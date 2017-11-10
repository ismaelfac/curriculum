<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class EXTIDI_ModelDynamic extends CI_Model {

    var $__config = array (
        "tabla" => "",
        "llave" => "id",
        "publico" => false,
        "verificar_permiso" => false,
        "estado" => "estado",
        "mostrarllave" => true,
        "mostrarestado" => true,
        "ordenBotones" => array (
            "crear",
            "modificar",
            "activar",
            "inactivar",
            "eliminar",
            "exportarexcel",
            "exportarpdf",
            "exportarcsv",
            "imprimir"
        ),
        "join" => false, /*
          array(
          array(
          "select"=>"",
          "tabla"=>"",
          "condicion"=>"",
          "tipo"=>""
          )
          )
         */
        "condicion" => "",
        "orden" => "",
        "paginador" => 20,
        "ruta" => "", //ruta del modulo para el permiso
        "permisos" => array (
            "ver",
            "crear",
            "modificar",
            "eliminar",
            "activar",
            "inactivar",
            "exportarexcel",
            "exportarpdf",
            "exportarcsv",
            "imprimir"/* ,
          "hacer" */
        ), //permisos del modulo
        "accionesAdicionales" => array (
        /* array(
          "text"=>"Boton",
          "name"=>"hacer"
          ) */
        ),
        "columnasAdicionales" => array (
        /* 			"programas"=>array(
          "tipo"=>"sql", //"sql", "join"
          "header"=>"Programas",
          "atributosadicionales"=>array(
          ),
          "sql"=>"
          (SELECT
          GROUP_CONCAT(DISTINCT p.`nombre`)
          FROM
          egresado_egresados_programas AS ep,
          egresado_programas AS p
          WHERE
          ep.egresados_id=prin.id
          AND
          ep.`estado`=1
          AND
          p.`id`=ep.`programas_id`
          GROUP BY p.`id`)
          ", //si es sql
          "join"=>array(
          "tabla"=>"",
          "condicion"=>"",//prin.id=_especial_columna_{key_columna}_{tabla}.{columna}
          "tipo"=>"",
          "columnas"=>array(
          ""
          ),
          "columnas_separadas"=>false
          ), //si es join
          ) */
        )
    );

    /*

      var $__config=array(
      "tabla"=>"",
      "llave"=>"id",
      "verificar_permiso"=>true,
      "estado"=>"estado",
      "mostrarllave"=>true,
      "mostrarestado"=>true,
      "condicion"=>"",
      "orden"=>"",
      "confirmar"=>false,
      "ruta"=>"",//ruta del modulo para el permiso
      "permisos"=>array(
      ""
      ),//permisos del modulo
      "accionesAdicionales"=>array(
      array(
      "text"=>"<Texto>",
      "name"=>"<nombre_permiso>"
      .
      .
      .
      //Otras propiedades del button en Extjs
      )
      )
      );

      $campo=array(
      "tipo"=> "bigint", (bigint | date | datetime | decimal | double | enum | float | int | text | time | tinyint | varchar | year)
      "tamano"=> (20 | array("id1"=>"valor1", "id2"=>"valor2")), //es array si es de tipo enum
      "pordefecto"=> 0,
      "transformador"=>'md5("$v")', //donde $v es el valor y transformar es un metodo php
      "nulo"=> true,
      "negativo"=> true,
      "unico"=>false,
      "unicoCombinado"=>false,//para unico entre varios campos

      "html"=>false,
      "password"=>false,
      "archivo"=>false, //para que suba un archivo
      "extensionarchivo"=>array( //extension de los archivos
      "jpg",
      "png",
      "bmp",
      "gif"
      ),

      "filtrar"=>true,
      //"filtro"=>"contiene", ("mayor", "menor", "mayorigual", "menorigual", "igual", "diferente", "rango", "norango", "contiene", "nocontiene", "sql") //sql= " $0 in(SELECT id FROM extidi_usuarios where nombre='$1')" donde $1 es el dato digitado y $0 es la columna

      "foraneo"=>array(
      "tabla"=>"tabla", //tiene que ser un modelo
      "columnarelacion"=>"id", //por si no se relaciona con la primaria
      "condicion"=>"id > 10", //sql de la condicion de la tabla foranea
      "orden"=>"columna ASC, columna2 DESC", //order by de la tabla foranea
      "columnasvalor"=>array(
      "columna1",
      "columna2"
      ),
      "columnasgrilla"=>array(
      "columna1",
      "columna2"=>"as2"
      )
      ),

      "valorparametro"=>array(
      "nombrecampo"=>"", //columna nombrecampo de extidi_parametro
      "condicion"=>"id > 10" //sql de la condicion de la tabla foranea
      ),

      "formulario"=>array( //Propiedades para formulario
      "visible"=>true,
      "nombre"=>"Campo a llenar",
      "tamanominimo"=>0,
      "atributosadicionales"=>array(
      )
      ),
      "grilla"=>array(
      "visible"=>true,
      "cabecera"=>"Campo",
      "ancho"=>150,
      "ordenar"=>true,
      "atributosadicionales"=>array(
      )
      )
      );
     */

    function __construct() {
        $id = $this->__config["llave"];
        $this->{$id} = array (
            "tipo" => "bigint",
            "tamano" => 20,
            "pordefecto" => 0,
            //"nulo"=>false,
            "negativo" => true,
            "formulario" => array (//Propiedades para formulario
                "visible" => false
            ),
            "grilla" => array (
                "visible" => $this->__config["mostrarllave"],
                "cabecera" => "Id",
                "ancho" => 70
            )
        );
        $estado = $this->__config["estado"];
        $this->{$estado} = array (
            "tipo" => "enum",
            "tamano" => array (
                "1" => "Activo",
                "0" => "Inactivo"
            ),
            "pordefecto" => 1,
            //"nulo"=>false,
            "negativo" => true,
            "formulario" => array (//Propiedades para formulario
                "visible" => false
            ),
            "grilla" => array (
                "visible" => $this->__config["mostrarestado"],
                "cabecera" => "Estado",
                "ancho" => 100
            )
        );
        parent::__construct();
    }

    function tienePermiso($accion, $retornar = false) {
        if ($this->__config["verificar_permiso"] === false) {
            return true;
        }
        $usuario = $this->session->userdata('usuario');

        $this->db->select("count(*) as cantidad", false);
        $this->db->from("extidi_acciones as a", false);
        $this->db->from("extidi_permisos as p", false);
        $this->db->from("extidi_modulos as m", false);
        $this->db->where("a.IdModulo=m.id", null, false);
        $this->db->where("a.IdAccion=p.IdAccion", null, false);
        $this->db->where("a.IdEstadoAccion_EAP", 1);
        $this->db->where("p.IdGrupoUsuario", $usuario['IdGruposUsuario']);
        $this->db->where("a.NombreAccion", $accion);
        $this->db->where("m.Controlador", $this->__config["ruta"]);
        $retorno = $this->db->get();
        $retorno = $retorno->result_array();
        if ($retorno[0]["cantidad"] == 0) {
            if ($retornar === false) {
                if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
                    echo json_encode(array (
                        'permisos' => false,
                        'mensaje' => 'No posee permiso de ' . $accion,
                        'data' => array ('mensaje' => 'No posee permiso de ' . $accion)
                    ));
                    die();
                } else {
                    show_error('No posee permiso de ' . $accion, 401);
                }
            } else {
                return false;
            }
        }
        if ($retornar) {
            return true;
        }
    }

    function getPropiedades() {
        $vars = get_object_vars($this);
        foreach ($vars as $key => $value) {
            if ('__' == substr($key, 0, 2)) {
                unset($vars[$key]);
            }
        }
        return $vars;
    }

    function modeloAccionesAdicionales() {
        $retorno = array ();
        foreach ($this->__config["accionesAdicionales"] as $columna => $valor) {
            array_push($retorno, array_merge($valor, array (
                "hidden" => true,
                "disabled" => true
            )));
        }
        return $retorno;
    }

    function modeloFormulario($mostrarBotones = true) {
        $retorno = array ();
        $xtype = array (
            "date" => "datefield",
            "datetime" => "datefield",
            "time" => "timefield",
            "bigint" => "numberfield",
            "decimal" => "numberfield",
            "double" => "numberfield",
            "year" => "numberfield",
            "float" => "numberfield",
            "int" => "numberfield",
            "tinyint" => "numberfield",
            "text" => "textareafield",
            "varchar" => "textfield",
            "enum" => "combo"
        );
        $modelo = $this->getPropiedades();
        foreach ($modelo as $columna => $propiedades) {
            $item = array (
                "eval" => array (),
                "xtype" => $xtype[$propiedades["tipo"]],
                "name" => $columna,
                "fieldLabel" => $columna,
                "anchor" => "-10",
                "allowBlank" => true
            );
            if (key_exists("eval", $propiedades)) {
                $item["eval"] = $propiedades["eval"];
            }
            if (key_exists("formulario", $propiedades)) {
                if (key_exists("tamanominimo", $propiedades["formulario"])) {
                    $item["minLength"] = $propiedades["formulario"]["tamanominimo"];
                }
            }
            if (key_exists("formulario", $propiedades)) {
                if (key_exists("nombre", $propiedades["formulario"])) {
                    $item["fieldLabel"] = $propiedades["formulario"]["nombre"];
                }
            }
            if (key_exists("nulo", $propiedades)) {
                $item["allowBlank"] = $propiedades["nulo"];
            }
            if (key_exists("negativo", $propiedades)) {
                if (!$propiedades["negativo"]) {
                    $item["minValue"] = 0;
                }
            }
            if (key_exists("tamano", $propiedades)) {
                if ($propiedades["tipo"] != "enum") {
                    $item["maxLength"] = $propiedades["tamano"];
                }
            }
            if ($propiedades["tipo"] == "date") {
                $item["format"] = "d M Y";
                $item["submitFormat"] = "Y-m-d";
            }
            if ($propiedades["tipo"] == "datetime") {
                $item["format"] = "d M Y H:i:s";
                $item["submitFormat"] = "Y-m-d H:i:s";
            }
            if ($propiedades["tipo"] == "time") {
                $item["format"] = "H:i:s";
                $item["submitFormat"] = "H:i:s";
            }

            if (key_exists("archivo", $propiedades)) {
                if ($propiedades["archivo"] == true) {
                    $item["xtype"] = "filefield";

                    $item["blankText"] = "No ha selecionado un archivo";
                    $item["buttonText"] = "...";
                    $item["flex"] = "1";
                    $item["valor"] = "";

                    $item = array (
                        "eval" => array (),
                        "xtype" => "fieldcontainer",
                        "layout" => "hbox",
                        "anchor" => "-10",
                        "items" => array (
                            $item,
                            array (
                                "xtype" => "button",
                                "width" => 25,
                                "margin" => "0 0 0 5",
                                "tabIndex" => -9999,
                                "columna" => $item["name"],
                                "campo" => "descargar_" . $item["name"],
                                "name" => "btnDescargar",
                                "hidden" => true,
                                "icon" => base_url() . "js/Extidi/sistema/dinamico/images/btnDescargar.png",
                                "tooltip" => "Descargar"
                            )
                        )
                    );
                }
            }
            if (key_exists("html", $propiedades)) {
                if ($propiedades["html"] == true) {
                    $item["xtype"] = "htmleditor";
                }
            }
            if (key_exists("formulario", $propiedades)) {
                if (key_exists("atributosadicionales", $propiedades["formulario"])) {
                    $item = array_merge($item, $propiedades["formulario"]["atributosadicionales"]);
                }
            }

            if (key_exists("formulario", $propiedades)) {
                if (key_exists("atributosadicionales", $propiedades["formulario"])) {
                    if (key_exists("inputType", $propiedades["formulario"]["atributosadicionales"])) {
                        if ($propiedades["formulario"]["atributosadicionales"]["inputType"] == "password") {
                            $item["allowBlank"] = true;
                        }
                    }
                }
            }
            if ($propiedades["tipo"] == "enum") {
                $item["xtype"] = "combo";
                $item["forceSelection"] = true;
                $item["displayField"] = "texto";
                $item["valueField"] = "id";
                $valores = "";
                foreach ($propiedades["tamano"] as $idEnum => $valorEnum) {
                    $valores.=($valores != "" ? ", " : "") . "['$idEnum', '$valorEnum']";
                }
                $item["store"] = "Ext.create('Ext.data.ArrayStore', {
					fields : ['id','texto'],
					data : [$valores]
				})";
                array_push($item["eval"], "store");
            }
            /*if (key_exists("adjuntos", $propiedades)) {
                $item = array (
                    "eval" => array (),
                    "xtype" => $xtype[$propiedades["tipo"]],
                    "name" => $columna,
                    "fieldLabel" => $columna,
                    "anchor" => "-10",
                    "allowBlank" => true
                );

                $base = "<div style='width: 150px; display: inline-block'>Adjunto:</div>";
                $item = array(
                    "name" => $columna,
                    "width"  => '100%',
                    "height" => 25,
                    "border" => false,
                    "layout" => array(
                        "type"    => 'hbox',
                        "align"   => 'stretch',
                        "padding" => 0,
                        "margin"  => 0
                    ),
                    "items" => array(
                        array(
                            "width" => 150,
                            "xtype" => "panel",
                            "html"  => "Adjuntos:",
                            "layout" => array("padding" => 0, "margin"  => 0)
                        ),
                        array(
                            "xtype" => "panel",
                            "html"  => "Adjuntos",
                            "border" => true,
                            "layout" => array("padding" => 0, "margin"  => '0 -200px 0 0'),
                            "width" => $propiedades["width"]
                        ),
                        array(
                            "xtype" => "button",
                            "name"  => "btnAdjuntar",
                            "text"  => "Adjuntos",
                        )
                    ),
                    "xtype"  => "panel",
                    "eval"   => array (),
                );
            }*/
            if ($item["xtype"] == "htmleditor") {
                $item["flex"] = 1;
                $item["padding"] = "10";
                $item = array (
                    "eval" => array (),
                    "xtype" => "fieldcontainer",
                    "layout" => array (
                        "type" => "hbox",
                        "align" => "stretch"
                    ),
                    "anchor" => "-10",
                    "padding" => "10",
                    "xtype2" => "htmleditor",
                    "items" => array (
                        array (
                            "eval" => array (),
                            "xtype" => "fieldcontainer",
                            "width" => 120,
                            "layout" => "vbox",
                            "margin" => "0 0 0 5",
                            "items" => array (
                                array (
                                    "xtype" => "displayfield",
                                    "value" => $item["fieldLabel"]
                                ),
                                array (
                                    "xtype"    => "button",
                                    "name"     => "btnImagen",
                                    "tabIndex" => -9999,
                                    "text"     => "Insertar Imagen",
                                    "tooltip"  => "Insertar Imagen",
                                    "margin"   => "0 0 10px 0"
                                ),
                                array (
                                    "xtype" => "button",
                                    "name" => "btnArchivo",
                                    "tabIndex" => -9998,
                                    "text" => "Insertar archivo",
                                    "tooltip" => "Insertar archivo"
                                )
                            )
                        ),
                        $item
                    )
                );
                $item["items"][1]["fieldLabel"] = "";
            }
            if (key_exists("foraneo", $propiedades) || key_exists("valorparametro", $propiedades)) {
                $item["xtype"] = "combo";
                $item["forceSelection"] = true;
                $item["flex"] = 1;
                $item["typeAhead"] = false;
                $item["hideTrigger"] = true;
                $item["listConfig"] = array (
                    "loadingText" => "Buscando...",
                    "emptyText" => "No existen registros con ese filtro."
                );
                $crear = true;
                $modificar = true;
                if (key_exists("valorparametro", $propiedades)) {
                    $item["displayField"] = "ValorParametro";
                    $item["valueField"] = "id";

                    $condicion = "IdParametro in(SELECT id FROM extidi_parametro WHERE NombreCampo='" . $propiedades["valorparametro"]["nombrecampo"] . "') ";
                    if (key_exists("condicion", $propiedades["valorparametro"])) {
                        $condicion.=" AND " . $propiedades["valorparametro"]["condicion"];
                    }
                    $item["store"] = "Ext.create('Extidi.clases.StoreValorParametro', {
						extraParams: {
							NombreCampo: '" . $propiedades["valorparametro"]["nombrecampo"] . "',
							con: '" . base64_encode($condicion) . "'
                        }
					})";
                    $this->load->model('extidi_valorparametro');
                    $this->extidi_valorparametro->__config["verificar_permiso"] = true;
                    $crear = $this->extidi_valorparametro->tienePermiso("crear", true);
                    $modificar = $this->extidi_valorparametro->tienePermiso("modificar", true);
                }
                if (key_exists("foraneo", $propiedades)) {
                    $item["displayField"] = "texto";
                    $item["valueField"] = "id";

                    $item["store"] = "Ext.create('Extidi.clases.Store', {
						model: Ext.define('Extidi.sistema.dinamico.model.model', {
							extend : 'Ext.data.Model',
							fields:['id','texto']
						}),
						url: Extidi.sistema.dinamico.constantes.URL_VALOR_FORANEO,
						extraParams: {
							tabla: '" . $propiedades["foraneo"]["tabla"] . "',
							" . (key_exists("orden", $propiedades["foraneo"]) ?
                                    " orden: '" . $propiedades["foraneo"]["orden"] . "', " :
                                    "")
                            . "
							columnas: '" . json_encode($propiedades["foraneo"]["columnasvalor"]) . "'
							" . (key_exists("condicion", $propiedades["foraneo"]) ?
                                    ", con: '" . base64_encode($propiedades["foraneo"]["condicion"]) . "' " :
                                    "")
                            . "
                        }
					})";

                    $this->load->model($propiedades["foraneo"]["tabla"]);
                    $this->{$propiedades["foraneo"]["tabla"]}->__config["verificar_permiso"] = true;
                    $crear = $this->{$propiedades["foraneo"]["tabla"]}->tienePermiso("crear", true);
                    $modificar = $this->{$propiedades["foraneo"]["tabla"]}->tienePermiso("modificar", true);
                }
                $item = array (
                    "eval" => array (),
                    "xtype" => "fieldcontainer",
                    "layout" => "hbox",
                    "anchor" => "-10",
                    "items" => array (
                        $item,
                        array (
                            "xtype" => "button",
                            "width" => 25,
                            "margin" => "0 0 0 5",
                            "name" => "btnQuitar",
                            "tabIndex" => -9999,
                            "hidden" => true,
                            "icon" => base_url() . "js/Extidi/sistema/dinamico/images/btnQuitar.png",
                            "tooltip" => "Quitar"
                        ),
                        array (
                            "xtype" => "button",
                            "width" => 25,
                            "margin" => "0 0 0 5",
                            "name" => "btnBuscar",
                            "tabIndex" => -9999,
                            "icon" => base_url() . "js/Extidi/sistema/dinamico/images/btnBuscar.png",
                            "tooltip" => "Buscar"
                        )
                    )
                );
                if ($modificar) {
                    if ($mostrarBotones) {
                        array_push(
                                $item["items"], array (
                            "xtype" => "button",
                            "width" => 25,
                            "margin" => "0 0 0 5",
                            "name" => "btnModificarModal",
                            "tabIndex" => -9999,
                            "hidden" => true,
                            "icon" => base_url() . "js/Extidi/sistema/dinamico/images/btnModificar.png",
                            "tooltip" => "Modificar"
                                )
                        );
                    }
                }
                if ($crear) {
                    if ($mostrarBotones) {
                        array_push(
                                $item["items"], array (
                            "xtype" => "button",
                            "width" => 25,
                            "margin" => "0 0 0 5",
                            "name" => "btnCrearModal",
                            "tabIndex" => -9999,
                            "icon" => base_url() . "js/Extidi/sistema/dinamico/images/btnCrear.png",
                            "tooltip" => "Crear"
                                )
                        );
                    }
                }
                array_push($item["eval"], "items,0,store");
            }

            if (key_exists("formulario", $propiedades)) {
                if (key_exists("visible", $propiedades["formulario"])) {
                    $item["hidden"] = !$propiedades["formulario"]["visible"];
                    if ($item["hidden"]) {
                        $item["allowBlank"] = true;
                    }
                }
            }
            if (key_exists("confirmar", $propiedades)) {
                if ($propiedades["confirmar"] === true) {
                    $item2 = array_merge($item);
                    $item["fieldLabel"] = "Confirmar " . $item["fieldLabel"];
                    $item["name"] = $item["name"] . "____confirm";
                    array_push($retorno, $item2);
                }
            }
            array_push($retorno, $item);
        }
        return $retorno;
    }

    function modeloGrilla() {
        //$this->tienePermiso("ver");
        $retorno = array ();
        $retorno2 = array ();

        $xtype = array (
            "date" => "datecolumn",
            "datetime" => "datecolumn",
            "time" => "datecolumn",
            "bigint" => "numbercolumn",
            "decimal" => "numbercolumn",
            "double" => "numbercolumn",
            "year" => "numbercolumn",
            "float" => "numbercolumn",
            "int" => "numbercolumn",
            "tinyint" => "numbercolumn",
            "text" => "",
            "varchar" => "",
            "enum" => ""
        );
        $modelo = $this->getPropiedades();
        foreach ($modelo as $columna => $propiedades) {
            $item = array (
                "eval" => array (),
                "dataIndex" => $columna,
                "text" => $columna,
                "width" => 150,
                "sortable" => true,
                "draggable" => false
            );
            if (key_exists("eval", $propiedades)) {
                $item["eval"] = $propiedades["eval"];
            }
            if ($xtype[$propiedades["tipo"]] != "") {
                $item["xtype"] = $xtype[$propiedades["tipo"]];
            }
            if ($propiedades["tipo"] == "int" || $propiedades["tipo"] == "bigint" || $propiedades["tipo"] == "year") {
                $item["format"] = "0";
            }
            if ($propiedades["tipo"] == "date") {
                $item["renderer"] = "function(value, metaData, record, rowIndex, colIndex, store, view){
					var formato=view.getGridColumns()[colIndex].format;
					return Ext.Date.format(Ext.Date.parse(value, 'Y-m-d'), formato);
				}
				";
                array_push($item["eval"], "renderer");
                $item["format"] = "d M Y";
            }
            if ($propiedades["tipo"] == "datetime") {
                $item["renderer"] = "function(value, metaData, record, rowIndex, colIndex, store, view){
					var formato=view.getGridColumns()[colIndex].format;
					return Ext.Date.format(Ext.Date.parse(value, 'Y-m-d H:i:s'), formato);
				}
				";
                array_push($item["eval"], "renderer");
                $item["format"] = "d M Y H:i:s";
            }
            if ($propiedades["tipo"] == "time") {
                $item["renderer"] = "function(value, metaData, record, rowIndex, colIndex, store, view){
					var formato=view.getGridColumns()[colIndex].format;
					return Ext.Date.format(Ext.Date.parse(value, 'H:i:s'), formato);
				}
				";
                array_push($item["eval"], "renderer");
                $item["format"] = "H:i:s";
            }
            if ($propiedades["tipo"] == "enum") {
                $item["renderer"] = "function(value){
					var valores=Ext.JSON.decode('" . json_encode($propiedades["tamano"]) . "');
					return valores[value];
				}
				";

                array_push($item["eval"], "renderer");
            }

            if (key_exists("valorparametro", $propiedades) || key_exists("foraneo", $propiedades)) {
                $item["renderer"] = "function(value, metaData, record, rowIndex, colIndex, store, view){
					var campo=view.getGridColumns()[colIndex].dataIndex;
					return record.get(campo+'_valor');
				}
				";
                array_push($item["eval"], "renderer");
                array_push($retorno2, $columna . "_valor");
            }

            if (key_exists("grilla", $propiedades)) {
                if (key_exists("cabecera", $propiedades["grilla"])) {
                    $item["text"] = $propiedades["grilla"]["cabecera"];
                }
            }
            if (key_exists("grilla", $propiedades)) {
                if (key_exists("ancho", $propiedades["grilla"])) {
                    $item["width"] = $propiedades["grilla"]["ancho"];
                }
            }
            if (key_exists("grilla", $propiedades)) {
                if (key_exists("ordenar", $propiedades["grilla"])) {
                    $item["sortable"] = $propiedades["grilla"]["ordenar"];
                }
            }
            if (key_exists("archivo", $propiedades)) {
                $item["renderer"] = "function(value){
					if(value!=null && value!=''){
						return 'Tiene archivo';
					}else{
						return 'No tiene archivo';
					}
				}
				";

                array_push($item["eval"], "renderer");
            }
            if (key_exists("grilla", $propiedades)) {
                if (key_exists("visible", $propiedades["grilla"])) {
                    $item["hidden"] = !$propiedades["grilla"]["visible"];
                }
            }
            if (key_exists("grilla", $propiedades)) {
                if (key_exists("atributosadicionales", $propiedades["grilla"])) {
                    $item = array_merge($item, $propiedades["grilla"]["atributosadicionales"]);
                }
                //Si la columna tiene un eval, aplicarlo
                if (key_exists("eval",$propiedades["grilla"])) {
                    $item["eval"] = $propiedades["grilla"]["eval"];
                }
            }
            array_push($retorno2, $columna);
            array_push($retorno, $item);
        }
        if (key_exists("columnasAdicionales", $this->__config)) {
            foreach ($this->__config["columnasAdicionales"] as $key => $value) {
                $item = array (
                    "eval" => array (),
                    "dataIndex" => "_especial_columna_" . $key,
                    "text" => $value["header"],
                    "width" => 150,
                    "sortable" => true,
                    "draggable" => false
                );
                if ($value["tipo"] == "sql") {
                    array_push($retorno2, "_especial_columna_" . $key);
                    $item = array (
                        "eval" => array (),
                        "dataIndex" => "_especial_columna_" . $key,
                        "text" => $value["header"],
                        "width" => 150,
                        "sortable" => true,
                        "draggable" => false
                    );
                }
                if ($value["tipo"] == "join") {
                    if ($value["join"]["columnas_separadas"] === false) {
                        array_push($retorno2, "_especial_columna_" . $key);
                        $item = array (
                            "eval" => array (),
                            "dataIndex" => "_especial_columna_" . $key,
                            "text" => $value["header"],
                            "width" => 150,
                            "sortable" => true,
                            "draggable" => false
                        );
                    } else {
                        foreach ($value["join"]["columnas"] as $kJoin => $vJoin) {
                            array_push($retorno2, "_especial_columna_" . $key . "_" . $vJoin);
                            $item = array (
                                "eval" => array (),
                                "dataIndex" => "_especial_columna_" . $key . "_" . $vJoin,
                                "text" => $value["header"],
                                "width" => 150,
                                "sortable" => true,
                                "draggable" => false
                            );
                        }
                    }
                }


                if (key_exists("atributosadicionales", $value)) {
                    $item = array_merge($item, $value["atributosadicionales"]);
                }
                /* Si la columna tiene un eval aplicarlo */
                if (key_exists("eval", $value)) {
                    $item["eval"] = $value["eval"];
                }
                array_push($retorno, $item);
            }
        }
        return array (
            "ordenBotones" => $this->__config["ordenBotones"],
            "columnas" => $retorno,
            "modelo" => $retorno2,
            "config" => array (
                "llave" => $this->__config["llave"],
                "estado" => $this->__config["estado"],
                "paginador" => $this->__config["paginador"]
            )
        );
    }

    function modeloFormularioFiltro() {
        $retorno = array ();

        $xtype = array (
            "date" => "datefield",
            "datetime" => "datefield",
            "time" => "timefield",
            "bigint" => "numberfield",
            "decimal" => "numberfield",
            "double" => "numberfield",
            "year" => "numberfield",
            "float" => "numberfield",
            "int" => "numberfield",
            "tinyint" => "numberfield",
            "text" => "textareafield",
            "varchar" => "textfield",
            "enum" => "combo"
        );
        $modelo = $this->getPropiedades();
        foreach ($modelo as $columna => $propiedades) {
            $mostrar = true;
            if (key_exists("filtrar", $propiedades)) {
                $mostrar = $propiedades["filtrar"];
            }
            if ($mostrar) {
                if (key_exists("grilla", $propiedades)) {
                    if (key_exists("visible", $propiedades["grilla"])) {
                        $mostrar = $propiedades["grilla"]["visible"];
                    }
                }
            }
            if ($mostrar) {
                $item = array (
                    "eval" => array (),
                    "xtype" => $xtype[$propiedades["tipo"]],
                    "name" => $columna,
                    "fieldLabel" => $columna,
                    "anchor" => "-10"
                );

                if (key_exists("grilla", $propiedades)) {
                    if (key_exists("cabecera", $propiedades["grilla"])) {
                        $item["fieldLabel"] = $propiedades["grilla"]["cabecera"];
                    }
                }

                if ($propiedades["tipo"] == "date") {
                    $item["format"] = "d M Y";
                    $item["submitFormat"] = "Y-m-d";
                }
                if ($propiedades["tipo"] == "datetime") {
                    $item["format"] = "d M Y H:i:s";
                    $item["submitFormat"] = "Y-m-d H:i:s";
                }
                if ($propiedades["tipo"] == "time") {
                    $item["format"] = "H:i:s";
                    $item["submitFormat"] = "H:i:s";
                }

                if ($propiedades["tipo"] == "enum") {
                    $item["xtype"] = "combo";
                    $item["forceSelection"] = true;
                    $item["displayField"] = "texto";
                    $item["valueField"] = "id";
                    $valores = "";
                    foreach ($propiedades["tamano"] as $idEnum => $valorEnum) {
                        $valores.=($valores != "" ? ", " : "") . "['$idEnum', '$valorEnum']";
                    }
                    $item["store"] = "Ext.create('Ext.data.ArrayStore', {
						fields : ['id','texto'],
						data : [$valores]
					})";
                    array_push($item["eval"], "store");
                }
                if (key_exists("foraneo", $propiedades) || key_exists("valorparametro", $propiedades)) {
                    $item["xtype"] = "combo";
                    $item["forceSelection"] = true;
                    $item["flex"] = 1;
                    $item["typeAhead"] = false;
                    $item["hideTrigger"] = true;
                    $item["listConfig"] = array (
                        "loadingText" => "Buscando...",
                        "emptyText" => "No existen registros con ese filtro."
                    );
                    if (key_exists("valorparametro", $propiedades)) {
                        $item["displayField"] = "ValorParametro";
                        $item["valueField"] = "id";

                        $item["store"] = "Ext.create('Extidi.clases.StoreValorParametro', {
							extraParams: {
								NombreCampo: '" . $propiedades["valorparametro"]["nombrecampo"] . "'
								" . (key_exists("condicion", $propiedades["valorparametro"]) ?
                                        ", con: '" . base64_encode($propiedades["valorparametro"]["condicion"]) . "' " :
                                        "")
                                . "
							}
						})";
                    }
                    if (key_exists("foraneo", $propiedades)) {
                        $item["displayField"] = "texto";
                        $item["valueField"] = "id";

                        $item["store"] = "Ext.create('Extidi.clases.Store', {
							model: Ext.define('Extidi.sistema.dinamico.model.model', {
								extend : 'Ext.data.Model',
								fields:['id','texto']
							}),
							url: Extidi.sistema.dinamico.constantes.URL_VALOR_FORANEO,
							extraParams: {
								tabla: '" . $propiedades["foraneo"]["tabla"] . "',
								" . (key_exists("orden", $propiedades["foraneo"]) ?
                                        " orden: '" . $propiedades["foraneo"]["orden"] . "'," :
                                        "")
                                . "
								columnas: '" . json_encode($propiedades["foraneo"]["columnasvalor"]) . "'
								" . (key_exists("condicion", $propiedades["foraneo"]) ?
                                        ", con: '" . base64_encode($propiedades["foraneo"]["condicion"]) . "' " :
                                        "")
                                . "
							}
						})";
                    }
                    $item = array (
                        "eval" => array (),
                        "xtype" => "fieldcontainer",
                        "layout" => "hbox",
                        "anchor" => "-10",
                        "items" => array (
                            $item,
                            array (
                                "xtype" => "button",
                                "width" => 25,
                                "margin" => "0 0 0 5",
                                "name" => "btnQuitar",
                                "tabIndex" => -9999,
                                "hidden" => true,
                                "icon" => base_url() . "js/Extidi/sistema/dinamico/images/btnQuitar.png",
                                "tooltip" => "Quitar"
                            ),
                            array (
                                "xtype" => "button",
                                "width" => 22,
                                "margin" => "0 0 0 5",
                                "name" => "btnBuscar",
                                "tabIndex" => -9999,
                                "icon" => base_url() . "js/Extidi/sistema/dinamico/images/btnBuscar.png",
                                "tooltip" => "Buscar"
                            )/* ,
                          array(
                          "xtype"=>"button",
                          "width"=>22,
                          "margin"=>"0 0 0 5",
                          "name"=>"btnCrear",
                          "icon"=>base_url()."js/Extidi/sistema/dinamico/images/btnCrear.png",
                          "tooltip"=>"Crear"
                          ) */
                        )
                    );
                    array_push($item["eval"], "items,0,store");
                }/*
                  if(key_exists("filtro", $propiedades)){
                  if($propiedades["filtro"]=="rango" || $propiedades["filtro"]=="norango"){
                  $item1=array_merge($item);
                  $item1["flex"]=1;
                  $item1["fieldLabel"]=$item1["fieldLabel"];
                  $item2=array_merge($item);
                  $item2["fieldLabel"]="Hasta";
                  $item2["labelAlign"]="right";
                  $item2["flex"]=1;
                  $itemN=array(
                  "eval"=>array(),
                  "xtype"=>"fieldcontainer",
                  "anchor"=>"-10",
                  "name"=>$item["name"]."_fieldcontainer",
                  "layout"=> array(
                  "type"=>"vbox",
                  "align"=>"stretch"
                  ),
                  "items"=>array(
                  $item1,
                  $item2
                  )
                  );
                  if(count($item["eval"])>0){
                  array_push($itemN["eval"], "items,0,".$item["eval"]);
                  array_push($itemN["eval"], "items,1,".$item["eval"]);
                  }
                  $item=$itemN;
                  }
                  } */
                /* $item1=array_merge($item);
                  $item1["flex"]=1;
                  $item1["fieldLabel"]=$item1["fieldLabel"];
                  $item2=array_merge($item);
                  $item2["flex"]=1;
                  $itemN=array(
                  "eval"=>array(),
                  "xtype"=>"fieldcontainer",
                  "anchor"=>"-10",
                  "name"=>$item["name"]."_fieldcontainer",
                  "layout"=> array(
                  "type"=>"vbox",
                  "align"=>"stretch"
                  ),
                  "items"=>array(
                  $item1,
                  $item2
                  )
                  );
                  for($iEval=0; $iEval<count($item["eval"]); $iEval++){
                  array_push($itemN["eval"], "items,1,".$item["eval"][$iEval]);
                  }
                  $item=$itemN;
                 */
                $item = array (
                    "eval" => array (
                        "items,0,store"
                    ),
                    "xtype" => "fieldcontainer",
                    "anchor" => "-10",
                    "layout" => array (
                        "type" => "hbox"
                    ),
                    "fieldLabel" => "",
                    "items" => array (
                        array (
                            "xtype" => "combo",
                            "forceSelection" => true,
                            "displayField" => "texto",
                            "valueField" => "id",
                            "value" => "=",
                            "width" => 100,
                            "name" => $columna . "___operador",
                            "store" => "Ext.create('Ext.data.ArrayStore', {
								fields : ['id','texto'],
								data : [
									['=', 'Igual'],
									['!=', 'Diferente'],
									['>', 'Mayor'],
									['<', 'Menor'],
									['>=', 'Mayor Igual'],
									['<=', 'Menor Igual']
								]
							})"
                        ),
                        $item
                    )
                );
                $item["items"][1]["flex"] = 1;
                if (in_array($propiedades["tipo"], array (
                            "bigint",
                            "decimal",
                            "double",
                            "year",
                            "float",
                            "int",
                            "tinyint",
                            "enum"
                        ))) {
                    if (key_exists("foraneo", $propiedades) || key_exists("valorparametro", $propiedades)) {
                        if (key_exists("fieldLabel", $item["items"][1]["items"][0])) {
                            $item["fieldLabel"] = $item["items"][1]["items"][0]["fieldLabel"];
                            $item["items"][1]["items"][0]["fieldLabel"] = "";
                        }
                    } else {
                        if (key_exists("fieldLabel", $item["items"][1])) {
                            $item["fieldLabel"] = $item["items"][1]["fieldLabel"];
                            $item["items"][1]["fieldLabel"] = "";
                        }
                    }
                }
                if (in_array($propiedades["tipo"], array (
                            "date",
                            "datetime",
                            "time"
                        ))) {
                    if (key_exists("fieldLabel", $item["items"][1])) {
                        $item["fieldLabel"] = $item["items"][1]["fieldLabel"];
                        $item["items"][1]["fieldLabel"] = "";
                    }
                }
                if (in_array($propiedades["tipo"], array (
                            "text",
                            "varchar"
                        ))) {
                    if (key_exists("fieldLabel", $item["items"][1])) {
                        $item["fieldLabel"] = $item["items"][1]["fieldLabel"];
                        $item["items"][1]["fieldLabel"] = "";
                    }
                    $item["items"][0]["value"] = "like";
                    $item["items"][0]["store"] = "Ext.create('Ext.data.ArrayStore', {
						fields : ['id','texto'],
						data : [
							['=', 'Igual'],
							['!=', 'Diferente'],
							['like', 'Contiene'],
							['not like', 'No Contiene']
						]
					})";
                }
                for ($iEval = 0; $iEval < count($item["items"][1]["eval"]); $iEval++) {
                    array_push($item["eval"], "items,1," . $item["items"][1]["eval"][$iEval]);
                }
                array_push($retorno, $item);
            }
        }/*
          if(key_exists("columnasAdicionales", $this->__config)){
          foreach($this->__config["columnasAdicionales"] as $key => $value){

          $item=array(
          "eval"=>array(),
          "xtype"=>"textfield",
          "name"=>"_especial_columna_".$key,
          "fieldLabel"=>$value["header"],
          "anchor"=>"-10"
          );
          }
          } */
        /*
          "tipo_filtro"=>"varios_foraneo",//varios_foraneo, texto, varios_texto, foraneo
          "sql_filtro"=>"
          prin.id in(SELECT
          ep.egresados_id
          FROM
          egresado_egresados_programas AS ep
          WHERE
          ep.`estado`=1
          AND
          ep.`programas_id` in({valor})
          )
          " */
        return $retorno;
    }

    function consultaForanea($columnas = array (), $start = 0, $limit = 20, $orden = '', $condicion = '', $query = '', $dato = '', $adicional = '') {
        //$this->tienePermiso("ver");

        $this->db->select($this->__config["llave"] . " as id", false);
        $this->db->select("concat(" . implode(', " ", ', $columnas) . ", ' ') as texto", false);
        $this->db->from($this->__config["tabla"] . " as prin");
        $this->db->where($this->__config["estado"], 1);
        if (trim($condicion) != '') {
            $this->db->where($condicion, null, false);
        }
        if ($dato != '') {
            $this->db->where($this->__config["llave"], $dato);
        }
        if ($query != '') {
            $this->db->where("concat(" . implode(', " ", ', $columnas) . ") like '%" . $query . "%'", null, false);
        }
        if ($adicional != '') {
            $conAdicional = json_decode($adicional, false);
            foreach ($conAdicional as $key => $value) {
                $this->db->where($key, $value);
            }
        }

        $this->db->limit($limit, $start);
        if ($orden != '') {
            $this->db->order_by($orden);
        }

        $resultado = $this->db->get();

        $resultado = $resultado->result_array();
        return $resultado;
    }

    function listadoGrilla($start = 0, $limit = 20, $query = '', $dato = '', $condicion = '', $orden = '') {
        $this->tienePermiso("ver");
        $campos = $this->getPropiedades();
        $i = 0;
        if ($condicion != '') {
            $this->db->where($condicion, null, false);
        }
        foreach ($campos as $key => $value) {
            $mostrar = true;
            if (key_exists("formulario", $value)) {
                if (key_exists("atributosadicionales", $value["formulario"])) {
                    if (key_exists("inputType", $value["formulario"]["atributosadicionales"])) {
                        if ($value["formulario"]["atributosadicionales"]["inputType"] == "password") {
                            $mostrar = false;
                        }
                    }
                }
            }
            if ($mostrar) {
                if (key_exists("foraneo", $value)) {
                    $this->db->select(($i == 0 ? "SQL_CALC_FOUND_ROWS " : "") . "prin." . $key, false);
                    $tablaFor = $value["foraneo"]["tabla"];
                    //$this->db->from($tablaFor." as ".$tablaFor."_".$key);
                    $this->load->model($tablaFor);
                    $idForaneo = $this->{$tablaFor}->__config["llave"];
                    $this->db->join($tablaFor . " as " . $tablaFor . "_" . $key, $tablaFor . "_" . $key . "." . $idForaneo . "=prin." . $key, "left");
                    $this->db->select("concat(" . $tablaFor . "_" . $key . '.' . implode(', " ", ' . $tablaFor . "_" . $key . '.', $value["foraneo"]["columnasvalor"]) . ") as " . $key . "_valor", false);
                } else if (key_exists("valorparametro", $value)) {
                    $this->db->select(($i == 0 ? "SQL_CALC_FOUND_ROWS " : "") . "prin." . $key, false);

                    $this->db->join("extidi_valorparametro as extidi_valorparametro_" . $key, "extidi_valorparametro_" . $key . ".id=prin." . $key, "left");
                    $this->db->select("extidi_valorparametro_" . $key . ".ValorParametro as " . $key . "_valor", false);
                } else {
                    $this->db->select(($i == 0 ? "SQL_CALC_FOUND_ROWS " : "") . "prin." . $key, false);
                }
            }
            $i++;
        }

        //--
        if (key_exists("columnasAdicionales", $this->__config)) {
            foreach ($this->__config["columnasAdicionales"] as $key => $value) {
                if ($value["tipo"] == "sql") {
                    $this->db->select(" (" . $value["sql"] . ") as _especial_columna_" . $key, false);
                }
                if ($value["tipo"] == "join") {
                    if ($value["join"]["columnas_separadas"] === false) {
                        $columnasJoin = "";
                        foreach ($value["join"]["columnas"] as $kJoin => $vJoin) {
                            $columnasJoin.=($columnasJoin != "" ? ", " : "") . "_especial_columna_" . $key . "_" . $value["join"]["tabla"] . ".$vJoin";
                        }
                        $this->db->select(" concat(" . $columnasJoin . ") as _especial_columna_" . $key, false);
                    } else {
                        foreach ($value["join"]["columnas"] as $kJoin => $vJoin) {
                            $this->db->select("_especial_columna_" . $key . "_" . $value["join"]["tabla"] . ".$vJoin as _especial_columna_" . $key . "_" . $vJoin, false);
                        }
                    }
                    $this->db->join($value["join"]["tabla"] . " as _especial_columna_" . $key . "_" . $value["join"]["tabla"], $value["join"]["condicion"], $value["join"]["tipo"]);
                }
            }
        }
        //--


        $this->db->from($this->__config["tabla"] . " as prin");
        $this->db->where("prin." . $this->__config["estado"] . ">=0", null, false);
        if ($this->__config["condicion"] != '') {
            $this->db->where($this->__config["condicion"], null, false);
        }
        if ($this->__config["join"] != false) {
            if (is_array($this->__config["join"])) {
                foreach ($this->__config["join"] as $keyJoin => $valueJoin) {
                    /* if(in_array("select", $valueJoin)){
                      $this->db->select($valueJoin["select"], false);
                      } */
                    $this->db->join($valueJoin["tabla"], $valueJoin["condicion"], $valueJoin["tipo"]);
                }
            }
        }
        if ($dato != '') {
            $dato = json_decode($dato);
            foreach ($dato as $keyQuery => $valueQuery) {
                $this->db->where("prin." . $keyQuery, $valueQuery);
            }
        }
        if ($query != '') {
            $query = json_decode($query, true);
            foreach ($query as $keyQuery => $valueQuery) {
                if (key_exists($keyQuery, $campos)) {
                    if (key_exists($keyQuery . "___operador", $query)) {
                        if ($valueQuery != "") {
                            $operacion = $query[$keyQuery . "___operador"];
                            //echo "/*$operacion $keyQuery*/\n";
                            switch ($operacion) {
                                case "=":
                                    $this->db->where("prin." . $keyQuery . " = '" . $valueQuery . "'", null, false);
                                    break;
                                case "!=":
                                    $this->db->where("prin." . $keyQuery . " != '" . $valueQuery . "'", null, false);
                                    break;
                                case ">":
                                    $this->db->where("prin." . $keyQuery . " > '" . $valueQuery . "'", null, false);
                                    break;
                                case "<":
                                    $this->db->where("prin." . $keyQuery . " < '" . $valueQuery . "'", null, false);
                                    break;
                                case ">=":
                                    $this->db->where("prin." . $keyQuery . " >= '" . $valueQuery . "'", null, false);
                                    break;
                                case "<=":
                                    $this->db->where("prin." . $keyQuery . " <= '" . $valueQuery . "'", null, false);
                                    break;
                                case "like":
                                    $this->db->where("prin." . $keyQuery . " like '%" . $valueQuery . "%'", null, false);
                                    break;
                                case "not like":
                                    $this->db->where("prin." . $keyQuery . " not like '%" . $valueQuery . "%'", null, false);
                                    break;
                            }
                        }
                    }
                    /* $operacion="contiene";
                      if(key_exists("filtro", $campos[$keyQuery])){
                      $operacion=$campos[$keyQuery]["filtro"];
                      }
                      switch($operacion){
                      case "mayor":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." > '".$valueQuery."'", null, false);
                      }
                      break;
                      case "menor":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." < '".$valueQuery."'", null, false);
                      }
                      break;
                      case "mayorigual":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." >= '".$valueQuery."'", null, false);
                      }
                      break;
                      case "menorigual":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." <= '".$valueQuery."'", null, false);
                      }
                      break;
                      case "contiene":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." like '%".$valueQuery."%'", null, false);
                      }
                      break;
                      case "nocontiene":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." not like '%".$valueQuery."%'", null, false);
                      }
                      break;
                      case "inicia":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." like '".$valueQuery."%'", null, false);
                      }
                      break;
                      case "noinicia":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." not like '".$valueQuery."%'", null, false);
                      }
                      break;
                      case "termina":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." like '%".$valueQuery."'", null, false);
                      }
                      break;
                      case "notermina":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." not like '%".$valueQuery."'", null, false);
                      }
                      break;
                      case "igual":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." = '".$valueQuery."'", null, false);
                      }
                      break;
                      case "diferente":
                      if($valueQuery!=""){
                      $this->db->where($keyQuery." != '".$valueQuery."'", null, false);
                      }
                      break;
                      case "rango":
                      $values=$valueQuery;
                      if($values[0]!="" && $values[1]!=""){
                      $this->db->where("(".$keyQuery." >= '".$values[0]."' AND ".$keyQuery." <= '".$values[1]."' )", null, false);
                      }
                      break;
                      case "norango":
                      $values=$valueQuery;
                      if($values[0]!="" && $values[1]!=""){
                      $this->db->where("(".$keyQuery." < '".$values[0]."' AND ".$keyQuery." > '".$values[1]."' )", null, false);
                      }
                      break;
                      default:
                      if($valueQuery!=""){
                      $this->db->where(str_replace("$0", $keyQuery, str_replace("$1", $valueQuery, $operacion)), null, false);
                      }
                      break;
                      } */
                }
            }
            //$this->db->where("concat(".implode(', " ", ', $columnas).") like '%".$query."%'", null, false);
        }
        if ($limit != 0) {
            $this->db->limit($limit, $start);
        }
        if ($orden != "") {
            $this->db->order_by($orden);
        } else {
            if ($this->__config["orden"] != "") {
                $this->db->order_by($this->__config["orden"]);
            }
        }
        $resultado = $this->db->get();
        //echo "/*".$this->db->last_query()."*/";
        $cantidad = $this->db->query("SELECT FOUND_ROWS() as cantidad;", false);
        $cantidad = $cantidad->result_array();

        $resultado = $resultado->result_array();
        header('Content-Type: application/json');
        return array (
            "data" => $resultado,
            "total" => $cantidad[0]["cantidad"]
        );
    }

    function cargar($condicion = '') {
        //$this->tienePermiso("ver");
        //$this->db->select($this->__config["llave"]." as id", false);
        $campos = $this->getPropiedades();
        $i = 0;
        if ($condicion != '') {
            $this->db->where($condicion, null, false);
        }
        foreach ($campos as $key => $value) {
            $this->db->select("prin." . $key, false);
        }
        $this->db->from($this->__config["tabla"] . " as prin");
        $this->db->where("prin." . $this->__config["estado"] . ">=0", null, false);
        /* if($this->__config["orden"]!=""){
          $this->db->order_by($this->__config["orden"]);
          } */
        $resultado = $this->db->get();
        $resultado = $resultado->result_array();
        return $resultado;
    }

    function guardar($valores) {
        //if(isset($valores['id']) && $valores['id'] != 0) die(json_encode($valores));
        if (!key_exists($this->__config["llave"], $valores)) {
            $valores[$this->__config["llave"]] = 0;
            $this->tienePermiso("crear");
        } else if ($valores[$this->__config["llave"]] == 0) {
            $this->tienePermiso("crear");
        } else {
            $this->tienePermiso("modificar");
        }
        $modelo = $this->getPropiedades();
        $entroUnico = false;
        $entroUnicoCombinado = false;
        $camposUnico = array ();
        $camposUnicoCombinado = array ();
        $camposArchivo = array ();
        $entroSql = "(";
        $entroCombinadoSql = "(";
        foreach ($modelo as $columna => $propiedades) {
            $nulo = true;
            $pordefecto = null;
            $vpordefecto = false;
            $transformador = "";
            $unico = false;
            $unicoCombinado = false;
            if (key_exists("nulo", $propiedades)) {
                $nulo = $propiedades["nulo"];
            }
            if (key_exists("pordefecto", $propiedades)) {
                $vpordefecto = true;
                $pordefecto = $propiedades["pordefecto"];
            }
            if (key_exists("transformador", $propiedades)) {
                $transformador = $propiedades["transformador"];
            }
            if (key_exists("unico", $propiedades)) {
                $unico = $propiedades["unico"];
            }
            if (key_exists("unicoCombinado", $propiedades)) {
                $unicoCombinado = $propiedades["unicoCombinado"];
            }

            $ignora = false;
            if (key_exists("formulario", $propiedades)) {
                if (key_exists("atributosadicionales", $propiedades["formulario"])) {
                    if (key_exists("inputType", $propiedades["formulario"]["atributosadicionales"])) {
                        if ($propiedades["formulario"]["atributosadicionales"]["inputType"] == "password") {
                            if ($valores[$this->__config["llave"]] != 0) {
                                $ignora = true;
                            }
                        }
                    }
                }
            }

            if (key_exists("archivo", $propiedades)) {
                if ($propiedades["archivo"] == true) {
                    $camposArchivo[$columna] = $propiedades;
                    $ignora = true;
                }
            }

            if (key_exists($columna, $valores)) {
                if ($valores[$columna] == "") {
                    if (!$ignora) {
                        if ($nulo == false) {
                            if (!$vpordefecto) {
                                return array (
                                    "success" => false,
                                    "mensaje" => "Campo faltante '" . (key_exists("formulario", $propiedades) ? (key_exists("nombre", $propiedades["formulario"]) ? $propiedades["formulario"]["nombre"] : $columna) : $columna) . "'"
                                );
                            } else {
                                if (key_exists("confirmar", $propiedades)) {
                                    if (key_exists($columna . "____confirm", $valores)) {
                                        if ($valores[$columna . "____confirm"] != $valores[$columna]) {
                                            return array (
                                                "success" => false,
                                                "mensaje" => "Campos no iguales en '" . (key_exists("formulario", $propiedades) ? (key_exists("nombre", $propiedades["formulario"]) ? $propiedades["formulario"]["nombre"] : $columna) : $columna) . "'"
                                            );
                                        }
                                    }
                                }
                                if ($transformador != "") {
                                    eval('$valores[$columna]=' . str_replace('$v', '"' . $pordefecto . '"', $transformador) . ';');
                                } else {
                                    $valores[$columna] = $pordefecto;
                                }
                            }
                        } else {
                            if ($vpordefecto) {
                                if (key_exists("confirmar", $propiedades)) {
                                    if (key_exists($columna . "____confirm", $valores)) {
                                        if ($valores[$columna . "____confirm"] != $valores[$columna]) {
                                            return array (
                                                "success" => false,
                                                "mensaje" => "Campos no iguales en '" . (key_exists("formulario", $propiedades) ? (key_exists("nombre", $propiedades["formulario"]) ? $propiedades["formulario"]["nombre"] : $columna) : $columna) . "'"
                                            );
                                        }
                                    }
                                }
                                if ($transformador != "") {
                                    eval('$valores[$columna]=' . str_replace('$v', '"' . $pordefecto . '"', $transformador) . ';');
                                } else {
                                    $valores[$columna] = $pordefecto;
                                }
                            }
                        }
                    }
                } else {
                    if (key_exists("confirmar", $propiedades)) {
                        if (key_exists($columna . "____confirm", $valores)) {
                            if ($valores[$columna . "____confirm"] != $valores[$columna]) {
                                return array (
                                    "success" => false,
                                    "mensaje" => "Campos no iguales en '" . (key_exists("formulario", $propiedades) ? (key_exists("nombre", $propiedades["formulario"]) ? $propiedades["formulario"]["nombre"] : $columna) : $columna) . "'"
                                );
                            }
                        }
                    }
                    if ($transformador != "") {
                        eval('$valores[$columna]=' . str_replace('$v', '"' . $valores[$columna] . '"', $transformador) . ';');
                    }
                }
            } else {
                if (!$ignora) {
                    if ($nulo == false) {
                        if (!$vpordefecto) {
                            return array (
                                "success" => false,
                                "mensaje" => "Campo faltante " . $columna
                            );
                        } else {
                            if (key_exists("confirmar", $propiedades)) {
                                if (key_exists($columna . "____confirm", $valores)) {
                                    if ($valores[$columna . "____confirm"] != $valores[$columna]) {
                                        return array (
                                            "success" => false,
                                            "mensaje" => "Campos no iguales en '" . (key_exists("formulario", $propiedades) ? (key_exists("nombre", $propiedades["formulario"]) ? $propiedades["formulario"]["nombre"] : $columna) : $columna) . "'"
                                        );
                                    }
                                }
                            }
                            if ($transformador != "") {
                                eval('$valores[$columna]=' . str_replace('$v', '"' . $pordefecto . '"', $transformador) . ';');
                            } else {
                                $valores[$columna] = $pordefecto;
                            }
                        }
                    } else {
                        if ($vpordefecto) {
                            if (key_exists("confirmar", $propiedades)) {
                                if (key_exists($columna . "____confirm", $valores)) {
                                    if ($valores[$columna . "____confirm"] != $valores[$columna]) {
                                        return array (
                                            "success" => false,
                                            "mensaje" => "Campos no iguales en '" . (key_exists("formulario", $propiedades) ? (key_exists("nombre", $propiedades["formulario"]) ? $propiedades["formulario"]["nombre"] : $columna) : $columna) . "'"
                                        );
                                    }
                                }
                            }
                            if ($transformador != "") {
                                eval('$valores[$columna]=' . str_replace('$v', '"' . $pordefecto . '"', $transformador) . ';');
                            } else {
                                $valores[$columna] = $pordefecto;
                            }
                        }
                    }
                }
            }
            if ($unico) {
                $entroUnico = true;
                $camposUnico[$columna] = $valores[$columna];
                $this->db->select($columna);
                $entroSql.=($entroSql == "(" ? "" : " OR ") . $columna . "='" . $valores[$columna] . "' ";
            }
            if ($unicoCombinado) {
                $entroUnicoCombinado = true;
                $camposUnicoCombinado[$columna] = $valores[$columna];
                $this->db->select($columna);
                $entroCombinadoSql.=($entroCombinadoSql == "(" ? "" : " AND ") . $columna . "='" . $valores[$columna] . "' ";
            }
        }

        $unicosCombinado = array ();
        if ($entroUnicoCombinado == true) {
            $this->db->where($entroCombinadoSql . ") AND " . $this->__config["llave"] . "!='" . $valores[$this->__config["llave"]] . "' AND " . $this->__config["estado"] . ">=0", null, false);
            $this->db->from($this->__config["tabla"]);
            $unicosCombinado = $this->db->get();
            $unicosCombinado = $unicosCombinado->result_array();
        }
        $unicos = array ();
        if ($entroUnico == true) {
            $this->db->where($entroSql . ") AND " . $this->__config["llave"] . "!='" . $valores[$this->__config["llave"]] . "' AND " . $this->__config["estado"] . ">=0", null, false);
            $this->db->from($this->__config["tabla"]);
            $unicos = $this->db->get();
            $unicos = $unicos->result_array();
        }
        if (count($unicosCombinado) > 0) {
            $camposRep = "";
            foreach ($unicosCombinado as $keyRep => $valueRep) {
                foreach ($camposUnicoCombinado as $keyCam => $valueCam) {
                    if ($valueRep[$keyCam] == $valueCam) {
                        $column = $keyCam;
                        if (key_exists("formulario", $modelo[$keyCam])) {
                            if (key_exists("nombre", $modelo[$keyCam]["formulario"])) {
                                $column = $modelo[$keyCam]["formulario"]["nombre"];
                            }
                        }
                        $camposRep.="<br>" . $column;
                    }
                }
            }
            /* Validacion unicosCombinado */
            return array (
                "success" => false,
                "mensaje" => "Campo unico repetido: " . $camposRep
            );
        } else if (count($unicos) > 0) {
            $camposRep = "";
            foreach ($unicos as $keyRep => $valueRep) {
                foreach ($camposUnico as $keyCam => $valueCam) {
                    if ($valueRep[$keyCam] == $valueCam) {
                        $column = $keyCam;
                        if (key_exists("formulario", $modelo[$keyCam])) {
                            if (key_exists("nombre", $modelo[$keyCam]["formulario"])) {
                                $column = $modelo[$keyCam]["formulario"]["nombre"];
                            }
                        }
                        $camposRep.="<br>" . $column;
                    }
                }
            }
            return array (
                "success" => false,
                "mensaje" => "Campo unico repetido: " . $camposRep
            );
        } else {
            $valores2 = array ();
            if ($valores[$this->__config["llave"]] == 0) {
                foreach ($valores as $keyy => $valuee) {
                    $seguir_val = true;
                    if (strpos($keyy, "____confirm") !== FALSE) {
                        $seguir_val = false;
                    }
                    if ($seguir_val) {
                        $valores2[$keyy] = $valuee;
                    }
                }
                $this->db->insert($this->__config["tabla"], $valores2);
                $valores[$this->__config["llave"]] = $this->db->insert_id();
            } else {
                $this->db->where($this->__config["llave"], $valores[$this->__config["llave"]]);

                foreach ($valores as $keyy => $valuee) {
                    $seguir_val = true;
                    if (strpos($keyy, "____confirm") !== FALSE) {
                        $seguir_val = false;
                    }
                    if ($seguir_val) {
                        $cambia = true;
                        if (key_exists("password", $modelo[$keyy])) {
                            if ($modelo[$keyy]["password"] == true) {
                                $cambia = false;
                            }
                        }
                        if (key_exists("archivo", $modelo[$keyy])) {
                            if ($modelo[$keyy]["archivo"] == true) {
                                $cambia = false;
                            }
                        }
                        if ($valuee != "" || $cambia === true) {
                            $valores2[$keyy] = $valuee;
                        }
                    }
                }
                $this->db->update($this->__config["tabla"], $valores2);
            }
        }
        /* EXIDI TODO ADD THIS TO MAIN EXTIDI REPO */
        $mjs = array();
        foreach ($camposArchivo as $columna => $propiedades) {
            $directorio = "./upload/" . $this->__config["tabla"];
            if (!is_dir($directorio)) {
                mkdir($directorio, 0776, true);
            }

            $this->load->library('upload');

            $config['file_name'] = $columna . "_" . $valores[$this->__config["llave"]] . "_" . date("YmdHis");
            $config['upload_path'] = $directorio;
            $config['allowed_types'] = implode("|", $propiedades["extensionarchivo"]);
            $config['overwrite'] = true;

            $this->upload->initialize($config);

            if (!$this->upload->do_upload($columna)) {
                $mjs[] = $this->upload->display_errors();
            } else {
                $data = $this->upload->data();
                $this->db->where($this->__config["llave"], $valores[$this->__config["llave"]]);
                $this->db->update($this->__config["tabla"], array (
                    $columna => 'index.php/archivo/?f=' . $this->__config["tabla"] . '/' . $data['file_name']
                ));
            }
        }

        if (count($mjs) > 0) {
            $mjs = "Guardado pero con errores en archivo: <br />" . implode(" <br />", $mjs);
        } else {
            $mjs = "Guardado correctamente";
        }
        return array (
            "id" => $valores[$this->__config["llave"]],
            "success" => true,
            "mensaje" => $mjs
        );
    }

    function eliminar($valores) {
        $this->tienePermiso("eliminar");

        $this->db->where_in($this->__config["llave"], $valores);

        $this->db->update($this->__config["tabla"], array (
            $this->__config["estado"] => -1
        ));
        return array (
            "success" => true,
            "mensaje" => "Eliminado correctamente"
        );
    }

    function activar($valores) {
        $this->tienePermiso("activar");

        $this->db->where_in($this->__config["llave"], $valores);

        $this->db->update($this->__config["tabla"], array (
            $this->__config["estado"] => 1
        ));
        return array (
            "success" => true,
            "mensaje" => "Activado correctamente"
        );
    }

    function inactivar($valores) {
        $this->tienePermiso("inactivar");

        $this->db->where_in($this->__config["llave"], $valores);

        $this->db->update($this->__config["tabla"], array (
            $this->__config["estado"] => 0
        ));
        return array (
            "success" => true,
            "mensaje" => "Inactivado correctamente"
        );
    }

    function html($filtro) {
        $campos = $this->getPropiedades();
        echo "<html>";
        echo "<head>";
        echo '<meta content="text/html; charset=utf-8" http-equiv="Content-Type">';
        echo "</head>";
        echo "<table border='1' style='width: 100%'>";
        echo "<tr>";
        foreach ($campos as $key => $value) {
            //echo $value[""];
            $cabecera = $key;
            if (key_exists("grilla", $value)) {
                if (key_exists("cabecera", $value["grilla"])) {
                    $cabecera = $value["grilla"]["cabecera"];
                }
            }
            $mostrar = true;
            if (key_exists("formulario", $value)) {
                if (key_exists("atributosadicionales", $value["formulario"])) {
                    if (key_exists("inputType", $value["formulario"]["atributosadicionales"])) {
                        if ($value["formulario"]["atributosadicionales"]["inputType"] == "password") {
                            $mostrar = false;
                        }
                    }
                }
            }
            if ($mostrar) {
                if (key_exists("grilla", $value)) {
                    if (key_exists("visible", $value["grilla"])) {
                        $mostrar = $value["grilla"]["visible"];
                    }
                }
            }

            if ($mostrar) {
                echo "<td>";
                echo $cabecera;
                echo "</td>";
            }
        }
        echo "</tr>";
        $start = 0;
        $limit = 20;
        $retorno = $this->listadoGrilla($start, $limit, $filtro);
        while (count($retorno["data"]) > 0) {
            $start+=$limit;
            //print_r($retorno["data"]);

            foreach ($retorno["data"] as $keyData => $valueData) {
                echo "<tr>";
                foreach ($campos as $key => $value) {
                    //echo $value[""];
                    $mostrar = true;
                    if (key_exists("formulario", $value)) {
                        if (key_exists("atributosadicionales", $value["formulario"])) {
                            if (key_exists("inputType", $value["formulario"]["atributosadicionales"])) {
                                if ($value["formulario"]["atributosadicionales"]["inputType"] == "password") {
                                    $mostrar = false;
                                }
                            }
                        }
                    }
                    if ($mostrar) {
                        if (key_exists("grilla", $value)) {
                            if (key_exists("visible", $value["grilla"])) {
                                $mostrar = $value["grilla"]["visible"];
                            }
                        }
                    }

                    if ($mostrar) {
                        echo "<td>";
                        if (key_exists("valorparametro", $value) || key_exists("foraneo", $value)) {
                            echo $valueData[$key] == "" ? "&nbsp;" : $valueData[$key . "_valor"];
                        } else if ($value["tipo"] == "enum") {
                            echo $valueData[$key] == "" ? "&nbsp;" : $value["tamano"][$valueData[$key]];
                        } else {
                            echo $valueData[$key] == "" ? "&nbsp;" : $valueData[$key];
                        }
                        echo "</td>";
                    }
                }
                echo "</tr>";
            }
            $retorno = $this->listadoGrilla($start, $limit, $filtro);
        }
        echo "</table>";
        echo "</html>";
    }

    function excel($filtro) {
        $this->tienePermiso("exportarexcel");
        header('Content-type: application/vnd.ms-excel');
        header("Content-Disposition: attachment; filename=exporte.xls");
        header("Pragma: no-cache");
        header("Expires: 0");
        $this->html($filtro);
    }

    function pdf($filtro) {
        $this->tienePermiso("exportarpdf");
        ob_start();
        $this->html($filtro);
        $html = ob_get_contents();
        ob_end_clean();
        $this->load->library("pdf");
        $this->pdf->SetSubject('Reporte Pdf');
        $this->pdf->SetFont('times', '', 10);
        $this->pdf->AddPage();
        $this->pdf->writeHTML($html, true, false, false, false, '');
        $this->pdf->Output('exporte.pdf', 'D');
    }

    function csv($filtro) {
        $this->tienePermiso("exportarcsv");
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=exporte.csv');
        $fp = fopen('php://output', 'w');

        $campos = $this->getPropiedades();
        $fila = array ();
        foreach ($campos as $key => $value) {
            //echo $value[""];
            $cabecera = $key;
            $mostrar = true;
            if (key_exists("formulario", $value)) {
                if (key_exists("atributosadicionales", $value["formulario"])) {
                    if (key_exists("inputType", $value["formulario"]["atributosadicionales"])) {
                        if ($value["formulario"]["atributosadicionales"]["inputType"] == "password") {
                            $mostrar = false;
                        }
                    }
                }
            }

            if ($mostrar) {
                array_push($fila, $cabecera);
            }
        }
        fputcsv($fp, $fila, ";");

        $start = 0;
        $limit = 20;
        $retorno = $this->listadoGrilla($start, $limit, $filtro);
        while (count($retorno["data"]) > 0) {
            $start+=$limit;
            //print_r($retorno["data"]);

            foreach ($retorno["data"] as $keyData => $valueData) {

                $fila = array ();
                foreach ($campos as $key => $value) {
                    //echo $value[""];
                    $mostrar = true;
                    if (key_exists("formulario", $value)) {
                        if (key_exists("atributosadicionales", $value["formulario"])) {
                            if (key_exists("inputType", $value["formulario"]["atributosadicionales"])) {
                                if ($value["formulario"]["atributosadicionales"]["inputType"] == "password") {
                                    $mostrar = false;
                                }
                            }
                        }
                    }

                    if ($mostrar) {

                        if (key_exists("valorparametro", $value) || key_exists("foraneo", $value)) {
                            array_push($fila, $valueData[$key] == "" ? "" : $valueData[$key . "_valor"]);
                        } else if ($value["tipo"] == "enum") {
                            array_push($fila, $valueData[$key] == "" ? "" : $value["tamano"][$valueData[$key]]);
                        } else {
                            array_push($fila, $valueData[$key] == "" ? "" : $valueData[$key]);
                        }
                    }
                }
                fputcsv($fp, $fila, ";");
            }
            $retorno = $this->listadoGrilla($start, $limit, $filtro);
        }

        //$this->html($filtro);
    }

    function imprimir($filtro) {
        $this->tienePermiso("imprimir");
        $this->html($filtro);
    }

    function plantilla() {
        $this->tienePermiso("importar");
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=exporte.csv');
        $fp = fopen('php://output', 'w');

        $campos = $this->getPropiedades();
        $fila = array ();
        foreach ($campos as $key => $value) {
            //echo $value[""];
            $cabecera = $key;
            $mostrar = true;
            if (key_exists("importar", $value)) {
                if ($value["importar"] == false) {
                    $mostrar = false;
                }
            } else {
                if (key_exists("formulario", $value)) {
                    if (key_exists("atributosadicionales", $value["formulario"])) {
                        if (key_exists("inputType", $value["formulario"]["atributosadicionales"])) {
                            if ($value["formulario"]["atributosadicionales"]["inputType"] == "password") {
                                $mostrar = false;
                            }
                        }
                    }
                }
                if ($this->__config["estado"] == $key) {
                    $mostrar = false;
                }
                if ($this->__config["llave"] == $key) {
                    $mostrar = false;
                }
            }

            if ($mostrar) {
                array_push($fila, $cabecera);
            }
        }
        fputcsv($fp, $fila, ";");
    }

    function instalador() {
        if ($this->__config["ruta"] != '') {
            $this->db->select("count(*) as cantidad", false);
            $this->db->from("extidi_modulos as m", false);
            $this->db->where("m.Controlador", $this->__config["ruta"]);
            $retorno = $this->db->get();
            $retorno = $retorno->result_array();
            if ($retorno[0]["cantidad"] == 0) {
                $this->db->query(
                        "
					INSERT INTO `extidi_modulos` (
						`id`,
						`estado`,
						`NombreModulo`,
						`DescripcionModulo`,
						`TipoModulo`,
						`IdModuloPadre`,
						`Orden`,
						`Controlador`,
						`AccesoDirecto`,
						`Ancestros`,
						`InicioRapido`,
						`Ayuda`
					)
					VALUES (
						0,
						1,
						'" . $this->__config["ruta"] . "',
						'',
						'TabCrud',
						0,
						0,
						'" . $this->__config["ruta"] . "',
						0,
						'',
						0,
						''
					);
					", false
                );
                $idSuperior = $this->db->insert_id();
                foreach ($this->__config["permisos"] as $value) {

                    $this->db->query(
                            "
						INSERT INTO `extidi_acciones` (
							`IdAccion`,
							`IdEstadoAccion_EAP`,
							`NombreAccion`,
							`IdModulo`,
							`Ver`,
							`DescripcionAccion`
						)
						VALUES (
							0,
							1,
							'" . $value . "',
							'" . $idSuperior . "',
							1,
							'" . $value . "'
						);
						", false
                    );
                    $idAccion = $this->db->insert_id();
                    $this->db->query(
                            "
						INSERT INTO `extidi_permisos` (
							`IdGrupoUsuario`,
							`IdAccion`
						)
						VALUES (
							1,
							'" . $idAccion . "'
						);
						", false
                    );
                }
            }
        }
    }

}
