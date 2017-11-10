<?php
#!/usr/bin/php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
*
*
*
* @author Jeison Berdugo
*/
if ( PHP_SAPI !== 'cli' )
	exit('No web access allowed');

set_time_limit(0);
ini_set('memory_limit', '256M');

class Extidicmd extends CI_Controller {

	public function index()
	{
		echo "Extidi command controller. Ready to help you.";
	}

	public function test($name="World!")
	{
		echo "Hello " . $name;
	}

	public function migrate($value='')
	{
		$this->config->load('migration');
		$migrations_enabled = $this->config->item('migration_enabled');
		if ($migrations_enabled) {
			$this->load->library('migration');
			$current = $this->config->item('migration_version');
			if (empty($value)) {
				echo "Migrando a la version $current.";
				$this->migration->current();
			} else {
				$is_rollback = $value < $current;
				if ($is_rollback) {
					echo "Regresando a la version $value";
				}
				echo "Migrando a la version $value.\n";
				$this->migration->version($value);
			}
		} else {
			echo "Migrations are disabled. Please enable them at config/migration.php";
		}
		
	}
}