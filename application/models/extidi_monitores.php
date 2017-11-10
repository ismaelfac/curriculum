<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_Monitores extends EXTIDI_ModelDynamic {

	function __construct() {

		$this->__config["tabla"]="extidi_monitores";
		$this->__config["condicion"]="prin.estado = 1";
		$this->__config["orden"]="prin.Apellidos, prin.FechaHoraDeRegistro ASC";
		$this->__config["ruta"]="Extidi.modulos.monitores";
        parent::__construct();

		//operaciones despues del __construct
		
        $this->Nombres=array(
			"tipo"=> "varchar",
			"tamano"=> 45,
			"nulo"=>false,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Nombres"
			),
			"grilla" => array(
				"cabecera" => "Nombres"
			)
		);

		$this->Apellidos = array(
			"tipo" => "varchar",
			"tamano" => 45,
			"nulo" => false,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Apellidos"
			),
			"grilla" => array(
				"cabecera" => "Apellidos"
			)
		);

		$this->Email=array(
			"tipo" => "varchar",
			"tamano" => 100,
			"nulo" => false,
			"unico" => true,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Correo electr&oacute;nico"
			),
			"grilla" => array(
				"cabecera" => "Email"
			)
		);

		$this->Identificacion = array(
			"tipo" => "varchar",
			"tamano" => 45,
			"nulo" => true,
			"unico" => "true",

			"formulario" => array("nombre" => "No. Identificaci&oacute;n"),
			"grilla" => array("cabecera" => "No. Identificaci&oacute;n")

		);
		$this->Programa_academico = array(
			"tipo" => "varchar",
			"tamano" => 45,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Programa_academico"
			),

			"grilla" => array(
				"cabecera" => "Programa_academico"
			)
		);
        
        $this->Semestre = array(
			"tipo" => "varchar",
			"tamano" => 45,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Semestre"
			),

			"grilla" => array(
				"cabecera" => "Semestre"
			)
		);

		$this->FechaHoraDeRegistro=array(
			"tipo"=> "datetime",
			"pordefecto"=>gmdate("Y-m-d H:i:s", time() + 3600*(-5)),
			"importar" => false,
			"filtro"=>"rango",

			"formulario"=>array( //Propiedades para formulario
				"visible"=>false
			),

			"grilla"=>array(
				"cabecera"=>"Fecha",
				"visible"=>true
			)
		);

    }

}
