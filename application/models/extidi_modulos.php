<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_Modulos extends EXTIDI_ModelDynamic {
	
	function __construct() {

		$this->__config["tabla"]="extidi_modulos";
		//$this->__config["condicion"]="prin.id > 9";
		$this->__config["orden"]="prin.IdModuloPadre ASC, prin.Orden ASC, prin.NombreModulo ASC";
		$this->__config["ruta"]="Extidi.modulos.extidi.modulos";
		$this->__config["mostrarllave"]=false;
		$this->__config["mostrarestado"]=false;
		$this->__config["permisos"] = array (
            "ver",
            "crear",
            "modificar",
            "eliminar",
            "activar",
            "inactivar",
            "permisos"
        );

        $this->__config["accionesAdicionales"] = array (
            array (
                "text" => "Permisos",
                "name" => "permisos"
            )
        );
        
        parent::__construct();
	
		//operaciones despues del __construct
		
		$this->NombreModulo=array(
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
		$this->NombreEscritorio=array(
			"tipo"=> "varchar",
			"tamano"=> 50,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Nombre en el escritorio"
			),
			
			"grilla"=>array(
				"cabecera"=>"Nombre en el escritorio"
			)
		);
		
		$this->DescripcionModulo=array(
			"tipo"=> "text",
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Descripcion"
			),
			
			"grilla"=>array(
				"cabecera"=>"Descripcion"
			)
		);
		
		
		$this->IdModuloPadre=array(
			"tipo"=> "bigint",

			"foraneo"=>array(
				"tabla"=>"extidi_modulos", //tiene que ser un modelo
		//		"condicion"=>"prin.id > 9", //sql de la condicion de la tabla foranea
				"orden"=>"prin.IdModuloPadre ASC, prin.Orden ASC, prin.NombreModulo ASC", //order by de la tabla foranea
				"columnasvalor"=>array(
					"NombreModulo"
				),
				"columnasgrilla"=>array(
					"NombreModulo"=>"Nombre"
				)
			),
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Modulo Padre"
			),
			
			"grilla"=>array(
				"cabecera"=>"Modulo Padre"
			)
		);
		
		$this->Orden=array(
			"tipo"=> "bigint",
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Orden"
			),
			
			"grilla"=>array(
				"cabecera"=>"Orden"
			)
		);
		
		$this->TipoModulo=array(
			"tipo"=> "enum",
			"tamano"=> array(
				"CarpetaMenu"=>"Carpeta Menu",
				"TabArbol"=>"Tab Arbol",
				"CarpetaArbol"=>"Carpeta Arbol",
				"TabCrud"=>"Tab Crud",
				"TabVacio"=>"Tab Vacio",
				"VentanaModal"=>"Ventana Modal",
				"Widget"=>"Widget"
			),
			"nulo"=>false,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Tipo"
			),
			
			"grilla"=>array(
				"cabecera"=>"Tipo"
			)
		);
		
		$this->Controlador=array(
			"tipo"=> "varchar",
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Controlador"
			),
			
			"grilla"=>array(
				"cabecera"=>"Controlador",
				"atributosadicionales"=>array(
					"flex"=>1
				)
			)
		);
		
		$this->Ayuda=array(
			"tipo"=> "text",
			"html"=>true,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Ayuda"
			),
			
			"grilla"=>array(
				"cabecera"=>"Ayuda",
				"visible"=>false
			)
		);
		
		$this->AccesoDirecto=array(
			"tipo"=> "enum",
			"tamano"=> array(
				"0"=>"No",
				"1"=>"Si"
			),
			"nulo"=>false,
			
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Acceso Directo"
			),
			
			"grilla"=>array(
				"cabecera"=>"Acceso Directo"
			)
		);
		

    }

}