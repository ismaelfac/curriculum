<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

class Dinamico extends EXTIDI_Controller
{
    
    var $__publico = true;
    
    public function index() {
        $this->config->set_item('extidi_titulo', 'item_value');
    }
    
    public function modeloFormularioFiltro() {
        $modelo = $this->input->post('modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        $datos = $this->$modelo->modeloFormularioFiltro();
        $modal = $this->input->post('modal');
        if ($modal == "1") {
            array_splice($datos, 0, 2);
        }
        $this->respuesta(true, $datos, "data");
    }
    
    public function modeloFormulario() {
        $modelo = $this->input->post('modelo');
        $mostrarBotones = $this->input->post('mostrarBotones') == '1';
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        $datos = $this->$modelo->modeloFormulario($mostrarBotones);
        $this->respuesta(true, $datos, "data");
    }
    
    public function modeloAccionesAdicionales() {
        $modelo = $this->input->post('modulo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        $datos = $this->$modelo->modeloAccionesAdicionales();
        $this->respuesta(true, $datos, "data");
    }
    
    public function modeloGrilla() {
        $modelo = $this->input->post('modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        $datos = $this->$modelo->modeloGrilla();
        $modal = $this->input->post('modal');
        if ($modal == "1") {
            $datos["columnas"][0]["hidden"] = true;
            $datos["columnas"][1]["hidden"] = true;
        }
        $this->respuesta(true, $datos, "data");
    }
    
    public function valorParametros() {
        $this->db->select("vp.id, vp.ValorParametro");
        $this->db->from("extidi_valorparametro as vp");
        $this->db->from("extidi_parametro as p");
        $this->db->where("vp.IdParametro=p.id", null, false);
        $this->db->where("vp.estado", 1);
        $this->db->where("p.NombreCampo", $this->input->post("NombreCampo"));
        
        if ($this->input->post("dato") != "") {
            $this->db->where("vp.id", $this->input->post("dato"));
        }
        if ($this->input->post("query") != "") {
            $this->db->where("ValorParametro like '%" . $this->input->post("query") . "%'", null, false);
        }
        if ($this->input->post("con") != "") {
            $this->db->where(base64_decode($this->input->post("con")), null, false);
        }
        
        $this->db->limit(5, $this->input->post("start"));
        
        $retorno = $this->db->get();
        $retorno = $retorno->result_array();
        $this->respuesta(true, $retorno, "data");
    }
    
    public function valorForaneo() {
        
        $modelo = $this->input->post('tabla');
        $this->load->model($modelo);
        if ($this->input->post("campo") != "") {
            $this->$modelo->__config["llave"] = $this->input->post("campo");
        }
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $retorno = $this->$modelo->consultaForanea(json_decode($this->input->post("columnas"), false), $this->input->post("start"), 5, $this->input->post("orden"), $this->$modelo->__config["condicion"] . " " . (($this->input->post("con") != "" && $this->$modelo->__config["condicion"]) ? " AND " : "") . base64_decode($this->input->post("con")), $this->input->post("query"), $this->input->post("dato"), $this->input->post("adicional"));
        
        $this->respuesta(true, $retorno, "data");
    }
    
    public function cargarModal() {
        
        $modelo = $this->input->post('modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $retorno = $this->$modelo->listadoGrilla(0, 1, '', json_encode(array($this->$modelo->__config["llave"] => $this->input->post("id"))));
        
        $retorno["success"] = true;
        echo json_encode($retorno);
    }
    
    public function listadoGrilla() {
                
        $modelo = $this->input->post('tabla');
        $this->load->model($modelo);
        
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = false;
        }
        $order = $this->input->post("sort");
        if ($order != "") {
            $order = json_decode($this->input->post("sort"), true);
            foreach ($order as $keyOrder => $valueOrder) {
                $order[$keyOrder] = $valueOrder["property"] . " " . $valueOrder["direction"];
            }
            $order = implode(", ", $order);
        }
        
        $retorno = $this->$modelo->listadoGrilla($this->input->post("start"), $this->input->post("limit"), $this->input->post("filtro"), $this->input->post("dato"), base64_decode($this->input->post("con")), $order);
        $retorno["success"] = true;
        echo json_encode($retorno);
        
        //$this->respuesta(true, $retorno, "data");
        
    }
    
    public function guardar() {
        $modelo = $this->input->post('__modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $valores = $this->input->post();
        unset($valores['__modelo']);
        $retorno = $this->$modelo->guardar($valores);
        $this->respuesta($retorno["success"], array("id" => (key_exists("id", $retorno) ? $retorno["id"] : 0), "mensaje" => $retorno["mensaje"]), "data");
    }
    
    public function eliminar() {
        $modelo = $this->input->post('modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $valores = json_decode($this->input->post('datos'));
        $retorno = $this->$modelo->eliminar($valores);
        
        //print_r($retorno);
        $this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
    }
    
    public function activar() {
        $modelo = $this->input->post('modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $valores = json_decode($this->input->post('datos'));
        $retorno = $this->$modelo->activar($valores);
        
        //print_r($retorno);
        $this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
    }
    
    public function inactivar() {
        $modelo = $this->input->post('modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $valores = json_decode($this->input->post('datos'));
        $retorno = $this->$modelo->inactivar($valores);
        
        //print_r($retorno);
        $this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
    }
    
    public function excel() {
        $modelo = $this->input->post('tabla');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $filtro =
        
        /* json_decode( */
        $this->input->post('filtro')
        
        /* ) */;
        $this->$modelo->excel($filtro);
        
        //echo $retorno;
        //print_r($retorno);
        //$this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
        
        
    }
    
    public function pdf() {
        $modelo = $this->input->post('tabla');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $filtro =
        
        /* json_decode( */
        $this->input->post('filtro')
        
        /* ) */;
        $retorno = $this->$modelo->pdf($filtro);
        
        //echo $retorno;
        //print_r($retorno);
        //$this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
        
        
    }
    
    public function csv() {
        $modelo = $this->input->post('tabla');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $filtro =
        
        /* json_decode( */
        $this->input->post('filtro')
        
        /* ) */;
        $retorno = $this->$modelo->csv($filtro);
        
        //echo $retorno;
        //print_r($retorno);
        //$this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
        
        
    }
    
    public function imprimir() {
        $modelo = $this->input->post('tabla');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $filtro =
        
        /* json_decode( */
        $this->input->post('filtro')
        
        /* ) */;
        $retorno = $this->$modelo->imprimir($filtro);
        
        //echo $retorno;
        //print_r($retorno);
        //$this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
        
        
    }
    
    public function plantilla() {
        $modelo = $this->input->post('modelo');
        $this->load->model($modelo);
        if ($this->$modelo->__config["publico"] === false) {
            $this->$modelo->__config["verificar_permiso"] = true;
        }
        
        $retorno = $this->$modelo->plantilla();
        
        //echo $retorno;
        //print_r($retorno);
        //$this->respuesta($retorno["success"], $retorno["mensaje"], "mensaje");
        
        
    }
    
    //index.php/dinamico/instalador?m=extidi_usuarios
    public function instalador() {
        $user = $this->session->userdata("usuario");
        if ($user["IdGruposUsuario"] == "1") {
            $modelo = $this->input->get('m');
            $this->load->model($modelo);
            $this->$modelo->instalador();
        }
    }
    
    public function cargar_archivos() {
        $user = $this->session->userdata("usuario");
        $modelo = $this->input->post('modelo');
        $columna = $this->input->post('columna');
        
        //$this->load->model($modelo);
        $this->load->helper('file');
        
        //$directorio='./upload/importacion/';
        $directorio = './upload/' . $modelo . '/' . $columna . '/' . $user["id"] . '/';
        if (!is_dir($directorio)) {
            mkdir($directorio, 0776, true);
        }
        $archivos = get_filenames($directorio);
        $this->respuesta(true, $archivos, "archivos");
    }
    
    public function subir_archivo() {
        $user = $this->session->userdata("usuario");
        $modelo = $this->input->post('modelo');
        $columna = $this->input->post('columna');
        
        $directorio = './upload/' . $modelo . '/' . $columna . '/' . $user["id"] . '/';
        if (!is_dir($directorio)) {
            mkdir($directorio, 0776, true);
        }
        
        $this->load->library('upload');
        $this->load->helper('file');
        
        $config['file_name'] = date("YmdHis");
        $config['upload_path'] = $directorio;
        $config['allowed_types'] = "*";
        $config['overwrite'] = true;
        
        $this->upload->initialize($config);
        
        if (!$this->upload->do_upload("archivo")) {
            $mjs2 = $this->upload->display_errors();
            $mjs2 = str_replace("<p>", "", $mjs);
            $mjs2 = str_replace("</p>", "", $mjs);
            $mjs = "<br>" . ($mjs == "" ? "Errores archivo: <br>" : "") . $mjs2;
            $this->respuesta(false, $mjs, "mensaje");
        } 
        else {
            $archivos = get_filenames($directorio);
            $this->respuesta(true, $archivos, "archivos");
        }
    }
}
