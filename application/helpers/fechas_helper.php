<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
if (!function_exists('now')) {

    function now() {
        $CI = & get_instance();

        if (strtolower($CI->config->item('time_reference')) == 'gmt') {
            $now = time();
            $system_time = mktime(gmdate("H", $now), gmdate("i", $now), gmdate("s", $now), gmdate("m", $now), gmdate("d", $now), gmdate("Y", $now));

            if (strlen($system_time) < 10) {
                $system_time = time();
                log_message('error', 'The Date class could not set a proper GMT timestamp so the local time() value was used.');
            }

            return $system_time;
        } else {
            return time();
        }
    }

}