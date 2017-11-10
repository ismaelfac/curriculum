<?php

date_default_timezone_set('America/Bogota');
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CrudUsuario extends EXTIDI_Controller {

    public function index() {
    }

    function listado() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;

        $this->load->model("extidi/usuario");
        $data = "extidi_usuarios.IdEstadoUsuario_EAP != -1";
        
        $search=json_decode($this->input->post("search"), true);
        //echo("/*");
        //print_r($search);
        //echo("*/");
        $condicionLike=array();
        if(is_array($search)){
            foreach ($search as $k => $v) {
                if($v!=='' && $v!==null){
                    $condicionLike[$k]=$v;
                }
            }
        }
        if(count($condicionLike)){
            $this->db->like($condicionLike);
        }
        /* Fin del codigo para hacer la busqueda con el filtro */

        $usuario = $this->session->userdata("usuario");
        $idGruposUsuario= $usuario["IdGruposUsuario"];   
      
        if($idGruposUsuario!=1){           
            $this->db->where("IdGruposUsuario !=", 1);                
        }

        $usuarios = $this->usuario->listadoUsuarios($data);
        for($i=$start;$i<count($usuarios); $i++){
            if($i==$start+$limit){
                break;
            }
            $usuarios[$i]["Password"]="";
        }
        $this->respuesta(true, $usuarios, "data", true, $start, $limit);
    }

    function listarGrupoUsuarioBusqueda() {
        $this->load->model("extidi/grupousuario");

        $usuario = $this->session->userdata("usuario");
        $idGruposUsuario= $usuario["IdGruposUsuario"];   
      
        if($idGruposUsuario!=1){           
            $this->db->where("IdGrupoUsuario !=", 1);                
        }

        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        array_push($grupo, array("NombreGrupo" => '-'));
        $this->respuesta(true, $grupo, "data");
    }

    function guardarUsuario() {
        $this->load->model("extidi/usuario");
        $usuario = $this->input->post("usuario");
        $usuario = json_decode($usuario, true);
        $idUsuario = $this->input->post("IdUsuario");

        $fecha = date("Y-m-d_H-i-s");

        //Id para cuando se este usando el detalle
        $idgrupo = $this->input->post("idgrupo");
        if ($idgrupo) {
            $usuario['IdGruposUsuario'] = $idgrupo;
        }
        //
        if ($usuario['IdEstadoUsuario_EAP'] == 'Activo') {

            $usuario['IdEstadoUsuario_EAP'] = 1;
        } else if ($usuario['IdEstadoUsuario_EAP'] == 'Inactivo') {
            $usuario['IdEstadoUsuario_EAP'] = 0;
        }

        $usuario["PrimerNombre"] = str_replace("ñ","Ñ",strtoupper(trim($usuario["PrimerNombre"])));
        $usuario["SegundoNombre"] = str_replace("ñ","Ñ",strtoupper(trim($usuario["SegundoNombre"])));
        $usuario["PrimerApellido"] = str_replace("ñ","Ñ",strtoupper(trim($usuario["PrimerApellido"])));
        $usuario["SegundoApellido"] = str_replace("ñ","Ñ",strtoupper(trim($usuario["SegundoApellido"])));
        $usuario["Usuario"] = strtolower(trim($usuario["Usuario"]));
        $usuario["Email"] = strtolower(trim($usuario["Email"]));
        if ($usuario["Password"] == "") {
            unset($usuario["Password"]);
        } else {
            $usuario["Password"] = md5($usuario["Password"]);
        }
        $usuario['FechaHoraDeRegistro'] = $fecha;

        $emailUsuario = $usuario["Email"];
        $usuaUsuario = $usuario["Usuario"];

        //$sqlConfirPass = "Select Password From extidi_usuarios where IdUsuario = '$idUsuario' ";
        $sqlIdUsuario = array("IdUsuario" => $idUsuario);
        $aux = '';
        if (is_numeric($idUsuario)) {
            $aux = "AND extidi_usuarios.IdUsuario != $idUsuario";
        }

        $sqlUsuario = "extidi_usuarios.Usuario = '$usuaUsuario' " . $aux;
        $sqlEmail = "extidi_usuarios.Email = '$emailUsuario' " . $aux;
        //AND extidi_usuarios.IdUsuario != $idUsuario";

        $this->usuario->buscar($sqlIdUsuario, true);
        $fechaReg = $this->usuario->FechaHoraDeRegistro;
        if (is_numeric($idUsuario)) {
            $usuario["FechaHoraDeRegistro"] = $fechaReg;
            $condicion = "IdUsuario != '$idUsuario' AND IdEstadoUsuario_EAP != -1 AND
								(Usuario = '$usuaUsuario' OR Email = '$emailUsuario')";

            $mensaje = "Usuario modificado Exitosamente.";
            $sw = 1;
        } else {
            //$condicion = array("IdEstadoUsuario_EAP !=" => -1, "Usuario" => $usuario['Usuario'], "Email"=>$usuario['Email']);
            $condicion = "IdEstadoUsuario_EAP != -1 AND (Usuario = '$usuaUsuario' OR Email = '$emailUsuario')";
            $mensaje = "Usuario guardado Exitosamente.";
            $sw = 2;
        }
        if (!$this->usuario->validar($condicion)) {
            $this->usuario->bind($usuario);
            $this->usuario->guardar();
            $resultado = true;
        } else {

            $resultado = false;
            $sqlUsuario = $this->usuario->buscar($sqlUsuario, true);
            $sqlEmail = $this->usuario->buscar($sqlEmail, true);

            if (($sqlUsuario != 0) && ($sqlEmail != 0)) {
                $mensaje = "El usuario y e-mail ya se encuentra registrado.";
            } else if ($sqlUsuario != 0) {
                $mensaje = "El usuario ya se encuentra registrado.";
            } else if ($sqlEmail != 0) {
                $mensaje = "El e-mail ya se encuentra registrado.";
            }

            //$mensaje = "El usuario ya existe.";
        }
        $this->respuesta($resultado, $mensaje, "mensaje");
    }

    public function cambiarEstado() {
        $this->load->model("extidi/usuario");
        $idUsuario = $this->input->post("idUsuario");
        $estadoUsuario = $this->input->post("estado");
        $this->usuario->cargar($idUsuario);

        if ($estadoUsuario == "Inactivo") {
            $this->usuario->activar();
        } else {
            $this->usuario->inactivar();
        }

        $this->respuesta(true, "Se ha cambiado el estado Exitosamente", "mensaje");
    }

    public function eliminarUsuario() {
        $idUsuario = $this->input->post("IdUsuarios");
        $idUsuario = json_decode($idUsuario);
        eliminarVarios("extidi/usuario", "usuario", $idUsuario);
        $this->respuesta(true, "Usuario(s) eliminado(s) exitosamente", "mensaje");
    }

    public function activarUsuarios() {
        $ids = $this->input->post("IdUsuarios");
        $ids = json_decode($ids);
        activarVarios('extidi/usuario', 'usuario', $ids);
        $this->respuesta(true, "Usuario(s) Modificado(s) Exitosamente.", "mensaje");
    }

    public function inactivarUsuarios() {
        $ids = $this->input->post("IdUsuarios");
        $ids = json_decode($ids);
        inactivarVarios('extidi/usuario', 'usuario', $ids);
        $this->respuesta(true, "Usuario(s) Modificado(s) Exitosamente.", "mensaje");
    }

    public function cargarGrupoUsuarios() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;

        $usuario = $this->session->userdata("usuario");
        $idGruposUsuario= $usuario["IdGruposUsuario"];   
      
        if($idGruposUsuario!=1){           
            $this->db->where("IdGrupoUsuario !=", 1);                
        }

        $this->load->model("extidi/grupousuario");
        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        $this->respuesta(true, $grupo, "data", false, $start, $limit);
    }

    public function SubirArchivo() {
        $user = $this->session->userdata('usuario');
        $fecha = date("d-m-Y_H-i-s");
        $config['file_name'] = $user['Usuario'] . "_" . $fecha;
        $config['upload_path'] = './upload/usuarios';
        $config['allowed_types'] = 'csv';
        $config['max_size'] = '5120';
        $config['max_width'] = '1024';
        $config['max_height'] = '768';

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('userfile')) {
            ///$error = array('error' => $this -> upload -> display_errors());
            $mjs = $this->upload->display_errors();
            $mjs = str_replace("<p>", "", $mjs);
            $mjs = str_replace("</p>", "", $mjs);
            $this->respuesta(false, $mjs, "mensaje");
        } else {
            $data = $this->upload->data();
            $data = $data['full_path'];

            $this->load->library('importarcsv');

            $columnas = $this->importarcsv->parse_file($data);
            $cabeceras = $this->importarcsv->fields;

            if (count($columnas) > 3000) {

                $this->respuesta(false, "El archivo que intenta subir supera el maximo de registros permitidos. Maximo: 3000.", "mensaje");
                unlink($data);
            } else {

                //validar si existen las cabeceras
                $cont = 0;
                for ($i = 0; $i < count($cabeceras); $i++) {

                    if ($cabeceras[$i] == 'PrimerNombre') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'SegundoNombre') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'PrimerApellido') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'SegundoApellido') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'Email') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'Usuario') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'Password') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'IdGruposUsuario') {
                        $cont++;
                    }
                }
                $colum = 0;
                if ($columnas) {
                    foreach ($columnas as $key => $value) {
                        $colum = count($value);
                    }
                }

                if ($colum != 0) {
                    if ($colum == $cont) {

                        if ($colum == 8) {
                            //validar si hay repetidos
                            $vec_us = array();
                            $vec_em = array();
                            $cant_reg = count($columnas);
                            $cont_rep_us = 0;
                            $cont_rep_em = 0;
                            $cont_rep = 0;
                            $msj = "";
                            for ($i = 0; $i < $cant_reg; $i++) {
                                $min_user = strtolower($columnas[$i]['Usuario']);
                                if (!in_array($min_user, $vec_us)) {
                                    $vec_us[$cont_rep_us] = $min_user;
                                    $cont_rep_us++;
                                }
                                $min_email = strtolower($columnas[$i]['Email']);
                                if (!in_array($min_email, $vec_em)) {
                                    $vec_em[$cont_rep_em] = $min_email;
                                    $cont_rep_em++;
                                }
                            }

                            $sw = 0;

                            for ($i = 0; $i < count($vec_us); $i++) {

                                $can_rep = $this->cantidadRepetidos($columnas, $vec_us[$i]);
                                if ($can_rep[0] > 1) {
                                    $msj = $msj . "El Usuario: $vec_us[$i] está repetido $can_rep[0] veces <br>";

                                    $sw = 1;
                                }
                            }
                            for ($i = 0; $i < count($vec_em); $i++) {

                                $can_rep = $this->cantidadRepetidos($columnas, $vec_em[$i]);
                                if ($can_rep[1] > 1) {
                                    $msj = $msj . "El email: $vec_em[$i] está repetido $can_rep[1] veces <br>";

                                    $sw = 1;
                                }
                            }
                            if ($sw == 1) {
                                $this->respuesta(false, $msj, "mensaje");
                                unlink($data);
                            } else {

                                $this->respuesta(true, $data, "data");
                            }
                        } else {

                            $this->respuesta(false, "El archivo .csv debe tener la cantidad de columnas especificadas, favor descargue la plantilla de ejemplo para verificar su formato", "mensaje");
                            unlink($data);
                        }
                    } else {

                        $this->respuesta(false, "Las cabeceras del archivo .csv deben ser iguales a las especificadas, favor descargue la plantilla de ejemplo para verificar su formato", "mensaje");
                        unlink($data);
                    }
                } else {
                    $this->respuesta(false, "El archivo que intenta subir no tiene datos para importar", "mensaje");
                    unlink($data);
                }
            }
        }
    }

    public function ListarImportarCsv() {

        $ruta = $this->input->post("ruta");
        $this->load->library('importarcsv');

        $data = $this->importarcsv->parse_file($ruta);
        $this->respuesta(true, $data, "data");
    }

    public function cantidadRepetidos($vec, $dato) {

        $aux = array();
        $cont_us = 0;
        $cont_em = 0;
        for ($j = 0; $j < count($vec); $j++) {

            if (strtolower(trim($dato)) == strtolower(trim($vec[$j]['Usuario']))) {

                $cont_us++;
            }
            if (strtolower(trim($dato)) == strtolower(trim($vec[$j]['Email']))) {

                $cont_em++;
            }
        }
        $aux[0] = $cont_us;
        $aux[1] = $cont_em;

        return $aux;
    }

    public function getGrupoUsuario($vec, $id) {
        $resp = false;
        $tam = count($vec);
        for ($i = 0; $i < $tam; $i++) {
            if ($id == $vec[$i]['IdGrupoUsuario']) {
                $resp = true;
            }
        }
        return $resp;
    }

    public function GuardarCsv() {
        $this->load->model("extidi/usuario");
        $this->load->model("extidi/grupousuario");
        $new_data = $this->input->post("usuario");
        $this->load->helper('email');
        $new_data = json_decode($new_data, true);
        $condicion = array("IdEstadoUsuario_EAP !=" => -1);
        $cond = array("IdEstadoGrupoUsuario_EAP" => 1);
        $old_data = $this->usuario->listadoUsuarios($condicion);
        $id_grupo_user = $this->grupousuario->listarGrupoPadre($cond);
        $errores = array();
        $cont_rep = 0;
        $cont = count($new_data);
        for ($i = 0; $i < $cont; $i++) {

            $new_data[$i]['PrimerNombre'] = trim($new_data[$i]['PrimerNombre']);
            $new_data[$i]['SegundoNombre'] = trim($new_data[$i]['SegundoNombre']);
            $new_data[$i]['PrimerApellido'] = trim($new_data[$i]['PrimerApellido']);
            $new_data[$i]['SegundoApellido'] = trim($new_data[$i]['SegundoApellido']);
            $new_data[$i]['Usuario'] = trim($new_data[$i]['Usuario']);
            $new_data[$i]['Email'] = trim($new_data[$i]['Email']);
            $new_data[$i]['IdGruposUsuario'] = trim($new_data[$i]['IdGruposUsuario']);
            $new_data[$i]['Password'] = trim($new_data[$i]['Password']);
            $new_data[$i]['FechaHoraDeRegistro'] = date("Y-m-d_H-i-s");

            $New_Usuario = $new_data[$i]['Usuario'];
            $New_Email = $new_data[$i]['Email'];
            $New_Pass = $new_data[$i]['Password'];
            $New_id = $new_data[$i]['IdGruposUsuario'];
            $New_Primer_Nombre = $new_data[$i]['PrimerNombre'];
            $New_Primer_Apellido = $new_data[$i]['PrimerApellido'];
            $New_Segundo_Apellido = $new_data[$i]['SegundoApellido'];
            $new_data[$i]['Password'] = md5($new_data[$i]['Password']);
            for ($j = 0; $j < count($old_data); $j++) {

                $Old_Usuario = $old_data[$j]['Usuario'];
                $Old_Email = $old_data[$j]['Email'];

                if (((strtolower($New_Usuario) == strtolower($Old_Usuario)) && ($Old_Usuario != null)) && ((strtolower($New_Email) == strtolower($Old_Email)) && ($Old_Email != null))) {
                    $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ',  Usuario: ' . $New_Usuario . ' y  Email: ' . $New_Email . ' ya se encuentran registrados.';
                    $cont_rep++;
                    unset($new_data[$i]);
                } else if ((strtolower($New_Usuario) == strtolower($Old_Usuario)) && ($Old_Usuario != null)) {
                    $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ',  Usuario: ' . $New_Usuario . ' ya se encuentra registrado.';
                    $cont_rep++;
                    unset($new_data[$i]);
                } else if ((strtolower($New_Email) == strtolower($Old_Email)) && ($Old_Email != null)) {
                    $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', Email: ' . $New_Email . ' ya se encuentra registrado.';
                    $cont_rep++;
                    unset($new_data[$i]);
                }
            }

            if (strlen($New_id) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', IdGruposUsuario esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            } else {
                $sw = $this->getGrupoUsuario($id_grupo_user, $New_id);
                if ($sw == false) {
                    $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', IdGruposUsuario: ' . $New_id . ' no existe.';
                    $cont_rep++;
                    unset($new_data[$i]);
                }
            }
            if (strlen($New_Primer_Apellido) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', PrimerApellido esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }
            if (strlen($New_Primer_Nombre) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', PrimerNombre esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }
            if (strlen($New_Segundo_Apellido) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', SegundoApellido esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }
            if (strlen($New_Pass) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', Password esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }

            if (strlen($New_Usuario) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', Usuario esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }
            if (strlen($New_Email) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', Email esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }

            if (preg_match("/ /i", $New_Usuario)) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', Usuario: ' . $New_Usuario . ' no debe tener espacios en blanco.';
                $cont_rep++;
                unset($new_data[$i]);
            }

            if (!valid_email($New_Email)) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', Email: ' . $New_Email . ' no tiene un formato correcto.';
                $cont_rep++;
                unset($new_data[$i]);
            }
            if (strlen($New_Pass) < 8) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', Password: ' . $New_Pass . ' debe tener minimo 8 caracteres.';
                $cont_rep++;
                unset($new_data[$i]);
            }
        }
        $reg_ok = count($new_data);
        $reg_er = count($errores);

        if ($reg_ok > 0) {
            $this->db->insert_batch("extidi_usuarios", $new_data);
        }

        if ($reg_er > 0) {
            $mensaje = "<FONT COLOR=green><b>$reg_ok Registro(s) ingresado(s) satisfactoriamente</b></FONT><br><FONT COLOR= #ff0000><b> $reg_er Error(es) encontrado(s): </b></FONT><br>";
            for ($i = 0; $i < $reg_er; $i++) {

                $mensaje = $mensaje . $errores[$i] . "<br>";
            }

            $this->respuesta(false, $mensaje, "mensaje");
        } else {

            $this->respuesta(true, "$reg_ok Registro(s) ingresado(s) satisfactoriamente", "mensaje");
        }
    }

    public function exportarPdf() {
        $this->load->model("extidi/usuario");
        $acciones = $this->usuario->listadoUsuarios(array("IdEstadoUsuario_EAP !=" => -1));
        $camposbd = array('PrimerNombre', 'SegundoNombre', 'PrimerApellido', 'SegundoApellido', 'Usuario',
            'Email', 'estado', 'FechaHoraDeRegistro', 'NombreGrupo');
        $cabeceras = array('Primer Nombre', 'Segundo Nombre', 'Primer Apellido', 'Segundo Apellido', 'Usuario',
            'e-mail', 'Estado', 'Fecha de Registro', 'Nombre Grupo');
        exportarPdf($acciones, $cabeceras, $camposbd);
    }

    public function imprimir() {
        $this->load->model("extidi/usuario");
        $acciones = $this->usuario->listadoUsuarios(array("IdEstadoUsuario_EAP !=" => -1));
        $camposbd = array('PrimerNombre', 'SegundoNombre', 'PrimerApellido', 'SegundoApellido', 'Usuario',
            'Email', 'estado', 'FechaHoraDeRegistro', 'NombreGrupo');
        $cabeceras = array('Primer Nombre', 'Segundo Nombre', 'Primer Apellido', 'Segundo Apellido', 'Usuario',
            'e-mail', 'Estado', 'Fecha de Registro', 'Nombre Grupo');
        $this->respuesta(true, imprimir($acciones, $cabeceras, $camposbd), 'mensaje');
    }

    public function exportarCsv() {
        //ESTE FALLA CON EL UTF 8
        $query = $this->db->query("SELECT extidi_usuarios.PrimerNombre, extidi_usuarios.SegundoNombre, 
										extidi_usuarios.PrimerApellido, extidi_usuarios.SegundoApellido, 
										extidi_usuarios.Usuario, extidi_usuarios.Email,
										VerEstado(extidi_usuarios.IdEstadoUsuario_EAP)Estado,
										extidi_usuarios.FechaHoraDeRegistro, extidi_gruposusuarios.NombreGrupo
										
										FROM extidi_usuarios
										
										INNER JOIN extidi_gruposusuarios
										ON extidi_gruposusuarios.IdGrupoUsuario = extidi_usuarios.IdGruposUsuario
										
										WHERE extidi_usuarios.IdEstadoUsuario_EAP != -1");
        exportarCsv($query);
    }

    public function exportarExcel() {

        $this->load->model("extidi/usuario");
        $acciones = $this->usuario->listadoUsuarios(array("IdEstadoUsuario_EAP !=" => -1));

        $camposbd = array('PrimerNombre', 'SegundoNombre', 'PrimerApellido', 'SegundoApellido', 'Usuario',
            'Email', 'estado', 'FechaHoraDeRegistro', 'NombreGrupo');
        $cabeceras = array('Primer Nombre', 'Segundo Nombre', 'Primer Apellido', 'Segundo Apellido', 'Usuario',
            'e-mail', 'Estado', 'Fecha de Registro', 'Nombre Grupo');
        exportarExcel($acciones, $cabeceras, $camposbd);
    }

}
