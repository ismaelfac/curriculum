<?php
if (!defined('BASEPATH'))
	exit('No direct script access allowed');

Class Modulo extends EXTIDI_Model {

	var $id = 0;
	var $estado = 1;
	var $NombreModulo = null;
	var $DescripcionModulo = null;
	var $TipoModulo = null;
	var $IdModuloPadre = 0;
	var $Orden = 0;
	var $Controlador = null;
	var $Ancestros = null;
	var $AccesoDirecto=0;
	var $InicioRapido=0;

	function __construct() {

		parent::__construct();

		$this -> _tabla = "extidi_modulos";
		$this -> _llave = "id";
		$this -> _estado = "estado";

	}

	function listarModulo($data) {
		$this -> db -> select("
                    *, 
                    if(estado=1, 'Activo', 'Inactivo') estado, 
                    (
                        SELECT 
                            NombreModulo 
                        FROM 
                            extidi_modulos eg2 
                        WHERE 
                            eg.IdModuloPadre = eg2.id
                    ) IdModuloP
                    ", false);
		$this -> db -> where($data);
		$this -> db -> order_by("IdModuloPadre", 'DESC');
		$this -> db -> order_by("Orden", 'ASC');
		$rs = $this -> db -> get('extidi_modulos eg');
		return $rs -> result_array();
	}

	function listarModuloPadre($data) {
		$this -> db -> select("id, NombreModulo, IdModuloPadre, Ancestros");
		$this -> db -> where($data);
                $this -> db -> where_in(
                    "TipoModulo", 
                    array(
                        'CarpetaMenu', 'TabArbol', 'CarpetaArbol'
                    )
                );
                $rs = $this -> db -> get('extidi_modulos');
		return $rs -> result_array();
	}

	function listarAncestros($data, $cond='') {
		$this -> db -> select("id, NombreModulo, Ancestros");
                if($cond!=''){
                    $this -> db -> where($cond);
                }
		$this -> db -> not_like('Ancestros', $data);
                $this->db->where_in(
                    "TipoModulo", 
                    array(
                        'CarpetaMenu','TabArbol','CarpetaArbol'
                    )
                );
		$rs = $this -> db -> get('extidi_modulos');
		return $rs -> result_array();
	}

	

	public function traerTipoModulo($data) {
		$this -> db -> select('TipoModulo');
		$this -> db -> where($data);
		$rs = $this -> db -> get('extidi_modulos');
		return $rs -> row_array();
	}

	public function traerTipoModuloHijo($data) {
		$this -> db -> select('TipoModulo');
		$this -> db -> where($data);
		$rs = $this -> db -> get('extidi_modulos');
		return $rs -> result_array();
	}

	public function traerAncestros($data) {
		$this -> db -> select('Ancestros,id');
		$this -> db -> where($data);
		$rs = $this -> db -> get('extidi_modulos');
		return $rs -> row_array();
	}

	public function traerIdHijos($pmold, $data) {
		$this -> db -> select("id , Ancestros");
		$this -> db -> where($data);
		$this -> db -> like('Ancestros', $pmold, 'after');
		$rs = $this -> db -> get('extidi_modulos');
		return $rs -> result_array();
	}	

}
