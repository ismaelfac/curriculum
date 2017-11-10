<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_GruposUsuarios extends EXTIDI_ModelDynamic {
	
	function __construct() {

		$this->__config["tabla"]="extidi_gruposusuarios";
		$this->__config["condicion"]="prin.id > 1";
		$this->__config["ruta"]="Extidi.modulos.extidi.gruposusuarios";
	
        parent::__construct();
		
		$this->IdGrupoPadre=array(
			"tipo"=> "bigint",

			"foraneo"=>array(
				"tabla"=>"extidi_gruposusuarios", //tiene que ser un modelo
				"condicion"=>"prin.id > 1", //sql de la condicion de la tabla foranea
				"orden"=>"NombreGrupo ASC", //order by de la tabla foranea
				"columnasvalor"=>array(
					"NombreGrupo"
				),
				"columnasgrilla"=>array(
					"NombreGrupo"=>"Nombre"
				)
			),
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Grupo Padre"
			),
			
			"grilla"=>array(
				"visible"=>false
			)
		);
	
		$this->NombreGrupo=array(
			"tipo"=> "varchar",
			"tamano"=> 45,
			"nulo"=>false,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Nombre"
			),
			
			"grilla"=>array(
				"cabecera"=>"Nombre"
			)
		);

		$this->AccedeEscritorio = array(
			"tipo" => "enum",
			"nulo" => false,
			"tamano"=> array(0=>"No", 1=>"Si"),
			"formulario"=>array(
				"nombre"=>"Accede Escritorio"
			),
			"grilla"=>array(
				"cabecera" => "AccedeEscritorio"
			)
		);
    }

}