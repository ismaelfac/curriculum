<?php

if (!defined('BASEPATH'))
	exit('No direct script access allowed');
date_default_timezone_set('America/Bogota');

class EXTIDI_Controller extends CI_Controller {

  	/*
	var $__MODULO = array(
		"controlador" => "Extidi.modulos.cic.proximo_servicio",
		"nombre" =>     "Proximo Servicio",
		"descripcion" =>  "Proximo Servicio",
		"tipo" => "TabVacio",
		"moduloPadre" => 0,
		"orden" => 1,
		"ancestros" => "",
		"accesoDirecto" => 0,
		"inicioRapido" => 0
	);
	var $__PERMISOS = array(
		"ver" => "Accion por defecto"
	);
  	*/
  
	var $__MODULO=array();
	var $__PERMISOS=array();
  	var $__publico=false;
	
	function __construct() {
		//$this->__PERMISOS["ver"]="Accion por defecto";
		parent::__construct();
		if($this->__publico==false){
			if (!$this->session->userdata('logged_in')) {
				if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
					strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
					echo json_encode(array(
						'conectado' => false,
						'mensaje' => 'Su sesi&oacute;n a caducado.'
					));
					die();
				} else {
					show_error('Acceso denegado', 401);
				}
			}
		}
	}

	protected function respuesta($success, $data, $variable, $listar = false, $start = 0, $limit = 0) {
		if ($listar) {
			$auxiliar["total"] = count($data);
			if (!$data)
				$aux = null;
			else
				$aux = $respuesta = array_splice($data, $start, $limit);
			$auxiliar[$variable] = $aux;
		} else {
			$auxiliar[$variable] = $data;
		}
		$auxiliar["success"] = $success;
		echo json_encode($auxiliar);
	}
	
	protected function tienePermiso($accion){
		$this->load->library('acl');
		$modulo = (is_array($this->__MODULO)?$this->__MODULO["controlador"]:$this->__MODULO);
		if(!$this->acl->tienePermiso($accion, $modulo)){
			if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
				strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
				echo json_encode(array(
					'permisos' => false,
					'mensaje' => 'No posee permiso de '.$accion
				));
				die();
			} else {
				show_error('Acceso denegado', 401);
			}
		}
	}

	public function install() {
		//echo "olaaaaa";
		$usuario = $this->session->userdata("usuario");
		//print_r($usuario);
		if($usuario["IdGruposUsuario"]=="1"){
			
			$this->load->model("extidi/modulo");
			$validacion = $this->modulo->validar(array(
				"Controlador" => $this->__MODULO["controlador"]
					));

			if (!$validacion) {
				
				$this->load->model("extidi/acciones");
				$datosModulo = array(
					"id" => 0,
					"NombreModulo" => $this->__MODULO["nombre"],
					"IdEstadoModulo_EAP" => 1,
					"DescripcionModulo" => $this->__MODULO["descripcion"],
					"TipoModulo" => $this->__MODULO["tipo"],
					"IdModuloPadre" => $this->__MODULO["moduloPadre"],
					"Orden" => $this->__MODULO["orden"],
					"Controlador" => $this->__MODULO["controlador"],
					"Ancestros" => $this->__MODULO["ancestros"],
					"AccesoDirecto" => $this->__MODULO["accesoDirecto"],
					"InicioRapido" => $this->__MODULO["inicioRapido"]
				);
				$this->modulo->bind($datosModulo);
				$this->modulo->guardar();

				$idModulo = $this->modulo->id;
				foreach ($this->__PERMISOS as $k => $v) {
					$datosAccion = array(
						"IdAccion" => 0,
						"NombreAccion" => $k,
						"IdEstadoAccion_EAP" => 1,
						"IdModulo" => $idModulo,
						"Ver" => 1,
						"DescripcionAccion" => $v
					);
					$this->acciones->bind($datosAccion);
					$this->acciones->guardar();
					$this->acciones->IdAccion;
					$this->db->query(
					"INSERT INTO `extidi_permisos` (
						`IdGrupoUsuario`,
						`IdAccion`)
					VALUES (1,'".$this->acciones->IdAccion."');",
					false
					);
				}
				echo "Modulo instalado correctamente";
			}
		}
	}
	
}