<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Crud_Monitorias extends EXTIDI_Controller {

	function __construct() {
        parent::__construct();
        $this->__MODULO = "Extidi.modulos";
        $this->load->model("extidi_monitorias");
    }

    public function index() {
        
    }

    public function listarMonitorias() {

    }

    public function tieneHijos() {
    
    }

    public function cargarGrupoPadre() {

       
    }

    public function cargarGrupoPadreBusqueda() {

        
    }

    public function listarDetalleGrupoUsuarios() {
      
    }

    public function guardarGrupo() {
       
    }

    public function activarEstadoGrupo() {

    }

    public function inactivarEstadoGrupo() {

    }

    public function eliminarGrupo() {

      
    }

    public function exportarPdf() {
        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        $camposbd = array('NombreGrupo', 'IdEstadoGrupoUsuario_EAP', 'IdGrupoP', 'IdGrupoUsuario');
        $cabeceras = array('Nombre Grupo', 'Estado', 'Grupo Padre', 'Id Grupo');
        exportarPdf($grupo, $cabeceras, $camposbd);
    }

    public function imprimir() {
        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        $camposbd = array('NombreGrupo', 'IdEstadoGrupoUsuario_EAP', 'IdGrupoP', 'IdGrupoUsuario');
        $cabeceras = array('Nombre Grupo', 'Estado', 'Grupo Padre', 'Id Grupo');
        
        $this->respuesta(true, imprimir($grupo, $cabeceras, $camposbd), 'mensaje');
    }

    public function exportarCsv() {

        $query = $this->db->query("SELECT * FROM extidi_monitorias WHERE estado != 0 ");
        exportarCsv($query);
    }

    public function exportarExcel() {

        $data = array("estado !=" => 0);
        $grupo = $this->crud_monitorias->listarMonitorias($data);
        $camposbd = array('NombreGrupo', 'IdEstadoGrupoUsuario_EAP', 'IdGrupoP', 'IdGrupoUsuario');
        $cabeceras = array('Nombre Grupo', 'Estado', 'Grupo Padre', 'Id Grupo');
        exportarExcel($grupo, $cabeceras, $camposbd);
    }

}

