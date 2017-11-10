<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
if (!function_exists('enviar_correo')) {
    function enviar_correo($codigo = "", $destinatarios = array (), $asunto = "", $contenido2 = "", $adjuntos = array ()) {
        $CI = & get_instance();
        $CI->config->load("email");
        $retorno = array (
            "mensaje" => "",
            "success" => true
        );
        $usuario = $CI->session->userdata('usuario');
        if ($CI->config->item('email_habilitado') === true) {
            if (is_array($destinatarios) && count($destinatarios) > 0) {
                $retornos = array ();
                $contenido = "";
                $asunto = "";
                $CI->load->model('egresado_egresados');
                $CI->load->library('email');
                $configuracion = $CI->config->item('email_config');
                
                if ($codigo != "") {
                    $SQL = "SELECT asunto, cabecera, cuerpo, pie
                              FROM egresado_plantillas_correos
                             WHERE estado = 1 
                               AND id = '$codigo'";
                    $result = $CI->db->query($SQL, false);
                    $result = $result->result_array();
                    if (count($result) > 0) {
                        $contenidoF = ($contenido2 != '' ? $contenido2 . "<br /><br />": '') . $result[0]["cuerpo"];
                        $asunto = " " . $result[0]["asunto"];
                        $contenidoF = preg_replace('/\s+/', ' ', $contenidoF);
                        $contenidoF = str_replace('> <', '><', $contenidoF);
                        $pos = 0; $posQ = 0;
                        $visorQ  = "http://www.cuc.edu.co/egresar/visor.php?ubicacion=";
                        $conteo = 0;
                        while(($pos = stripos(substr($contenidoF, $posQ), '<img')) !== false) {
                            $posQ+= $pos + 1;
                            $tmp = substr($contenidoF, $posQ);
                            $tmp = substr($tmp, 0, stripos($tmp, '>') + 1);
                            $tmp = substr($tmp, stripos($tmp, 'src="') + 5);
                            $tmp = substr($tmp, 0, stripos($tmp, '"'));
                            if(stripos($tmp, $visorQ) !== false)
                                continue;
                            if(stripos($tmp, '//') !== false)
                                $tmpQ = $tmp;
                            else
                                $tmpQ = base_url() . $tmp;
                                
                            $tmpQ = $visorQ . base64_encode($tmpQ);
                            $contenidoF = str_replace($tmp, $tmpQ, $contenidoF);
                        }
                    }
                    if($adjuntos == array()) {
                        $SQL = "SELECT *
                                  FROM egresado_plantillas_correos_adjuntos
                                 WHERE estado = 1
                                   AND plantilla_id = $codigo;";
                        $adjuntos = $CI->db->query($SQL)->result();
                        $tmpF = array();
                        foreach ($adjuntos as $value) {
                            $tmpF[] = "upload/$value->adjunto";
                        }
                        $adjuntos = $tmpF;
                    }
                }
                if (is_array($adjuntos) && count($adjuntos) > 0) {
                    foreach ($adjuntos as $keyAdjunto => $valueAdjunto) {
                        if (is_numeric($keyAdjunto)) {
                            $CI->email->attach(getcwd() . "/" . $valueAdjunto);
                        } else {
                            $CI->email->attach($keyAdjunto . $valueAdjunto);
                        }
                    }
                }
                foreach ($destinatarios as $valuesDes) {
                    $CI->load->model("egresado_historial_egresados");
                    $datos = $CI->egresado_historial_egresados->listadoGrilla(0, 1, '', '', " prin.estado=1 AND prin.egresados_id='$valuesDes' ", "prin.fecha_actualizacion DESC");
                    $datos = $datos["data"];
                    if (count($datos) > 0) {
                        $datos = $datos[0];
                        $datos_egresado = $CI->egresado_egresados->listadoGrilla(0, 1, '', '', " prin.estado=1 AND prin.id='" . $datos["egresados_id"] . "' ", "");
                        $datos_egresado = $datos_egresado["data"];

                        if (count($datos_egresado) > 0) {
                            $datos_egresado = $datos_egresado[0];
                            $id = $datos["id"];
                            $SQL = "SELECT *
                                      FROM egresado_egresados AS e
                                 LEFT JOIN egresado_historial_egresados AS he ON he.egresados_id = e.id
                                     WHERE he.id = '$id'";
                            $sql = $CI->db->query($SQL, false);
                            $sql = $sql->result_array();
                            if (count($sql) > 0) {
                                $sql = $sql[0];
                                //$datos["correo_personal"] = "xxx@xxx.xxx";
                                $datos["correo_personal"] = preg_replace("/( ){2,}/", " ", trim($datos["correo_personal"]));
                                $tmpQ = explode(' ', $datos["correo_personal"]);
                                if ($codigo != "") {

                                    $etiquetas = array (
                                        '{primer_nombre}',
                                        "{segundo_nombre}",
                                        "{primer_apellido}",
                                        "{segundo_apellido}",
                                        "{tipo_documento_ea}",
                                        "{numero_documento}",
                                        "{sexo_ea}",
                                        "{numero_documento}",
                                        "{fecha_nacimiento}",
                                        "{situacion_ea}",
                                        "{estrato}",
                                        "{direccion_residencia}",
                                        "{ciudad_residencia_id}",
                                        "{pais_residencia_ea}",
                                        "{telefono_residencia}",
                                        "{telefono_movil}",
                                        "{correo_personal}",
                                        "{estudios_ea}",
                                        "{trabaja}",
                                        "{tipo_trabajador_ea}",
                                        "{empresa_labora}",
                                        "{direccion_empresa}",
                                        "{cargo_desempena}",
                                        "{telefono_empresa}",
                                        "{correo_empresa}"
                                    );
                                    $datos_egresado = array (
                                        $datos_egresado["primer_nombre"],
                                        $datos_egresado["segundo_nombre"],
                                        $datos_egresado["primer_apellido"],
                                        $datos_egresado["segundo_apellido"],
                                        $datos_egresado["tipo_documento_ea_valor"],
                                        $datos_egresado["numero_documento"],
                                        $datos_egresado["sexo_ea_valor"],
                                        $datos["fecha_nacimiento"],
                                        $datos["situacion_ea"],
                                        $datos["estrato"],
                                        $datos["direccion_residencia"],
                                        $datos["ciudad_residencia_id"],
                                        $datos["pais_residencia_ea_valor"],
                                        $datos["telefono_residencia"],
                                        $datos["telefono_movil"],
                                        $datos["correo_personal"],
                                        $datos["estudios_ea_valor"],
                                        $datos["trabaja"],
                                        $datos["tipo_trabajador_ea_valor"],
                                        $datos["empresa_labora"],
                                        $datos["direccion_empresa"],
                                        $datos["cargo_desempena"],
                                        $datos["telefono_empresa"],
                                        $datos["correo_empresa"]
                                    );
                                    $contenido = str_replace($etiquetas, $datos_egresado, $contenidoF);
                                }

                                foreach ($tmpQ as &$value) {
                                    $CI->email->initialize($configuracion);
                                    $CI->email->from($CI->config->item('email_from'));
                                    $CI->email->to($value);

                                    $CI->email->subject($asunto);

                                    $CI->email->message($contenido);

                                    if (!$CI->email->send()) {
                                        $retorno = array (
                                            "mensaje" => "Error al enviar correo, comuniquese con el administrador.<BR>" . $CI->email->print_debugger(),
                                            "success" => false
                                        );
                                    } else {
                                        $retorno = array (
                                            "mensaje" => $CI->email->print_debugger(),
                                            "correos" => $destinatarios,
                                            "success" => true
                                        );
                                    }
                                    if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
                                        header('Content-Type: text/html');
                                        die($CI->email->print_debugger() . '<br />' . $contenido);
                                    }
                                    array_push($retornos, $retorno);
                                }
                            }
                        }
                    }
                }
                return $retornos;
            } else {
                $retorno = array (
                    "mensaje" => "Lista de destinatarios vacia",
                    "success" => false
                );
                return $retorno;
            }
        } else {
            $retorno = array (
                "mensaje" => "Servidor de correos no funcionando",
                "success" => false
            );
            return $retorno;
        }
    }

}