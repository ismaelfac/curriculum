<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_ValorParametro extends EXTIDI_ModelDynamic {
	
	function __construct() {

		$this->__config["tabla"]="extidi_valorparametro";
		//$this->__config["condicion"]="prin.IdGruposUsuario > 1";
		$this->__config["orden"]="prin.ValorCuantitativo ASC, prin.ValorParametro ASC";
		$this->__config["ruta"]="Extidi.modulos.extidi.valorparametro";
		/*$this->__config["mostrarllave"]=false;
		$this->__config["mostrarestado"]=false;
		*/
        parent::__construct();
	
		//operaciones despues del __construct
		
		$this->IdParametro=array(
			"tipo"=> "bigint",
			"filtro"=>true,

			"foraneo"=>array(
				"tabla"=>"extidi_parametro", //tiene que ser un modelo
				//"condicion"=>"id > 1", //sql de la condicion de la tabla foranea
				"orden"=>"NombreParametro ASC", //order by de la tabla foranea
				"columnasvalor"=>array(
					"NombreParametro"
				),
				"columnasgrilla"=>array(
					"NombreParametro"=>"Nombre",
					"visible"=>false
				)
			),
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Parametro"
			),
			
			"grilla"=>array(
				"visible"=>false
			)
		);
		
		$this->ValorParametro=array(
			"tipo"=> "text",
			"nulo"=>false,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Valor"
			),
			
			"grilla"=>array(
				"cabecera"=>"Valor"
			)
		);
		
		$this->ValorCuantitativo=array(
			"tipo"=> "decimal",
			"filtro"=>false,
			"pordefecto"=>0,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Valor Cuantitativo",
				"visible"=>false
			),
			
			"grilla"=>array(
				"cabecera"=>"Valor Cuantitativo",
				"visible"=>false
			)
		);
		

    }

}