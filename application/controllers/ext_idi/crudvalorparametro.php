<?php

date_default_timezone_set('America/Bogota');
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CrudValorParametro extends EXTIDI_Controller {

    public function index() {
        
    }
    
    public function cargarValoresParametro(){
        $this->load->model("extidi/valorparametro");
        $condicion=array(
            "NombreCampo"=>$this->input->post("NombreCampo")
        );
        $retorno=$this->valorparametro->listar($condicion);
        $this->respuesta(true, $retorno, "data");
    }

    public function listado() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;
        $this->load->model("extidi/valorparametro");
        $data = "";
        /* Codigo para el buscar */
        $busqueda = $this->input->post("search");
        $busqueda = json_decode($busqueda, true);
        $valorParametro = trim($busqueda['ValorParametro']);
        $ValorCuantitativo = trim($busqueda['ValorCuantitativo']);
        $nombreParametro = trim($busqueda['NombreParametro']);
        $estadoValorParametro = trim($busqueda['estado_Valor']);
        if($valorParametro!=""){
        $sqlValor = ($data!=""?" AND ":"")."ValorParametro LIKE '%$valorParametro%' ";
        $data = $data . $sqlValor;
        }
        if($ValorCuantitativo!=""){
        $sqlValor = ($data!=""?" AND ":"")."ValorCuantitativo LIKE '%$ValorCuantitativo%' ";
        $data = $data . $sqlValor;
        }
        if($nombreParametro!=""){
        $sqlNombreParametro = ($data!=""?" AND ":"")."prin.id ='$nombreParametro' ";
        $data = $data . $sqlNombreParametro;
        }
        if($estadoValorParametro!=""){
        $sqlEstado = ($data!=""?" AND ":"")."estado = '$estadoValorParametro' ";
        $data = $data . $sqlEstado;
        }
        /* Fin codigo para para la busqueda */
        $valorParametro = $this->valorparametro->listar($data);
        $this->respuesta(true, $valorParametro, "data", true, $start, $limit);
    }

    public function listaParametroBuscar() {
        $this->load->model('extidi/parametro');
        //$condicion = array("IdParametro >=" => 0);
        $resp = $this->parametro->listar('', '', true);
        array_push($resp, array("NombreParametro" => '-'));
        $this->respuesta(true, $resp, "data");
    }

    public function cargarParametros() {
        $this->load->model('extidi/parametro');
        //$condicion = array("IdParametro >=" => 0);
        $resp = $this->parametro->listar('', '', true);
        $this->respuesta(true, $resp, "data");
    }

    public function guardarValorParametro() {
        $this->load->model("extidi/valorparametro");
        $valorParametro = $this->input->post("valorParametro");
        $idparametro = $this->input->post("idparametro");
        $valorParametro = json_decode($valorParametro, true);
        $idValorParametro = $valorParametro['IdValorParametro'];
        $valorParametro['ValorParametro'] = trim($valorParametro['ValorParametro']);

        if ($idparametro) {
            $valorParametro['IdParametro'] = $idparametro;
        }

        if (is_numeric($idValorParametro)) {
            $condicion = array(
                "id !=" => $idValorParametro, 
                "estado !=" => -1, 
                "ValorParametro" => $valorParametro['ValorParametro'],
                "IdParametro"=>$idparametro
                );
            $mensaje = "Valor Parametro Modificada Exitosamente.";
            $sw = 1;
        } else {
            $condicion = array(
                "estado !=" => -1, 
                "ValorParametro" => $valorParametro['ValorParametro'],
                "IdParametro"=>$idparametro
            );
            $mensaje = 'Valor Parametro guardado Exitosamente.';
            $sw = 2;
        }
        if (!$this->valorparametro->validar($condicion)) {
            $this->valorparametro->bind($valorParametro);
            $this->valorparametro->guardar();
            $resultado = true;
        } else {
            $resultado = false;
            if ($sw === 1)
                $mensaje = "El nombre del valor parametro ya existe.";
            else
                $mensaje = "El nombre del valor parametro ya existe.";
        }
        $this->respuesta($resultado, $mensaje, "mensaje");
    }

    public function cambiarEstadoValorParametro() {
        $this->load->model("extidi/valorparametro");
        $idValorParametro = $this->input->post("idValorParametro");
        $estadoValorParametro = $this->input->post("estado");
        $this->valorparametro->cargar($idValorParametro);
        $estadoValorParametro == 1 ? $this->valorparametro->inactivar() : $this->valorparametro->activar();

        $this->respuesta(true, "Se ha cambiado el estado Exitosamente", "mensaje");
    }

    public function activarValorParametro() {
        $ids = $this->input->post("IdValParametro");
        $ids = json_decode($ids);
        activarVarios('extidi/valorparametro', 'valorparametro', $ids);

        $this->respuesta(true, "Valor(es) Parametro(s) Modificados Exitosamente.", "mensaje");
    }

    public function inactivarValorParametro() {
        $ids = $this->input->post("IdValParametro");
        $ids = json_decode($ids);
        inactivarVarios('extidi/valorparametro', 'valorparametro', $ids);

        $this->respuesta(true, "Valor(es) Parametro(s) Modificados Exitosamente.", "mensaje");
    }

    public function cantidadRepetidos($vec, $dato) {
        $tamVec = count($vec);
        $cont = 0;
        for ($i = 0; $i < $tamVec; $i++) {
            if (strtolower(trim($vec[$i]['ValorParametro'])) == strtolower(trim($dato))) {
                $cont++;
            }
        }
        return $cont;
    }

    public function subirArchivo() {

        $user = $this->session->userdata('usuario');
        $fecha = date("d-m-Y_H-i-s");
        $config['file_name'] = $user['Usuario'] . "_" . $fecha;
        $config['upload_path'] = './upload/valoresparametros';
        $config['allowed_types'] = 'csv';
        $config['max_size'] = '5120';
        $config['max_width'] = '1024';
        $config['max_height'] = '768';
        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('userfile')) {
            $error = array('error' => $this->upload->display_errors());
            $mjs = $this->upload->display_errors();
            $mjs = str_replace("<p>", "", $mjs);
            $mjs = str_replace("</p>", "", $mjs);
            $this->respuesta(false, $mjs, "mensaje");
        } else {
            $data = $this->upload->data();
            $data = $data['full_path'];

            $this->load->library("importarcsv");

            $arr = $this->importarcsv->parse_file($data);
            if (count($arr) <= 3000) {
                //obtener las cabeceras del csv usando la libreria
                $cabeceras = $this->importarcsv->fields;
                $contCabeceras = 0;

                for ($i = 0; $i < count($cabeceras); $i++) {
                    if ($cabeceras[$i] == 'ValorParametro') {
                        $contCabeceras++;
                    }
                    if ($cabeceras[$i] == 'IdParametro') {
                        $contCabeceras++;
                    }
                }

                //for para contar las columnas de una matriz o vector asociativo o tabla en su defecto
                $colum = 0;
                if ($arr) {
                    foreach ($arr as $key => $value) {
                        $colum = count($value);
                    }
                }

                if ($colum != 0) {
                    if ($colum == $contCabeceras) {

                        if ($colum == 2) {
                            $vecNomValParametro = array();
                            $tamReg = count($arr);
                            $contRep = 0;
                            for ($i = 0; $i < $tamReg; $i++) {
                                $minuscula = strtolower($arr[$i]['ValorParametro']);
                                if (!in_array($minuscula, $vecNomValParametro)) {
                                    $vecNomValParametro[$contRep] = $minuscula;
                                    //$arr[$i]['ValorParametro'];
                                    $contRep++;
                                }
                            }
                            $sw = 0;
                            $mensaje = "";
                            for ($i = 0; $i < count($vecNomValParametro); $i++) {
                                $cantRep = $this->cantidadRepetidos($arr, $vecNomValParametro[$i]);
                                if ($cantRep > 1) {
                                    $mensaje = "El Valor Parametro: $vecNomValParametro[$i], esta repetido $cantRep veces.";
                                    $sw = 1;
                                }
                            }
                            if ($sw == 1) {
                                $this->respuesta(false, $mensaje, "mensaje");
                                unlink($data);
                            } else {
                                $this->respuesta(true, $data, "data");
                            }
                        } else {
                            $this->respuesta(false, "El archivo .csv debe tener la cantidad de columnas especificadas,
												favor descargue la plantilla de ejemplo para verificar su formato", "mensaje");
                            unlink($data);
                        }
                    } else {
                        $this->respuesta(false, "Las cabeceras del archivo csv deben ser iguales a las especificadas,
												favor descargue la plantilla de ejemplo para verificar su formato", "mensaje");
                        unlink($data);
                    }
                } else {
                    $this->respuesta(false, "El archivo que intenta subir no tienes datos para importar.", "mensaje");
                    unlink($data);
                }
            } else {
                $this->respuesta(false, "El archivo que intenta subir supera el maximo de registros permitidos.
										Maximo: 3.000", "mensaje");
                unlink($data);
            }
        }
    }

    public function listarImporteCsv() {
        $ruta = $this->input->post("ruta");
        $this->load->library('importarcsv');
        $data = $this->importarcsv->parse_file($ruta);

        $this->respuesta(true, $data, "data");
    }

    public function getParametro($vec, $id) {
        $resp = false;
        $tam = count($vec);
        for ($i = 0; $i < $tam; $i++) {
            if ($id == $vec[$i]['IdParametro']) {
                $resp = true;
            }
        }
        return $resp;
    }

    public function guardarImporteCsv() {
        $this->load->model("extidi/valorparametro");
        $this->load->model("extidi/parametro");
        $data = $this->input->post("valorParametro");
        $data = json_decode($data, true);
        $parametros = $this->parametro->listar("EstadoParametro_EAP = 1");
        $datosTabla = $this->valorparametro->listar();
        $vecRep = array();
        $contNom = 0;
        $tamData = count($data);
        $sw = 0;
        $k = 0;

        for ($i = 0; $i < $tamData; $i++) {
            $data[$i]['IdParametro'] = trim($data[$i]['IdParametro']);
            $data[$i]['ValorParametro'] = trim($data[$i]['ValorParametro']);
            $nombreCsv = $data[$i]['ValorParametro'];
            $idParametroCsv = $data[$i]['IdParametro'];
            $sw = $this->getParametro($parametros, $idParametroCsv);

            for ($j = 0; $j < count($datosTabla); $j++) {
                $idParametroDb = $datosTabla[$j]['IdParametro'];
                $nombreDb = $datosTabla[$j]['ValorParametro'];

                if (strtolower($nombreCsv) == strtolower($nombreDb) && ($nombreDb != null)) {
                    $vecRep[$contNom] = "En la fila " . ($i + 1) . ", ValorParametro: $nombreCsv ya se encuentra registrada.";
                    $contNom++;
                    unset($data[$i]);
                }
            }

            if (strlen($idParametroCsv) == 0) {
                $vecRep[$contNom] = "En la fila " . ($i + 1) . ", el campo idParametro esta en blanco.";
                $contNom++;
                unset($data[$i]);
            } else if ($sw == false) {
                $vecRep[$contNom] = "En la fila " . ($i + 1) . ", IdParametro: $idParametroCsv no existe.";
                unset($data[$i]);
                $contNom++;
            }

            if (strlen($nombreCsv) <= 0) {
                $vecRep[$contNom] = "En la fila " . ($i + 1) . ", el campo NombreAccion esta en blanco.";
                $contNom++;
                unset($data[$i]);
            }
        }
        $reg_ok = count($data);
        $reg_er = count($vecRep);
        $mensaje = "<font color ='green'><b>$reg_ok Registro(s) ingresado(s) satisfactoriamente </b></font><br><font color = 'red'><b> $reg_er Error(es) encontrado(s): </b></font><br>";
        if ($reg_er > 0) {
            for ($i = 0; $i < $reg_er; $i++) {

                $mensaje = $mensaje . $vecRep[$i] . "<br>";
            }

            if ($reg_ok > 0) {
                $this->db->insert_batch("extidi_valorparametro", $data);
            }
            $this->respuesta(false, $mensaje, "mensaje");
        } else {
            $this->db->insert_batch("extidi_valorparametro", $data);
            $this->respuesta(true, "$reg_ok Registro(s) ingresado(s) Exitosamente.", "mensaje");
        }
    }

    public function exportarPdf() {
        $this->load->model("extidi/valorparametro");
        $parametro = $this->valorparametro->listar();
        $camposbd = array('ValorParametro', 'estado_Valor', 'extidi_parametro_id_NombreParametro');
        $cabeceras = array('Valor Parametro', 'Estado', 'Nombre Parametro');
        exportarPdf($parametro, $cabeceras, $camposbd);
    }

    public function imprimir() {
        $this->load->model("extidi/valorparametro");
        $valParametro = $this->valorparametro->listar();
        $camposbd = array('ValorParametro', 'estado_Valor', 'extidi_parametro_id_NombreParametro');
        $cabeceras = array('Valor Parametro', 'Estado', 'Nombre Parametro');
        $this->respuesta(true, imprimir($valParametro, $cabeceras, $camposbd), 'mensaje');
        
    }

    public function exportarCsv() {
        //ESTE FALLA CON EL UTF 8
        $query = $this->db->query("SELECT val.ValorParametro, if(val.estado=1,'Activo','Inactivo') Estado, 
									param.NombreParametro
									FROM extidi_valorparametro val
									INNER JOIN extidi_parametro param
									ON param.id = val.IdParametro
									WHERE val.estado != -1");
        exportarCsv($query);
    }

    public function exportarExcel() {

        $this->load->model("extidi/valorparametro");
        $parametro = $this->valorparametro->listar();
        $camposbd = array('ValorParametro', 'estado_Valor', 'extidi_parametro_id_NombreParametro');
        $cabeceras = array('Valor Parametro', 'Estado', 'Nombre Parametro');
        exportarExcel($parametro, $cabeceras, $camposbd);
    }

}
