<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title><?php echo $extidi['titulo'];?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge" />
		<link rel="stylesheet" href="<?php echo $url; ?>css/loading.css" type="text/css" media="screen" title="no title" charset="utf-8">
        <script src="<?php echo $url; ?>js/Extidi/Extidi.js" type="text/javascript" charset="utf-8"></script>	
        <script type="text/javascript">Extidi.BASE_PATH = "<?php echo $url; ?>";</script>
    </head>
    <body>
        <!--<div id="notify"></div>
        <div id="content"></div>-->
        <!--[if IE]>
        <script type="text/javascript">
        var e = ("abbr,article,aside,audio,canvas,datalist,details,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video").split(',');
        for (var i=0; i<e.length; i++) {
        document.createElement(e[i]);
        }
        </script>
        <![endif]-->
        <div id="loading-mask"></div>
        <div id="loading">
		<center>
            <img src="<?php echo $url; ?>images/loading.gif" width="50" height="50" alt="Cargando..." />
            <p id="msg">Espere un momento: Cargando estilos...</p>
		</center>
        </div>
        <div>
			<link rel="stylesheet" type="text/css" href="<?php echo $url; ?>css/desktop.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo $url; ?>css/mensaje.css" />
            <script type="text/javascript">
                document.getElementById('msg').innerHTML = 'Espere un momento: Cargando archivos ExtJS...';
            </script> 
			<script type="text/javascript" src="<?php echo $url; ?>vendor/fundacionidi/extjs/include-ext.js?<?php echo !($extidi['css']===true)?"css":"nocss";?>&<?php echo $extidi['debug']?"debug":"nodebug";?>&theme=<?php echo !($extidi['css']===true)?"neptune":$extidi['theme'];?>"></script>
			<!--<script type="text/javascript" src="<?php echo $url; ?>vendor/fundacionidi/extjs/include-ext.js"></script>-->
			<script type="text/javascript">
                document.getElementById('msg').innerHTML = 'Espere un momento: Cargando escritorio Extidi.';
				
            </script> 
			<?php if(($extidi['css']===true)){?>
			<link rel="stylesheet" type="text/css" href="<?php echo $url; ?>vendor/fundacionidi/<?php echo $extidi['theme'];?>/build/resources/<?php echo $extidi['theme'];?>-all.css" />
			<script type="text/javascript" src="<?php echo $url; ?>vendor/fundacionidi/<?php echo $extidi['theme'];?>/build/<?php echo $extidi['theme'];?>.js"></script>
			<?php }?>

			<script type="text/javascript" src="<?php echo $url; ?>vendor/fundacionidi/extjs/locale/ext-lang-es.js"></script>
			<script type="text/javascript">
				Extidi.USER = Ext.JSON.decode('<?php echo json_encode($this->session->userdata("usuario")); ?>');
				Extidi.config = Ext.JSON.decode('<?php echo json_encode($extidi); ?>');
				</script>
			<script src="<?php echo $url; ?>js/Extidi/init.js" type="text/javascript" charset="utf-8"></script>
        </div>
        <!--script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script-->
    </body>
</html>	