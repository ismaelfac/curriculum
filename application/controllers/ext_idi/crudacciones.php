<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CrudAcciones extends EXTIDI_Controller {

    public function index() {
        
    }

    public function listado() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;

        $this->load->model("extidi/acciones");
        $data = "IdEstadoModulo_EAP = 1";
        /* Codigo para realizar el filtor */
        $busqueda = $this->input->post("search");
        $busqueda = json_decode($busqueda, true);
        $nombreBusqueda = trim($busqueda['NombreAccion']);
        $DescripcionBusqueda = trim($busqueda['DescripcionAccion']);
        $verBusqueda = trim($busqueda['Ver']);
        $estadoBusqueda = trim($busqueda['IdEstadoAccion_EAP_Valor']);
        $nombreModuloBusqueda = trim($busqueda['NombreModulo']);
        /* Codigo para que funcione la busqueda */
        if (isset($busqueda)) {
            $sqlNombre = "AND NombreAccion LIKE '$nombreBusqueda%' ";
            $data = $data . $sqlNombre;
            $sqlDescripcion = "AND DescripcionAccion LIKE '$DescripcionBusqueda%' ";
            $data = $data . $sqlDescripcion;
            $sqlVer = "AND Ver LIKE '$verBusqueda%' ";
            $data = $data . $sqlVer;
            $sqlModulo = "AND prin.IdModulo LIKE '$nombreModuloBusqueda%' ";
            $data = $data . $sqlModulo;
            $sqlEstado = "AND IdEstadoAccion_EAP LIKE '$estadoBusqueda%' ";
            $data = $data . $sqlEstado;
        }
        /* Fin Codigo para realizar la busqueda con el filtro */
        $oder = "IdAccion DESC";

        $acciones = $this->acciones->listar($data, $oder);
        $this->respuesta(true, $acciones, "data", true, $start, $limit);
    }

    public function listarModulosBusqueda() {
        $this->load->model("extidi/modulo");
        $modulos = $this->modulo->listar('', '', true);
        array_push($modulos, array("NombreModulo" => '-'));
        $this->respuesta(true, $modulos, "data");
    }

    public function cargarModulos() {
        $this->load->model("extidi/modulo");
        $modulos = $this->modulo->listar('', '', true);
        $this->respuesta(true, $modulos, "data");
    }



}
