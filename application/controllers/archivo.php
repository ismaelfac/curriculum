<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Archivo extends CI_Controller {

    function index() {
        if ($this->input->get('f') == "") {
            exit();
        }
        $root = "./upload/";
        $file = $this->input->get('f');
        $path = $root . $file;
        $type = '';
        $mime_types = array (
            'txt' => 'text/plain',
            'htm' => 'text/html',
            'html' => 'text/html',
            'php' => 'text/html',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'xml' => 'application/xml',
            'swf' => 'application/x-shockwave-flash',
            'flv' => 'video/x-flv',
            // images
            'png' => 'image/png',
            'jpe' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'jpg' => 'image/jpeg',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'ico' => 'image/vnd.microsoft.icon',
            'tiff' => 'image/tiff',
            'tif' => 'image/tiff',
            'svg' => 'image/svg+xml',
            'svgz' => 'image/svg+xml',
            // archives
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'exe' => 'application/x-msdownload',
            'msi' => 'application/x-msdownload',
            'cab' => 'application/vnd.ms-cab-compressed',
            // audio/video
            'mp3' => 'audio/mpeg',
            'qt' => 'video/quicktime',
            'mov' => 'video/quicktime',
            // adobe
            'pdf' => 'application/pdf',
            'psd' => 'image/vnd.adobe.photoshop',
            'ai' => 'application/postscript',
            'eps' => 'application/postscript',
            'ps' => 'application/postscript',
            // ms office
            'doc' => 'application/msword',
            'rtf' => 'application/rtf',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',
            'docx' => 'application/msword',
            'xlsx' => 'application/vnd.ms-excel',
            'pptx' => 'application/vnd.ms-powerpoint',
            // open office
            'odt' => 'application/vnd.oasis.opendocument.text',
            'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
        );

        if (is_file($path)) {
            $size = filesize($path);
            $ext = explode(".", $path);
            $ext = count($ext) > 0 ? $ext[count($ext) - 1] : '';
            if (function_exists('mime_content_type')) {
                $type = mime_content_type($path);
            } else if (function_exists('finfo_file')) {
                $info = finfo_open(FILEINFO_MIME);
                $type = finfo_file($info, $path);
                finfo_close($info);
            } elseif (array_key_exists($ext, $mime_types)) {
                $type = $mime_types[$ext];
            }
            if ($type == '') {
                $type = "application/force-download";
            }
            if ($this->input->get('esimagen') == 'true') {
                $tmp = explode('/', $type);
                if ($tmp[0] != 'image') {
                    $path = "images/icons/48/warning2.png";
                }
            }
            header("Pragma: no-cache");
            header("Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
            header("Expires: 0");
            header("Content-Type: $type");
            header("Content-Transfer-Encoding: binary");
            header("Content-Disposition: inline; filename=$file");
            header("Content-Length: $size");
            readfile($path);
            if ($this->input->get('tmp') == 1)
                unlink($path);
        } else {
            header('HTTP/1.0 404 Not Found');
            echo "404 Not Found";
        }
    }

}

?>