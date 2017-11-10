<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Formulario extends CI_Controller {

    function index() {
        
    }

    function horaSistema() {
		return gmdate("Y-m-d H:i:s", time() + 3600*(-5));
    }

    function logout() {
		$this->session->sess_destroy();
        echo json_encode(array(
            'success' => true
        ));
    }


    function validarHistorial() {
	    
		$mensaje = "";
		$id_nuevo_historial = 0;
		
        $this->load->model("egresado_historial_egresados");
		$egresados_id=$this->input->post("egresados_id");
		
		$historial = $this->egresado_historial_egresados->cargar("egresados_id = '$egresados_id' ");
	   
		if(count($historial)>0){
		 
			$historial_estado_0 = $this->egresado_historial_egresados->cargar("egresados_id = '$egresados_id'  AND estado='0'  AND origen_actualizacion='Egresado' ");
			
			if(count($historial_estado_0)>0){
			    $mensaje = "ya tiene Historial 0 con origen Egresado ";
			   	$id_nuevo_historial =  $historial[0]["id"];
				
			}else{
			
			        $ultimo_historial = "SELECT * FROM egresado_historial_egresados ORDER BY id DESC LIMIT 1";
					$data_ultimo_historial= $this->db->query($ultimo_historial);
					$result_ultimo_historial   = $data_ultimo_historial->result_array();	
					$id_nuevo_historial = $result_ultimo_historial[0]["id"];
					$id_anterior = $result_ultimo_historial[0]["id"];
					
				    $result_ultimo_historial[0]["id"] = 0;
					$result_ultimo_historial[0]["estado"] = "1";
					$result_ultimo_historial[0]["egresados_id"] = $egresados_id;
					$result_ultimo_historial[0]["fecha_actualizacion"] = $this->horaSistema();
					
					 $guardado_copia  = $this->egresado_historial_egresados->guardar($result_ultimo_historial[0]);
					 
					
					 
					  if($guardado_copia["mensaje"] = "Guardado correctamente"){
							 $id_nuevo_historial =  $guardado_copia["id"];
							 $mensaje = "Nuevo Historial con estado 1 ingresado y origen Visita a oficina - copia";
							 
							  $this->load->model("egresado_programas_historial_egresados");
							  $historial_programas = $this->egresado_programas_historial_egresados->cargar("historial_egresados_id = '$id_anterior' ");
							  
							   if(count($historial_programas)>0){							  
								  $this->db->insert("egresado_programas_historial_egresados", array(
									'programas_id'=>$historial_programas[0]["programas_id"],
									'historial_egresados_id'=>$id_nuevo_historial,
									 'estado'=>"1"								
									));
								}
						
                              $this->load->model("egresado_referidos_egresados_publico");
							  $historial_referidos = $this->egresado_referidos_egresados_publico->cargar("historial_egresados_id = '$id_anterior' ");
							  $historial_referidos[0]["id"] = 0;
							  $historial_referidos[0]["historial_egresados_id"] = $id_nuevo_historial;							  
							  $historial_referidos_copia  = $this->egresado_referidos_egresados_publico->guardar($historial_referidos[0]);		
							  
                              $this->load->model("egresado_contactos_egresados_publico");
							  $historial_contactos = $this->egresado_contactos_egresados_publico->cargar("historial_egresados_id = '$id_anterior' ");
							  $historial_contactos[0]["id"] = 0;
							  $historial_contactos[0]["historial_egresados_id"] = $id_nuevo_historial;
							  $historial_contactos_copia  = $this->egresado_contactos_egresados_publico->guardar($historial_contactos[0]);										  
					  }
			}
			
		}else{
		
		    $array_guardar = Array
				(
					"id" => 0,
					"estado" => "0",
					"egresados_id" => $egresados_id,
					"fecha_nacimiento" => NULL,
					"situacion_ea" => 19,
					"direccion_residencia" => "  ",
					"ciudad_residencia_ea" => "0",
					"pais_residencia_ea" => "0",
					"telefono_residencia" => NULL,
					"telefono_movil" => NULL,
					"correo_personal" => NULL,
					"estudios_ea" => "  ",
					"trabaja" => "1",
					"tipo_trabajador_ea" => "0", 
					"empresa_labora" => NULL,
					"direccion_empresa" => NULL,
					"cargo_desempena" => NULL,
					"telefono_empresa" => NULL,
					"correo_empresa" => NULL,
					"origen_actualizacion" => "Egresado",
					"agente_usuarios_id" => NULL,
					"campanas_id" => NULL,
					"contactado" => NULL,
					"fecha_actualizacion" => $this->horaSistema(),
					"razon_no_contactado_ea" => NULL,
					"observaciones" => NULL
				);
			
			     $guardado  = $this->egresado_historial_egresados->guardar($array_guardar);	 
				 
		         if($guardado["mensaje"] = "Guardado correctamente"){
				     $id_nuevo_historial =  $guardado["id"];
					 $mensaje = "Nuevo Historial con estado 0 ingresado y origen Egresado";
				 }
		  
		}
		
		$historial_actual = $this->egresado_historial_egresados->cargar("id = '$id_nuevo_historial'  ");
		
		 echo json_encode(array(
				'success' => true,
				'datos' => array(
					'mensaje' => $mensaje,
					'id'=>$id_nuevo_historial,
					'historial_actual'=>$historial_actual
					
				)
			));
    }
	
	
	function guardar(){
	     $mensaje="";
		$id=$this->input->post("id_historial");
		$estado=$this->input->post("estado");
		$origen_actualizacion=$this->input->post("origen_actualizacion");
		$egresados_id=$this->input->post("egresados_id");
	    $cargo_desempena=$this->input->post("cargo_desempena");
		$ciudad_residencia_ea=$this->input->post("ciudad_residencia_ea");
		$correo_empresa=$this->input->post("correo_empresa");
		$direccion_empresa=$this->input->post("direccion_empresa");
		$direccion_residencia=$this->input->post("direccion_residencia");
		$telefono_movil=$this->input->post("telefono_movil");
		$correo_personal=$this->input->post("correo_personal");
		$empresa_labora=$this->input->post("empresa_labora");
		$estudios_ea=$this->input->post("estudios_ea");
		$fecha_actualizacion=$this->input->post("fecha_actualizacion");
		$fecha_nacimiento=$this->input->post("fecha_nacimiento");
		$observaciones=$this->input->post("observaciones");
		$pais_residencia_ea=$this->input->post("pais_residencia_ea");
		$situacion_ea=$this->input->post("situacion_ea");
		$estrato=$this->input->post("estrato");
		$telefono_empresa=$this->input->post("telefono_empresa");
		$telefono_residencia=$this->input->post("telefono_residencia");
		$tipo_trabajador_ea=$this->input->post("tipo_trabajador_ea");
		$trabaja=$this->input->post("trabaja");
		
		 $this->load->model("egresado_historial_egresados");
	
		$historial_loaded = $this->egresado_historial_egresados->cargar("id = '$id' ");	
			
			$historial_loaded[0]["estado"]=$estado;
			$historial_loaded[0]["egresados_id"]=$egresados_id;
			$historial_loaded[0]["origen_actualizacion"]=$origen_actualizacion;
			$historial_loaded[0]["fecha_nacimiento"]=$fecha_nacimiento;
			$historial_loaded[0]["situacion_ea"]=$situacion_ea;
			$historial_loaded[0]["direccion_residencia"]=$direccion_residencia;
			$historial_loaded[0]["ciudad_residencia_ea"]=$ciudad_residencia_ea;
			$historial_loaded[0]["pais_residencia_ea"]=$pais_residencia_ea;
			$historial_loaded[0]["telefono_residencia"]=$telefono_residencia;
			$historial_loaded[0]["estrato"]=$estrato;
			$historial_loaded[0]["telefono_movil"]=$telefono_movil;
			$historial_loaded[0]["correo_personal"]=$correo_personal;
			$historial_loaded[0]["estudios_ea"]=$estudios_ea;
			$historial_loaded[0]["trabaja"]=$trabaja;
			$historial_loaded[0]["tipo_trabajador_ea"]=$tipo_trabajador_ea;
			$historial_loaded[0]["empresa_labora"]=$empresa_labora;
			$historial_loaded[0]["direccion_empresa"]=$direccion_empresa;
			$historial_loaded[0]["cargo_desempena"]=$cargo_desempena;
			$historial_loaded[0]["telefono_empresa"]=$telefono_empresa;
			$historial_loaded[0]["correo_empresa"]=$correo_empresa;
			$historial_loaded[0]["fecha_actualizacion"]=$this->horaSistema();
			$historial_loaded[0]["observaciones"]=$observaciones;


		  $guardado_copia  = $this->egresado_historial_egresados->guardar($historial_loaded[0]);
		 
		 if($guardado_copia["mensaje"] = "Guardado correctamente"){
		   $mensaje = "Guardado Perfectamente";
		 }else{
		   $mensaje = "Error en base de datos";
		 }
		 
		 echo json_encode(array(
		'success' => true,
		'datos' => array(
			'mensaje' => $mensaje)));
		
	}
	
	
	
function finalizar(){
	
	$mensaje="";
	$id=$this->input->post("id_historial");
	$estado=$this->input->post("estado");
	 
	 $this->load->model("egresado_historial_egresados");

	$historial_loaded = $this->egresado_historial_egresados->cargar("id = '$id' ");	
		
		$historial_loaded[0]["estado"]="1";
		$historial_loaded[0]["origen_actualizacion"]="Visita a oficina";
		
	   $guardado_copia  = $this->egresado_historial_egresados->guardar($historial_loaded[0]);
	 
		 if($guardado_copia["mensaje"] = "Guardado correctamente"){
		   $mensaje = "Guardado Perfectamente";
		 }else{
		   $mensaje = "Error en base de datos";
		 }
	 
		 echo json_encode(array(
			'success' => true,
			'datos' => array(
			'mensaje' => $mensaje)));
	
}

   

}

?>