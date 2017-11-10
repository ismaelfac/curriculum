<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

    function index() {

    }

    function horaSistema() {
		echo json_encode(array(
            "ano" => gmdate("Y", time() + 3600*(-5)),
            "mes" => gmdate("m", time() + 3600*(-5))-1,
            "dia" => gmdate("d", time() + 3600*(-5)),
            "hora" => gmdate("H", time() + 3600*(-5)),
            "minuto" => gmdate("i", time() + 3600*(-5)),
            "segundo" => gmdate("s", time() + 3600*(-5))
        ));
    }

    function logout() {
		$this->session->sess_destroy();
        echo json_encode(array(
            'success' => true
        ));
    }

    function cambiarContrasena() {
        $this->load->model("extidi/usuario");
        $user = $this->session->userdata("usuario"); //["user_data"];

        $datos = json_decode($this->input->post("datos"), true);
        //print_r($user);
        $data = array(
            "id" => $user["id"],
            "Password" => md5($datos["PasswordAntiguo"]),
            "estado" => 1
        );

        $valido = $this->usuario->validar($data);

        if ($valido) {
            if ($datos["PasswordAntiguo"] == $datos["PasswordNueva"]) {
                echo json_encode(array(
                    'success' => false,
                    'mensaje' => 'Contrase&ntilde;a nueva no puede ser la misma'
                ));
            } elseif ($datos["PasswordNueva"] != $datos["PasswordNueva2"]) {
                echo json_encode(array(
                    'success' => false,
                    'mensaje' => 'Las contrase&ntilde;as no coinciden'
                ));
            } else {

                $this->usuario->cargar($user["id"]);
                $this->usuario->Password = md5($datos["PasswordNueva"]);
                $this->usuario->guardar();
                echo json_encode(array(
                    'success' => true,
                    'mensaje' => 'Contrase&ntilde;a cambiada correctamente'
                ));
            }
        } else {
            echo json_encode(array(
                'success' => false,
                'mensaje' => 'Contrase&ntilde;a antigua no es valida'
            ));
        }
    }

    function validarUsuario() {
        $this->load->model("extidi/usuario");
		$this->config->load("ldap");
		$usuario    = $this->input->post("usuario");
		$contrasena = $this->input->post("contrasena");
		$ldap       = false;
		$data = array(
			"Usuario"  => $usuario,
			"Password" => md5($contrasena),
			"estado"   => 1
		);
		$valido = $this->usuario->validar($data);
		if($valido === false) {
			if($this->config->item('ldap_activo') === true) {
				$this->load->library('ldap');
				$ldap = $this->ldap->login($usuario, $contrasena);
			}
			if($ldap !== false) {
				$result=$this->db->query(
                   "SELECT count(*) as cantidad
					  FROM extidi_usuarios
				 	 WHERE Usuario = '$usuario'
                       AND estado = 1", false);
				$result=$result->result_array();
				if($result[0]["cantidad"]==0) {
					$this->db->query(
                   "INSERT INTO `extidi_usuarios` (
						`id`,
						`PrimerNombre`,
						`SegundoNombre`,
						`PrimerApellido`,
						`SegundoApellido`,
						`Usuario`,
						`Email`,
						`Password`,
						`estado`,
						`FechaHoraDeRegistro`,
						`IdGruposUsuario`
					) VALUES (
						0,
						'".$ldap["nombre"]."',
						'',
						'".$ldap["apellido"]."',
						'',
						'$usuario',
						'".$ldap["correo"]."',
						'',
						1,
						now(),
						'5'
					);
					", false);
				}
				$valido = true;
			}
		}

		if ($valido) {
			$data = array(
				"Usuario" => $usuario,
				"estado" => 1
			);
			$usuario = $this->usuario->buscar($data, false);
			unset($usuario["Password"]);


            $this->load->model("extidi/grupousuario");
            $data = array(
                "id" => $usuario["IdGruposUsuario"],
                "estado" => 1
            );

            $gu = $this->grupousuario->buscar($data, false);
            $usuario["tipo"]=$gu["NombreGrupo"];


            if($gu["AccedeEscritorio"] == 1){
                $usuario["AccedeEscritorio"] = 1; //Esta propiedad se verifica en Extidi/init.js
                $this->session->set_userdata(array(
                    "usuario" => $usuario,
                    "logged_in" => true
                ));
            } else

            {


                echo json_encode(array(
                        'success' => true,
                        'datos' => array(
                            'conectado' => false,
                            'mensaje' => 'Usted no puede entrar al sistema.'
                                )
                            ));
                            die();

            }

			echo json_encode(array(
				'success' => true,
				'datos' => array(
					'conectado' => true,
					'session_id'=> $this->session->userdata('session_id')
				)
			));
		} else {
			echo json_encode(array(
				'success' => true,
				'datos' => array(
					'conectado' => false,
					'mensaje' => 'Usuario y/o contrase&ntilde;a invalido.'
				)
			));
		}
    }

    function estaConectado() {
        $user = $this->session->userdata("usuario"); //["user_data"];
		echo json_encode(array(
            'success' => true,
            'conectado' => is_array($user),
            'usuario'=>$user
        ));
    }

    function usuarioConectado() {
        //print_r($this->session);
        $user = $this->session->userdata("usuario"); //["user_data"];
        //var_dump($user);
        if (is_array($user)) {
            $nombre = array(
                $user["PrimerNombre"],
                $user["SegundoNombre"],
                $user["PrimerApellido"],
                $user["SegundoApellido"]
            );

            echo json_encode(array(
                'success' => true,
                'usuario' => implode(" ", $nombre),
                'datos' => json_encode($user)
            ));
        } else {

            echo json_encode(array(
                'success' => true,
                'usuario' => "",
                'datos' => ''
            ));
        }
    }

	function datosUsuario(){
        $user = $this->session->userdata("usuario");
		if (is_array($user)) {
			$this->load->model("extidi_usuarios");
			$this->extidi_usuarios->__config["verificar_permisos"]=false;
			$datos=$this->extidi_usuarios->cargar(" id= '".$user["id"]."' ");
            echo json_encode(array(
                'success' => true,
                'data' => $datos[0]
            ));
        } else {
            echo json_encode(array(
                'success' => true,
                'data' => array()
            ));
        }
	}
	function cambiarDatos(){
        $user = $this->session->userdata("usuario");
		$this->load->model("extidi_usuarios");
		$this->extidi_usuarios->__config["verificar_permisos"] = false;
		$valores = json_decode($this->input->post("valores"), true);

        $datos   = $this->extidi_usuarios->cargar(" id= '".$user["id"]."' ");
        $regex   = '/(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d){6,20}.+$)/';

        if(strlen($valores['Password']) > 5) {
            $datos[0]["Password"] = $valores["Password"];
            $retorno = $this->extidi_usuarios->guardar($datos[0]);
            echo json_encode($retorno);
        } else {
            echo json_encode(array(
                'success' => false,
                'mensaje' => 'La contraseña debe tener minimo 6 caracteres, una mayuscula, una minuscula y un numero.'
            ));
        }
	}
}

?>
