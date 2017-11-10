<?php

if ( ! defined('BASEPATH'))
	exit('No direct script access allowed');

class Escritorio extends EXTIDI_controller {
    
    public function index()
    {
    }
    
    public function cargarMenu($node = 0) {
        $user = $this->session->userdata("usuario");
        if (!is_array($user)) {
            $this->respuesta(true, array(), "datos");
        } else {
            $usuario = $user["id"];
            $result = $this->db->query("
				SELECT 
					m.*
				FROM
					extidi_permisos as p,
					extidi_acciones as a,
					extidi_modulos as m
				WHERE
					p.IdGrupoUsuario='" . $user["IdGruposUsuario"] . "'
				AND
					p.IdAccion=a.IdAccion
				AND 
					a.Ver=1
				AND
					m.TipoModulo!='Widget'
				AND 
					a.NombreAccion='ver'
				AND
					a.IdModulo=m.id
				AND
					m.IdModuloPadre='$node'
				AND
					m.estado=1
				ORDER BY m.Orden ASC, m.TipoModulo ASC
			", false);
            $resultado = $result->result_array();
            foreach ($resultado as $k => $v) {
				$resultado[$k]['menu'] = $this->cargarMenu($v['id']);
            }
            if ($node == 0) {
                $this->respuesta(true, $resultado, "datos");
            } else {
                return $resultado;
            }
        }
	}    
    public function cargarPermisos() {
        $modulo = $this->input->post("modulo");
        $user = $this->session->userdata("usuario");
		$info=array(
			"titulo"=>""
		);
		$resultado = array();
        if (is_array($user)) {
            $result = $this->db->query("
				SELECT IFNULL(GROUP_CONCAT(a.NombreAccion), '') AS permisos
				FROM extidi_modulos AS m,
				extidi_acciones AS a,
				extidi_permisos AS p
				WHERE
				m.Controlador='$modulo'
				AND
				p.IdGrupoUsuario='".$user["IdGruposUsuario"]."'
				AND
				a.IdModulo=m.id
				AND
				p.IdAccion=a.IdAccion
				AND
				a.IdEstadoAccion_EAP=1
			", false);
            $resultado = $result->result_array();
            $result = $this->db->query("
				SELECT 
				m.NombreEscritorio
				FROM extidi_modulos AS m
				WHERE
				m.Controlador='$modulo'
			", false);
            $informacion = $result->result_array();
			$info["titulo"]=$informacion[0]["NombreEscritorio"];
        }
		echo json_encode(array(
			"success"=>true,
			"datos"=>$resultado,
			"info"=>$info
		));
	}
	public function cargarAyuda() {
        $modulo = $this->input->post("modulo");
        $user = $this->session->userdata("usuario");
		$info="";
		$resultado = array();
        if (is_array($user)) {
            $result = $this->db->query("
				SELECT 
				m.Ayuda
				FROM extidi_modulos AS m
				WHERE
				m.Controlador='$modulo'
			", false);
            $informacion = $result->result_array();
			$info=$informacion[0]["Ayuda"];
        }
		echo json_encode(array(
			"success"=>true,
			"info"=>$info
		));
	}
	
    public function cargarWidgets() {
        $user = $this->session->userdata("usuario");
        if (!is_array($user)) {
            $this->respuesta(true, array(), "datos");
        } else {
            $usuario = $user["id"];
            $result = $this->db->query("
				SELECT 
					m.*
				FROM
					extidi_permisos as p,
					extidi_acciones as a,
					extidi_modulos as m
				WHERE
					p.IdGrupoUsuario='".$user["IdGruposUsuario"]."'
				AND
					p.IdAccion=a.IdAccion
				AND 
					a.Ver=1
				AND
					m.TipoModulo='Widget'
				AND 
					a.NombreAccion='ver'
				AND
					a.IdModulo=m.id
				AND
					m.estado=1
				ORDER BY m.Orden DESC
			", false);
            $resultado = $result->result_array();
			
			$this->respuesta(true, $resultado, "datos");
        }
	}    
	
	public function cargarAccesos() {
        $user = $this->session->userdata("usuario");
        if (!is_array($user)) {
            $this->respuesta(true, array(), "datos");
        } else {
            $usuario = $user["id"];
            $result = $this->db->query("
				SELECT 
					m.Controlador as id,
					m.NombreEscritorio as texto
				FROM
					extidi_permisos as p,
					extidi_acciones as a,
					extidi_modulos as m
				WHERE
					p.IdGrupoUsuario='".$user["IdGruposUsuario"]."'
				AND
					p.IdAccion=a.IdAccion
				AND 
					a.Ver=1
				AND
					m.TipoModulo not in('Widget', 'CarpetaArbol', 'CarpetaMenu')
				AND 
					a.NombreAccion='ver'
				AND
					a.IdModulo=m.id
				AND
					m.estado=1
				AND
					m.AccesoDirecto=1
				ORDER BY m.Orden ASC
			", false);
            $resultado = $result->result_array();
			
			$this->respuesta(true, $resultado, "datos");
        }
	}    
}
