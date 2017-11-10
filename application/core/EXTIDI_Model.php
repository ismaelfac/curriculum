<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class EXTIDI_Model extends CI_Model {

    var $_tabla = '';
    var $_llave = '';
    var $_estado = '';
    var $_arrayParametros = array();
    var $_ap = array();
    var $_arrayJoinsTablaRelacion = array();
    var $_arrayJoinsCampoRelacion = array();
    var $_arrayJoinsCampoMostrar = array();

    function __construct() {
        parent::__construct();
        foreach ($this->_arrayParametros as $k => $v) {
            $consulta = $this->db->get_where("extidi_parametro", array("NombreCampo" => $v));
            $fila = $consulta->row();
            $this->_ap[$v] = $fila->IdParametro;
        }
    }
/*
    $datosNuevo=array(
        'primernombre'=>'richard',
        'primerapellido'=>'sarmiento'
        .
        .
        .
    )
    
    $this->usuario->cargar(2);
    $this->usuario->bind($datosNuevo);
    $this->usuario->guardar();
    */
    function bind($fuente, $ignorar = array()) {

        $esArray = is_array($fuente);
        $esObject = is_object($fuente);

        if (!$esArray && !$esObject) {
            return false;
        }
        if (!is_array($ignorar)) {
            $ignorar = explode(' ', $ignorar);
        }
        foreach ($this->getPropiedades() as $k => $v) {

            if ((!in_array($k, $ignorar))) {
                if ($esArray && isset($fuente[$k])) {
                    $this->{$k} = $fuente[$k];
                } else if ($esObject && isset($fuente->{$k})) {
                    $this->{$k} = $fuente->{$k};
                }
            }
        }
        //A probar.
        /* $nllave = $$this->_llave;
          if ($this->{$nllave} !=0){
          $this->cargar($this->{$nllave});
          } */

        return true;
    }

    function getPropiedades($public = true) {
        $vars = get_object_vars($this);

        if ($public) {
            foreach ($vars as $key => $value) {
                if ('_' == substr($key, 0, 1)) {
                    unset($vars[$key]);
                }
            }
        }

        return $vars;
    }

    function guardar() {

        $l = $this->_llave;
        if($this->{$l}===""){
            $this->{$l}=0;
        }
        if ($this->{$l} == 0) {
            $this->db->insert($this->_tabla, $this->toArray());
            $this->{$l} = $this->db->insert_id();
        } else {
            $this->db->where($this->_llave, $this->{$l});
            $this->db->update($this->_tabla, $this->toArray());
        }
    }

    function toArray() {
        $arreglo = array();

        foreach ($this->getPropiedades() as $k => $v) {

            $arreglo[$k] = $v;
        }

        return $arreglo;
    }

    function cargar($id = null) {

        if ($id == null) {
            return false;
        }

        $l = $this->_llave;
        $d = $this->{$l};

        $r = $this->db->get_where($this->_tabla, array($this->_llave => $id), 1);

        $arr = $r->row_array();

        $this->bind($arr);
    }

    function eliminar() {

        $l = $this->_llave;
        $id = $this->{$l};

        $e = $this->_estado;
        $estado = -1;

        $this->db->update($this->_tabla, array($e => $estado), array($l => $id));

        //Quitar Comentario Si desea que la aplicacion elimine de raiz los registros
        //$this->db->delete($this->_tabla,array($l=>$id));	
        $this->vaciar();
    }

    function vaciar() {

        foreach ($this->getPropiedades() as $k => $v) {
            $this->{$k} = NULL;
        }
    }

    function activar() {

        $l = $this->_llave;
        $id = $this->{$l};

        $e = $this->_estado;
        $estado = 1;

        $this->db->update($this->_tabla, array($e => $estado), array($l => $id));
    }

    function inactivar() {

        $l = $this->_llave;
        $id = $this->{$l};

        $e = $this->_estado;
        $estado = 0;

        $this->db->update($this->_tabla, array($e => $estado), array($l => $id));
    }

    function estado() {

        $e = $this->_estado;
        return $this->{$e};
    }

    function buscar($where, $cargar = true) {
        $this->db->where($where);
        $rs = $this->db->get($this->_tabla);

        if ($rs->num_rows === 0) {

            return false;
        } else {

            if (!$cargar) {
                return $rs->row_array();
            } else {
                $this->bind($rs->row_array());
                return true;
            }
        }
    }

    //Cuando estado es false no tener en cuenta los estados de los registros
    function listar($where = "", $orderby = "", $estado = false) {

        foreach ($this->getPropiedades() as $k => $v) {
            $this->db->select('prin.' . $k);
        }


        //SELECT DE JOINS			
        foreach ($this->_arrayJoinsCampoMostrar as $k => $v) {
            $c = explode(',', $v);
            foreach ($c as $llave => $valor) {
                $e = explode("+", $valor);
                $cad = "CONCAT(";
                $cad2 = "";
                foreach ($e as $key => $value) {
                    $cad .= " IFNULL(".$this->_arrayJoinsTablaRelacion[$k] ."_".$k. '.' . $value . ", '') ";
                    if ($key < count($e) - 1) {
                    $espacio = " ";
                    $cad .= ", SPACE(1) ,";
                    }
                    $cad2 .=$this->_arrayJoinsTablaRelacion[$k]."_".$k. '_'.$value;
                }
                $cad .= ")";
                $this->db->select($cad . " AS " . $cad2, false);
                //$this->db->select($this->_arrayJoinsTablaRelacion[$k].'.'.$v);
            }
        }

        $cont = 0;
        foreach ($this->_ap as $k => $v) {
            $this->db->select('v' . $cont . '.ValorParametro AS ' . $k . "_Valor");
            $cont++;
        }


        
        //JOIN CON PARAMETROS
        $cont = 0;
        foreach ($this->_ap as $k => $v) {
            $this->db->join('extidi_valorparametro AS v' . $cont, 'v' . $cont . '.IdValorParametro = prin.' . $k);
            $cont++;
        }


        //JOIN CON OTRAS TABLAS
        foreach ($this->_arrayJoinsTablaRelacion as $k => $v) {
            $this->db->join($v ." as ".$v."_".$k, $v."_".$k . '.' . $this->_arrayJoinsCampoRelacion[$k] . ' = prin.' . $k, "left");
            $cont++;
        }

        if ($where != "") {
            $this->db->where($where);
        }
        if($this->_estado !=''){
            $this->db->where("prin.$this->_estado != -1");

            if ($estado === true) {
                $this->db->where("prin.$this->_estado = 1");
            }
        }
        if ($orderby != "") {
            $this->db->order_by($orderby);
        }

        $this->db->from($this->_tabla . ' AS prin');
        $rs = $this->db->get();
        if ($rs->num_rows === 0) {
            return false;
        } else {

            //Recorro array
            $res = $rs->result_array();

            foreach ($res as $k => $v) {
                foreach ($v as $prop => $val) {
                    if ($prop == $this->_estado) {
                        switch ($res[$k][$prop]) {
                            case 1:
                                $res[$k][$prop . "_Valor"] = "Activo";
                                break;
                            case 0:
                                $res[$k][$prop . "_Valor"] = "Inactivo";
                                break;
                            case -1:
                                $res[$k][$prop . "_Valor"] = "Eliminado";
                                break;
                        }
                    }
                }
            }
            return $res;
        }
    }

    function validar($where) {
        $this->db->where($where);
        $rs = $this->db->get($this->_tabla);
        return $rs->num_rows === 1;
    }

}