<?php
if (!defined('BASEPATH'))
	exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_Parametro extends EXTIDI_ModelDynamic {
	
	function __construct() {

		$this->__config["tabla"]="extidi_parametro";
		//$this->__config["condicion"]="prin.IdGruposUsuario > 1";
		$this->__config["orden"]="prin.NombreParametro ASC";
		$this->__config["ruta"]="Extidi.modulos.extidi.parametro";
		/*$this->__config["mostrarllave"]=false;
		$this->__config["mostrarestado"]=false;
		*/
        parent::__construct();
	
		//operaciones despues del __construct
		
		$this->NombreParametro=array(
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
		
		$this->NombreCampo=array(
			"tipo"=> "varchar",
			"tamano"=> 45,
			"unico"=>true,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Nombre Campo"
			),
			
			"grilla"=>array(
				"cabecera"=>"Nombre Campo"
			)
		);
    }

}