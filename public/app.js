const formulario = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');
const boton = document.getElementById('guardar');

async function cargarUsuarios() {
  const estado = document.getElementById('estado');
  try {
    const respuesta = await fetch('/usuarios');
    if (!respuesta.ok) throw new Error('No se pudo cargar la lista. Recarga la página.');
    const usuarios = await respuesta.json();
    const lista = document.getElementById('usuarios');
    lista.replaceChildren();
    for (const usuario of usuarios) {
      const item = document.createElement('li');
      const nombre = document.createElement('strong');
      const correo = document.createElement('span');
      nombre.textContent = usuario.nombre;
      correo.textContent = usuario.email;
      item.append(nombre, correo);
      lista.append(item);
    }
    estado.textContent = usuarios.length ? `${usuarios.length} usuario(s) registrado(s).` : 'Aún no hay usuarios registrados.';
  } catch (error) { estado.textContent = error.message; }
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  boton.disabled = true;
  mensaje.className = '';
  mensaje.textContent = 'Guardando…';
  try {
    const respuesta = await fetch('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: formulario.nombre.value, email: formulario.email.value }),
    });
    const resultado = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(Array.isArray(resultado.message) ? resultado.message.join(' ') : resultado.message || 'No se pudo guardar.');
    }
    mensaje.className = 'exito';
    mensaje.textContent = `Usuario guardado correctamente (ID: ${resultado.id}).`;
    formulario.reset();
    await cargarUsuarios();
  } catch (error) {
    mensaje.className = 'error';
    mensaje.textContent = error.message;
  } finally { boton.disabled = false; }
});

void cargarUsuarios();
