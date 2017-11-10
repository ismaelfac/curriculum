<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class ldap {

    public function __construct() {
        $this->ci = & get_instance();
        $this->ci->load->config('ldap');

        /*if (!function_exists('ldap_connect')) {
            show_error('LDAP no esta habilitado en el servidor.');
        }*/
    }

    function login($username, $password) {
		if (!function_exists('ldap_connect')) {
			return false;
		}
        if(($user_info = $this->_autenticar($username, $password))!==false){
            //echo("Successful login: " . $user_info['cn'] . "(" . $username . ") from " . $this->ci->input->ip_address());
/*
            $customdata = array('username' => $username,
                'cn' => $user_info['cn'],
                'logged_in' => TRUE);
            return TRUE;*/
            return $user_info;
        }else{
            return false;
        }
    }

    private function _autenticar($username, $password) {
        if($this->ci->config->item('ldap_activo')===false){
            return false;
		}
        $hosts = $this->ci->config->item('ldap_hosts');
        $puertos = $this->ci->config->item('ldap_puertos');
        if (count($puertos) != count($hosts)) {
            //show_error('Error, verifique la configuracion de los hosts y puertos.');
            //exit();
			return false;
        }
        foreach ($hosts as $k => $host) {
            $this->ldapconn = ldap_connect($host, $puertos[$k]);
            if ($this->ldapconn) {
                break;
            }
        }
        if (!$this->ldapconn) {
            //show_error('Error connecting to your LDAP server(s).  Please check the connection and try again.');
            //exit();
			return false;
        }

        ldap_set_option($this->ldapconn, LDAP_OPT_REFERRALS, 0);
        ldap_set_option($this->ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($this->ldapconn, LDAP_OPT_NETWORK_TIMEOUT, 5);
        if (preg_match('/^(\w+\.)+\w{2,4}$/', $this->ci->config->item('ldap_dominio'))) {
            $binddn = $username . '@' . $this->ci->config->item('ldap_dominio');
        } else {
            $binddn = $this->ci->config->item('ldap_dominio') . '\\' . $username;
        }
        $bind = @ldap_bind($this->ldapconn, $binddn, $password);
        if (!$bind) {
            return false;
        } else {
            $filter = "(samaccountname=$username)";
            $id=array();
            for($i=0;$i<count($this->ci->config->item('ldap_basedn'));$i++){
                $id[]=$this->ldapconn;
            }
            $search = ldap_search($id, $this->ci->config->item('ldap_basedn'), $filter);
            $entro=false;
            for($i=0;$i<count($search);$i++){
                $entries = ldap_get_entries($this->ldapconn, $search[$i]);
                if($entries['count']!=0){
                    $entro=true;
                    break;
                }
            }
            if ($entro===false) {
                return false;
            }
            $grupo= explode(",",(key_exists("dn", $entries[0])?$entries[0]["dn"]:""));
            foreach (array_reverse($grupo) as $value) {
                $parte=explode("=", $value);
                if($parte[0]=="OU" && $parte[1]!="USUARIOS"){
                    $grupo=$parte[1];
                    break;
                }
            }
            $retorno=array(
                "programa"=>(key_exists("department", $entries[0])?$entries[0]["department"][0]:""),
                "cedula"=>(key_exists("description", $entries[0])?$entries[0]["description"][0]:""),
                "nombre"=>(key_exists("givenname", $entries[0])?$entries[0]["givenname"][0]:""),
                "apellido"=>(key_exists("sn", $entries[0])?$entries[0]["sn"][0]:""),
                "dn"=>$grupo,
				"correo"=>$username."@".$this->ci->config->item('ldap_dominio')
            );
            return $retorno;
        }
    }

}

//fin archivo /application/libraries/ldap.php