<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Crud_Monitores extends EXTIDI_Controller {

	function __construct() {
        parent::__construct();
        $this->__MODULO = "Extidi.modulos";
        $this->load->model("extidi_monitores");
    }
    public function index() {
        
    }

    public function listarMonitores() {

   		
    }

    
    public function activarMonitor() {

    }

    public function inactivarMonitor() {

    }

    public function eliminarMonitor() {

  
    }

    public function exportarPdf() {
     
    }

    public function imprimir() {
       
    }

    public function exportarCsv() {

        $query = $this->db->query("SELECT * FROM extidi_monitores WHERE estado != 0 ");
        exportarCsv($query);
    }

    public function exportarExcel() {

       // $this->load->model("extidi/grupousuario");
        $data = array("estado !=" => 0);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        $camposbd = array('NombreGrupo', 'IdEstadoGrupoUsuario_EAP', 'IdGrupoP', 'IdGrupoUsuario');
        $cabeceras = array('Nombre Grupo', 'Estado', 'Grupo Padre', 'Id Grupo');
        exportarExcel($grupo, $cabeceras, $camposbd);
    }

}

