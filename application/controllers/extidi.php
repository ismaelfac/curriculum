<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Extidi extends CI_Controller {

	public function index()
	{
		//print_r(array("config"=>$this->config));
		$parametro=array(
			"url"=>base_url(),
			"extidi"=>array(
				"titulo"=>$this->config->item('extidi_titulo'),
				"debug"=>$this->config->item('extidi_debug'),
				"css"=>$this->config->item('extidi_css'),
				"theme"=>$this->config->item('extidi_theme'),
				"logo"=>$this->config->item('extidi_logo'),
				"wallpaper"=>$this->config->item('extidi_wallpaper'),
				"colorFondo"=>$this->config->item('extidi_colorFondo'),
				"widgets"=>$this->config->item('extidi_widgets'),
				"accesos"=>$this->config->item('extidi_accesos'),
				"calendario"=>$this->config->item('extidi_calendario')
			)
		);
		$this->load->view('extidi', $parametro);
	}
	
}