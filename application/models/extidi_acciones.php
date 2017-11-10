<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_Acciones extends EXTIDI_ModelDynamic {
	
	function __construct() {

		$this->__config["tabla"]="extidi_acciones";
		$this->__config["llave"]="IdAccion";
		$this->__config["estado"]="IdEstadoAccion_EAP";
		$this->__config["condicion"]="prin.IdModulo > 9";
		$this->__config["orden"]="prin.IdModulo ASC, prin.NombreAccion ASC";
		$this->__config["ruta"]="Extidi.modulos.extidi.acciones";
		$this->__config["mostrarllave"]=false;
		$this->__config["mostrarestado"]=false;
		
        parent::__construct();
	
		//operaciones despues del __construct
		
		$this->IdModulo=array(
			"tipo"=> "bigint",
			"nulo"=>false,

			"foraneo"=>array(
				"tabla"=>"extidi_modulos", //tiene que ser un modelo
				"orden"=>"prin.NombreModulo ASC, prin.IdModuloPadre ASC", //order by de la tabla foranea
				"columnasvalor"=>array(
					"NombreModulo"
				),
				"columnasgrilla"=>array(
					"NombreModulo"=>"Nombre"
				)
			),
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Modulo"
			),
			
			"grilla"=>array(
				"cabecera"=>"Modulo"
			)
		);
		
		$this->NombreAccion=array(
			"tipo"=> "varchar",
			"tamano"=> 200,
			"nulo"=>false,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Nombre"
			),
			
			"grilla"=>array(
				"cabecera"=>"Nombre"
			)
		);
		
		$this->Ver=array(
			"tipo"=> "enum",
			"tamano"=> array(
				"0"=>"No",
				"1"=>"Si"
			),
			"nulo"=>false,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Ver"
			),
			
			"grilla"=>array(
				"cabecera"=>"Ver"
			)
		);
		

		$this->DescripcionAccion=array(
			"tipo"=> "text",
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Descripci&oacute;n"
			),
			
			"grilla"=>array(
				"cabecera"=>"Descripci&oacute;n",
				"atributosadicionales"=>array(
					"flex"=>1
				)
			)
		);
		
    }

}