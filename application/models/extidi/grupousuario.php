<?php
if (!defined('BASEPATH'))
	exit('No direct script access allowed');

Class GrupoUsuario extends EXTIDI_Model {

	var $id = 0;
	var $NombreGrupo = NULL;
	var $estado = 0;
	var $IdGrupoPadre = 0;
	var $Ancestros = null;

	function __construct() {

		$this -> _tabla = "extidi_gruposusuarios";
		$this -> _llave = "id";
		$this -> _estado = "estado";
		parent::__construct();
	}

	function listarGrupoUsuario($data) {
		$this -> db -> select("*, VerEstado(estado) IdEstadoGrupoUsuario_EAP, 
		(SELECT NombreGrupo FROM extidi_gruposusuarios eg2 WHERE eg.IdGrupoPadre = eg2.id) IdGrupoP");
		$this -> db -> where($data);
		$this -> db -> order_by("IdGrupoPadre", 'DESC');
		$rs = $this -> db -> get('extidi_gruposusuarios eg');

		return $rs -> result_array();
	}

	function listarGrupoPadre($data) {
		$this -> db -> select('NombreGrupo, id as IdGrupoUsuario');
		$this -> db -> where($data);
		$rs = $this -> db -> get('extidi_gruposusuarios');
		return $rs -> result_array();
	}

	function listarGrupoMaximo($data) {
		$this -> db -> select('NombreGrupo, id as IdGrupoUsuario');
		$this -> db -> where(array("estado  !=" => -1));
		$this -> db -> not_like('Ancestros', $data, 'after');
		$rs = $this -> db -> get('extidi_gruposusuarios');
		return $rs -> result_array();
	}

	function traerIdUltimoGrupoIngresado($data) {

		$this -> db -> select('id as IdGrupoUsuario');
		$this -> db -> where($data);
		$this -> db -> order_by('IdGrupoUsuario', 'DESC');
		$this -> db -> limit(1);
		$rs = $this -> db -> get('extidi_gruposusuarios');
		return $rs -> row_array();

	}

	public function traerAncestros($data) {
		$this -> db -> select('Ancestros');
		$this -> db -> where($data);
		$rs = $this -> db -> get('extidi_gruposusuarios');
		return $rs -> row_array();
	}

	public function traerIdHijos($pmold, $data) {
		$this -> db -> select("id as IdGrupoUsuario, Ancestros");
		$this -> db -> where($data);
		$this -> db -> like('Ancestros', $pmold, 'after');
		$rs = $this -> db -> get('extidi_gruposusuarios');
		return $rs -> result_array();
	}

}
