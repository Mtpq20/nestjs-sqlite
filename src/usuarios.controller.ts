import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrearUsuarioDto } from './crear-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Post()
  crear(@Body() datos: CrearUsuarioDto) { return this.usuarios.crear(datos); }

  @Get()
  listar() { return this.usuarios.listar(); }
}
