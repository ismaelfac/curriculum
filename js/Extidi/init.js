Ext.Loader.setConfig({
    enabled : true,
    paths : {
        Extidi : Extidi.BASE_PATH + 'js/Extidi'
    }
});
Ext.window.MessageBox.buttonText={
	ok: "OK",
	yes: "Si",
	no: "No",
	cancel: "Cancelar"
}
Ext.QuickTips.init();
Ext.define('Ext.fix.form.field.HtmlEditor', {
    override: 'Ext.form.field.HtmlEditor',

    execCmd: function (cmd, value) {
        var me = this,
            doc = me.getDoc();
       try {
            doc.execCommand(cmd, false, (value == undefined ? null : value));
    }
        catch (e) {}
        me.syncValue();
    }
});
Ext.BLANK_IMAGE_URL=Extidi.BASE_PATH+"images/s.gif";

Ext.require([
    'Extidi.clases.Constantes',
    'Extidi.clases.Helper',
    'Extidi.clases.Mensajes'/*,
    'Extidi.core.App'*/
    ]);
Ext.onReady(function() {


    Ext.Ajax.on('requestcomplete', function(conn, response, options, eOptions){
        if(options.url!=Extidi.Constantes.URL_ESTA_CONECTADO){
            var resultadoAjax=Ext.JSON.decode(response.responseText, true);
            if(resultadoAjax!=null){
                if(typeof(resultadoAjax.conectado)!='undefined'){
                    if(!resultadoAjax.conectado){
                        Extidi.Msj.error(resultadoAjax.mensaje, function(){
                            document.location=Extidi.BASE_PATH;
                        });
                    }
                }
            }
        }
    });

    Ext.getBody().on('keydown', function(e, t, eOpts){
        //console.debug(t.localName)
        if(t.localName!='input' && t.localName!='textarea' && e.getKey()==8){
            e.stopEvent()
        }
    });

    Ext.get('loading').remove();
    Ext.fly('loading-mask').animate({
        opacity : 0.8,
        remove : true,
        callback : function() {
            Ext.Ajax.request({
                url : Extidi.Constantes.URL_ESTA_CONECTADO,
                method : 'POST',
                success : function(result, request) {
                    result=Ext.JSON.decode((result.responseText))
                    var resultado = result.success;
                    var conectado = result.conectado;
                    var usuario = result.usuario;
                    if(resultado) {
                        if(conectado){
                            if(Extidi.USER.AccedeEscritorio==1){
							     Extidi.clases.Helper.iniciarApp('Extidi.sistema.escritorio');
                            }else{
                                 Extidi.clases.Helper.iniciarApp('Extidi.modulos.front');//TODO
                            }
                        }else{//muestra el login de extidi
/*                            Ext.application({
                                name : "login",
                                appFolder : Extidi.BASE_PATH + 'js/Extidi',
                                controllers : [
                                'Extidi.core.Controller',
                                'Extidi.class.controller.accionesGeneral'
                                ],
                                launch : function() {
                                    var app = this;
                                    var win = Ext.create("Extidi.modulos.login.VentanaLogin");
                                    win.show();
                                }
                            });*/
							/*
							Ext.application({
								name: "Login",
								appFolder: Extidi.BASE_PATH + 'js/Extidi/sistema/login',
								controllers: [
									'Extidi.sistema.login.controller.controller'
								],
								init: function(app) {
									Ext.require('Extidi.sistema.login.constantes', function(){
										Extidi.desktop=new Ext.create('Extidi.sistema.login.init');
										Extidi.app=app;
									})
								}
							});*/
							Extidi.clases.Helper.iniciarApp('Extidi.sistema.login');/*
							Ext.Loader.require([
								'Extidi.sistema.login.constantes'
							], function(){
								var app=Ext.create('Extidi.sistema.login.app')
								app.name='Extidi.sistema.login';
								app.appFolder=Extidi.BASE_PATH +'js/Extidi/sistema/login';
								app.paths={
									ruta: Extidi.BASE_PATH +'js/Extidi/sistema/login'
								};
								Ext.application(app);
							})*/
                        }
                    }
                },
				failure:    function(par1, par2, par3) {
					/** /
                    console.debug(par1)
					console.debug(par2)
					console.debug(par3)
                    /**/
				}
            });
        }
    });
});
