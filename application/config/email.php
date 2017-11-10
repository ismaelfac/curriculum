<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
$config['email_habilitado'] = false;
$config['email_from'] = "EMAIL_FROM"//
$config['email_from_name'] = "Fundacion I+D+I";
$config['email_config'] = array(
	"useragent"=>"Extidi",
	"protocol"=>"smtp", //mail, sendmail, or smtp
	"mailpath"=>"/usr/sbin/sendmail",
	"smtp_host"=>"SMTP_HOST",//
	"smtp_user"=>"SMTP_USER",//
	"smtp_pass"=>"SMTP_ASS",//
	"smtp_port"=>25,
	"smtp_timeout"=>5,
	"wordwrap"=>true,
	"wrapchars"=>76,
	"mailtype"=>"html", //text, html
	"charset"=>"utf-8", //utf-8, iso-8859-1
	"validate"=>false, 
	"priority"=>3, //1,2,3,4,5  1 = highest. 5 = lowest. 3 = normal
	"crlf"=>"\n", //  "\r\n" or "\n" or "\r"
	"newline"=>"\n", //  "\r\n" or "\n" or "\r"
	"bcc_batch_mode"=>false,
	"bcc_batch_size"=>200
);