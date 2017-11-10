<?php

date_default_timezone_set('America/Bogota');
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

Class Usuario extends EXTIDI_Model {

    var $id = 0;
    var $PrimerNombre = NULL;
    var $SegundoNombre = NULL;
    var $PrimerApellido = NULL;
    var $SegundoApellido = NULL;
    var $Usuario = NULL;
    var $Email = NULL;
    var $Password = "";
    var $estado = 1;
    var $FechaHoraDeRegistro = NULL;
    var $IdGruposUsuario = 0;

    function __construct() {

        parent::__construct();

        $this->_tabla = "extidi_usuarios";
        $this->_llave = "id";
        $this->_estado = "estado";
        
        $this->_arrayJoinsTablaRelacion=array(                
                "IdGruposUsuario"=>"extidi_gruposusuarios"
                );
        
          $this->_arrayJoinsCampoRelacion=array(
                "IdGruposUsuario"=>"IdGrupoUsuario"
                );

          $this->_arrayJoinsCampoMostrar=array(
                "IdGruposUsuario"=>"NombreGrupo"
                );  
        
    }

    function listadoUsuarios($data=array()) {

        $this->db->select("extidi_usuarios.*,VerEstado(estado) estado, extidi_gruposusuarios.NombreGrupo NombreGrupo");
        $this->db->select("DATE_FORMAT(FechaHoraDeRegistro, '%e-%m-%Y %r') FechaHoraDeRegistro", false);
        $this->db->from("extidi_usuarios");
        $this->db->join("extidi_gruposusuarios", "extidi_usuarios.IdGruposUsuario = extidi_gruposusuarios.IdGrupoUsuario");
        $this->db->where($data);
        $this->db->order_by("extidi_usuarios.FechaHoraDeRegistro", "DESC");
        $rs = $this->db->get();
        //unset($rs["data"]["Password"]);
        //print_r($rs);
        return $rs->result_array();
    }

    function listarUsuarioDetalle($data) {

        $this->db->select("*, VerEstado(estado) estado, Password PasswordC");
        $this->db->where($data);
        $this->db->order_by("extidi_usuarios.FechaHoraDeRegistro", "DESC");
        $rs = $this->db->get('extidi_usuarios');
        return $rs->result_array();
    }

}

