<?php

date_default_timezone_set('America/Bogota');
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CrudParametro extends EXTIDI_Controller {

    public function index() {
        
    }

    public function listarParametro() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;
        $data = "";
        if (isset($_POST['search'])) {

            $datosfiltrados = json_decode($_POST['search'], true);
            $NombreParametro = trim($datosfiltrados['NombreParametro']);
            $NombreCampo = trim($datosfiltrados['NombreCampo']);
            $Estadoparametro = $datosfiltrados['EstadoParametro_EAP_Valor'];
            $IdParametro = $datosfiltrados['IdParametro'];
            $cond1 = "NombreParametro like '$NombreParametro%' ";
            $cond2 = "and NombreCampo like '$NombreCampo%' ";
            $cond3 = "and estado like '$Estadoparametro%' ";
            $cond4 = "and id	like '$IdParametro%' ";
            $data = $data . $cond1;
            $data = $data . $cond2;
            $data = $data . $cond3;
            $data = $data . $cond4;
        }
        $orderby = "id DESC";
        $this->load->model("extidi/parametro");
        $parametro = $this->parametro->listar($data, $orderby);
        $this->respuesta(true, $parametro, "data", true, $start, $limit);
    }

    public function listarDetallleParametro() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;

        $idparametro = $this->input->post("IdParametro");
        $this->load->model("extidi/valorparametro");
        $parametro=array();
        if ($idparametro) {
            $data = "prin.id =" . $idparametro;
            $orderby = "id DESC";
            $parametro = $this->valorparametro->listar($data, $orderby);
        }
        $this->respuesta(true, $parametro, "data", true, $start, $limit);
    }

    public function guardarParametro() {
        $this->load->model("extidi/parametro");
        $parametro = $this->input->post("parametro");
        $parametro = json_decode($parametro, true);
        $idParametro = $parametro["IdParametro"];
        $NombreCampo = $parametro['NombreCampo'];
        $parametro['NombreParametro'] = trim($parametro['NombreParametro']);
        $NombreParametro = $parametro['NombreParametro'];

        if (is_numeric($idParametro)) {
            $condicion = "id != '$idParametro' AND estado != -1 AND 
			(NombreCampo='$NombreCampo' OR NombreParametro='$NombreParametro')";

            $mensaje = "Parametro Modificado Exitosamente.";
            $sw = 1;
        } else {
            $condicion = "estado != -1 AND 
			(NombreCampo='$NombreCampo' OR NombreParametro='$NombreParametro')";
            $mensaje = "Parametro Ingresado Exitosamente.";
            $sw = 2;
        }

        if (!$this->parametro->validar($condicion)) {
            $this->parametro->bind($parametro);
            $this->parametro->guardar();
            $resultado = true;
            //$this -> respuesta($resultado, $mensaje, "mensaje");
        } else {
            $resultado = false;
            if ($sw === 1) {
                $mensaje = "El Nombre Parametro y/o Nombre Campo digitado ya se encuentra registrado.";
            } else {
                $mensaje = "No puede ingresar el Nombre Parametro y/o Nombre Campo debido a que ya se encuentra registrado.";
            }
        }

        $this->respuesta($resultado, $mensaje, "mensaje");
    }
    public function eliminarValorParametro() {
        $this->load->model("extidi/valorparametro");
        $IdValorParametro = $this->input->post("id");
        $this->valorparametro->cargar($IdValorParametro);
        if($this->valorparametro->id===$IdValorParametro){
            $this->valorparametro->eliminar();
            $this->respuesta(true, "Eliminado correctamente", "mensaje");
        }else{
            $this->respuesta(false, "Error al momento de eliminar", "mensaje");
        }
    }

    public function activarEstadoParametro() {

        $idparametro = $this->input->post("IdParametro");
        $idparametro = json_decode($idparametro);
        activarVarios('extidi/parametro', 'parametro', $idparametro);
        $this->respuesta(true, "Activacion Exitosa", "mensaje");
    }

    public function inactivarEstadoParametro() {

        $idparametro = $this->input->post("IdParametro");
        $idparametro = json_decode($idparametro);
        inactivarVarios('extidi/parametro', 'parametro', $idparametro);
        $this->respuesta(true, "Inactivacion Exitosa.", "mensaje");
    }

    public function ListarImportarCsv() {

        $ruta = $this->input->post("ruta");
        $this->load->library('importarcsv');
        $data = $this->importarcsv->parse_file($ruta);
        $this->respuesta(true, $data, "data");
    }

    public function SubirArchivo() {
        $user = $this->session->userdata('usuario');
        $fecha = date("d-m-Y_H-i-s");
        $config['file_name'] = $user['Usuario'] . "_" . $fecha;
        $config['upload_path'] = './upload/parametros';
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

            if (count($columnas) <= 3000) {
                //validar si existen las cabeceras
                $cont = 0;
                for ($i = 0; $i < count($cabeceras); $i++) {

                    if ($cabeceras[$i] == 'NombreParametro') {
                        $cont++;
                    }
                    if ($cabeceras[$i] == 'NombreCampo') {
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

                        if ($colum == 2) {
                            //validar si hay repetidos
                            $vec_np = array();
                            $vec_nc = array();
                            $cant_reg = count($columnas);
                            $cont_rep_np = 0;
                            $cont_rep_nc = 0;
                            $cont_rep = 0;
                            for ($i = 0; $i < $cant_reg; $i++) {
                                $min_np = strtolower($columnas[$i]['NombreParametro']);
                                if (!in_array($min_np, $vec_np)) {
                                    $vec_np[$cont_rep_np] = $min_np;
                                    $cont_rep_np++;
                                }
                                $min_nc = strtolower($columnas[$i]['NombreCampo']);
                                if (!in_array($min_nc, $vec_nc)) {
                                    $vec_nc[$cont_rep_nc] = $min_nc;
                                    $cont_rep_nc++;
                                }
                            }

                            $sw = 0;
                            $msj = "";
                            for ($i = 0; $i < count($vec_np); $i++) {

                                $can_rep = $this->cantidadRepetidos($columnas, $vec_np[$i]);
                                if ($can_rep[0] > 1) {
                                    $msj = $msj . "El NombreParametro: $vec_np[$i] está repetido $can_rep[0] veces <br>";

                                    $sw = 1;
                                }
                            }
                            for ($i = 0; $i < count($vec_nc); $i++) {

                                $can_rep = $this->cantidadRepetidos($columnas, $vec_nc[$i]);
                                if ($can_rep[1] > 1) {
                                    $msj = $msj . "El NombreCampo: $vec_nc[$i] está repetido $can_rep[1] veces <br>";

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

                            $this->respuesta(false, "El archivo .csv debe tener la cantidad de columnas especificadas, favor descargue la plantilla de ejemplo para verificar su formato.", "mensaje");
                            unlink($data);
                        }
                    } else {

                        $this->respuesta(false, "Las cabeceras del archivo .csv deben ser iguales a las especificadas, favor descargue la plantilla de ejemplo para verificar su formato.", "mensaje");
                        unlink($data);
                    }
                } else {
                    $this->respuesta(false, "El archivo que intenta subir no tiene datos para importar.", "mensaje");
                    unlink($data);
                }
            } else {
                $this->respuesta(false, "El archivo que intenta subir supera el maximo de registros permitdos. Maximo: 3000.", "mensaje");
                unlink($data);
            }
            //
        }
    }

    public function cantidadRepetidos($vec, $dato) {

        $aux = array();
        $cont_np = 0;
        $cont_nc = 0;
        for ($j = 0; $j < count($vec); $j++) {

            if (strtolower(trim($dato)) == strtolower(trim($vec[$j]['NombreParametro']))) {

                $cont_np++;
            }
            if (strtolower($dato) == strtolower(trim($vec[$j]['NombreCampo']))) {

                $cont_nc++;
            }
        }
        $aux[0] = $cont_np;
        $aux[1] = $cont_nc;

        return $aux;
    }

    public function GuardarCsv() {
        $this->load->model("extidi/parametro");
        $new_data = $this->input->post("parametro");
        $new_data = json_decode($new_data, true);
        $old_data = $this->parametro->listar();
        $errores = array();
        $cont_rep = 0;
        $cont = count($new_data);
        for ($i = 0; $i < $cont; $i++) {

            $new_data[$i]['NombreParametro'] = trim($new_data[$i]['NombreParametro']);
            $new_data[$i]['NombreCampo'] = trim($new_data[$i]['NombreCampo']);
            $New_NombreP = $new_data[$i]['NombreParametro'];
            $New_CampoN = $new_data[$i]['NombreCampo'];

            for ($j = 0; $j < count($old_data); $j++) {

                $Old_NombreP = $old_data[$j]['NombreParametro'];
                $Old_CampoN = $old_data[$j]['NombreCampo'];

                if (((strtolower($New_NombreP) == strtolower($Old_NombreP)) && ($Old_NombreP != null)) && ((strtolower($New_CampoN) == strtolower($Old_CampoN)) && ($Old_CampoN != null))) {
                    $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ',  NombreParametro: ' . $New_NombreP . ' y  NombreCampo: ' . $New_CampoN . ' ya se encuentran registrados.';
                    $cont_rep++;
                    unset($new_data[$i]);
                } else if ((strtolower($New_NombreP) == strtolower($Old_NombreP)) && ($Old_NombreP != null)) {
                    $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ',  NombreParametro: ' . $New_NombreP . ' ya se encuentra registrado.';
                    $cont_rep++;
                    unset($new_data[$i]);
                } else if ((strtolower($New_CampoN) == strtolower($Old_CampoN)) && ($Old_CampoN != null)) {
                    $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', NombreCampo: ' . $New_CampoN . ' ya se encuentra registrado.';
                    $cont_rep++;
                    unset($new_data[$i]);
                }
            }

            if (strlen($New_NombreP) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', NombreParametro esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }
            if (strlen($New_CampoN) == 0) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', NombreCampo esta en blanco';
                $cont_rep++;
                unset($new_data[$i]);
            }

            if (preg_match("/ /i", $New_CampoN)) {
                $errores[$cont_rep] = 'En la fila ' . ($i + 1) . ', NombreCampo: ' . $New_CampoN . ' no debe tener espacios en blanco.';
                $cont_rep++;
                unset($new_data[$i]);
            }
        }

        $reg_ok = count($new_data);
        $reg_er = count($errores);

        if ($reg_ok > 0) {
            $this->db->insert_batch("extidi_parametro", $new_data);
        }

        if ($reg_er > 0) {
            $mensaje = "<FONT COLOR=green><b>$reg_ok Registro(s) ingresado(s) satisfactoriamente.</b></FONT><br><FONT COLOR= #ff0000><b> $reg_er Error(es) encontrados: </b></FONT><br>";
            for ($i = 0; $i < $reg_er; $i++) {

                $mensaje = $mensaje . $errores[$i] . "<br>";
            }

            $this->respuesta(false, $mensaje, "mensaje");
        } else {

            $this->respuesta(true, "$reg_ok Registro(s) ingresado(s) satisfactoriamente.", "mensaje");
        }
    }

    public function exportarPdf() {
        $this->load->model("extidi/parametro");
        $parametro = $this->parametro->listar();
        $camposbd = array('NombreParametro', 'NombreCampo', 'estado_Valor', 'id');
        $cabeceras = array('Parametro', 'Nombre Campo', 'Estado', 'Id Parametro');
        exportarPdf($parametro, $cabeceras, $camposbd);
    }

    public function imprimir() {
        $this->load->model("extidi/parametro");
        $parametro = $this->parametro->listar();
        $camposbd = array('NombreParametro', 'NombreCampo', 'estado_Valor', 'id');
        $cabeceras = array('Parametro', 'Nombre Campo', 'Estado', 'Id Parametro');
        $this->respuesta(true, imprimir($parametro, $cabeceras, $camposbd), 'mensaje');
        
    }

    public function exportarCsv() {
        $query = $this->db->query("SELECT NombreParametro, NombreCampo FROM extidi_parametro WHERE estado != -1 ");
        exportarCsv($query);
    }

    public function exportarExcel() {
        $this->load->model("extidi/parametro");
        $parametro = $this->parametro->listar();
        $camposbd = array('NombreParametro', 'NombreCampo', 'estado_Valor', 'id');
        $cabeceras = array('Parametro', 'Nombre Campo', 'Estado', 'Id Parametro');
        exportarExcel($parametro, $cabeceras, $camposbd);
    }

}
