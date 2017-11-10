<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
if ( ! function_exists('movimiento_historial'))
{
	
	function movimiento_historial($modulo, $dato, $comentario){
		$CI =& get_instance();
		$seccion = $CI->session->userdata("usuario");
		$CI->load->model("csed_historial_movimientos");
		$datos=array(
			"id"=>"0",
			"estado"=>"1",
			"usuarios_id"=>$seccion["id"],
			"fecha"=>gmdate("Y-m-d H:i:s", time() + 3600*(-5)),
			"modulo"=>$modulo,
			"dato"=>$dato,
			"comentario"=>$comentario
		);
		$CI->csed_historial_movimientos->guardar($datos);
	
	}
}