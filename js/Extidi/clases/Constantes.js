Ext.define('Extidi.clases.Constantes',{
    alternateClassName:'Extidi.Constantes',
    singleton:true,
    
    
    REGEX_NOMBRE: new RegExp("[a-zA-ZñÑ ]"),
    REGEX_CORREO: new RegExp("[a-zA-Z0-9]"),

    URL_SUBIR_IMAGEN: Extidi.BASE_PATH+"index.php/cruddinamico/subirImagen",
    URL_LISTAR_IMAGENES: Extidi.BASE_PATH+"index.php/cruddinamico/listarImagenes",
    URL_LISTAR_CARPETAS: Extidi.BASE_PATH+"index.php/cruddinamico/listarCarpetas",
    
    /* Url del Login */
    URL_HORA_SISTEMA: Extidi.BASE_PATH+"index.php/login/horaSistema",
    
    URL_LOGIN: Extidi.BASE_PATH+"index.php/login/validarUsuario",
    URL_LOGIN2: Extidi.BASE_PATH+"index.php/login/validarUsuario2",
    URL_LDAP: Extidi.BASE_PATH+"index.php/login/cambiarDatos",
    URL_ESTA_CONECTADO: Extidi.BASE_PATH+"index.php/login/estaConectado",
	URL_ESTA_CONECTADO_EGRESADO: Extidi.BASE_PATH+"index.php/login_formulario/estaConectado",
    URL_DESCONECTAR: Extidi.BASE_PATH+"index.php/login/logout",
    URL_CAMBIARCONTRASENA: Extidi.BASE_PATH+"index.php/login/cambiarContrasena",
    URL_USUARIO_CONECTADO: Extidi.BASE_PATH+"index.php/login/usuarioConectado",
    URL_IMAGEN_LOGO: Extidi.BASE_PATH+"images/logo.png",
    
    URL_CARGAR_MODULOS: Extidi.BASE_PATH+"index.php/extidi/crudmodulo/cargarMenu",
    URL_AYUDA: Extidi.BASE_PATH+"index.php/extidi/crudmodulo/cargarAyuda",
    URL_PERMISOS: Extidi.BASE_PATH+"index.php/extidi/crudpermisos/cargarPermisos",
    URL_CARGAR_VALOR_PARAMETRO: Extidi.BASE_PATH+"index.php/dinamico/valorParametros",
    	
	
    
    /* Url de la imagen del Logo */
	
    URL_BASE_LOGO: Extidi.BASE_PATH+"images/logo/",
    URL_IMAGEN_RECARGAR: Extidi.BASE_PATH+"images/recargar.png",
	
    /* Set de Iconos*/
	
    URL_ICONO_ENVIAR:Extidi.BASE_PATH+"images/icons/16/send.png",
    URL_ICONO_ELIMINAR_AVAL:Extidi.BASE_PATH+"images/icons/16/del.png",
    URL_ICONO_AGREGAR:Extidi.BASE_PATH+"images/icons/16/page_add.png",
    URL_ICONO_ELIMINAR:Extidi.BASE_PATH+"images/icons/16/page_delete.png",
    URL_ICONO_EXPORTAR_EXCEL:Extidi.BASE_PATH+"images/icons/16/page_excel.png",
    URL_ICONO_EXPORTAR_CSV:Extidi.BASE_PATH+"images/icons/16/page_green.png",
    URL_ICONO_EXPORTAR_PDF:Extidi.BASE_PATH+"images/icons/16/page_pdf.png",	
    URL_ICONO_IMPORTAR:Extidi.BASE_PATH+"images/icons/16/page_go.png",
    URL_ICONO_GUARDAR:Extidi.BASE_PATH+"images/icons/16/page_save.png",
    URL_ICONO_IMPRIMIR:Extidi.BASE_PATH+"images/icons/16/printer.png",
    URL_ICONO_BORRAR:Extidi.BASE_PATH+"images/icons/16/cancel.png",
	URL_BASE_LOGO_ACTUALIZAR: Extidi.BASE_PATH+"images/logo/egresados.jpg",
    URL_ICONO_MODIFICAR:Extidi.BASE_PATH+"images/icons/16/page_edit.png",
    URL_ICONO_ACEPTAR:Extidi.BASE_PATH+"images/icons/16/accept.png",
    URL_ICONO_CAMBIAR:Extidi.BASE_PATH+"images/icons/16/cambiar.png",
	URL_ICONO_FILTRAR:Extidi.BASE_PATH+"images/icons/16/filtro.png",
    URL_ICONO_ELIMINAR_FILA:Extidi.BASE_PATH+"images/icons/16/delete.png",
    URL_ICONO_AGREGAR_FILA:Extidi.BASE_PATH+"images/icons/16/add.png",
    URL_ICONO_ACTIVAR:Extidi.BASE_PATH+"images/icons/16/accept.png",
    URL_ICONO_INACTIVAR:Extidi.BASE_PATH+"images/icons/16/stop.png",
    URL_ICONO_EXAMINAR_IMPORTE:Extidi.BASE_PATH+"images/icons/16/magnifier.png",
    URL_ICONO_CANCELAR_IMPORTE:Extidi.BASE_PATH+"images/icons/16/table_delete.png",
    URL_ICONO_GUARDAR_IMPORTE:Extidi.BASE_PATH+"images/icons/16/table_save.png",
    URL_ICONO_IMPORTAR_IMPORTE:Extidi.BASE_PATH+"images/icons/16/table_go.png",
    URL_ICONO_INFORMACION_IMPORTE:Extidi.BASE_PATH+"images/icons/16/information.png",
    URL_ICONO_MENSAJE_IMPORTE:Extidi.BASE_PATH+"images/icons/48/warning2.png",
    URL_ICONO_LIBRO:Extidi.BASE_PATH+"images/icons/16/libro.png",
    URL_ICONO_LIBRETA: Extidi.BASE_PATH+"images/icons/16/libreta.png",
    URL_ICONO_EDIT_CARPETA: Extidi.BASE_PATH+"images/icons/16/edit_carpeta.png",
    URL_ICONOS_MENU: Extidi.BASE_PATH+"images/images-menu/",
	
    /* Url de Escritorio*/
    URL_ESCRITORIO: Extidi.BASE_PATH+"index.php/escritorio",
	
    /* Posicion Botones de Tabcrud*/
	
    BOTON_NUEVO_TABCRUD:0,
    BOTON_ACTIVAR_TABCRUD:1,
    BOTON_INACTIVAR_TABCRUD:2,
    BOTON_ELIMINAR_TABCRUD:3,
    BOTON_EXPORTAR_EXCEL_TABCRUD:4,
    BOTON_EXPORTAR_PDF_TABCRUD:5,
    BOTON_EXPORTAR_CSV_TABCRUD:6,
    BOTON_IMPRIMIR_TABCRUD:7,
    BOTON_IMPORTAR_TABCRUD:8,

    BOTON_GUARDAR_TABCRUD:0,
    BOTON_BORRAR_TABCRUD:1

    
    
});