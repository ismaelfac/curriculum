<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

    Class Parametro extends EXTIDI_Model{
    	
		var $id = 0;
		var $NombreParametro = NULL;
		var $NombreCampo = NULL;
		var $estado_EAP= 0;
		
		
    	
		function __construct(){
			
			
			
			$this->_tabla= "extidi_parametro";
			$this->_llave= "id";
			$this->_estado= "estado_EAP";
			parent::__construct();
			
			
			
		}
		
		
		
	}