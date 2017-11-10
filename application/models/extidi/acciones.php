<?php

date_default_timezone_set('America/Bogota');
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

Class Acciones extends EXTIDI_Model {

    var $IdAccion = 0;
    var $NombreAccion = NULL;
    var $IdEstadoAccion_EAP = NULL;
    var $IdModulo = 0;
    var $Ver = NULL;
    var $DescripcionAccion = NULL;

    function __construct() {



        $this->_tabla = "extidi_acciones";
        $this->_llave = "IdAccion";
        $this->_estado = "IdEstadoAccion_EAP";

        $this->_arrayJoinsTablaRelacion = array(
            "IdModulo" => "extidi_modulos"
        );

        $this->_arrayJoinsCampoRelacion = array(
            "id" => "IdModulo"
        );

        $this->_arrayJoinsCampoMostrar = array(
            "IdModulo" => "NombreModulo"
        );

        parent::__construct();
    }

    /* function listar ($data){
      $this->db->select("*, VerEstado(IdEstadoAccion_EAP) estado");
      $this->db->where($data);
      //$this -> db -> order_by("IdGrupoPadre", 'DESC');
      $rs = $this->db->get('extidi_acciones');
      return $rs->result_array();
      } */

    function listadoAcciones($data) {
        $this->db->select("extidi_acciones.*,if(IdEstadoAccion_EAP=1, 'Activo', 'Inactivo') estado, extidi_modulos.NombreModulo NombreModulo, if(Ver=1,'Activo', 'Inactivo') Ver, if(Ver=1, 'Activo', 'Inactivo') mirar", false);
        $this->db->from("extidi_acciones");
        $this->db->join("extidi_modulos", "extidi_acciones.IdModulo = extidi_modulos.id");
        $this->db->where($data);
        $this->db->order_by("IdAccion", "DESC");
        $rs = $this->db->get();
        return $rs->result_array();
    }

    function actualizar($data, $condicion) {
        $this->db->where($condicion);
        $this->db->update("extidi_acciones", $data);
    }

    function traerIdAccionPorDefecto($data) {
        $this->db->select('IdAccion');
        $this->db->where($data);
        $this->db->order_by("IdAccion", "ASC");
        $this->db->limit(1);
        $rs = $this->db->get('extidi_acciones');
        return $rs->row_array();
    }

}