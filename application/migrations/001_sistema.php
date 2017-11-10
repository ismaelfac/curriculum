<?php

/**
*  MIGRACION DE SISTEMA
*/
class Migration_sistema extends CI_Migration
{

	function up()
	{
		$this->dbforge->add_field($this->sesiones_fields());
		$this->dbforge->add_key('session_id', TRUE);
		$this->dbforge->create_table('extidi_sesiones');

		$this->dbforge->add_field($this->parametro_fields());
		$this->dbforge->add_key('id', TRUE);
		$this->dbforge->create_table('extidi_parametro');

		$this->dbforge->add_field($this->valorparametro_fields());
		$this->dbforge->add_key('id', TRUE);
		$this->dbforge->create_table('extidi_valorparametro');
		$this->db->query("ALTER TABLE extidi_valorparametro ADD KEY fk_ValorParametro_Parametro1 (IdParametro)");

		$this->dbforge->add_field($this->modulos_fields());
		$this->dbforge->add_key('id', TRUE);
		$this->dbforge->create_table('extidi_modulos');
		$this->db->query("INSERT INTO extidi_modulos
			(NombreModulo, NombreEscritorio, DescripcionModulo, TipoModulo,
				IdModuloPadre, Orden, Controlador, AccesoDirecto, Ancestros,
				InicioRapido, Ayuda)
			VALUES
			('Sistema', NULL, 'Carpeta de Modulos Extidi', 'CarpetaMenu', 0, 1,
				NULL, 0, '', 0, NULL),
			('Acciones', 'Acciones', 'Acciones Extidi', 'TabCrud', 1, 1,
				'Extidi.modulos.extidi.acciones', 0, '1', 0, NULL),
			('Grupos de Usuario', 'Grupos de Usuario', 'Grupos de Usuario Extidi',
				'TabCrud', 1, 2, 'Extidi.modulos.extidi.gruposusuarios', 0, '1', 0, ''),
			('Modulos', 'Modulos', 'Modulos Extidi', 'TabCrud', 1, 3,
				'Extidi.modulos.extidi.modulos', 0, '1', 0, NULL),
			('Parametros', 'Parametros', 'Parametros Extidi', 'TabCrud', 1, 4,
				'Extidi.modulos.extidi.parametro', 0, '1', 0, NULL),
			('Permisos', 'Permisos', 'Permisos Extidi', 'TabCrud', 1, 5,
				'Extidi.modulos.extidi.permisos', 0, '1', 0, NULL),
			('Usuarios', 'Usuarios', 'Usuarios Extidi', 'TabCrud', 1, 6,
				'Extidi.modulos.extidi.usuarios', 0, '1', 0, ''),
			('Valor Parametros', 'Valor Parametros', 'Valor Parametros Extidi',
				'TabCrud', 1, 7, 'Extidi.modulos.extidi.valorparametro', 0, '1', 0, NULL),
			('Consola MYSql', NULL, 'Consola MYSql', 'Widget', 0, 1,
				'Extidi.widget.consola_mysql', 0, '0', 0, NULL),
			('Configuración', '', '', 'CarpetaMenu', 0, 1, '', 0, NULL, NULL, ''),
			('Reportes', 'Reportes', 'Reportes', 'CarpetaMenu', 0, 1, '', 0, NULL,
				NULL, 'Reportes')");

		$this->dbforge->add_field($this->acciones_fields());
		$this->dbforge->add_key('IdAccion', TRUE);
		$this->dbforge->create_table('extidi_acciones');
		$this->db->query("ALTER TABLE extidi_acciones ADD KEY fk_Acciones_Modulos1 (IdModulo)");
		$this->db->query("INSERT INTO extidi_acciones
			(NombreAccion, IdModulo, Ver, DescripcionAccion)
			VALUES
			('ver', 1, 1, 'Accion por defecto'),
			('ver', 2, 1, 'Accion por defecto'),
			('ver', 3, 1, 'Accion por defecto'),
			('crear', 3, 1, 'Accion crear'),
			('modificar', 3, 1, 'Accion modificar'),
			('eliminar', 3, 1, 'Accion eliminar'),
			('activar', 3, 1, 'Accion activar'),
			('inactivar', 3, 1, 'Accion inactivar'),
			('exportarexcel', 3, 1, 'Accion exportarxcel'),
			('exportarpdf', 3, 1, 'Accion exportarpdf'),
			('exportarcsv', 3, 1, 'Accion exportarcsv'),
			('imprimir', 3, 1, 'Accion imprimir'),
			('importar', 3, 1, 'Accion importar'),
			('ver', 4, 1, 'Accion por defecto'),
			('crear', 4, 1, 'Accion crear'),
			('modificar', 4, 1, 'Accion modificar'),
			('eliminar', 4, 1, 'Accion eliminar'),
			('activar', 4, 1, 'Accion activar'),
			('inactivar', 4, 1, 'Accion inactivar'),
			('ver', 5, 1, 'Accion por defecto'),
			('crear', 5, 1, 'Accion crear'),
			('modificar', 5, 1, 'Accion modificar'),
			('eliminar', 5, 1, 'Accion eliminar'),
			('activar', 5, 1, 'Accion activar'),
			('inactivar', 5, 1, 'Accion inactivar'),
			('importar', 5, 1, 'Accion importar'),
			('ver', 6, 1, 'Accion por defecto'),
			('modificar_grupos', 6, 1, 'Modificar Grupos'),
			('ver', 7, 1, 'Accion por defecto'),
			('crear', 7, 1, 'Accion crear'),
			('modificar', 7, 1, 'Accion modificar'),
			('eliminar', 7, 1, 'Accion eliminar'),
			('activar', 7, 1, 'Accion activar'),
			('inactivar', 7, 1, 'Accion inactivar'),
			('exportarexcel', 7, 1, 'Accion exportarxcel'),
			('exportarpdf', 7, 1, 'Accion exportarpdf'),
			('exportarcsv', 7, 1, 'Accion exportarcsv'),
			('imprimir', 7, 1, 'Accion imprimir'),
			('importar', 7, 1, 'Accion importar'),
			('ver', 8, 1, 'Accion por defecto'),
			('crear', 8, 1, 'Accion crear'),
			('modificar', 8, 1, 'Accion modificar'),
			('eliminar', 8, 1, 'Accion eliminar'),
			('activar', 8, 1, 'Accion activar'),
			('inactivar', 8, 1, 'Accion inactivar'),
			('importar', 8, 1, 'Accion importar'),
			('ver', 9, 1, 'Accion ver'),
			('ver', 10, 1, 'Accion por defecto'),
			('ver', 11, 1, 'ver'),
			('importar', 7, 1, 'importar')");

		$this->dbforge->add_field($this->gruposusuarios_fields());
		$this->dbforge->add_key('id', TRUE);
		$this->dbforge->create_table('extidi_gruposusuarios');
		$this->db->query("INSERT INTO extidi_gruposusuarios
			(IdGrupoPadre, NombreGrupo, Ancestros, AccedeEscritorio) VALUES
			(0, 'SUPERADMINISTRADOR', NULL, 1), (0, 'Administradores', NULL, 1)");

		$this->dbforge->add_field($this->permisos_fields());
		$this->dbforge->add_key(array('IdGrupoUsuario','IdAccion'), TRUE);
		$this->dbforge->create_table('extidi_permisos');
		$this->db->query("ALTER TABLE extidi_permisos ADD KEY fk_Permisos_GruposUsuarios1
			(IdGrupoUsuario), ADD KEY fk_Permisos_Acciones1 (IdAccion)");
		$this->db->query("INSERT INTO extidi_permisos
			(IdGrupoUsuario, IdAccion) VALUES
			(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),
			(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),
			(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),
			(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),
			(1,42),(1,43),(1,44),(1,45),(1,46),(1,47),(1,48),(1,49),(1,50)");

		$this->dbforge->add_field($this->usuarios_fields());
		$this->dbforge->add_key('id', TRUE);
		$this->dbforge->create_table('extidi_usuarios');
		$this->db->query("ALTER TABLE extidi_usuarios ADD KEY fk_Usuarios_GruposUsuarios1 (IdGruposUsuario)");
		$this->db->query("INSERT INTO extidi_usuarios
			(PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido, Usuario,
				Email, identificacion, Password, IdGruposUsuario, FechaHoraDeRegistro) VALUES
			('SUPER', NULL, 'ADMINISTRADOR', NULL, 'super', 'super@idi.org', NULL,
				MD5('12345678'), 1, NOW())");

	}

	function down()
	{
		$this->dbforge->drop_table('extidi_usuarios');
		$this->dbforge->drop_table('extidi_permisos');
		$this->dbforge->drop_table('extidi_gruposusuarios');
		$this->dbforge->drop_table('extidi_acciones');
		$this->dbforge->drop_table('extidi_modulos');
		$this->dbforge->drop_table('extidi_valorparametro');
		$this->dbforge->drop_table('extidi_parametro');
		$this->dbforge->drop_table('extidi_sesiones');
	}

	private function sesiones_fields ()
	{
		return array(
			'session_id' => array(
				'type' => 'VARCHAR',
				'constraint' => 40,
		        'default' => '0'
			),
			'ip_address' => array(
				'type' => 'VARCHAR',
				'constraint' => 16,
		        'default' => '0'
			),
			'user_agent' => array(
				'type' => 'VARCHAR',
				'constraint' => 120
			),
			'last_activity' => array(
				'type' => 'INT',
				'constraint' => 10,
				'unsigned' => TRUE,
		        'default' => '0'
			),
			'user_data' => array(
				'type' => 'TEXT'
			)
		);
	}

	private function parametro_fields ()
	{
		return array(
			'id' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			),
			'estado' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'default' => 1
			),
			'NombreParametro' => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'null' => TRUE
			),
			'NombreCampo' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			)
		);
	}

	private function valorparametro_fields ()
	{
		return array(
			'id' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			),
			'estado' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'default' => 1
			),
			'IdParametro' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE
			),
			'ValorParametro' => array(
				'type' => 'TEXT',
				'null' => TRUE
			),
			'ValorCuantitativo' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,2',
				'null' => TRUE
			)
		);
	}

	private function modulos_fields ()
	{
		return array(
			'id' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			),
			'estado' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'default' => 1
			),
			'NombreModulo' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'NombreEscritorio' => array(
				'type' => 'VARCHAR',
				'constraint' => 100,
				'null' => TRUE
			),
			'DescripcionModulo' => array(
				'type' => 'TEXT',
				'null' => TRUE
			),
			'IdModuloPadre' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE
			),
			'Orden' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE
			),
			'TipoModulo' => array(
				'type' => 'ENUM',
				'constraint' => "'CarpetaMenu','TabArbol','CarpetaArbol','TabCrud','TabVacio','VentanaModal','Widget'",
				'null' => TRUE
			),
			'Controlador' => array(
				'type' => 'TEXT',
				'null' => TRUE
			),
			'Ayuda' => array(
				'type' => 'TEXT',
				'null' => TRUE
			),
			'AccesoDirecto' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'null' => TRUE
			),
			'InicioRapido' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'null' => TRUE
			),
			'Ancestros' => array(
				'type' => 'VARCHAR',
				'constraint' => 80,
				'null' => TRUE
			)
		);
	}

	private function acciones_fields ()
	{
		return array(
			'IdAccion' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			),
			'IdEstadoAccion_EAP' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'default' => 1
			),
			'IdModulo' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE
			),
			'NombreAccion' => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'null' => TRUE
			),
			'Ver' => array(
				'type' => 'INT',
				'constraint' => 11,
				'default' => 0
			),
			'DescripcionAccion' => array(
				'type' => 'TEXT',
				'null' => TRUE
			)
		);
	}

	private function gruposusuarios_fields ()
	{
		return array(
			'id' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			),
			'estado' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'default' => 1
			),
			'IdGrupoPadre' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'default' => 0
			),
			'NombreGrupo' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'Ancestros' => array(
				'type' => 'VARCHAR',
				'constraint' => 80,
				'null' => TRUE
			),
			'AccedeEscritorio' => array(
				'type' => 'TINYINT',
				'constraint' => 3,
				'unsigned' => TRUE
			)
		);
	}

	private function permisos_fields ()
	{
		return array(
			'IdGrupoUsuario' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'default' => 0
			),
			'IdAccion' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'default' => 0
			)
		);
	}

	private function usuarios_fields ()
	{
		return array(
			'id' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			),
			'estado' => array(
				'type' => 'TINYINT',
				'constraint' => 4,
				'default' => 1
			),
			'PrimerNombre' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'SegundoNombre' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'PrimerApellido' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'SegundoApellido' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'Usuario' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'Email' => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'null' => TRUE
			),
			'identificacion' => array(
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			),
			'Password' => array(
				'type' => 'VARCHAR',
				'constraint' => 50,
				'null' => TRUE
			),
			'IdGruposUsuario' => array(
				'type' => 'BIGINT',
				'constraint' => 20,
				'unsigned' => TRUE
			),
			'FechaHoraDeRegistro' => array(
				'type' => 'DATETIME',
				'null' => TRUE
			)
		);
	}

}
