<?php

if (!defined('BASEPATH'))
	exit('No direct script access allowed');

class consola_mysql extends EXTIDI_Controller {

	var $__MODULO = array(
        "controlador" => "Extidi.widget.consola_mysql",
        "nombre" => 		"Widget Consola Mysql",
        "descripcion" => 	"Widget Consola Mysql",
        "tipo" => "Widget",
        "moduloPadre" => 0,
        "orden" => 1,
        "ancestros" => "",
        "accesoDirecto" => 0,
        "inicioRapido" => 0
    );
    var $__PERMISOS = array(
        "ver" => "Accion por defecto"
    );
	
    function index() {
    }

	function ejecutar(){
		$this->tienePermiso("ver");
		$sql=$this->input->post("sql");
		
		$retorno=$this->db->query($sql, false);
		if(is_bool($retorno)){
			$this->respuesta(true, array(
				"result"=>$retorno,
				"num_rows"=>$this->db->affected_rows()
			), "data");
		}else{
			$resultado=$retorno->result_array();
			$html="";
			if(count($resultado)>0){
				$html.="<td>#</td>";
				foreach($resultado[0] as $key=>$value){
					$html.="<td>".$key."</td>";
				}
				$html="<tr>".$html."</tr>";
				foreach($resultado as $keyFila=>$valueFila){
					$fila="<td>$keyFila</td>";
					foreach($valueFila as $keyCelda=>$valueCelda){
						$fila.="<td>".$valueCelda."</td>";
					}
					$html.="<tr>".$fila."</tr>";
				}
				$html='<table width="100%" border="1">'.$html."</table>";
			}
			$this->respuesta(true, array(
				"result"=>$html,
				"num_rows"=>$retorno->num_rows()
			), "data");
		}
	}
}

?>