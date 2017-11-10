<?php

/**
*  Modulo Monitorias
*/
class Migration_monitorias extends CI_Migration
{

	function up()
	{
		$this->dbforge->add_field($this->monitores_fiels());
		$this->dbforge->add_key('id_monitor', TRUE);
		$this->dbforge->create_table('extidi_monitores');
		$this->dbforge->add_field($this->monitorias_fiels());
		$this->dbforge->add_key('id_monitoria', TRUE);
		$this->dbforge->create_table('extidi_monitorias');
		$this->dbforge->add_field($this->programasacademicos_fiels());
		$this->dbforge->add_key('id_programa', TRUE);
		$this->dbforge->create_table('mod_programasacademicos');
	}

	function down()
	{
		$this->dbforge->drop_table('extidi_monitores');
		$this->dbforge->drop_table('extidi_monitorias');
		$this->dbforge->drop_table('mod_programasacademicos');
	}

	private function monitores_fiels(){
		return [
			'Id_monitor' => [
				'type' => 'TINYINT',
				'contraint' => 20,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			],
			'estado' => [
				'type' => 'BIGINT',
				'contraint' => 4,
				'default' => 0
			],
			'PrimerNombre' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'SegundoNombre' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'PrimerApellido' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'SegundoApellido' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'Email' => [
				'type' => 'VARCHAR',
				'constraint' => 200,
				'null' => TRUE
			],
			'identificacion' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'Programa_academico' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'Semestre' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'FechaHoraDeRegistro' => [
				'type' => 'TIMESTAMP',
				'null' => FALSE
			]			
		];
	}
    
	private function monitorias_fiels()
	{
		return [
			'Id_monitoria' => [
				'type' => 'BIGINT',
				'contraint' => 40,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			],
			'Estado' => [
				'type' => 'TINYINT',
				'contraint' => 4,
				'default' => 0
			],
			'Id_monitor' => [
				'type' => 'TINYINT',
				'constraint' => 20,
				'unsigned' => TRUE,
				'null' => FALSE
			],
			'Salon' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'FechaHoraDeRegistro' => [
				'type' => 'TIMESTAMP',
				'null' => FALSE
			]				
		];
	}

	private function programasacademicos_fiels()
	{
		return [
			'id_programa' => [
				'type' => 'BIGINT',
				'contraint' => 40,
				'unsigned' => TRUE,
				'auto_increment' => TRUE
			],
			'Estado' => [
				'type' => 'TINYINT',
				'contraint' => 4,
				'default' => 0
			],
			'valor' => [
				'type' => 'VARCHAR',
				'constraint' => 45,
				'null' => TRUE
			],
			'FechaHoraDeRegistro' => [
				'type' => 'TIMESTAMP',
				'null' => FALSE
			]				
		];
	}

}
