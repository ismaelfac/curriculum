<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Acl {
    /*
     * 
     * IMPORTATE: Cada modulo tiene un IdModulo distinto en diferentes implementaciones de EXTIDI,
     * es decir que cada ves que se reutilice un modulo desarrollado bajo EXTIDI puede que su IdModulo
     * sea diferente, para esto se manejara una variable IdModulo dentro del desarrollo del modulo, que se
     * colocara el valor correspondiente luego de agregarla en la tabla extidi_modulos
     * 
     * */

    var $CI;

    public function __construct() {
        log_message('debug', "Clase de ACL inicializada");
        $this->CI = & get_instance();
    }

    public function idTipoUsuario() {
        $usuario = $this->CI->session->userdata('usuario');
        return $usuario['IdGruposUsuario'];
    }

    /*
     * 
     * Esta funcion retorna los modulos hijos que tiene permisos para 
     * ver a partir de un modulo padre predeterminado
     * si no pasa un idModuloPapa es porque quiero obtener 
     * los modulos del menu principal.
     * 
     */

    public function modulosHijos($idModuloPapa = 0) {

        $consulta = $this->CI->db->query("
                SELECT 
                *
                FROM extidi_modulos AS m, 
                        extidi_acciones AS a, 
                        extidi_permisos AS p
                WHERE m.IdModuloPadre = '" . $idModuloPapa . "' 
                        AND m.id = a.IdModulo
                        AND a.Ver=1 
                        AND a.IdAccion = p.IdAccion 
                        AND p.IdGrupoUsuario = " . $this->idTipoUsuario() . "
                        AND m.estado = 1
                        AND a.IdEstadoAccion_EAP = 1");

        return $consulta->result_array();
    }

    /*
     * 
     * A partir de un modulo retornar los permisos que 
     * tiene el actual tipo de usuario
     * logueado sobre este modulo
     * 
     */

    public function permisosModulo($idModulo) {

        $consulta = $this->CI->db->query("SELECT a.*
										FROM extidi_modulos AS m, 
										extidi_acciones AS a, 
										extidi_permisos AS p
										WHERE m.id = '" . $idModulo . "'
										AND m.id = a.IdModulo 
										AND a.IdAccion = p.IdAccion 
										AND p.IdGrupoUsuario = " . $this->idTipoUsuario() . "
										AND m.estado = 1
										AND a.IdEstadoAccion_EAP = 1");

        return $consulta->result_array();
    }

    public function puedeVer($idModulo) {

        $consulta = $this->CI->db->query("SELECT *
                            FROM extidi_modulos AS m, 
                            extidi_acciones AS a, 
                            extidi_permisos AS p
                            WHERE m.id = 1
                            AND m.id = a.IdModulo 
                            AND a.Ver=1 
                            AND a.IdAccion = p.IdAccion 
                            AND p.IdGrupoUsuario = 1
                            AND m.estado = 1
                            AND a.IdEstadoAccion_EAP = 1");

        if ($consulta->num_rows() === 0) {
            return false;
        } else {
            return true;
        }
    }

    public function tienePermiso($accion, $modulo) {

        $consulta = $this->CI->db->query("
                                    SELECT 
                                        *
                                    FROM  
                                        extidi_acciones AS a, 
                                        extidi_permisos AS p
                                    WHERE  
                                        a.NombreAccion='" . $accion . "'
                                    AND 
                                        a.IdAccion = p.IdAccion 
                                    AND 
                                        p.IdGrupoUsuario = " . $this->idTipoUsuario() . "
                                    AND 
                                        a.IdEstadoAccion_EAP = 1
                                    AND 
                                        a.IdModulo in(
                                            SELECT id from extidi_modulos WHERE Controlador='".$modulo."'
                                        )
                                ");
        if ($consulta->num_rows() === 0) {
            return false;
        } else {
            return true;
        }
    }

}

//fin archivo /application/libraries/acl.php