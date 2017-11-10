<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Extidi_Permisos extends EXTIDI_Controller {

	var $__MODULO = array(
        "controlador" => "Extidi.modulos.extidi.permisos",
        "nombre" => 		"Permisos",
        "descripcion" => 	"Permisos",
        "tipo" => "TabVacio",
        "moduloPadre" => 0,
        "orden" => 1,
        "ancestros" => "",
        "accesoDirecto" => 0,
        "inicioRapido" => 0
    );
    var $__PERMISOS = array(
        "ver" => "Accion por defecto",
        "modificar_grupos" => "Accion modificar"
    );
	
    function index() {
    }
	
	function obtener_grupos(){
		$this->tienePermiso("ver");
		$id=$this->input->post("id");
		$this->load->model("extidi_gruposusuarios");
		$grupos=$this->extidi_gruposusuarios->cargar();
		foreach($grupos as $key=>$value){
			$resultado=$this->db->query("
				SELECT
					a.IdAccion,
					a.NombreAccion,
					a.DescripcionAccion,
					COUNT(p.`IdGrupoUsuario`) AS cantidad
				FROM extidi_acciones AS a
				LEFT JOIN extidi_permisos AS p
				ON p.`IdAccion`=a.`IdAccion`
				AND
				p.`IdGrupoUsuario`='".$value["id"]."'
				WHERE
				a.`IdEstadoAccion_EAP`=1
				AND
				a.`IdModulo`='$id'
				GROUP BY a.IdAccion, a.NombreAccion
			", false);
			$resultado=$resultado->result_array();
			$grupos[$key]["acciones"]=$resultado;
		}
		$retorno=array(
			"success"=>true,
			"data"=>$grupos
		);
		echo json_encode($retorno);
	}
	
	function guardar(){
		$this->tienePermiso("modificar_grupos");
		$datos=json_decode($this->input->post("datos"), true);
		foreach($datos as $key=>$value){
			//print_r($value);
			$dat=array(
				'IdAccion'=>$value["accion_id"],
				'IdGrupoUsuario'=>$value["grupo_id"]
			);
			
			$this->db->select('COUNT(*) AS cantidad');
			$this->db->from('extidi_permisos');
			$this->db->where('IdAccion', $value["accion_id"]);
			$this->db->where('IdGrupoUsuario', $value["grupo_id"]);
			$resultado=$this->db->get();
			$resultado=$resultado->result_array();
			
			if($resultado[0]["cantidad"]==0){
				if($value["valor"]===true){
					$this->db->insert('extidi_permisos', $dat);
				}
			}else{
				if($value["valor"]===false){
					$this->db->delete('extidi_permisos', $dat);
				}
			}
		}
		echo json_encode(array(
			"success"=>true
		));
	}
}