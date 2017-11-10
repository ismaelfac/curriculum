<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * EXTIDI_Composer
 *
 * Esta clase solo carga el autoload.php de de Composer.
 *
 * @author Jeison Berdugo
 */
class EXTIDI_Composer
{
    function __construct() 
    {
        include("./vendor/autoload.php");
    }
}