<?php
if ( ! defined('BASEPATH'))
	exit('No direct script access allowed');
if ( ! function_exists('crear_ical'))
{
	function crear_ical($fecha='', $duracion='0,0,0', $lugar='NA', $asunto='NA'){
		if($fecha==''){
			$fecha=date("Y-m-d H:i:s");
		}
		//$CI =& get_instance();
		require_once(APPPATH . 'third_party/ical.php');
		$config    = array( "unique_id" => "kigkonsult.se", "TZID" => "Europe/Stockholm" );
		$vcalendar = new vcalendar( $config );
		$vevent = & $vcalendar->newComponent( "vevent" );
		$vevent->setProperty( "dtstart", array( "year"  => date("Y", strtotime($fecha))
											  , "month" => date("m", strtotime($fecha))
											  , "day"   => date("d", strtotime($fecha))
											  , "hour"  => date("H", strtotime($fecha))
											  , "min"  => date("i", strtotime($fecha)) 
											  , "sec"  => date("s", strtotime($fecha)) 
							  ));
		$duracion=explode(",", $duracion);
		$vevent->setProperty( "duration", $duracion[0], $duracion[1], $duracion[2] );
		$vevent->setProperty( "LOCATION", $lugar );
		$vevent->setProperty( "summary", $asunto );
		$archivo=date("YmdHis", strtotime($fecha))."_".date("YmdHis").".ics";
		$vcalendar->setConfig( array( "directory" => "upload/calendar", "filename"  => $archivo ));
		$retorno=$vcalendar->saveCalendar();
		
		if($retorno===true){
			$retorno="upload/calendar/".$archivo;
		}
		return $retorno;
	}
}