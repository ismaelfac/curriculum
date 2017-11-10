<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_Parametro_items extends EXTIDI_ModelDynamic {
	
	function __construct() {

		$this->__config["tabla"]="extidi_parametro";
		//$this->__config["condicion"]="prin.IdGruposUsuario > 1";
		$this->__config["llave"]="NombreCampo";
		$this->__config["orden"]="prin.NombreParametro ASC";
		$this->__config["ruta"]="";
		$this->__config["verificar_permiso"]=false;
		$this->__config["mostrarllave"]=false;
		$this->__config["mostrarestado"]=false;
		
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
    }

}