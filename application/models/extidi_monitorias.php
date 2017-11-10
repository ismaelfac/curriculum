<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_Monitorias extends EXTIDI_ModelDynamic {

	function __construct() {

		$this->__config["tabla"]="extidi_monitorias";
		$this->__config["orden"]="prin.FechaHoraDeRegistro DESC";
		$this->__config["ruta"]="Extidi.modulos.monitorias";
        parent::__construct();

		//operaciones despues del __construct
	    $this->id_monitor = array(
      		"tipo"=> "tinyint",
			"nulo"=>false,
			"importar" => false,

			"foraneo"=>array(
				"tabla"=>"extidi_monitores", //tiene que ser un modelo
				"orden"=>"Apellidos ASC", //order by de la tabla foranea
				"columnasvalor"=>array(
					"Nombres","Apellidos"
				),
				"columnasgrilla"=>array(
					"Nombres"=>"Nombres",
					"Apellidos" => "Apellidos"
				)
			),

			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Monitor"
			),

			"grilla"=>array(
				"cabecera"=>"Monitor"
			)
	    );
		$this->Salon = array(
			"tipo" => "varchar",
			"nulo" => false,
			"tamano" => 10,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Salon"
			),

			"grilla" => array(
				"cabecera" => "Salon"
			)
		);
		$this->Fecha_monitoria=array(
			"tipo"=> "datetime",
			"pordefecto"=>gmdate("Y-m-d H:i:s", time() + 3600*(-5)),
			"nulo" => false,
			"importar" => false,
			"filtro"=>"rango",

			"formulario"=>array( //Propiedades para formulario
				"nombre" => "Fecha de Monitoria",
				"visible"=>true
			),

			"grilla"=>array(
				"cabecera"=>"Fecha Monitoria",
				"visible"=>true
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

    function listarMonitorias($data){

    }

}
