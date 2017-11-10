Ext.define('Extidi.sistema.escritorio.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[$className=Extidi.sistema.escritorio.view.Viewport]'
    }
    ],
	cerrarFormularios: function(crud){
		var me=this;
		if(crud!=null){
			if(crud.formulario.$className=="Extidi.clases.VentanaModal"){
				crud.formulario.close()
			}
			var tabpanel=crud.down('tabpanel[name="detalle"]');
			if(tabpanel!=null){
				for(var i=0;i<tabpanel.items.items.length; i++){
					//me.cerrarFormularios(tabpanel.items.items[i].formulario);
					me.cerrarFormularios(tabpanel.items.items[i]);
				}
			}
		}
	},
    init: function(){
		var me=this;
        me.control({
            'form[name="cambiar_datos"] [name="btnGuardar"]':{
				click: function(btn){
					var formulario=btn.up('form');
					if(formulario.getForm().isValid()){
						var valores=formulario.getForm().getValues();
						var enviar=true;
						if(valores["Password"]!="" || valores["Password2"]!=""){
							if(valores["Password"]!=valores["Password2"]){
								enviar=false;
								Extidi.Msj.error("Las contrase&ntilde;as no coinciden");
							}
						}
						if(enviar===true){
							Ext.Ajax.request({
								async: false,
								url : Extidi.sistema.escritorio.constantes.URL_GUARDAR_DATOS,
								method : 'POST',
								params: {
									valores: Ext.JSON.encode(valores)
								},
								success : function(result, request) {
									result=Ext.JSON.decode(result.responseText);
									if(result.success){
										formulario.down('[name="Password"]').setValue("");
										formulario.down('[name="Password2"]').setValue("");
										Extidi.Msj.info(result.mensaje)
									}else{
										Extidi.Msj.error(result.mensaje)
									}
								}
							});
						}
					}else{
						Extidi.Msj.error("Digite las contrase&ntilde;as correctamente");
					}
				}
			},
            '[$className=Extidi.sistema.escritorio.view.MenuInicio] [name="cambiar_datos"]':{
				click: function(btn){
					var datos={};
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.escritorio.constantes.URL_DATOS,
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								datos=result.data;
							}
						}
					});
					Ext.create('Extidi.sistema.escritorio.view.CambiarDatos', {
						datos: datos
					});
				}
			},
			'[$className=Extidi.sistema.escritorio.view.MenuInicio] [name="Logout"]':{
				click: function(btn){
					Extidi.Msj.confirm(
						'&iquest;Desea cerrar la sesi&oacute;n actual?',
						function(btn){
							if(btn=="yes"){
								Ext.Ajax.request({
									url : Extidi.sistema.escritorio.constantes.URL_DESCONECTARSE,
									method : 'POST',
									success : function(result, request) {
										result=Ext.JSON.decode(result.responseText);
										if(result.success){
											document.location=Extidi.BASE_PATH;
										}
									}
								});
							}
						}
					);
				}
			},
            '[$className=Extidi.sistema.escritorio.view.MenuInicio] [name="Menu"] [name="Modulo"]':{
				click: function(btn){
					me.abrirModulo(btn.ruta);
				}
			},
            '[$className=Extidi.sistema.escritorio.view.MenuInicio]':{
                Cargo : function(comp) {
					var menu=comp.down('[name="Menu"]');
					comp.setTitle(
							((Extidi.USER.PrimerNombre=='' || Extidi.USER.PrimerNombre==null)?'':' '+Extidi.USER.PrimerNombre)+
							((Extidi.USER.SegundoNombre=='' || Extidi.USER.SegundoNombre==null)?'':' '+Extidi.USER.SegundoNombre)+
							((Extidi.USER.PrimerApellido=='' || Extidi.USER.PrimerApellido==null)?'':' '+Extidi.USER.PrimerApellido)+
							((Extidi.USER.SegundoApellido=='' || Extidi.USER.SegundoApellido==null)?'':' '+Extidi.USER.SegundoApellido)

					);
					var modulos=[];
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.escritorio.constantes.URL_CARGAR_MENU_INICIO,
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								modulos=result.datos;
							}
						}
					});
					me.cargarMenu(menu, modulos);
				}
			},
            '[$className=Extidi.sistema.escritorio.view.Viewport]':{
                Cargo : function(comp) {
					comp=comp.down('[$className=Extidi.sistema.escritorio.view.Widgets]');
					//console.debug(comp)
					var modulos=[];
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.escritorio.constantes.URL_CARGAR_WIDGETS,
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								modulos=result.datos;
							}
						}
					});

					for(var i=0; i<modulos.length; i++){
						Extidi.clases.Helper.iniciarAppWidget(modulos[i]["Controlador"], comp);
					}
				}
			},
            '[$className=Extidi.sistema.escritorio.view.AccesosDirectos]':{
                Cargo : function(comp) {
					var modulos=[];
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.escritorio.constantes.URL_CARGAR_ACCESOS,
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								modulos=result.datos;
							}
						}
					});
					//console.debug()
					comp.getStore().loadData(modulos);
				},
				itemclick: function(comp, record){
					me.abrirModulo(record.get("id"))
				}
			},
            '[$className=Extidi.sistema.escritorio.view.Reloj]':{
                Cargo : function(comp) {
					me.actualizarHora(comp);
				},
				afterrender: function(comp){
					me.cambiarSegundo(comp);
				},
				destroy: function (comp) {
					if (comp.timer) {
						window.clearTimeout(comp.timer);
						comp.timer = null;
					}
				}
			},
            'window':{
				activate: function(comp){
					if(typeof(comp.vensuperior)!='undefined'){
						comp.vensuperior.close()
					}
				},
				close: function(comp){
					var crud=comp.down('[$className=Extidi.sistema.dinamico.view.Crud]');
					me.cerrarFormularios(crud);

					if(typeof(comp.vensuperior)!='undefined'){
						comp.vensuperior.close()
					}
				}
			},
            '[__=Extidi.sistema.escritorio.view.VentanaModuloEscritorio] [name="toolAyuda"]':{
                click : function(comp) {
					comp.up('window').setLoading("Espere por favor");
					var ayuda="";
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.escritorio.constantes.URL_CARGAR_AYUDA,
						method : 'POST',
						params: {
							modulo: comp.up('window').controlador
						},
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								ayuda=result.info;
							}
						}
					});
					Ext.create('Extidi.clases.VentanaModal', {
						title: 'Ayuda de '+comp.up('window').title,
						layout: 'fit',
						modal: false,
						draggable: true,
						maximizable: true,
						items: [
							{
								xtype: 'panel',
								html: ayuda,
								autoScroll: true
							}
						]
					})
					comp.up('window').setLoading(false);
				}
			},
            '[__=Extidi.sistema.escritorio.view.VentanaModuloEscritorio]':{
                Cargo : function(comp) {
				//console.debug(comp)
					comp.renderTo=me.getPrincipal().down(Ext.isIE7m?'[name="render_ventanas"]':'[$className=Extidi.sistema.escritorio.view.Wallpaper]').getEl();
					var urlIcono=Extidi.BASE_PATH+"js"+Extidi.Helper.cambiarRuta(comp._.split(".view")[0])+"/images/icon/16.png";
					comp.icon=urlIcono;

					//....permisos


					var permisos=[];
					var info={};
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.escritorio.constantes.URL_CARGAR_PERMISOS,
						method : 'POST',
						params: {
							modulo: comp._.split(".view")[0]
						},
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								permisos=result.datos;
								if(permisos.length>0){
									permisos=permisos[0].permisos.split(',');
								}
								info=result.info;
							}
						}
					});

					comp.setTitle(info["titulo"]);
					comp.controlador=comp._.split(".view")[0];
					var barraEstado=me.getPrincipal().down('[$className=Extidi.sistema.escritorio.view.BarraEstado]');

					var componente=barraEstado.down('[urlComponente="'+comp._+'"]');
					var botonNuevo=barraEstado.add({
						name: "App",
						text: info["titulo"],
						icon: urlIcono,
						pressed: true,
						enableToggle: true,
						componente: comp,
						urlComponente: comp._
					});
					comp.boton=botonNuevo;
					comp.fireEvent('Permisos', comp, permisos)
				},
				Permisos: function(comp, permisos){
					//console.debug(comp.items.items)
					for(var i=0; i<comp.items.items.length; i++){
						//comp.items.items[i].permisos=permisos;
						comp.items.items[i].fireEvent('Permisos', comp.items.items[i], permisos);
					}
				},
				destroy: function(comp){
					var barraEstado=me.getPrincipal().down('[$className=Extidi.sistema.escritorio.view.BarraEstado]');
					barraEstado.remove(comp.boton);
				},
				minimize: function(comp){
					var barraEstado=me.getPrincipal().down('[$className=Extidi.sistema.escritorio.view.BarraEstado]');
					var componente=barraEstado.down('[urlComponente="'+comp._+'"]');
					componente.toggle(false);
					componente.componente.setVisible(false);
				}
			},
            '[$className=Extidi.sistema.escritorio.view.BarraEstado] [name="App"]':{
				click: function(btn){
                    btn.componente.setVisible(btn.pressed)
                    var openModulesButtons = btn.up().getItems();
                    Ext.each(openModulesButtons, function (butt,i,buttons) {
                        if (butt.urlComponente !== btn.urlComponente) {
                            butt.pressed = !btn.pressed;
                        }
                    });
				}
			}
		});
	},
	cargarMenu: function(componente, menu){
		var me=this;
		for(var i=0; i<menu.length; i++){
			var nuevoMenu={
				text: menu[i].NombreModulo
			};
			if(menu[i].menu.length>0){
				me.cargarMenu(nuevoMenu, menu[i].menu);
				nuevoMenu.icon=Extidi.BASE_PATH+"images/folder.png";
			}else{
				if(typeof(menu[i].Controlador)!="undefined" && menu[i].Controlador!=null && menu[i].Controlador!=""){
					var ruta=Extidi.clases.Helper.cambiarRuta(menu[i].Controlador);
					nuevoMenu.icon=Extidi.BASE_PATH+"js"+ruta+"/images/icon/16.png";
					nuevoMenu.name= 'Modulo';
					nuevoMenu.ruta= menu[i].Controlador;
				}
			}
			if(componente.$className=="Ext.menu.Menu"){
				componente.add(nuevoMenu);
			}else{
				if(typeof(componente.menu)=="undefined"){
					componente.menu=[];
				}
				componente.menu.push(nuevoMenu);
			}
		}
	},
	actualizarHora: function(comp){
		var me=this;
		Ext.Ajax.request({
            url : Extidi.sistema.escritorio.constantes.URL_HORA_SISTEMA,
            method : 'POST',
            success : function(result, request) {
                result=Ext.JSON.decode((result.responseText));
                comp.fecha=new Date(result.ano, result.mes, result.dia, result.hora, result.minuto, result.segundo);

				//comp.set

                Ext.Function.defer(me.actualizarHora, 600000, me, [comp]);
            }
        })
	},
	cambiarSegundo: function(comp){
		var me=this;
        comp.fecha=Ext.Date.add(comp.fecha, Ext.Date.SECOND, 1);

        var time = Ext.Date.format(comp.fecha, 'd/m/Y H:i:s');
		comp.setText(time);
        comp.timer = Ext.Function.defer(me.cambiarSegundo, 1000, me, [comp]);
	},
	abrirModulo: function(ruta){
		var me=this;
		var barraEstado=me.getPrincipal().down('[$className=Extidi.sistema.escritorio.view.BarraEstado]');
		var componente=barraEstado.down('[urlComponente="'+ruta+'.view.Viewport"]');
		//console.debug(componente)
		if(componente==null){
			Extidi.Msj.info('Cargando m&oacute;dulo', function(){}, 'mc');
			Extidi.clases.Helper.iniciarApp(ruta);
		}else{
			if(!componente.pressed){
				componente.toggle(true);
				componente.componente.setVisible(true);
			}
		}
	}
});
