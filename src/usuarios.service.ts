import { ConflictException, Injectable, OnModuleDestroy } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { CrearUsuarioDto } from './crear-usuario.dto';

@Injectable()
export class UsuariosService implements OnModuleDestroy {
  private readonly db: DatabaseSync;

  constructor() {
    const archivo = process.env.DB_PATH ?? join(__dirname, '..', 'data', 'usuarios.sqlite');
    mkdirSync(dirname(archivo), { recursive: true });
    this.db = new DatabaseSync(archivo);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  crear(datos: CrearUsuarioDto) {
    try {
      // Los parámetros evitan concatenar los datos del usuario en el SQL.
      const resultado = this.db.prepare(
        'INSERT INTO usuarios (nombre, email) VALUES (?, ?)'
      ).run(datos.nombre, datos.email);
      return this.db.prepare('SELECT * FROM usuarios WHERE id = ?').get(resultado.lastInsertRowid);
    } catch (error) {
      if ((error as { errcode?: number }).errcode === 2067) {
        throw new ConflictException('Este correo ya está registrado.');
      }
      throw error;
    }
  }

  listar() { return this.db.prepare('SELECT * FROM usuarios ORDER BY id DESC').all(); }

  onModuleDestroy() { this.db.close(); }
}
