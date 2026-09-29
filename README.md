# Formulario con NestJS y SQLite

Ejemplo educativo: registrar el nombre y el correo de un usuario desde un formulario HTML y guardar los datos en un archivo SQLite real.

## 1. Requisitos

- Node.js 24 o superior y npm. Comprueba tu versión con `node --version`.
- Un editor, por ejemplo Visual Studio Code.

Este proyecto utiliza NestJS 11, TypeScript y el módulo `node:sqlite` incluido en Node.js. No requiere instalar un servidor de base de datos ni configurar contraseñas. Según la versión de Node puede aparecer un aviso experimental de SQLite; no impide ejecutar el ejemplo.

## 2. Ejecutarlo

Extrae el ZIP y abre una terminal dentro de la carpeta `nestjs-sqlite` (la que contiene `package.json`). Ejecuta:

```bash
npm install
npm start
```

Abre **http://localhost:3000** en el navegador. Ingresa un nombre y un correo y pulsa **Guardar usuario**. El registro aparecerá debajo del formulario.

Para detener el servidor, pulsa `Ctrl+C` en la terminal. Si editas el código, vuelve a ejecutar `npm start` para compilarlo y ver los cambios.

## 3. Cómo funciona

```text
Formulario HTML → fetch POST /usuarios → Controller → Service → SQLite
```

1. `public/index.html` presenta los campos de nombre y correo.
2. `public/app.js` captura el envío y manda JSON a `POST /usuarios` con `fetch`.
3. `src/crear-usuario.dto.ts` define los datos admitidos. `ValidationPipe` verifica los datos en el servidor, incluso si se omite la validación del navegador.
4. `src/usuarios.controller.ts` recibe la solicitud y llama al servicio.
5. `src/usuarios.service.ts` abre SQLite, crea la tabla si no existe e inserta el registro mediante una consulta parametrizada.
6. El navegador consulta `GET /usuarios` para actualizar la lista.

`src/app.module.ts` registra el controlador y el servicio. `src/main.ts` inicia NestJS y sirve el formulario desde la carpeta `public`.

## 4. Base de datos

Al iniciar se crea automáticamente `data/usuarios.sqlite` dentro del proyecto. Los datos permanecen guardados después de cerrar el servidor. Puedes abrir ese archivo con un visor compatible con SQLite.

La tabla se crea con:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

La inserción está en `usuarios.service.ts`:

```ts
const resultado = this.db.prepare(
  'INSERT INTO usuarios (nombre, email) VALUES (?, ?)'
).run(datos.nombre, datos.email);
```

Los signos `?` son parámetros: los valores se envían separados de la consulta SQL.

Para revisar la tabla desde un visor SQLite:

```sql
SELECT * FROM usuarios ORDER BY id DESC;
```

## 5. Rutas y validaciones

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/` | Muestra el formulario |
| POST | `/usuarios` | Guarda un usuario; responde con HTTP 201 |
| GET | `/usuarios` | Devuelve los usuarios en JSON |

Ejemplo del cuerpo enviado:

```json
{ "nombre": "Ana Pérez", "email": "ana@ejemplo.com" }
```

Se valida que el nombre tenga entre 2 y 80 caracteres y que el correo tenga formato válido y no supere los 120 caracteres. El correo se guarda en minúsculas. Los datos inválidos producen HTTP 400 y un correo repetido produce HTTP 409.

## 6. Prueba y evidencia para entregar

Ejecuta `npm test` para comprobar el formulario servido, el registro, los datos inválidos, los duplicados y la persistencia al reiniciar la aplicación. La prueba utiliza una base temporal separada.

Para demostrar el trabajo:

1. Registra un usuario y toma una captura del formulario con el mensaje de éxito y el usuario en la lista.
2. Reinicia el servidor y verifica que el usuario sigue apareciendo.
3. Abre `data/usuarios.sqlite` en un visor SQLite y toma una captura de la tabla.

Explicación breve para tu exposición:

> Desarrollé una aplicación con NestJS que recibe el nombre y el correo desde un formulario HTML. El navegador envía los datos mediante una petición POST. NestJS valida los campos y un servicio ejecuta una consulta parametrizada para guardarlos en SQLite. Después se consulta la base de datos para mostrar los usuarios registrados. La información permanece guardada en un archivo local.

Es una demostración local sin autenticación, pensada para este ejercicio.

## Referencias oficiales

- NestJS: https://docs.nestjs.com/first-steps
- Validación: https://docs.nestjs.com/techniques/validation
- SQLite en Node.js: https://nodejs.org/api/sqlite.html
