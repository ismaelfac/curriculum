<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CrudGrupoUsuario extends EXTIDI_Controller {

    public function index() {
        
    }

    public function listarGrupoUsuario() {

        $id = $this->input->post('node');
        if ($id == 'root' || $id == "") {
            $id = 0;
        }
        $this->load->model("extidi/grupousuario");
        $nodes = array();

        $data = "IdEstadoGrupoUsuario_EAP != -1 and IdGrupoPadre = $id";

        $grupo = $this->grupousuario->listarGrupoUsuario($data);  
        $datosdb = $this->grupousuario->listar();     
        for ($i = 0; $i < count($grupo); $i++) {

            $sw = $this->tieneHijos($datosdb, $grupo[$i]['IdGrupoUsuario']);

            $nodes[$i] = array(
                'NombreGrupo' => $grupo[$i]['NombreGrupo'],  
                'id' => $grupo[$i]['IdGrupoUsuario'],
                'IdGrupoPadre' => $grupo[$i]['IdGrupoPadre'],                 
                'IdEstadoGrupoUsuario_EAP' => $grupo[$i]['IdEstadoGrupoUsuario_EAP'],
                'IdGrupoUsuario' => $grupo[$i]['IdGrupoUsuario'],              
                'IdGrupoP' => $grupo[$i]['IdGrupoP'],               
                'Ancestros' => $grupo[$i]['Ancestros'],
                'leaf'=>$sw
            );

            //  'icon' => 'archivos/imagenes/icons/16/libro.png');
        }
        $this->respuesta(true, $nodes, "data");
    }

    public function tieneHijos($vec, $id) {
        $resp = true;
        $tam = count($vec);
        for ($i = 0; $i < $tam; $i++) {
            if ($id == $vec[$i]['IdGrupoPadre']) {
                $resp = false;
                $i = $tam + 1;
            }
        }
        return $resp;
    }

    public function cargarGrupoPadre() {

        $this->load->model("extidi/grupousuario");
        $id = $this->input->post("IdGrupo");

        $grupo = array();
        if ($id) {
            $grupo = $this->grupousuario->listarGrupoMaximo($id);
        } else {

            $grupo = $this->grupousuario->listar();
        }
        if ($grupo) {
            array_push($grupo, array('NombreGrupo' => 'Ninguno', 'IdGrupoUsuario' => 0));
        } else {
            $grupo[0] = array('NombreGrupo' => 'Ninguno', 'IdGrupoUsuario' => 0);
        }

        //print_r($grupo);
        $this->respuesta(true, $grupo, "data");
    }

    public function cargarGrupoPadreBusqueda() {

        $this->load->model("extidi/grupousuario");
        $id = $this->input->post("IdGrupo");

        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1, "IdGrupoUsuario !=" => $id);

        $grupo = $this->grupousuario->listarGrupoPadre($data);
        array_push($grupo, array('NombreGrupo' => 'Ninguno', 'IdGrupoUsuario' => 0));
        array_push($grupo, array('NombreGrupo' => '-'));
        $this->respuesta(true, $grupo, "data");
    }

    public function listarDetalleGrupoUsuarios() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;

        $idgrupo = $this->input->post("IdGrupo");
        $this->load->model("extidi/usuario");
        $data = array("estado !=" => -1, "IdGruposUsuario" => $idgrupo);
        $grupo = $this->usuario->listarUsuarioDetalle($data);
        for ($i = $start; $i < count($grupo); $i++) {
            if ($i == $start + $limit) {
                break;
            }
            $grupo[$i]["Password"] = "";
            $grupo[$i]["PasswordC"] = "";
        }
        $this->respuesta(true, $grupo, "data", true, $start, $limit);
    }

    public function guardarGrupo() {
        $this->load->model("extidi/grupousuario");

        $grupo = $this->input->post("grupousuario");
        $grupo = json_decode($grupo, true);
        $idgrupousuario = $grupo['IdGrupoUsuario'];
        $idgrupopadre = $grupo['IdGrupoPadre'];
        $grupo['NombreGrupo'] = trim($grupo['NombreGrupo']);

        if ($grupo['IdEstadoGrupoUsuario_EAP'] == 'Activo') {

            $grupo['IdEstadoGrupoUsuario_EAP'] = 1;
        } else if ($grupo['IdEstadoGrupoUsuario_EAP'] == 'Inactivo') {
            $grupo['IdEstadoGrupoUsuario_EAP'] = 0;
        }

        if (is_numeric($idgrupousuario)) {
            $condicion = array("IdGrupoUsuario !=" => $idgrupousuario, "IdEstadoGrupoUsuario_EAP !=" => -1, "NombreGrupo" => $grupo['NombreGrupo']);
            $mensaje = "Grupo Modificado Exitosamente.";
            $sw = 1;
        } else {
            $condicion = array("IdEstadoGrupoUsuario_EAP !=" => -1, "NombreGrupo" => $grupo['NombreGrupo']);
            $mensaje = "Grupo Ingresado Exitosamente.";
            $sw = 2;
        }

        if (!$this->grupousuario->validar($condicion)) {
            $this->grupousuario->bind($grupo);
            $this->grupousuario->guardar();

            $cond = array("IdEstadoGrupoUsuario_EAP !=" => -1);
            $idgrupocreado = $this->grupousuario->traerIdUltimoGrupoIngresado($cond);

            if ($sw == 2) {

                if ($idgrupopadre == 0) {

                    $grupo['Ancestros'] = $idgrupocreado['IdGrupoUsuario'] . ",";
                    $grupo['IdGrupoUsuario'] = $idgrupocreado['IdGrupoUsuario'];
                    $this->grupousuario->bind($grupo);
                    $this->grupousuario->guardar();
                } else {
                    $condpadrem = array("IdEstadoGrupoUsuario_EAP !=" => -1, "IdGrupoUsuario" => $idgrupopadre);
                    $padremaximo = $this->grupousuario->traerAncestros($condpadrem);
                    $grupo['Ancestros'] = $padremaximo['Ancestros'] . $idgrupocreado['IdGrupoUsuario'] . ",";
                    $grupo['IdGrupoUsuario'] = $idgrupocreado['IdGrupoUsuario'];
                    $this->grupousuario->bind($grupo);
                    $this->grupousuario->guardar();
                }
            } else if ($sw == 1) {
                $pmold = $grupo['Ancestros'];
                if ($idgrupopadre == 0) {

                    $pmbase = $grupo['IdGrupoUsuario'] . ",";

                    $condidhijos = array("IdEstadoGrupoUsuario_EAP !=" => -1, "IdGrupoUsuario !=" => $idgrupousuario);
                    $idhijos = $this->grupousuario->traerIdHijos($pmold, $condidhijos);

                    $grupo['Ancestros'] = $pmbase;
                    $this->grupousuario->bind($grupo);
                    $this->grupousuario->guardar();

                    if (count($idhijos) > 0) {

                        for ($i = 0; $i < count($idhijos); $i++) {
                            $aux_new_pm = $idhijos[$i]['Ancestros'];
                            $idaux = $idhijos[$i]['IdGrupoUsuario'];
                            $pmnew = str_replace($pmold, $pmbase, $aux_new_pm);
                            $datos = array("Ancestros" => $pmnew);
                            $this->db->update('extidi_gruposusuarios', $datos, "IdGrupoUsuario = $idaux");
                        }
                    }
                } else {
                    $condpadrem = array("IdEstadoGrupoUsuario_EAP !=" => -1, "IdGrupoUsuario" => $idgrupopadre);
                    $pm_para_donde_voy = $this->grupousuario->traerAncestros($condpadrem);
                    $condidhijos = array("IdEstadoGrupoUsuario_EAP  !=" => -1, "IdGrupoUsuario !=" => $idgrupousuario);
                    $idhijos = $this->grupousuario->traerIdHijos($pmold, $condidhijos);
                    $pmbase = $pm_para_donde_voy['Ancestros'] . $idgrupousuario . ",";
                    $grupo['Ancestros'] = $pmbase;
                    $this->grupousuario->bind($grupo);
                    $this->grupousuario->guardar();
                    $cant = count($idhijos);

                    if ($cant > 0) {

                        for ($i = 0; $i < count($idhijos); $i++) {
                            $aux_new_pm = $idhijos[$i]['Ancestros'];
                            $idaux = $idhijos[$i]['IdGrupoUsuario'];
                            $pmnew = str_replace($pmold, $pmbase, $aux_new_pm);
                            $datos = array("Ancestros" => $pmnew);
                            $this->db->update('extidi_gruposusuarios', $datos, "IdGrupoUsuario = $idaux");
                        }
                    }
                }
            }

            $resultado = true;
        } else {
            $resultado = false;
            if ($sw === 1)
                $mensaje = "El Nombre Grupo ya se encuentra registrado.";
            else
                $mensaje = "No puede Ingresar este Nombre de Grupo debido a que  ya se encuentra registrado.";
        }

        $this->respuesta($resultado, $mensaje, "mensaje");
    }

    public function activarEstadoGrupo() {

        $idgrupo = $this->input->post("IdGrupoUsuario");
        $idgrupo = json_decode($idgrupo);
        activarVarios('extidi/grupousuario', 'grupousuario', $idgrupo);
        $this->respuesta(true, "Activacion Exitosa.", "mensaje");
    }

    public function inactivarEstadoGrupo() {

        $idgrupo = $this->input->post("IdGrupoUsuario");
        $idgrupo = json_decode($idgrupo);
        inactivarVarios('extidi/grupousuario', 'grupousuario', $idgrupo);
        $this->respuesta(true, "Inactivacion Exitosa.", "mensaje");
    }

    public function eliminarGrupo() {

        $idgrupo = $this->input->post("IdGrupoUsuario");
        $nombregrupo = $this->input->post("NombreGrupo");
        $idgrupo = json_decode($idgrupo);
        $nombregrupo = json_decode($nombregrupo);
        $vec_resp = array();
        $cont = 0;
        $mensaje = "<b>Detalle de Grupos de Usuarios que no fueron eliminados: </b><br>";
        $cant_ids = count($idgrupo);
        for ($i = 0; $i < $cant_ids; $i++) {

            $datap = array("IdEstadoGrupoUsuario_EAP !=" => -1, "extidi_gruposusuarios.IdGrupoUsuario" => $idgrupo[$i]);
            $datau = array("IdEstadoGrupoUsuario_EAP !=" => -1, "extidi_gruposusuarios.IdGrupoUsuario" => $idgrupo[$i], "extidi_usuarios.IdEstadoUsuario_EAP !=" => -1);
            $cond = array("IdGrupopadre" => $idgrupo[$i], "IdEstadoGrupoUsuario_EAP !=" => -1);

            //Validar si tiene hijos
            $this->db->select('extidi_gruposusuarios.*');
            $this->db->where($cond);
            $rsh = $this->db->get('extidi_gruposusuarios');

            //Validar si tiene permisos asignados
            $this->db->select('extidi_gruposusuarios.*, extidi_permisos.IdGrupoUsuario');
            $this->db->from('extidi_gruposusuarios');
            $this->db->join('extidi_permisos', 'extidi_gruposusuarios.IdGrupoUsuario = extidi_permisos.IdGrupoUsuario');
            $this->db->where($datap);
            $rsp = $this->db->get();

            //Validar si tiene Usuarios asignados
            $this->db->select('extidi_gruposusuarios.*, extidi_usuarios.IdGruposUsuario');
            $this->db->from('extidi_gruposusuarios');
            $this->db->join('extidi_usuarios', 'extidi_gruposusuarios.IdGrupoUsuario = extidi_usuarios.IdGruposUsuario');
            $this->db->where($datau);
            $rsu = $this->db->get();


            $cantpermisos = $rsp->num_rows;
            $cantusuarios = $rsu->num_rows;
            $canthijos = $rsh->num_rows;

            $sw = true;
            if ($canthijos > 0) {
                $mensaje = $mensaje . "El Grupo Usuario: " . $nombregrupo[$i] . " tiene $canthijos  hijo(s) asignado(s). <br>";

                $sw = false;
            }
            if ($cantpermisos > 0) {
                $mensaje = $mensaje . "El Grupo Usuario: " . $nombregrupo[$i] . " tiene $cantpermisos permiso(s) asignado(s). <br>";

                $sw = false;
            }

            if ($cantusuarios > 0) {
                $mensaje = $mensaje . "El Grupo Usuario: " . $nombregrupo[$i] . " tiene $cantusuarios usuario(s) asignado(s). <br>";

                $sw = false;
            }

            if ($sw) {
                $vec_resp[$cont] = $idgrupo[$i];
                $cont++;
            }
        }

        $cant_ae = count($vec_resp);
        if ($cant_ae == $cant_ids) {

            $mensaje = "$cant_ae Grupo Usuario(s) eliminado(s).";
            eliminarVarios('extidi/grupousuario', 'grupousuario', $vec_resp);
            $this->respuesta(true, $mensaje, "mensaje");
        } else {
            $mensaje = "<b>" . $cant_ae . " Grupo(s) Usuarios eliminados. </b><br><br>" . $mensaje;
            eliminarVarios('extidi/grupousuario', 'grupousuario', $vec_resp);
            $this->respuesta(false, $mensaje, "mensaje");
        }
    }

    public function exportarPdf() {
        $this->load->model("extidi/grupousuario");
        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        $camposbd = array('NombreGrupo', 'IdEstadoGrupoUsuario_EAP', 'IdGrupoP', 'IdGrupoUsuario');
        $cabeceras = array('Nombre Grupo', 'Estado', 'Grupo Padre', 'Id Grupo');
        exportarPdf($grupo, $cabeceras, $camposbd);
    }

    public function imprimir() {
        $this->load->model("extidi/grupousuario");
        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        $camposbd = array('NombreGrupo', 'IdEstadoGrupoUsuario_EAP', 'IdGrupoP', 'IdGrupoUsuario');
        $cabeceras = array('Nombre Grupo', 'Estado', 'Grupo Padre', 'Id Grupo');
        
        $this->respuesta(true, imprimir($grupo, $cabeceras, $camposbd), 'mensaje');
    }

    public function exportarCsv() {

        $query = $this->db->query("SELECT NombreGrupo, IdEstadoGrupoUsuario_EAP, IdGrupoPadre FROM extidi_gruposusuarios WHERE IdEstadoGrupoUsuario_EAP != -1 ");
        exportarCsv($query);
    }

    public function exportarExcel() {

        $this->load->model("extidi/grupousuario");
        $data = array("IdEstadoGrupoUsuario_EAP !=" => -1);
        $grupo = $this->grupousuario->listarGrupoUsuario($data);
        $camposbd = array('NombreGrupo', 'IdEstadoGrupoUsuario_EAP', 'IdGrupoP', 'IdGrupoUsuario');
        $cabeceras = array('Nombre Grupo', 'Estado', 'Grupo Padre', 'Id Grupo');
        exportarExcel($grupo, $cabeceras, $camposbd);
    }

}

