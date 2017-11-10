<?php
if ( ! defined('BASEPATH'))
	exit('No direct script access allowed');
if ( ! function_exists('reporte_reserva'))
{
	function reporte_reserva($id)
	{
		$CI =& get_instance();
		$CI->config->load("email");
		$CI->load->model("recursos_reservas"); 
		$CI->recursos_reservas->__config["verificar_permiso"]=false;
		$retorno = $CI->recursos_reservas->listadoGrilla(0,0, "", "", "prin.id=$id");
		$datos = array(
			"reserva" => $retorno['data'][0]
		);
		
		$CI->load->model("recursos_reservas_recursos_adicionales"); 
		$CI->recursos_reservas_recursos_adicionales->__config["verificar_permiso"] = false;
		$retorno = $CI->recursos_reservas_recursos_adicionales->listadoGrilla(0,0, "", "", "prin.reservas_id=$id and prin.estado=1");
		$r_adicionales = $retorno['data'];		
		$datos['adicionales'] = $r_adicionales;

		$CI->load->model("recursos_secciones_reservas"); 
		$CI->recursos_secciones_reservas->__config["verificar_permiso"] = false;
		$retorno = $CI->recursos_secciones_reservas->listadoGrilla(0,0, "", "", "prin.reservas_id=$id and prin.estado=1 and prin.cruce=0");
		$datos['secciones_reserva'] = $retorno['data'];
		//print_r($datos['secciones_reserva']);

		return $CI->load->view('recursos/reporte_reservas',$datos, true);	
	}
}