<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Mod_Programasacadenicos extends EXTIDI_ModelDynamic {

	function __construct() {

		$this->__config["tabla"]="mod_programasacademicos";
		$this->__config["condicion"]="prin.estado != 1";
		$this->__config["ruta"]="Extidi.modulos.monitorias.mod_programasacademicos";
        parent::__construct();

		//operaciones despues del __construct
	    $this->id = array(
      		"tipo"=> "tinyint",
			"nulo"=>false,
			"importar" => false,
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Id",
				"visible" => false
			),

			"grilla"=>array(
				"cabecera"=>"Id"
			)
	    );
		$this->valor = array(
			"tipo" => "varchar",
			"nulo" => false,
			"tamano" => 60,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Programa Academico"
			),

			"grilla" => array(
				"cabecera" => "Programa Academico"
			)
		);
	
    }

    function listarMonitorias($data){

    }

}
