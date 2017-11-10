Ext.define('Extidi.core.Controller', {
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'desktop',
        selector: 'desktop'
    }
    ],
    init: function() {
        this.control({
            'desktop': {
                abrirModulo: this.abrirModulo 
           },
            'menu > menuitem[nombre="recargar_modulos"]':{
                click: this.recargar_modulos
            },
            'desktop dataview[nombre="principal"]':{
                itemclick: this.abrirModulo
            },
            'menu > menuitem[nombre="modulo"]':{
                click: this.abrirModulo2
            },
            'taskbar > toolbar > button[nombre="modulo"]': {
                click: this.abrirModulo2
            },
            'startMenu > toolbar > button[action="logout"]':{
                click: this.cerrarSesion
            },
            'startMenu > toolbar > button[action="cambiar_contrasena"]':{
                click: this.cambiarContrasena
            },
            'tabarboldinamico > tabarbol > treepanel':{
                itemclick: this.abrirTabArbolPanel
            },
            'cambioContrasena button[action="cambiar_contrasena"]':{
                click: this.cambiar
            }
        });
    },
    recargar_modulos: function(men, eve, opc){
        this.getDesktop().getDesktopConfig();
    },
    abrirModulo2: function(men, eve, opc){
        //console.debug(men)
        this.abrirModulo(men,{
            data:men
        });
    },
    abrirModulo: function (view, record) {
        var me =this.getDesktop();
        
        var tipo=record.data.data.TipoModulo;
        
        if(tipo=="TabCrud" || tipo=="TabVacio"){
            me.loading=me.setLoading('Espere');
            var module = record.data.url || record.data.modulo;
            var url=module;
            var css=module;
            var nombre=module;
            while(url.indexOf(".")>-1){
                url=url.replace(".","/");
                css=css.replace(".","_");
                nombre=nombre.replace(".","_");
            }
            css="icon-"+css;
            url=Extidi.BASE_PATH+"js/"+url;
            Ext.Ajax.request({
                url : Extidi.Constantes.URL_ESTA_CONECTADO,
                method : 'POST',
                success : function(result, request) {
                    result=Ext.JSON.decode((result.responseText))
                    var resultado = result.success;
                    var conectado = result.conectado;
                    if(resultado) {
                        if(conectado){
                            Ext.require([
                                module+".Constantes"
                                ], function(){
                                    if(typeof(me.app.controller.controllers.get(module+'.controller.init'))=="undefined"){
                                        var controller = me.app.controller.getController(module+'.controller.init');
                                        me.app.controller.controllers.add(controller);
                                        //controller.init();
                                    }
                                    me.addCss(
                                        "."+css+" {"+
                                        "background-image:url("+url+"/images/icon/16.png) !important;"+
                                        "}", module);

                                    me.createWindow({
                                        title: record.data.data.NombreModulo,
                                        iconCls: css,
                                        idModulo: record.data.data.id
                                    },module);
                                })
                        }else{
                            Extidi.Msj.error("Su sesi&oacute;n caduco",function(){
                                document.location=Extidi.BASE_PATH;		
                            });

                        }
                    }
                }
            });
        }else if(tipo=="TabArbol"){
            me.loading=me.setLoading('Espere');
        
            me.createWindow({
                title: record.data.data.NombreModulo,
                menu: record.data.data.menu
            },'Extidi.core.TabArbolDinamico', true)
            
        }
    },
    cerrarSesion: function(but, eve, opc){
        Ext.Msg.confirm(
            'Cerrar sesi&oacute;n', 
            '&iquest;Desea cerrar la sesi&oacute;n actual?',
            function(btn){
                if(btn=="yes"){
                    Ext.Ajax.request({
                        url : Extidi.Constantes.URL_DESCONECTAR,
                        method : 'POST',
                        success : function(result, request) {
                            result=Ext.JSON.decode((result.responseText))
                            var resultado = result.success;
                            if(resultado) {
                                document.location=Extidi.BASE_PATH;
                            }
                        }
                    });
                }
            }
            );
    //console.debug(respuesta)
    },
    abrirTabArbolPanel: function(view, record, item, index, e, eOpts ){
        if(record.data.leaf===true){
            //console.debug(record)
        }
    },
    cambiarContrasena: function(but, eve, opc){
        Ext.create('Extidi.modulos.login.CambioContrasena')
    },
    cambiar: function(but, eve, opc){
        var form=but.up('form');
        var ventana=but.up('window');
        if(form.getForm().isValid()){
            Ext.Msg.confirm(
                'Cambiar Contrase&ntilde;a', 
                '&iquest;Desea cambiar la contrase&ntilde;a?',
                function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url : Extidi.Constantes.URL_CAMBIARCONTRASENA,
                            method : 'POST',
                            params: {
                                datos: Ext.JSON.encode(form.getForm().getValues())
                            },
                            success : function(result, request) {
                                result=Ext.JSON.decode((result.responseText))
                                var resultado = result.success;
                                var mensaje = result.mensaje;
                                if(resultado) {
                                    Extidi.Msj.info(mensaje)
                                    ventana.destroy();
                                }else{
                                    Extidi.Msj.error(mensaje)
                                }
                            }
                        });
                    }
                }
            );
        }
    //console.debug(respuesta)
    }
});