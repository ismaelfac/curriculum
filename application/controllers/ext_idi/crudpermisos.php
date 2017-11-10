<?php

date_default_timezone_set('America/Bogota');
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CrudPermisos extends EXTIDI_Controller {

    public function index() {
        
    }

    public function cargarPermisos(){
        $this->load->library('acl');
        $modulo=$this->input->post('modulo');
        $permisos=$this->acl->permisosModulo($modulo);
        $this->respuesta(true, $permisos, "datos");
    }
    

    public function listado() {
        $this->load->model("extidi/permisos");       
        $nv = array();

        $sqlPermisos = "SELECT * FROM extidi_permisos";
        $sqlGruposUsuarios = "
                    SELECT 
                        extidi_gruposusuarios.id as IdGrupoUsuario, 
                        extidi_gruposusuarios.NombreGrupo                        
                    FROM 
                        extidi_gruposusuarios
                    WHERE 
                        extidi_gruposusuarios.estado = 1 
                    ";

        $sqlModuloAc = "
                    SELECT
                        extidi_modulos.id, 
                        extidi_modulos.NombreModulo, 
                        extidi_acciones.IdAccion, 
                        extidi_acciones.NombreAccion,
                        extidi_modulos.DescripcionModulo
                    FROM 
                        extidi_modulos
                    INNER JOIN 
                        extidi_acciones
                    ON 
                        extidi_acciones.IdModulo = extidi_modulos.id
                    WHERE 
                        extidi_modulos.estado = 1 
                    AND 
                        extidi_acciones.IdEstadoAccion_EAP = 1 
                    ";

        /* Codigo para la busqueda con el filtro */
        $busqueda = $this->input->post("search");
        
        $busqueda = ($busqueda!="")?json_decode($busqueda, true):array();
        $idGrupoUsarioBusqueda = trim(key_exists("NombreGrupo", $busqueda)?$busqueda['NombreGrupo']:"");
        $idModuloBusqueda = trim(key_exists("NombreModulo", $busqueda)?$busqueda['NombreModulo']:"");
        $idAccionBusqueda = trim(key_exists("NombreAccion", $busqueda)?$busqueda['NombreAccion']:"");

        if (isset($busqueda)) {

            $sqlGrupos = " AND extidi_gruposusuarios.id LIKE '$idGrupoUsarioBusqueda%' ";
            $sqlGruposUsuarios = $sqlGruposUsuarios . $sqlGrupos;
            $sqlModulo = " AND extidi_modulos.NombreModulo LIKE '%$idModuloBusqueda%' ";
            $sqlModuloAc = $sqlModuloAc . $sqlModulo;
            $sqlAccion = " AND extidi_acciones.NombreAccion LIKE '$idAccionBusqueda%' ";
            $sqlModuloAc = $sqlModuloAc . $sqlAccion;
        }
        /* Fin codigo para la busqueda */
        $sqlModuloAc = $this->db->query($sqlModuloAc);
        $sqlGruposUsuarios = $this->db->query($sqlGruposUsuarios);
        $sqlPermisos = $this->db->query($sqlPermisos);


        $usuario = $this->session->userdata("usuario");
        $idGruposUsuario= $usuario["IdGruposUsuario"]; 

        $this->permi = $sqlPermisos->result_array();

        $i = 0;      
        foreach ($sqlGruposUsuarios->result_array() as $grup) {                    
            foreach ($sqlModuloAc->result_array() as $moduloAc) {
             
                    if($idGruposUsuario==1 || (!strpos($moduloAc['DescripcionModulo'], 'Extidi') && $grup['IdGrupoUsuario'] != 1)){

                        $nv [$i] = array("IdGrupo" => $grup['IdGrupoUsuario'],
                            "NombreGrupo" => $grup['NombreGrupo'],
                            "IdModulo" => $moduloAc['id'],
                            "NombreModulo" => $moduloAc['NombreModulo'],
                            "IdAccion" => $moduloAc['IdAccion'],
                            "NombreAccion" => $moduloAc['NombreAccion'],
                            "Permiso" => $this->traerPermiso($grup['IdGrupoUsuario'], $moduloAc['IdAccion'])
                            );
                        $i++;                        
                    }                
            }
               
        }

        $this->respuesta(true, $nv, "data");
    }

    function traerPermiso($idGrupo, $idAccion) {
        foreach ($this->permi as $per) {
            if (($per['IdGrupoUsuario'] == $idGrupo) && ($per['IdAccion']) == $idAccion) {
                return 0;
            }
        }
        return 1;
    }

    public function eliminarPermisos() {
        $this->load->model("extidi/permisos");

        $idGrupo = $this->input->post("IdGrupo");
        $idAccion = $this->input->post("IdAccion");
        $idModulo = $this->input->post("IdModulo");

        $data = array("IdGrupoUsuario" => $idGrupo, "IdAccion" => $idAccion);

        $this->db->delete("extidi_permisos", $data);

        $this->respuesta(true, "Permiso Eliminado Exitosamente", "mensaje");
    }

    public function guardarPermiso() {
        $this->load->model("extidi/permisos");

        $idGrupo = $this->input->post("IdGrupo");
        $idAccion = $this->input->post("IdAccion");
        $idModulo = $this->input->post("IdModulo");

        $data = array("IdGrupoUsuario" => $idGrupo, "IdAccion" => $idAccion);

        $this->db->insert("extidi_permisos", $data);

        $this->respuesta(true, "Permiso agregado Exitosamente", "mensaje");
    }

    public function cargarGrupoUsuario() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;

        $this->load->model("extidi/grupousuario");

        $usuario = $this->session->userdata("usuario");
        $idGruposUsuario= $usuario["IdGruposUsuario"];   
      
        if($idGruposUsuario!=1){           
            $this->db->where("extidi_gruposusuarios.id !=", 1);                
        }

        $data = array("extidi_gruposusuarios.estado >=" => 0);

        $grupUsuario = $this->grupousuario->listarGrupoPadre($data);
        array_push($grupUsuario, array("NombreGrupo" => '-'));
        $this->respuesta(true, $grupUsuario, "data", false, $start, $limit);
    }

    public function cargarAcciones() {
        $start = isset($_POST['start']) ? $_POST['start'] : 0;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 20;

        $this->load->model("extidi/acciones");
        $data = array("extidi_acciones.IdEstadoAccion_EAP >=" => 0);
        $acciones = $this->acciones->listadoAcciones($data);
        array_push($acciones, array("NombreAccion" => '-'));
        $this->respuesta(true, $acciones, "data", false, $start, $limit);
    }

    public function cargarModulos() {
        $this->load->model("extidi/modulo");
        $data = array("extidi_modulos.estado >=" => 0);
        $modulos = $this->modulo->listarModuloPadre($data);
        array_push($modulos, array("NombreModulo" => '-'));
        $this->respuesta(true, $modulos, "data");
    }

}