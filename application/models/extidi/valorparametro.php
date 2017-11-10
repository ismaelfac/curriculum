<?php
if (!defined('BASEPATH'))
	exit('No direct script access allowed');

class ValorParametro extends EXTIDI_Model {

	var $id = 0;
	var $ValorParametro = NULL;
	var $estado = NULL;
	var $IdParametro = 0;
	var $ValorCuantitativo = 0;

	function __construct() {

		$this -> _tabla = "extidi_valorparametro";
		$this -> _llave = "id";
		$this -> _estado = "estado";

		//campo=>tabla
		$this -> _arrayJoinsTablaRelacion = array("IdParametro" => "extidi_parametro");

		$this -> _arrayJoinsCampoRelacion = array("IdParametro" => "id");

		$this -> _arrayJoinsCampoMostrar = array("IdParametro" => "NombreParametro");

		parent::__construct();

	}

}
