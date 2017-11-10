<?php
date_default_timezone_set('America/Bogota');
if (!defined('BASEPATH'))
	exit('No direct script access allowed');

Class Permisos extends EXTIDI_Model {

	var $IdGrupoUsuario = 0;

	var $IdAccion = 0;
	

	function __construct() {

		

		$this -> _tabla = "extidi_permisos";
		$this -> _llave = "IdAccion";
		parent::__construct();
	}


	function listadoPermisos($data) {

		$this -> db -> where($data);
		$resp = $this -> db -> get("extidi_permisos");
		return $resp -> result_array();
	}

}
