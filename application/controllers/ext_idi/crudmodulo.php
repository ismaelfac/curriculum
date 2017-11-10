<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CrudModulo extends EXTIDI_Controller {

    public function index() {
        
    }

	public function cargarAyuda() {
        $modulo = $this->input->post("modulo"); //["user_data"];
		$result = $this->db->query("
				SELECT 
					Ayuda
				FROM extidi_modulos
				WHERE id='$modulo'
			", false);
		$resultado = $result->result_array();
		$this->respuesta(true, $resultado[0], "data");
    }
    public function cargarMenu($node = 0) {
        $user = $this->session->userdata("usuario"); //["user_data"];
        if (!is_array($user)) {
            $this->respuesta(true, array(), "datos");
        } else {
            $usuario = $user["id"];
            $result = $this->db->query("
                    SELECT 
                    *,
                    (
                    SELECT count(*)
                    FROM extidi_modulos
                    WHERE IdModuloPadre=m.id
                    AND id IN (
                        SELECT id FROM extidi_acciones
                        WHERE IdAccion IN (
                            SELECT IdAccion FROM extidi_permisos
                            WHERE IdGrupoUsuario IN (
                                SELECT IdGruposUsuario FROM extidi_usuarios 
                                WHERE id='$usuario'
                            )
                        )
                        AND Ver=1
                        AND NombreAccion='ver'
                    )
                    ) as cantidadHijo
                    FROM extidi_modulos as m
                    WHERE id IN (
                        SELECT IdModulo FROM extidi_acciones
                        WHERE IdAccion IN (
                            SELECT IdAccion FROM extidi_permisos
                            WHERE IdGrupoUsuario IN (
                                SELECT IdGruposUsuario FROM extidi_usuarios 
                                WHERE id='$usuario'
                            )
                        )
                        AND Ver=1
                        AND NombreAccion='ver'
                    )
                    AND 
                        IdModuloPadre=$node
                    AND 
                        estado=1
                    ORDER BY m.Orden ASC
                ", false);
				//echo "/*".$this->db->last_query()."*/";
            $resultado = $result->result_array();
            foreach ($resultado as $k => $v) {
                if ($v['cantidadHijo'] > 0) {
                    $resultado[$k]['menu'] = $this->cargarMenu($v['id']);
                }
            }
            //$resultado["sql"]= $this->db->last_query();
            //$resultado=$this->modulo->listar();
            if ($node == 0) {
                $this->respuesta(true, $resultado, "datos");
            } else {
                return $resultado;
            }
        }
    }

    public function listarModulo() {

        $id = $this->input->post('node');
        if ($id == 'root' || $id == "") {
            $id = 0;
        }
        $a = $this->input->post('search');
        $this->load->model("extidi/modulo");
        $nodes = array();

        $datosfiltrados = json_decode($a, true);
        $NombreModulo = trim($datosfiltrados['NombreModulo']);
        $DescripcionModulo = trim($datosfiltrados['DescripcionModulo']);

        if ($NombreModulo != "") {
            $data = "estado != -1";
            $cond1 = " and NombreModulo like '$NombreModulo%' ";
            $cond2 = " and DescripcionModulo like '$DescripcionModulo%' ";
            $data = $data . $cond1;
            $data = $data . $cond2;
        } else {
            $data = "estado != -1 and IdModuloPadre = $id";
        }
        $modulo = $this->modulo->listarModulo($data);
        $datosdb = $this->modulo->listar();
        for ($i = 0; $i < count($modulo); $i++) {
            //if ($id != 'carpCategorias') {
            $sw = $this->tieneHijos($datosdb, $modulo[$i]['id']);
            //print_r($modulo);
            //}
            if ($NombreModulo != "") {
                $sw = true;
            }
            $nodes[$i] = array(
                'NombreModulo' => $modulo[$i]['NombreModulo'],
                'id' => $modulo[$i]['id'],
                'leaf' => !($modulo[$i]['TipoModulo'] == 'CarpetaArbol'
                || $modulo[$i]['TipoModulo'] == 'CarpetaMenu'
                || $modulo[$i]['TipoModulo'] == 'TabArbol'),
                'DescripcionModulo' => $modulo[$i]['DescripcionModulo'],
                'Controlador' => $modulo[$i]['Controlador'],
                'Orden' => $modulo[$i]['Orden'],
                'TipoModulo' => $modulo[$i]['TipoModulo'],
                'estado' => $modulo[$i]['estado'],
                'IdModulo' => $modulo[$i]['id'],
                'IdModuloPadre' => $modulo[$i]['IdModuloPadre'],
                'Ancestros' => $modulo[$i]['Ancestros'],
                'InicioRapido' => $modulo[$i]['InicioRapido'] ,
                'AccesoDirecto' => $modulo[$i]['AccesoDirecto']/* ,
                      'expanded'=>!$sw */
            );

            //  'icon' => 'archivos/imagenes/icons/16/libro.png');
        }
        $this->respuesta(true, $nodes, "data");
    }

    public function tieneHijos($vec, $id) {
        $resp = true;
        $tam = count($vec);
        for ($i = 0; $i < $tam; $i++) {
            if ($id == $vec[$i]['IdModuloPadre']) {
                $resp = false;
                $i = $tam + 1;
            }
        }
        return $resp;
    }

    public function listarMoverModulo() {
        $this->load->model("extidi/modulo");
        $id = $this->input->get("Ancestros");
        $nodo = $this->input->get("node");

        if ($nodo == 'root') {
            $nodo = 0;
            $cond = array("estado  !=" => -1, "IdModuloPadre" => $nodo);
            $modulo = $this->modulo->listarAncestros($id, $cond);
        } else {
            $data = array("estado  !=" => -1, "IdModuloPadre" => $nodo);
            $modulo = $this->modulo->listarModuloPadre($data);
        }

        $nodes = array();
        $datosdb = $this->modulo->listar();

        for ($i = 0; $i < count($modulo); $i++) {

            $sw = $this->tieneHijos($datosdb, $modulo[$i]['id']);
            $nodes[$i] = array('text' => $modulo[$i]['NombreModulo'],
                'id' => $modulo[$i]['id'],
                'Ancestros' => $modulo[$i]['Ancestros'],
                'leaf' => $sw);
        }

        $this->respuesta(true, $nodes, "data");
    }

    public function moverModulo() {
        $this->load->model("extidi/modulo");
        $modulo = $this->input->post("modulo");
        $idpadre = $this->input->post("idpadre");
        $modulo = json_decode($modulo, true);

        $idmodulo = $modulo['id'];
        $tipomodulo = $modulo['TipoModulo'];
        $modulo['IdModuloPadre'] = $idpadre;
        $idmodulopadre = $modulo['IdModuloPadre'];


        if ($this->buscarTipoModuloHijos($tipomodulo, $idmodulo, $idmodulopadre) != 0) {
            if ($this->buscarTipoModulo($tipomodulo, $idmodulopadre) == 1) {


                $pmold = $modulo['Ancestros'];
                if ($idmodulopadre == 0) {

                    $pmbase = $modulo['id'] . ",";

                    $condidhijos = array("estado !=" => -1, "id !=" => $idmodulo);
                    $idhijos = $this->modulo->traerIdHijos($pmold, $condidhijos);

                    $modulo['Ancestros'] = $pmbase;
                    $this->modulo->bind($modulo);
                    $this->modulo->guardar();

                    if (count($idhijos) > 0) {

                        for ($i = 0; $i < count($idhijos); $i++) {
                            $aux_new_pm = $idhijos[$i]['Ancestros'];
                            $idaux = $idhijos[$i]['id'];
                            $pmnew = str_replace($pmold, $pmbase, $aux_new_pm);
                            $datos = array("Ancestros" => $pmnew);
                            $this->db->update('extidi_modulos', $datos, "id = $idaux");
                        }
                    }
                } else {
                    $condpadrem = array("estado !=" => -1, "id" => $idmodulopadre);
                    $pm_para_donde_voy = $this->modulo->traerAncestros($condpadrem);
                    $condidhijos = array("estado !=" => -1, "id !=" => $idmodulo);
                    $idhijos = $this->modulo->traerIdHijos($pmold, $condidhijos);
                    $pmbase = $pm_para_donde_voy['Ancestros'] . $idmodulo . ",";
                    $modulo['Ancestros'] = $pmbase;
                    $this->modulo->bind($modulo);
                    $this->modulo->guardar();
                    $cant = count($idhijos);

                    if (count($idhijos) > 0) {

                        for ($i = 0; $i < count($idhijos); $i++) {
                            $aux_new_pm = $idhijos[$i]['Ancestros'];
                            $idaux = $idhijos[$i]['id'];
                            $pmnew = str_replace($pmold, $pmbase, $aux_new_pm);
                            $datos = array("Ancestros" => $pmnew);
                            $this->db->update('extidi_modulos', $datos, "id = $idaux");
                        }
                    }
                }

                $this->respuesta(true, "Nodo Movido con Exito.", "mensaje");
            } else {
                $this->respuesta(false, "No puede crear $tipomodulo dentro de este Modulo", "mensaje");
            }
        } else {
            $this->respuesta(false, "No puede Ingresar o Modificar este modulo por $tipomodulo porque tiene hijos que no lo permiten", "mensaje");
        }
    }

    public function cargarTipoModulo() {

        $this->load->model("extidi/modulo");
        $id = $this->input->post("IdModulo");

        $__widget = array(
            "tipo" => "Widget",
            "nombre" => "Widget"
        );
        $__carpetaArbol = array(
            "tipo" => "CarpetaArbol",
            "nombre" => "Carpeta Arbol"
        );

        $__carpetaMenu = array(
            "tipo" => "CarpetaMenu",
            "nombre" => "Carpeta Menu"
        );

        $__tabCrud = array(
            "tipo" => "TabCrud",
            "nombre" => "Tab Crud"
        );

        $__tabArbol = array(
            "tipo" => "TabArbol",
            "nombre" => "Tab Arbol"
        );

        $__tabVacio = array(
            "tipo" => "TabVacio",
            "nombre" => "Tab Vacio"
        );

        $__ventanaModal = array(
            "tipo" => "VentanaModal",
            "nombre" => "Ventana Modal"
        );
        $modulo = array();
        if($id!='0'){
            $this->modulo->cargar($id);
            $id=$this->modulo->TipoModulo;
        }
        switch ($id) {
            case '0':
                array_push($modulo, $__widget);
                array_push($modulo, $__carpetaMenu);
                array_push($modulo, $__tabArbol);
                array_push($modulo, $__tabCrud);
                array_push($modulo, $__tabVacio);
                array_push($modulo, $__ventanaModal);
                break;
            case 'CarpetaMenu':
                array_push($modulo, $__carpetaMenu);
                array_push($modulo, $__tabArbol);
                array_push($modulo, $__tabCrud);
                array_push($modulo, $__tabVacio);
                array_push($modulo, $__ventanaModal);
                break;
            case 'TabArbol':
                array_push($modulo, $__tabArbol);
                array_push($modulo, $__carpetaArbol);
                array_push($modulo, $__tabCrud);
                array_push($modulo, $__tabVacio);
                break;
            case 'CarpetaArbol':
                array_push($modulo, $__tabArbol);
                array_push($modulo, $__carpetaArbol);
                array_push($modulo, $__tabCrud);
                array_push($modulo, $__tabVacio);
                break;
        }

        $this->respuesta(true, $modulo, "data");
    }

    public function cargarModuloPadre() {

        $this->load->model("extidi/modulo");
        $id = $this->input->post("Ancestros");
        if ($id!=='') {
            $data = array(
                "estado  !=" => -1,
                "id !="=>$id
            );
            $modulo = $this->modulo->listarAncestros($id, $data);
        } else {
            
            $data = array(
                "estado  !=" => -1
            );
            $modulo = $this->modulo->listarModuloPadre($data);
        }
        array_push($modulo, array(
            'NombreModulo' => 'Menu Principal',
            'id' => "0"
        ));

        $this->respuesta(true, $modulo, "data");
    }

    public function cargarModuloPadreBusqueda() {

        $this->load->model("extidi/modulo");
        $data = array("estado  !=" => -1);
        $modulo = $this->modulo->listarModulo($data);
        array_push($modulo, array('NombreModulo' => 'Menu Principal', 'id' => 0));
        array_push($modulo, array('NombreModulo' => '-'));
        $this->respuesta(true, $modulo, "data");
    }

    public function buscarTipoModulo($tipomodulo, $idmodulopadre) {

        $tabarbol_carparbol = array('TabArbol', 'CarpetaArbol', 'TabCrud', 'TabVacio');
        $tabvacio_ventmodal = array('TabArbol', 'TabCrud', 'TabVacio', 'VentanaModal');
        $tabcrud = array('TabArbol', 'TabVacio', 'TabCrud', 'VentanaModal');
        $menup_carpmenu = array('Widget', 'TabArbol', 'CarpetaMenu', 'TabCrud', 'TabVacio', 'VentanaModal');

        //hacer consulta para traer el tipo de modulo de ese id Padre
        $this->load->model("extidi/modulo");
        $condTM = array("estado !=" => -1, "id" => $idmodulopadre);
        $tipoM = $this->modulo->traerTipoModulo($condTM);
        $sw = 0;

        if ($idmodulopadre == 0) {
            for ($i = 0; $i < count($menup_carpmenu); $i++) {

                if ($menup_carpmenu[$i] == $tipomodulo) {
                    $sw = 1;
                }
            }
        } else {

            switch ($tipoM['TipoModulo']) {
                case 'CarpetaMenu' :
                    for ($i = 0; $i < count($menup_carpmenu); $i++) {
                        if ($menup_carpmenu[$i] == $tipomodulo) {
                            $sw = 1;
                        }
                    }
                    break;

                case 'TabArbol' :
                    for ($i = 0; $i < count($tabarbol_carparbol); $i++) {
                        if ($tabarbol_carparbol[$i] == $tipomodulo) {
                            $sw = 1;
                        }
                    }
                    break;
                case 'CarpetaArbol' :
                    for ($i = 0; $i < count($tabarbol_carparbol); $i++) {
                        if ($tabarbol_carparbol[$i] == $tipomodulo) {
                            $sw = 1;
                        }
                    }
                    break;
                case 'TabCrud' :
                    for ($i = 0; $i < count($tabcrud); $i++) {
                        if ($tabcrud[$i] == $tipomodulo) {
                            $sw = 1;
                        }
                    }

                    break;
                case 'TabVacio' :
                    for ($i = 0; $i < count($tabvacio_ventmodal); $i++) {
                        if ($tabvacio_ventmodal[$i] == $tipomodulo) {
                            $sw = 1;
                        }
                    }

                    break;
                case 'VentanaModal' :
                    for ($i = 0; $i < count($tabvacio_ventmodal); $i++) {
                        if ($tabvacio_ventmodal[$i] == $tipomodulo) {
                            $sw = 1;
                        }
                    }
                    break;
            }
        }
        return $sw;
    }

    public function buscarTipoModuloHijos($tipomodulo, $idmodulopadre) {

        $tabarbol_carparbol = array('TabArbol', 'CarpetaArbol', 'TabCrud', 'TabVacio');
        $tabvacio_ventmodal = array('TabArbol', 'TabCrud', 'TabVacio', 'VentanaModal');
        $tabcrud = array('TabArbol', 'TabVacio', 'TabCrud', 'VentanaModal');
        $menup_carpmenu = array('TabArbol', 'CarpetaMenu', 'TabCrud', 'TabVacio', 'VentanaModal');

        $this->load->model("extidi/modulo");

        if ($idmodulopadre != 0) {
            $condTM = array("estado !=" => -1, "IdModuloPadre" => $idmodulopadre);
            $tipoM = $this->modulo->traerTipoModuloHijo($condTM);
            $tipoMAux = array();
            $i = 0;
            foreach ($tipoM as $tipo) {
                foreach ($tipo as $valor) {
                    $tipoMAux[$i] = $valor;
                    $i++;
                }
            }

            $sw = 0;
            $cantHijos = count($tipoM);
            $cont = 0;

            if ($cantHijos != 0) {

                switch ($tipomodulo) {
                    case 'CarpetaMenu' :
                        for ($i = 0; $i < count($tipoMAux); $i++) {
                            $aux = $tipoMAux[$i];

                            for ($j = 0; $j < count($menup_carpmenu); $j++) {

                                if ($menup_carpmenu[$j] == $aux) {
                                    $cont++;
                                }
                            }
                        }

                        if ($cont == $cantHijos) {
                            $sw = 1;
                        }

                        break;

                    case 'TabArbol' :
                        for ($i = 0; $i < count($tipoMAux); $i++) {
                            $aux = $tipoMAux[$i];

                            for ($j = 0; $j < count($tabarbol_carparbol); $j++) {

                                if ($tabarbol_carparbol[$j] == $aux) {
                                    $cont++;
                                }
                            }
                        }

                        if ($cont == $cantHijos) {
                            $sw = 1;
                        }
                        break;
                    case 'CarpetaArbol' :
                        for ($i = 0; $i < count($tipoMAux); $i++) {
                            $aux = $tipoMAux[$i];
                            //print_r($aux);
                            for ($j = 0; $j < count($tabarbol_carparbol); $j++) {

                                if ($tabarbol_carparbol[$j] == $aux) {
                                    $cont++;
                                }
                            }
                        }

                        if ($cont == $cantHijos) {
                            $sw = 1;
                        }
                        break;
                    case 'TabCrud' :
                        for ($i = 0; $i < count($tipoMAux); $i++) {
                            $aux = $tipoMAux[$i];

                            for ($j = 0; $j < count($tabcrud); $j++) {

                                if ($tabcrud[$j] == $aux) {
                                    $cont++;
                                }
                            }
                        }

                        if ($cont == $cantHijos) {
                            $sw = 1;
                        }

                        break;
                    case 'TabVacio' :
                        for ($i = 0; $i < count($tipoMAux); $i++) {
                            $aux = $tipoMAux[$i];

                            for ($j = 0; $j < count($tabvacio_ventmodal); $j++) {

                                if ($tabvacio_ventmodal[$j] == $aux) {
                                    $cont++;
                                }
                            }
                        }

                        if ($cont == $cantHijos) {
                            $sw = 1;
                        }

                        break;
                    case 'VentanaModal' :
                        for ($i = 0; $i < count($tipoMAux); $i++) {
                            $aux = $tipoMAux[$i];

                            for ($j = 0; $j < count($tabvacio_ventmodal); $j++) {

                                if ($tabvacio_ventmodal[$j] == $aux) {
                                    $cont++;
                                }
                            }
                        }

                        if ($cont == $cantHijos) {
                            $sw = 1;
                        }
                        break;
                }
            } else {
                $sw = 2;
            }
        } else {
            $sw = 1;
        }

        return $sw;
    }

    public function guardarModulo() {
        $this->load->model("extidi/modulo");
        $this->load->model("extidi/acciones");

        $modulo = json_decode($this->input->post("modulo"), true);
        $idmodulo = (is_null($modulo['IdModulo']) || $modulo['IdModulo'] === "" ? '0' : $modulo['IdModulo']);

        $modulo['NombreModulo'] = trim($modulo['NombreModulo']);
        $modulo['DescripcionModulo'] = trim($modulo['DescripcionModulo']);
        $tipomodulo = (key_exists("TipoModulo", $modulo)?$modulo['TipoModulo']:"");
        $idmodulopadre = $modulo['IdModuloPadre'];

        if ($modulo['estado'] == 'Activo') {
            $modulo['estado'] = 1;
        } else if ($modulo['estado'] == 'Inactivo') {
            $modulo['estado'] = 0;
        }
        
        if ($idmodulo != "0") {
            $this->modulo->cargar($idmodulo);
            $tipomodulo=$this->modulo->TipoModulo;
        }

        if ($this->buscarTipoModuloHijos($tipomodulo, $idmodulo, $idmodulopadre) != 0) {
            if ($this->buscarTipoModulo($tipomodulo, $idmodulopadre) == 1) {
                $sw = 0;
                if ($idmodulo != "0") {
                    $condicion = array(
                        "id !=" => $idmodulo,
                        "estado !=" => -1/* ,
                              "NombreModulo" => $modulo['NombreModulo'] */
                    );
                    $mensaje = "Modulo Modificado Exitosamente.";
                    $conorden = array(
                        "id !=" => $idmodulo,
                        "estado !=" => -1,
                        "IdModuloPadre" => $modulo['IdModuloPadre'],
                        "Orden" => $modulo['Orden']
                    );
                    $sw = 1;
                } else {
                    $condicion = array(
                        "estado !=" => -1/* ,
                              "NombreModulo" => $modulo['NombreModulo'] */
                    );
                    $mensaje = "Modulo Ingresado Exitosamente.";
                    $conorden = array(
                        "estado !=" => -1,
                        "IdModuloPadre" => $modulo['IdModuloPadre'],
                        "Orden" => $modulo['Orden']
                    );
                    $sw = 2;
                }

                //if (!$this->modulo->validar($conorden)) {
                if (!$this->modulo->validar($condicion)) {
                    $this->modulo->bind($modulo);
                    $this->modulo->guardar();
                    $cond = array("estado !=" => -1);
                    $idmodulocreado = $this->modulo->id;

                    if ($sw == 2) {
                        if ($idmodulopadre == "0") {

                            //$modulo['Ancestros'] = $idmodulocreado . ",";
                            $modulo['Ancestros'] = "";
                            $modulo['id'] = $idmodulocreado;
                            $this->modulo->bind($modulo);
                            $this->modulo->guardar();
                        } else {
                            $condpadrem = array(
                                "estado !=" => -1,
                                "id" => $idmodulopadre
                            );
                            $padremaximo = $this->modulo->traerAncestros($condpadrem);
                            $modulo['Ancestros'] = $padremaximo['Ancestros'];
                            $modulo['Ancestros'] = ($modulo['Ancestros'] != "" ? "," : "") . $padremaximo['id'];

                            $modulo['id'] = $idmodulocreado;
                            $this->modulo->bind($modulo);
                            $this->modulo->guardar();
                        }

                        $acciondefecto = array(
                            'id' => $idmodulocreado,
                            'NombreAccion' => 'ver',
                            'IdEstadoAccion_EAP' => 1,
                            'Ver' => 1,
                            'DescripcionAccion' => 'Accion Ver generado por defecto'
                        );
                        $this->acciones->bind($acciondefecto);
                        $this->acciones->guardar();
                    } else if ($sw == 1) {
                        $pmold = $modulo['Ancestros'];
                        if ($idmodulopadre == 0) {

                            $pmbase = "";

                            $condidhijos = array(
                                "estado !=" => -1,
                                "id !=" => $idmodulo
                            );
                            $idhijos = $this->modulo->traerIdHijos($pmold, $condidhijos);

                            $modulo['Ancestros'] = $pmbase;
                            $modulo['id'] = $idmodulocreado;
                            $this->modulo->bind($modulo);
                            $this->modulo->guardar();

                            if (count($idhijos) > 0) {

                                for ($i = 0; $i < count($idhijos); $i++) {
                                    $aux_new_pm = $idhijos[$i]['Ancestros'];
                                    $idaux = $idhijos[$i]['id'];
                                    $pmnew = str_replace($pmold, $pmbase, $aux_new_pm);

                                    $datos = array("Ancestros" => $pmnew);
                                    $this->db->update('extidi_modulos', $datos, "id = $idaux");
                                }
                            }
                        } else {
                            $condpadrem = array("estado !=" => -1, "id" => $idmodulopadre);
                            $pm_para_donde_voy = $this->modulo->traerAncestros($condpadrem);
                            $condidhijos = array("estado !=" => -1, "id !=" => $idmodulo);
                            $idhijos = $this->modulo->traerIdHijos($pmold, $condidhijos);
                            $pmbase = $pm_para_donde_voy['Ancestros'];
                            $pmbase.=($pmbase != "" ? "," : "") . $pm_para_donde_voy['id'];
                            $modulo['Ancestros'] = $pmbase;
                            $modulo['id'] = $idmodulocreado;
                            $this->modulo->bind($modulo);
                            $this->modulo->guardar();
                            $cant = count($idhijos);

                            if (count($idhijos) > 0) {

                                for ($i = 0; $i < count($idhijos); $i++) {
                                    $aux_new_pm = $idhijos[$i]['Ancestros'];
                                    $idaux = $idhijos[$i]['id'];
                                    $pmnew = str_replace($pmold, $pmbase, $aux_new_pm);
                                    $datos = array("Ancestros" => $pmnew);
                                    $this->db->update('extidi_modulos', $datos, "id = $idaux");
                                }
                            }
                        }
                    }
                    $resultado = true;
                } else {
                    $resultado = false;
                    if ($sw === 1)
                        $mensaje = "El Nombre Modulo ya se encuentra registrado.";
                    else
                        $mensaje = "No puede Ingresar este Nombre de Modulo debido a que  ya se encuentra registrado.";
                }

                $this->respuesta($resultado, $mensaje, "mensaje");
                /* } else {

                  $this->respuesta(false, "El modulo a ingresar, no debe tener el mismo orden dentro de un modulo padre", "mensaje");
                  } */
            } else {
                $this->respuesta(false, "No puede crear $tipomodulo dentro de este Modulo", "mensaje");
            }
        } else {
            $this->respuesta(false, "No puede Ingresar o Modificar este modulo por $tipomodulo porque tiene hijos que no lo permiten", "mensaje");
        }
    }

    public function activarEstadoModulo() {

        $idmodulo = $this->input->post("IdModulo");
        $idmodulo = json_decode($idmodulo);
        activarVarios('extidi/modulo', 'modulo', $idmodulo);
        $this->respuesta(true, "Activacion Exitosa.", "mensaje");
    }

    public function inactivarEstadoModulo() {

        $idmodulo = $this->input->post("IdModulo");
        $idmodulo = json_decode($idmodulo);
        inactivarVarios('extidi/modulo', 'modulo', $idmodulo);
        $this->respuesta(true, "Inactivacion Exitosa.", "mensaje");
    }

    public function eliminarModulo() {

        $idmodulo = json_decode($this->input->post("IdModulo"));

        $vec_resp = array();
        $cont = 0;
        $mensaje = "<b>Detalle de Modulos que no fueron eliminados: </b><br>";
        $cant_ids = count($idmodulo);

        for ($i = 0; $i < $cant_ids; $i++) {

            $data = array("estado !=" => -1, "extidi_modulos.id" => $idmodulo[$i], "extidi_acciones.IdEstadoAccion_EAP !=" => -1);
            $cond = array("IdModuloPadre" => $idmodulo[$i], "estado !=" => -1);

            //Validar si tiene hijos
            $this->db->select('extidi_modulos.*');
            $this->db->where($cond);
            $rsh = $this->db->get('extidi_modulos');

            //Validar si tiene acciones
            /*
              $this->db->select('extidi_modulos.*, extidi_acciones.IdModulo');
              $this->db->from('extidi_modulos');
              $this->db->join('extidi_acciones', 'extidi_modulos.IdModulo = extidi_acciones.IdModulo');
              $this->db->where($data);
              $rsa = $this->db->get();
             */
//            $cantacciones = $rsa->num_rows;
            $canthijos = $rsh->num_rows;

            $sw = true;

            if ($canthijos > 0) {
                $mensaje = $mensaje . "El Modulo: " . $idmodulo[$i] . " tiene $canthijos  hijo(s) asignado(s). <br>";
                $sw = false;
            }
            /*          if ($cantacciones > 1) {
              $mensaje = $mensaje . "El Modulo: " . $idmodulo[$i] . " tiene  $cantacciones accion(es) asignada(s). <br>";

              $sw = false;
              } else {
              $this->load->model('extidi/acciones');
              $condIdAccion = array("IdEstadoAccion_EAP !=" => -1, "IdModulo" => $idmodulo[$i]);
              $idaccion = $this->acciones->traerIdAccionPorDefecto($condIdAccion);
              $id = $idaccion['IdAccion'];
              $this->acciones->cargar($id);
              $this->acciones->eliminar();
              }
             */
            if ($sw) {
                $vec_resp[$cont] = $idmodulo[$i];
                $cont++;
            }
        }

        $cant_ae = count($vec_resp);
        if ($cant_ae == $cant_ids) {

            $mensaje = "$cant_ae Modulo(s) eliminado(s).";
            eliminarVarios('extidi/modulo', 'modulo', $vec_resp);
            $this->respuesta(true, $mensaje, "mensaje");
        } else {
            $mensaje = "<b>" . $cant_ae . " Modulo(s) eliminados.</b><br><br>" . $mensaje;
            eliminarVarios('extidi/modulo', 'modulo', $vec_resp);
            $this->respuesta(false, $mensaje, "mensaje");
        }
    }

    public function exportarPdf() {
        $this->load->model("extidi/modulo");
        $data = array("estado !=" => -1);
        $modulo = $this->modulo->listarModulo($data);
        $camposbd = array('NombreModulo', 'DescripcionModulo', 'estado', 'Orden', 'IdModuloP', 'Controlador', 'id');
        $cabeceras = array('Modulo', 'Descripcion', 'Estado', 'Orden', 'Modulo Padre', 'Controlador', 'Id');
        exportarPdf($modulo, $cabeceras, $camposbd);
    }

    public function imprimir() {
        $this->load->model("extidi/modulo");
        $data = array("estado !=" => -1);
        $modulo = $this->modulo->listarModulo($data);
        $camposbd = array('NombreModulo', 'DescripcionModulo', 'estado', 'Orden', 'IdModuloP', 'Controlador', 'id');
        $cabeceras = array('Modulo', 'Descripcion', 'Estado', 'Orden', 'Modulo Padre', 'Controlador', 'Id');
        $this->respuesta(true, imprimir($modulo, $cabeceras, $camposbd), 'mensaje');
    }

    public function exportarCsv() {

        $query = $this->db->query("SELECT * FROM extidi_modulos WHERE estado != -1 ");
        exportarCsv($query);
    }

    public function exportarExcel() {

        $this->load->model("extidi/modulo");
        $data = array("estado !=" => -1);
        $modulo = $this->modulo->listarModulo($data);
        $camposbd = array('NombreModulo', 'DescripcionModulo', 'estado', 'Orden', 'IdModuloP', 'Controlador', 'id');
        $cabeceras = array('Modulo', 'Descripcion', 'Estado', 'Orden', 'Modulo Padre', 'Controlador', 'Id');
        exportarExcel($modulo, $cabeceras, $camposbd);
    }


}
