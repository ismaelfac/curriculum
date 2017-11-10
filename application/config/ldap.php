<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
$config['ldap_activo'] = false;
/*
$config['ldap_hosts'] = array('telurio.cuc.edu.co');
$config['ldap_puertos'] = array(389);
$config['ldap_basedn'] = array(
    //'OU=ESTUDIANTES,OU=USUARIOS,DC=cuc,DC=edu,DC=co',
    'OU=PROFESORES,OU=USUARIOS,DC=cuc,DC=edu,DC=co',
    'OU=ADMINISTRATIVOS,OU=USUARIOS,DC=cuc,DC=edu,DC=co'
);
$config['ldap_dominio'] = 'cuc.edu.co';
$config['ldap_usuario_admin'] = 'USUARIOS/ADMINISTRATIVOS/BASICOS/PROVEEDORES/autldap';
$config['ldap_password_admin'] = 'AutLdapCuc';
*/
$config['ldap_hosts'] = array('192.168.1.91');
$config['ldap_puertos'] = array(389);
$config['ldap_basedn'] = array(
    //'OU=ESTUDIANTES,OU=USUARIOS,DC=fundacionidi,DC=org',
    'OU=PROFESORES,OU=USUARIOS,DC=fundacionidi,DC=org',
    'OU=ADMINISTRATIVOS,OU=USUARIOS,DC=fundacionidi,DC=org'
);
$config['ldap_dominio'] = 'fundacionidi.org';
$config['ldap_usuario_admin'] = 'USUARIOS/ADMINISTRATIVOS/BASICOS/PROVEEDORES/autldap';
$config['ldap_password_admin'] = 'AutLdapCuc';
