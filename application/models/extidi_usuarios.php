<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH."core/EXTIDI_ModelDynamic.php";

Class Extidi_Usuarios extends EXTIDI_ModelDynamic {

	function __construct() {

		$this->__config["tabla"]="extidi_usuarios";
		$this->__config["condicion"]="prin.IdGruposUsuario > 1";
		$this->__config["orden"]="prin.IdGruposUsuario ASC, prin.PrimerApellido ASC, prin.PrimerNombre ASC";
		$this->__config["ruta"]="Extidi.modulos.extidi.usuarios";
        parent::__construct();

		//operaciones despues del __construct
		$this->PrimerNombre=array(
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

		$this->SegundoNombre = array(
			"tipo" => "varchar",
			"tamano" => 45,
			"formulario" => array( //Propiedades para formulario
				"nombre" => "Segundo nombre",
				"visible" => false
			),

			"grilla" => array(
				"cabecera" => "Segundo nombre",
				"visible" => false
			)
		);

		$this->PrimerApellido = array(
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

		$this->SegundoApellido=array(
			"tipo" => "varchar",
			"tamano" => 45,

			"formulario" => array( //Propiedades para formulario
				"nombre" => "Segundo apellido",
				"visible" => false
			),

			"grilla" => array(
				"cabecera" => "Segundo apellido",
				"visible" => false
			)
		);

		$this->Usuario = array(
			"tipo" => "varchar",
			"tamano" => 45,
			"nulo" => false,
			"unico" => true,
			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Usuario"
			),
			"grilla"=>array(
				"cabecera"=>"Usuario"
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

		$this->identificacion = array(
			"tipo" => "varchar",
			"tamano" => 45,
			"nulo" => true,
			"unico" => "true",

			"formulario" => array("nombre" => "No. Identificaci&oacute;n"),
			"grilla" => array("cabecera" => "No. Identificaci&oacute;n")

		);

		$this->Password=array(
			"tipo"=> "varchar",
			"tamano"=> 50,
			"nulo"=>false,
			"transformador"=>'md5($v)',
			"pordefecto"=>"12345678",
			"filtrar"=>false,
			"password"=>true,

			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Contrase&ntilde;a",
				"tamanominimo"=>8,
				"atributosadicionales"=>array(
					"inputType"=>"password"
				)
			),

			"grilla"=>array(
				"visible"=>false
			)
		);

		$this->IdGruposUsuario=array(
			"tipo"=> "bigint",
			"nulo"=>false,
			"importar" => false,

			"foraneo"=>array(
				"tabla"=>"extidi_gruposusuarios", //tiene que ser un modelo
				"condicion"=>"prin.id > 1", //sql de la condicion de la tabla foranea
				"orden"=>"NombreGrupo ASC", //order by de la tabla foranea
				"columnasvalor"=>array(
					"NombreGrupo"
				),
				"columnasgrilla"=>array(
					"NombreGrupo"=>"Nombre",
					"estado"
				)
			),

			"formulario"=>array( //Propiedades para formulario
				"nombre"=>"Grupo de usuario"
			),

			"grilla"=>array(
				"cabecera"=>"Grupo Usuario"
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
