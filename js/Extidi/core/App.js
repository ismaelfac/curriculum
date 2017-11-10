/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Extidi.core.App', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: [
        'Ext.container.Viewport',

        'Extidi.core.ShortcutModel',
        'Extidi.core.Desktop'
    ],

    isReady: false,
    modules: null,
    useQuickTips: true,

    constructor: function (config) {
        var me = this;
        me.addEvents(
            'ready',
            'beforeunload'
            );

        me.mixins.observable.constructor.call(this, config);
        
    	Ext.Ajax.on('requestcomplete',function(conn, response, options, eOpts ){
            var datos=Ext.JSON.decode(response.responseText);
            if(typeof(datos.permisos)!='undefined'){
                Extidi.Msj.error(datos.mensaje)
            }
        });
        
        Ext.Ajax.request({
            url		: Extidi.Constantes.URL_CARGAR_MODULOS,
            scope	: me,
            callback: function(response, success, data){
                if(success){
                    data=Ext.decode(data.responseText)
                    me.modules=data.datos; 
                }else{
                    me.modules=[];
                }
                Ext.Ajax.request({
                    url : Extidi.Constantes.URL_USUARIO_CONECTADO,
                    method : 'POST',
                    callback: function(response, success, data){
                        if(success){
                            data=Ext.decode(data.responseText)
                            me.usuario = data.usuario;
                            if (Ext.isReady) {
                                Ext.Function.defer(me.init, 10, me);
                            } else {
                                Ext.onReady(me.init, me);
                            }
                        }
                    }
                });

				
            }
        });
        
    },

    init: function() {
        var me = this, desktopCfg;

        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }

        desktopCfg = me.getDesktopConfig();
        me.desktop = new Extidi.core.Desktop(desktopCfg);

        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [ me.desktop ]
        });

        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);

        me.isReady = true;
        me.fireEvent('ready', me);
    },
    AccesoDirecto: function(datos, retorno){
        var me=this;
        //console.debug(datos)
        Ext.each(datos, function (module) {
            if(module.AccesoDirecto==1 
                && 
                module.TipoModulo!='CarpetaMenu' 
                && 
                module.TipoModulo!='CarpetaArbol'
            ){
                var urlImagen='';
                if(module.Controlador!=null){
                    urlImagen=module.Controlador;
                    while(urlImagen.indexOf(".")>-1){
                        urlImagen=urlImagen.replace(".","/");
                    }
                    urlImagen=Extidi.BASE_PATH+"js/"+urlImagen+"/images/icon/";
                }
                
                retorno.push({
                    data: module,
                    name: module.NombreModulo,
                    icon: urlImagen,
                    url: module.Controlador
                });
            }else if(module.TipoModulo!='CarpetaMenu' 
                ||
                module.TipoModulo!='CarpetaArbol'
                ){
                        //console.debug(module)
                me.AccesoDirecto(module.menu, retorno)
            }
        });
        return retorno;
    },
    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getDesktopConfig: function () {
        var me = this;
        var datos=[]
        var datosWidget=[]
        var widgets=[]
        Ext.each(me.modules, function (module) {
            //console.debug(module)
            if(module.AccesoDirecto==1 
                && 
                module.TipoModulo!='CarpetaMenu' 
                && 
                module.TipoModulo!='CarpetaArbol'
                && 
                module.TipoModulo!='Widget'
            ){
                var urlImagen='';
                if(module.Controlador!=null){
                    urlImagen=module.Controlador;
                    while(urlImagen.indexOf(".")>-1){
                        urlImagen=urlImagen.replace(".","/");
                    }
                    urlImagen=Extidi.BASE_PATH+"js/"+urlImagen+"/images/icon/";
                }
                
                datos.push({
                    data: module,
                    name: module.NombreModulo,
                    icon: urlImagen,
                    url: module.Controlador
                });
            }else if(module.TipoModulo=="Widget"){
                datosWidget.push({
                    modulo: module.Controlador
                });
                Ext.require(module.Controlador+".Constantes", function(){
                    if(!me.controller.controllers.get(module.Controlador+'.controller.init')){
                        var controller = me.controller.getController(module.Controlador+'.controller.init');
                        me.controller.controllers.add(controller);
                        //controller.init();
                    }
                    //console.debug(module)
                    var div=module.Controlador;
                    /*while(div.indexOf(".")!=-1){
                        div=div.replace(".","_")
                    }*/
                    //console.debug(Ext.get('widget-'+div).dom)
                    //alert(Ext.get('widget-'+div).dom)
                    Ext.create(module.Controlador+".view.init", {
                        renderTo: Ext.get('widget-'+div).dom
                    });
                    //widgets.push(module.Controlador);
                });
            }else if(module.TipoModulo!='CarpetaMenu' 
                ||
                module.TipoModulo!='CarpetaArbol'
                ){
                me.AccesoDirecto(module.menu, datos)
            }
        });
        var cfg = {
            app: me,
            taskbarConfig: me.getTaskbarConfig(),
            
            wallpaper : 'wallpaperextidi.jpg',
            //wallpaperStretch : false,
			
            contextMenuItems : [/*{
                text : 'Recargar Modulos',
                nombre: 'recargar_modulos',
                scope : me
            }*/],
			
            shortcuts : Ext.create('Ext.data.Store', {
                model : 'Extidi.core.ShortcutModel',
                data : datos
            }),
			
            shortcutsWidget : Ext.create('Ext.data.Store', {
                model : 'Extidi.core.ShortcutModel',
                data : datosWidget,
                listeners: {
                    load: function(store, records, success, eOpts){
                        //console.debug("ola")
                        for(var i=0;i<widgets.length; i++){
                            //console.debug(widgets[i])
                            Ext.create(widgets[i]+".view.init", {
                                renderTo: Ext.get('widget-'+widgets[i]).dom
                            });
                        }
                    }
                }
            }),
            widgets : widgets

        };
        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: function(){
        var me=this;
        return me.modules;
    },

    /**
     * This method returns the configuration object for the Start Button. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getStartConfig: function () {
        var me = this, cfg = {
            title: me.usuario,
            app: me,
            menu: []
        };
        
        Ext.apply(cfg, me.startConfig);
        Extidi.Helper.creacionMenu(cfg.menu, me.modules);
        return cfg;
    },
    InicioRapido: function(datos, retorno){
        var me=this;
        //console.debug(datos)
        Ext.each(datos, function (module) {
            if(module.InicioRapido==1 
                && 
                module.TipoModulo!='CarpetaMenu' 
                && 
                module.TipoModulo!='CarpetaArbol'
            ){
                var urlImagen='';
                if(module.Controlador!=null){
                    urlImagen=module.Controlador;
                    while(urlImagen.indexOf(".")>-1){
                        urlImagen=urlImagen.replace(".","/");
                    }
                    urlImagen=Extidi.BASE_PATH+"js/"+urlImagen+"/images/icon/";
                }

                retorno.push({
                    data: module,
                    nombre: 'modulo',
                    name: module.NombreModulo,
                    icon: urlImagen+"16.png",
                    url: module.Controlador
                });
            }else if(module.TipoModulo!='CarpetaMenu' 
                ||
                module.TipoModulo!='CarpetaArbol'
                ){
                        //console.debug(module)
                me.InicioRapido(module.menu, retorno)
            }
        });
        return retorno;
    },


    /**
     * This method returns the configuration object for the TaskBar. A derived class
     * can override this method, call the base version to build the config and then
     * modify the returned object before returning it.
     */
    getTaskbarConfig: function () {
        var me = this;
        var datos=[]
        Ext.each(me.modules, function (module) {
            if(module.InicioRapido==1 && module.TipoModulo!='CarpetaMenu' && module.TipoModulo!='CarpetaArbol' && module.TipoModulo!='Widget'){
                var urlImagen='';
                if(module.Controlador!=null){
                    urlImagen=module.Controlador;
                    while(urlImagen.indexOf(".")>-1){
                        urlImagen=urlImagen.replace(".","/");
                    }
                    urlImagen=Extidi.BASE_PATH+"js/"+urlImagen+"/images/icon/";
                }

                datos.push({
                    data: module,
                    nombre: 'modulo',
                    name: module.NombreModulo,
                    icon: urlImagen+"16.png",
                    url: module.Controlador
                });
            }else if(module.TipoModulo!='CarpetaMenu' 
                ||
                module.TipoModulo!='CarpetaArbol'
                ){
                        //console.debug(module)
                me.InicioRapido(module.menu, datos)
            }
        });
        var cfg = {
            app: me,
            startConfig: me.getStartConfig(),
            quickStart: datos
        };

        Ext.apply(cfg, me.taskbarConfig);
        
        /*return Ext.apply(cfg, {
			quickStart : [{
				name : 'Accordion Window',
				iconCls : 'accordion',
				module : 'acc-win'
			}, {
				name : 'Grid Window',
				iconCls : 'icon-grid',
				module : 'grid-win'
			}]
		});*/
        return cfg;
    },

    initModules : function(modules) {
        var me = this;
        Ext.each(modules, function (module) {
            module.app = me;
        });
    },

    getModule : function(name) {
    	var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id == name || m.appType == name) {
                return m;
            }
        }
        return null;
    },

    onReady : function(fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },

    getDesktop : function() {
        return this.desktop;
    },

    onUnload : function(e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    }
});
