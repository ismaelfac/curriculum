Ext.define('Extidi.sistema.dinamico.controller.dinamico',{
    extend: 'Ext.app.Controller',
    refs: [
		
    ],
    init: function(){
		var me=this;
		/*
		Eventos
			FormularioFiltroDinamico[modelo=""]
			{
					
			}
			CrudDinamico[modelo=""]
			{
				CargoAcciones:				(crud, grilla)
			}
			FormularioDinamico[modelo=""]
			{
				antesMostrarFormulario:		(formulario, record)
				despuesMostrarFormulario:	(formulario, record)
				TerminoCargar:				(formulario)
				antesGuardar: 				(btnGuardar)
				despuesGuardar: 			(btnGuardar, esValidoFormulario)
				antesCancelar: 				(btnCancelar)
				despuesCancelar: 			(btnCancelar)
			}
			GrillaDinamico[modelo=""]
			{
				antesFiltrar:				(btn, grilla)
				despuesFiltrar:				(btn, grilla, ventana)
				
				antesSeleccionar:			(grilla, seleccionados)
				antesDetalleSeleccionar:	(grilla, seleccionados, detalles)
				despuesSeleccionar:			(grilla, seleccionados)
			
				antesCrear:					(grilla, btnCrear)
				despuesCrear:				(grilla, btnCrear)
				antesModificar:				(grilla, btnModificar, seleccionados)
				despuesModificar:			(grilla, btnModificar, seleccionados)
				antesEliminar:				(grilla, btnEliminar, seleccionados)
				antesConfirmarEliminar:		(grilla, btnEliminar, seleccionados, btnConfirmacion)
				despuesConfirmarEliminar:	(grilla, btnEliminar, seleccionados, btnConfirmacion)
				despuesEliminar:			(grilla, btnEliminar, seleccionados, success)
				antesActivar:				(grilla, btnActivar, seleccionados)
				antesConfirmarActivar:		(grilla, btnActivar, seleccionados, btnConfirmacion)
				despuesConfirmarActivar:	(grilla, btnActivar, seleccionados, btnConfirmacion)
				despuesInactivar:			(grilla, btnInactivar, seleccionados, success)
				antesInactivar:				(grilla, btnInactivar, seleccionados)
				antesConfirmarInactivar:	(grilla, btnInactivar, seleccionados, btnConfirmacion)
				despuesConfirmarInactivar:	(grilla, btnInactivar, seleccionados, btnConfirmacion)
				despuesInactivar:			(grilla, btnInactivar, seleccionados, success)
				antesExportarExcel:			(grilla, btnExportarExcel)
				despuesExportarExcel:		(grilla, btnExportarExcel)
				antesExportarPdf:			(grilla, btnExportarPdf)
				despuesExportarPdf:			(grilla, btnExportarPdf)
				antesExportarCsv:			(grilla, btnExportarCsv)
				despuesExportarCsv:			(grilla, btnExportarCsv)
				antesImprimir:				(grilla, btnImprimir)
				despuesImprimir:			(grilla, btnImprimir)
				antesImportar:				(grilla, btnImportar)
				despuesImportar:			(grilla, btnImportar)

			}
		*/
		
		
        me.control({
            '[$className=Extidi.sistema.dinamico.view.Formulario]':{
				Cargo: function(comp){
					comp.removeAll();
					comp.setLoading("Cargando");
					var modelo=[];
					
					var mostrarBotonesCrear=true;
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.dinamico.constantes.URL_MODELO_FORMULARIO,
						params: {
							modelo: comp.modelo,
							mostrarBotones: mostrarBotonesCrear?1:0
						},
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								modelo=result.data;
							}
						}
					});
					
					for(var i=0;i<modelo.length;i++){
						for(var j=0;j<modelo[i].eval.length;j++){
							var partes=modelo[i].eval[j].split(",");
							var modificar=modelo[i];
							var cadena="";
							for(var z=0;z<partes.length;z++){
								var part=partes[z];
								if(typeof(partes[z]*1)=="number" && partes[z]==partes[z]*1){
									part=partes[z]*1;
									cadena+="["+partes[z]+"]";
								}else{
									cadena+="."+partes[z];
								}
								modificar=modificar[part];
							}
							eval("modelo[i]"+cadena+"="+modificar);
							
						}
					}
					comp.add(modelo);
					
					var valores=comp.valores;
					Ext.Object.each(valores, function(key, value, myself) {
						var componente=comp.down('[name="'+key+'"]');
						if(componente!=null){
							if(componente.$className=="Ext.form.field.ComboBox"){
								componente.getStore().load({
									params: {
										dato: valores[key]
									},
									callback: function(records, operation, success) {
										componente.setValue(value+"");
									}
								});
							}else if(componente.$className=="Ext.form.field.File"){
								var boton=componente.up().down('[name="btnDescargar"]');
								componente.valor=value;
								if(value!=null && value!=""){
									boton.setVisible(true);
								}else{
									boton.setVisible(false);
								}
							}else{
								componente.setValue(value);
							}
						}
					});
					if(comp.tipo=="modalCombo" && comp.tipoCombo=="valorparametro"){
						comp.down('[name="IdParametro"]').getStore().load({
							params: {
								limit: 1,
								adicional: Ext.JSON.encode({
									NombreCampo: comp.parametro.NombreCampo
								})/*,
								dato: comp.parametro.NombreCampo*/
							},
							callback: function(records, operation, success) {
								comp.down('[name="IdParametro"]').setValue(records[0].get("id"));
							}
						});
						comp.down('[name="IdParametro"]').up().setVisible(false)
					}
					comp.setLoading(false);
					comp.fireEvent("TerminoCargar", comp)
				}
            },
            '[$className=Extidi.sistema.dinamico.view.Formulario] [name="btnCancelar"]':{
				click: function(btn){
					var formulario=btn.up('[$className=Extidi.sistema.dinamico.view.Formulario]');
					if(!formulario.fireEvent('antesCancelar', btn)){
						return;
					}
					var windows=formulario.up('window[tipo="modal"]');
					formulario.getForm().reset();
					formulario.setDisabled(true);
					formulario.fireEvent('despuesCancelar', btn);
					if(typeof(windows)!='undefined'){
						windows.close();
					}
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Formulario] [name="btnGuardar"]':{
				click: function(btn){
					var formulario=btn.up('[$className=Extidi.sistema.dinamico.view.Formulario]');
					if(!formulario.fireEvent('antesGuardar', btn)){
						return;
					}
					var windows=formulario.up('window[tipo="modal"]');
					//console.debug(formulario.getForm().getValues());
					if(formulario.getForm().isValid()){
						var valores=formulario.getForm().getValues();
						btn.setDisabled(true);
						formulario.getForm().submit({
							url : Extidi.sistema.dinamico.constantes.URL_GUARDAR,
							params: {
								__modelo: formulario.modelo
							},
							method : 'POST',
							success : function(request, result) {
								var resultado = Ext.JSON.decode((result.response.responseText)).success;
								var mensaje = Ext.JSON.decode((result.response.responseText)).data.mensaje;
								var id = Ext.JSON.decode((result.response.responseText)).data.id;
								if (resultado) {
									Extidi.Msj.info(mensaje);
									if(typeof(formulario.grilla)!='undefined'){
										formulario.getForm().reset();
										formulario.setDisabled(true);
										formulario.grilla.getStore().load();
										formulario.grilla.getSelectionModel().deselectAll();
									}
									if(typeof(formulario.combo)!='undefined'){
										formulario.combo.getStore().load({
											params: {
												dato: id
											},
											callback: function(records, operation, success) {
												formulario.combo.setValue(id+"");
												var botonModificar=formulario.combo.up().down('[name="btnModificarModal"]');
												var botonQuitar=formulario.combo.up().down('[name="btnQuitar"]');
												if(records.length==1){
													if(botonModificar!=null){
														botonModificar.setVisible(true);
													}
													if(botonQuitar!=null){
														botonQuitar.setVisible(true);
													}
												}else{
													if(botonModificar!=null){
														botonModificar.setVisible(false);
													}
													if(botonQuitar!=null){
														botonQuitar.setVisible(false);
													}
												}
												//console.debug(formulario.combo)
												formulario.up('window').close();
											}
										});
									}
									if(typeof(windows)!='undefined'){
										windows.close();
									}
								}else{
									Extidi.Msj.error(mensaje);
								}
								btn.setDisabled(false);
							},
							failure: function(form, action){
								btn.setDisabled(false);
								if (action.failureType === Ext.form.action.Action.CONNECT_FAILURE) {
								   Extidi.Msj.error('Estado:'+action.response.status+': '+action.response.statusText);
								}
								if (action.failureType === Ext.form.action.Action.SERVER_INVALID){
									Extidi.Msj.error(Ext.JSON.decode(action.response.responseText).data.mensaje);
								}
							}
						});
					}else{
						Extidi.Msj.error("Valores de los datos incorrectos, por favor verifiquelos");
					}
					formulario.fireEvent('despuesGuardar', btn, formulario.getForm().isValid());
				}
			},
			
			'[$className=Extidi.sistema.dinamico.view.Formulario] button[name="btnImagen"]':{
				click: function(btn){
					var html=btn.up('[xtype2="htmleditor"]').down('htmleditor');
					var archivos=[];
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.dinamico.constantes.URL_CARGAR_ARCHIVOS,
						params: {
							modelo: html.up('form').modelo,
							columna: html.name
						},
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								archivos=result.archivos;
							}
						}
					});
					Ext.create('Extidi.sistema.dinamico.view.SubirImagen', {
						modelo: html.up('form').modelo,
						columna: html.name,
						componente: html,
						archivos: archivos,
						ruta: "index.php/archivo/?f="+html.up('form').modelo+"/"+html.name+"/"+Extidi.USER.id+"/"
					});
				}
			},
			'[$className=Extidi.sistema.dinamico.view.SubirImagen] [name="treArchivos"]':{
				selectionchange: function(tree, selected, eOpts ){
					var wind=tree.view.up('window');
					var container=wind.down('[name="conImagen"]');
					if(selected.length>0){
						container.update({
							html: '<img src="'+Extidi.BASE_PATH+wind.ruta+selected[0].data.text+'" width="100%"/>'
						});
					}else{
						container.update({
							html: ''
						});
					}
				}
			},
			'[$className=Extidi.sistema.dinamico.view.SubirImagen] [name="btnSubir"]':{
				click: function(btn){
					var form=btn.up('form');
					var wind=btn.up('window');
					var html=wind.componente;
					var tree=wind.down('[name="treArchivos"]');
					if(form.isValid()){
						form.getForm().submit({
							url : Extidi.sistema.dinamico.constantes.URL_SUBIR_ARCHIVO,
							params: {								
								modelo: html.up('form').modelo,
								columna: html.name
							},
							method : 'POST',
							success : function(request, result) {
								var resultado = Ext.JSON.decode((result.response.responseText)).success;
								if (resultado) {
									Extidi.Msj.info("Archivo subido correctamente");
									var archivos = Ext.JSON.decode((result.response.responseText)).archivos;
									wind.recargar(archivos);
									//tree.
								}else{
									var mensaje = Ext.JSON.decode((result.response.responseText)).mensaje;
									Extidi.Msj.error(mensaje);
								}
							}
						})
					}else{
						Extidi.Msj.error("Seleccione el archivo");
					}
				}
			},
			'[$className=Extidi.sistema.dinamico.view.SubirImagen] [name="btnEscoger"]':{
				click: function(btn){
					var wind=btn.up('window');
					var ancho=wind.down('[name="txtAncho"]').getValue();
					var alto=wind.down('[name="txtAlto"]').getValue();
					var tree=wind.down('[name="treArchivos"]');
					var selected=tree.getSelectionModel().getSelection();
					var html=wind.componente;
					html.insertAtCursor('<img src="'+wind.ruta+selected[0].data.text+'" '+(ancho==0?"":'width="'+ancho+'px"')+'" '+(alto==0?"":'height="'+alto+'px"')+'" />');
					wind.close();
				}
			},
			////////////////////////////////////Eventos Grilla
			
			'[$className=Extidi.sistema.dinamico.view.Grilla]':{
				itemdblclick: function(grid, record, item, index, e, eOpts ){
					grid=grid.ownerCt;
					botones=grid.getDockedItems('[name="acciones"]');
					if(botones.length>0){
						var btn=grid.getDockedItems('[name="acciones"]')[0].down('[name="btnModificar"]');
						if(btn!=null){
							if(grid.down('[name="btnModificar"]').isVisible()===true){
								me.btnModificar(btn);
							}
						}
					}
				},
				AntesCargar: function(comp){
					//comp.removeAll();
					comp.setLoading("Cargando");
					var columnas=[];
					var modelo=[];
					var config={};
					var parametros=comp.parametros
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.dinamico.constantes.URL_MODELO_GRILLA,
						params: {
							modelo: comp.modelo,
							modal: comp.mod
						},
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								columnas=result.data.columnas;
								modelo=result.data.modelo;
								config=result.data.config;
							}
						}
					});
					
					
					for(var i=0;i<columnas.length;i++){
						for(var j=0;j<columnas[i].eval.length;j++){
							var partes=columnas[i].eval[j].split(",");
							var modificar=columnas[i];
							var cadena="";
							for(var z=0;z<partes.length;z++){
								var part=partes[z];
								if(typeof(partes[z]*1)=="number" && partes[z]==partes[z]*1){
									part=partes[z]*1;
									cadena+="["+partes[z]+"]";
								}else{
									cadena+="."+partes[z];
								}
								modificar=modificar[part];
							}
							eval("columnas[i]"+cadena+"="+modificar);
							
						}
					}
					comp.config=config;
					comp.columns=columnas;
					var autoCargar=true;
					if(typeof(comp.AutoCargar)!='undefined'){
						autoCargar=comp.AutoCargar;
					}
					comp.store=Ext.create('Extidi.clases.Store',{
						autoLoad: autoCargar,
						url: Extidi.sistema.dinamico.constantes.URL_LISTADO_GRILLA,
						model: Ext.define('Extidi.sistema.dinamico.model.grilla', {
							extend : 'Ext.data.Model',
							fields: modelo
						}),
						remoteSort: true,
						extraParams: {
							tabla: comp.modelo,
							filtro: Ext.JSON.encode(parametros),
							con: comp.con,
							limit: comp.config["paginador"]
						}
					});
					comp.setLoading(false);
				},
				Cargo: function(comp){
					var paginador=comp.down('[name="paginador"]');
					if(paginador.down('[name="btnFiltrar"]')==null){
						paginador.insert(paginador.items.items.length-2, {
							name: 'btnFiltrar',
							icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnFiltrar.png",
							text: 'Filtrar'
						});
						paginador.insert(paginador.items.items.length-2, {
							name: 'btnQuitarFiltro',
							icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnQuitarFiltro.png",
							text: 'Quitar Filtro',
							hidden: true
						});
					}
				}
            },
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="paginador"] [name="btnFiltrar"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					var mostrar=false;
					if(typeof(crud)!='undefined'){
						var datoPre=crud.grilla.getStore().extraParams.dato;
						if(typeof(datoPre)!='undefined'){
							if(datoPre!=''){
								mostrar=true;
							}
						}
						if(typeof(crud.superior)=='undefined'){
							mostrar=true;
						}
					}else{
						mostrar=true;
					}
					if(mostrar===true){
						var grilla=btn.up('[$className=Extidi.sistema.dinamico.view.Grilla]');
						if(!grilla.fireEvent('antesFiltrar', btn, grilla)){
							return;
						}
						var ventana=grilla.up('window')
						venModal=Ext.create('Extidi.clases.VentanaModal',{
							title: 'Filtrar',
							closeAction: 'hide',
							width: grilla.ancho_filtro,
							modal: false,
							items:[
								Ext.create('Extidi.sistema.dinamico.view.FormularioFiltro',{
									grilla: grilla,
									modelo: grilla.modelo,
									mod: grilla.mod
								})
							],
							listeners: {
								close: function(win){
									var comp=win.down('[_="Extidi.sistema.dinamico.view.FormularioFiltro"]');
									comp.fireEvent('Cerro', comp, win);
								}
							}
						});
						
						if(typeof(ventana)!='undefined'){
							ventana.vensuperior=venModal;
						}
						grilla.fireEvent('despuesFiltrar', btn, grilla, venModal)
					}
				}
			},
			
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="paginador"] [name="btnQuitarFiltro"]':{
				click: function(btn){
					var grilla=btn.up('[$className=Extidi.sistema.dinamico.view.Grilla]');
					grilla.getStore().extraParams.filtro=Ext.JSON.encode({});
					grilla.getStore().load();
					btn.setVisible(false);
				}
			},
			////////////////////////////////////////////////////////////////Eventos Formulario Filtro
			
            '[_="Extidi.sistema.dinamico.view.FormularioFiltro"]':{
				Cerro: function(comp){
					if(typeof(comp.grilla.up('window'))!='undefined'){
						comp.grilla.up('window').setDisabled(false);
					}
				},
				Cargo: function(comp){
					if(typeof(comp.grilla.up('window'))!='undefined'){
						comp.grilla.up('window').setDisabled(true);
					}
					comp.removeAll();
					comp.setLoading("Cargando");
					var modelo=[];
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.dinamico.constantes.URL_MODELO_FORMULARIO_FILTRO,
						params: {
							modelo: comp.modelo,
							modal: comp.mod
						},
						method : 'POST',
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								modelo=result.data;
							}
						}
					});
					
					
					for(var i=0;i<modelo.length;i++){
						for(var j=0;j<modelo[i].eval.length;j++){
							var partes=modelo[i].eval[j].split(",");
							var modificar=modelo[i];
							var cadena="";
							for(var z=0;z<partes.length;z++){
								var part=partes[z];
								if(typeof(partes[z]*1)=="number" && partes[z]==partes[z]*1){
									part=partes[z]*1;
									cadena+="["+partes[z]+"]";
								}else{
									cadena+="."+partes[z];
								}
								modificar=modificar[part];
							}
							eval("modelo[i]"+cadena+"="+modificar);
							
						}
					}
					comp.add(modelo);
					
					var valores=comp.grilla.getStore().extraParams.filtro;
					valores=Ext.JSON.decode(valores);
					Ext.Object.each(valores, function(key, value, myself) {
						var componente=comp.down('[name="'+key+'"]');
						if(componente!=null){
							var componente2=comp.down('[name="'+key+'_fieldcontainer"]');
							if(componente2==null){
								if(componente.$className=="Ext.form.field.ComboBox"){
									componente.getStore().load({
										params: {
											dato: valores[key]
										},
										callback: function(records, operation, success) {
											componente.setValue(value);
										}
									});
								}else if(componente.$className=="Ext.form.field.Date"){
									componente.setValue(Ext.Date.parse(value, "Y-m-d H:i:s"));
								}else{
									componente.setValue(value);
								}
							}else{
								for(var iCom=0;iCom<componente2.items.items.length; iCom++){
									componente=componente2.items.items[iCom];
									if(componente.name!=key){
										componente=componente.down('[name="'+key+'"]');
									}
									value2=value[iCom];
									if(componente.$className=="Ext.form.field.ComboBox"){
										componente.getStore().load({
											params: {
												dato: valores[key]
											},
											callback: function(records, operation, success) {
												componente.setValue(value2);
											}
										});
									}else if(componente.$className=="Ext.form.field.Date"){
										componente.setValue(Ext.Date.parse(value2, "Y-m-d H:i:s"));
									}else{
										componente.setValue(value2);
									}
								}
							}
						}
					});
					comp.setLoading(false);
				}
            },
			
            '[_="Extidi.sistema.dinamico.view.FormularioFiltro"] [name="btnFiltrar"]':{
				click: function(btn){
					var formulario=btn.up('[_="Extidi.sistema.dinamico.view.FormularioFiltro"]');
					var grilla=formulario.grilla;
					var valores=formulario.getForm().getValues();
					//console.debug(grilla.getStore())
					grilla.getStore().extraParams.filtro=Ext.JSON.encode(valores);
					//console.debug(grilla.getStore().first());
					grilla.getDockedItems('toolbar[dock="bottom"]')[0].moveFirst();
					formulario.up('window').close();
					grilla.down('[name="paginador"] [name="btnQuitarFiltro"]').setVisible(true);
				}
			},
			
            '[_="Extidi.sistema.dinamico.view.FormularioFiltro"] [name="btnCancelar"]':{
				click: function(btn){
					var formulario=btn.up('[_="Extidi.sistema.dinamico.view.FormularioFiltro"]');
					formulario.up('window').close();
				}
			},
			
			////////////////////////////////////////////////////////////////Eventos Crud
			
			
            '[$className=Extidi.sistema.dinamico.view.Crud]':{
				render: function(comp){
					if(typeof(comp.title)=='undefined'){
						if(typeof(comp.up('window'))!='undefined'){
							if(comp.posicionFormulario=="modal"){
								comp.formulario.title='Edici&oacute;n de '+comp.up('window').title;
								//comp.title=comp.up('window').title;
							}
						}
					}
				},
				Cargo: function(comp){
					var formulario=null;
					if(comp.posicionFormulario=='modal'){
						formulario=comp.formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]');
					}else{
						formulario=comp.formulario;
					}
					formulario.setDisabled(true);
					if(typeof(comp.permiso)!='undefined'){
						var permisos=[];
						Ext.Ajax.request({
							async: false,
							url : Extidi.sistema.escritorio.constantes.URL_CARGAR_PERMISOS,
							method : 'POST',
							params: {
								modulo: comp.permiso
							},
							success : function(result, request) {
								result=Ext.JSON.decode(result.responseText);
								if(result.success){
									permisos=result.datos;
									if(permisos.length>0){
										permisos=permisos[0].permisos.split(',');
									}
								}
							}
						});
						
						comp.fireEvent('Permisos2', comp, permisos);
					}
				},
				Permisos2: function(comp, permisos){
					me.PermisosDinamico(comp, permisos);
				},
				Permisos: function(comp, permisos){
					me.PermisosDinamico(comp, permisos);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Crud] [$className=Extidi.sistema.dinamico.view.Grilla]':{
				selectionchange: function(grid, seleccionados, eOpts){
					var grilla=grid.view.panel;
					var crud=grilla.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					if(!grilla.fireEvent('antesSeleccionar', grilla, seleccionados)){
						return;
					}
					var formulario=crud.formulario;
					var idPrincipal="";
					if(seleccionados.length==1){
						var mostrar=false;
						if(crud.posicionFormulario=='modal'){
							if(formulario.isVisible()){
								mostrar=true;
							}
							formulario=formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]');
						}else{
							mostrar=true;
						}
						formulario.getForm().reset();
						formulario.setDisabled(false);
						if(mostrar==true){
							var valores=seleccionados[0];
							//console.debug(valores)
							//console.debug(formulario)
							Ext.Object.each(valores.data, function(key, value, myself) {
								//console.debug('[name="'+key+'"]')
								//console.debug(value)
								var componente=formulario.down('[name="'+key+'"]');
								if(componente!=null){
									if(componente.$className=="Ext.form.field.ComboBox"){
										componente.getStore().load({
											params: {
												dato: valores.data[key]
											},
											callback: function(records, operation, success) {
												componente.setValue(value);
											}
										});
									}else if(componente.$className=="Ext.form.field.File"){
										var boton=componente.up().down('[name="btnDescargar"]');
										componente.valor=value;
										if(value!=null && value!=""){
											boton.setVisible(true);
										}else{
											boton.setVisible(false);
										}
									}else{
										componente.setValue(value);
									}
								}
							});
						}
						idPrincipal=seleccionados[0].get(grilla.config.llave);
					}else{
						if(crud.posicionFormulario=='modal'){
							if(formulario.isVisible()){
							}
							formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]').getForm().reset();
						}else{
							formulario.getForm().reset();
						}
					}
					
					if(!grilla.fireEvent('antesDetalleSeleccionar', grilla, seleccionados, crud.detalles)){
						return;
					}
					if(crud.detalles.length>0){
						for(var i=0;i<crud.detalles.length;i++){
							var modelo=crud.detalles[i].modelo;
							var campo=crud.detalles[i].campo;
							var deta=crud.down('[modelo="'+modelo+'"]');
							eval('var vari=Ext.JSON.encode({ "'+campo+'": "'+idPrincipal+'" })');
							if(idPrincipal==""){
								vari="";
							}
							deta.grilla.getStore().extraParams["dato"]=vari;
							//console.debug(deta.grilla.getStore().extraParams);
							if(idPrincipal==""){
								deta.grilla.getStore().removeAll();
							}else{
								deta.grilla.getStore().load();
							}
							deta.grilla.down('[name="paginador"] [name="btnQuitarFiltro"]').setVisible(false);
						}
					}
					grilla.fireEvent('despuesSeleccionar', grilla, seleccionados);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnCrear"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					if(!crud.grilla.fireEvent('antesCrear', crud.grilla, btn)){
						return;
					}
					var mostrar=false;
					var datoPre=crud.grilla.getStore().extraParams.dato;
					if(typeof(datoPre)!='undefined'){
						if(datoPre!=''){
							mostrar=true;
						}
					}
					if(typeof(crud.superior)=='undefined'){
						mostrar=true;
					}
					if(mostrar===true){
						var formulario={};
						if(crud.posicionFormulario=='modal'){
							crud.formulario.show();
							formulario=crud.formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]');
						}else{
							formulario=crud.formulario;
						}
						if(formulario.fireEvent('antesMostrarFormulario', formulario)){
							formulario.getForm().reset();
							formulario.setDisabled(false);
							if(typeof(crud.permiso)!='undefined'){
								var valores=Ext.JSON.decode(datoPre);
								Ext.Object.each(valores, function(key, value, myself) {
									var componente=formulario.down('[name="'+key+'"]');
									if(componente!=null){
										if(componente.$className=="Ext.form.field.ComboBox"){
											componente.getStore().load({
												params: {
													dato: valores[key]
												},
												callback: function(records, operation, success) {
													componente.setValue(value);
												}
											});
										}else if(componente.$className=="Ext.form.field.File"){
											var boton=componente.up().down('[name="btnDescargar"]');
											componente.valor=value;
											if(value!=null && value!=""){
												boton.setVisible(true);
											}else{
												boton.setVisible(false);
											}
										}else{
											componente.setValue(value);
										}
									}
								});
							}
						}
						formulario.fireEvent('despuesMostrarFormulario', formulario);
						crud.grilla.getSelectionModel().deselectAll();
					}
					crud.grilla.fireEvent('despuesCrear', crud.grilla, btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnModificar"]':{
				click: function(btn){
					me.btnModificar(btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnEliminar"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					var seleccionados = crud.grilla.getSelectionModel().getSelection();
					if(!crud.grilla.fireEvent('antesEliminar', crud.grilla, btn, seleccionados)){
						return;
					}
					if(seleccionados.length>0){
						var id=crud.grilla.config.llave;
						var formulario=null;
						if(crud.posicionFormulario=='modal') {
							formulario=crud.formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]');
						}else{
							formulario=crud.formulario;
						}
						formulario.setDisabled(false);
						var valores=[];
						
						for(var i=0;i<seleccionados.length;i++){
							valores.push(seleccionados[i].get(id));
						}
						if(valores.length==0){
							return;
						}
                        Extidi.Msj.confirm(
							'&iquest;Desea eliminar '+(seleccionados.length>1?'los':'el')+' registro'+(seleccionados.length>1?'s':'')+' seleccionado'+(seleccionados.length>1?'s':'')+'?',
							function(btn2){
								if(!crud.grilla.fireEvent('antesConfirmarEliminar', crud.grilla, btn, seleccionados, btn2)){
									return;
								}
								if(btn2=="yes"){
									Ext.Ajax.request({
										url : Extidi.sistema.dinamico.constantes.URL_ELIMINAR,
										params: {
											modelo: formulario.modelo,
											datos: Ext.JSON.encode(valores)
										},
										method : 'POST',
										success : function(result, request) {
											result=Ext.JSON.decode((result.responseText))
											var mensaje = result.mensaje;
											Extidi.Msj.info(mensaje);
											crud.grilla.getStore().load();
											formulario.getForm().reset();
											crud.grilla.fireEvent('despuesEliminar', crud.grilla, btn, seleccionados, result);
										}
									});
								}
								crud.grilla.fireEvent('despuesConfirmarEliminar', crud.grilla, btn, seleccionados, btn2);
							}
						);
					}
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnActivar"]':{
				click: function(btn){
					
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					
					var seleccionados=crud.grilla.getSelectionModel().getSelection();
					if(!crud.grilla.fireEvent('antesActivar', crud.grilla, btn, seleccionados)){
						return;
					}
					if(seleccionados.length>0){
						var id=crud.grilla.config.llave;
						var formulario=null;
						if(crud.posicionFormulario=='modal'){
							formulario=crud.formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]');
						}else{
							formulario=crud.formulario;
						}
						formulario.setDisabled(false);
						var valores=[];
						
						for(var i=0;i<seleccionados.length;i++){
							valores.push(seleccionados[i].get(id));
						}
						if(valores.length==0){
							return;
						}
						Extidi.Msj.confirm(
							'&iquest;Desea activar '+(seleccionados.length>1?'los':'el')+' registro'+(seleccionados.length>1?'s':'')+' seleccionado'+(seleccionados.length>1?'s':'')+'?',
							function(btn2){
								if(!crud.grilla.fireEvent('antesConfirmarActivar', crud.grilla, btn, seleccionados, btn2)){
									return;
								}
								if(btn2=="yes"){
									Ext.Ajax.request({
										url : Extidi.sistema.dinamico.constantes.URL_ACTIVAR,
										params: {
											modelo: formulario.modelo,
											datos: Ext.JSON.encode(valores)
										},
										method : 'POST',
										success : function(result, request) {
											result=Ext.JSON.decode((result.responseText))
											var mensaje = result.mensaje;
											Extidi.Msj.info(mensaje);
											crud.grilla.getStore().load();
											formulario.getForm().reset();	
											crud.grilla.fireEvent('despuesActivar', crud.grilla, btn, seleccionados, result);	
										}
									});
								}
								crud.grilla.fireEvent('despuesConfirmarActivar', crud.grilla, btn, seleccionados, btn2);
							}
						);
					}
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnInactivar"]':{
				click: function(btn){
					
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					var seleccionados=crud.grilla.getSelectionModel().getSelection();
					if(!crud.grilla.fireEvent('antesInactivar', crud.grilla, btn, seleccionados)){
						return;
					}
					if(seleccionados.length>0){
						var id=crud.grilla.config.llave;
						var formulario=null;
						if(crud.posicionFormulario=='modal'){
							formulario=crud.formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]');
						}else{
							formulario=crud.formulario;
						}
						formulario.setDisabled(false);
						var valores=[];
						
						for(var i=0;i<seleccionados.length;i++){
							valores.push(seleccionados[i].get(id));
						}
						if(valores.length==0){
							return;
						}
						Extidi.Msj.confirm(
							'&iquest;Desea inactivar '+(seleccionados.length>1?'los':'el')+' registro'+(seleccionados.length>1?'s':'')+' seleccionado'+(seleccionados.length>1?'s':'')+'?',
							function(btn2){
								if(!crud.grilla.fireEvent('antesConfirmarInactivar', crud.grilla, btn, seleccionados, btn2)){
									return;
								}
								if(btn2=="yes"){
									Ext.Ajax.request({
										url : Extidi.sistema.dinamico.constantes.URL_INACTIVAR,
										params: {
											modelo: formulario.modelo,
											datos: Ext.JSON.encode(valores)
										},
										method : 'POST',
										success : function(result, request) {
											result=Ext.JSON.decode((result.responseText))
											var mensaje = result.mensaje;
											Extidi.Msj.info(mensaje);
											crud.grilla.getStore().load();
											formulario.getForm().reset();
											crud.grilla.fireEvent('despuesInactivar', crud.grilla, btn, seleccionados, btn2, result)
										}
									});
								}
								crud.grilla.fireEvent('despuesConfirmarInactivar', crud.grilla, btn, seleccionados, btn2)
							}
						);
					}
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnExportarExcel"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					if(!crud.grilla.fireEvent('antesExportarExcel', crud.grilla, btn)){
						return;
					}
					var mostrar=false;
					var datoPre=crud.grilla.getStore().extraParams.dato;
					if(typeof(datoPre)!='undefined'){
						if(datoPre!=''){
							mostrar=true;
						}
					}
					if(typeof(crud.superior)=='undefined'){
						mostrar=true;
					}
					if(mostrar===true){
						var parametros=crud.grilla.getStore().extraParams;
						Ext.create('Ext.form.Panel', {
							standardSubmit: true
						}).getForm().submit({
							url : Extidi.sistema.dinamico.constantes.URL_EXCEL,
							target : "_blank",
							params: parametros
						});
						}
					crud.grilla.fireEvent('despuesExportarExcel', crud.grilla, btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnExportarPdf"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					if(!crud.grilla.fireEvent('antesExportarPdf', crud.grilla, btn)){
						return;
					}
					var mostrar=false;
					var datoPre=crud.grilla.getStore().extraParams.dato;
					if(typeof(datoPre)!='undefined'){
						if(datoPre!=''){
							mostrar=true;
						}
					}
					if(typeof(crud.superior)=='undefined'){
						mostrar=true;
					}
					if(mostrar===true){
						var parametros=crud.grilla.getStore().extraParams;
						Ext.create('Ext.form.Panel', {
							standardSubmit: true
						}).getForm().submit({
							url : Extidi.sistema.dinamico.constantes.URL_PDF,
							target : "_blank",
							params: parametros
						});
						}
					crud.grilla.fireEvent('despuesExportarPdf', crud.grilla, btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnExportarCsv"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					if(!crud.grilla.fireEvent('antesExportarCsv', crud.grilla, btn)){
						return;
					}
					var mostrar=false;
					var datoPre=crud.grilla.getStore().extraParams.dato;
					if(typeof(datoPre)!='undefined'){
						if(datoPre!=''){
							mostrar=true;
						}
					}
					if(typeof(crud.superior)=='undefined'){
						mostrar=true;
					}
					if(mostrar===true){
						var parametros=crud.grilla.getStore().extraParams;
						Ext.create('Ext.form.Panel', {
							standardSubmit: true
						}).getForm().submit({
							url : Extidi.sistema.dinamico.constantes.URL_CSV,
							target : "_blank",
							params: parametros
						});
					}
					crud.grilla.fireEvent('despuesExportarCsv', crud.grilla, btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnImprimir"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					if(!crud.grilla.fireEvent('antesImprimir', crud.grilla, btn)){
						return;
					}
					var mostrar=false;
					var datoPre=crud.grilla.getStore().extraParams.dato;
					if(typeof(datoPre)!='undefined'){
						if(datoPre!=''){
							mostrar=true;
						}
					}
					if(typeof(crud.superior)=='undefined'){
						mostrar=true;
					}
					if(mostrar===true){
						var parametros=crud.grilla.getStore().extraParams;
						Ext.create('Ext.form.Panel', {
							standardSubmit: true
						}).getForm().submit({
							url : Extidi.sistema.dinamico.constantes.URL_IMPRIMIR,
							target : "_blank",
							params: parametros
						});
					}
					crud.grilla.fireEvent('despuesImprimir', crud.grilla, btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Grilla] [name="btnImportar"]':{
				click: function(btn){
					var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
					if(!crud.grilla.fireEvent('antesImportar', crud.grilla, btn)){
						return;
					}
					var mostrar=false;
					var datoPre=crud.grilla.getStore().extraParams.dato;
					if(typeof(datoPre)!='undefined'){
						if(datoPre!=''){
							mostrar=true;
						}
					}
					if(typeof(crud.superior)=='undefined'){
						mostrar=true;
					}
					if(mostrar===true){
						var modelo='';
						if(crud.posicionFormulario=='modal'){
							modelo=crud.formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]').modelo;
						}else{
							modelo=crud.formulario.modelo;
						}
						Ext.create('Extidi.clases.VentanaModal',{
							title: 'Importar',
							layout: 'fit',
							width: 450,
							height: 180,
							items: [
								Ext.create('Extidi.sistema.dinamico.view.Importar', {
									modelo: modelo
								})
							]
						})
					}
					crud.grilla.fireEvent('despuesImportar', crud.grilla, btn);
				}
			},
			'[$className=Extidi.sistema.dinamico.view.Importar] [name="btnPlantilla"]':{
				click: function(btn){
					Ext.create('Ext.form.Panel', {
						standardSubmit: true
					}).getForm().submit({
						url : Extidi.sistema.dinamico.constantes.URL_PLANTILLA,
						target : "_blank",
						params: {
							modelo: btn.up('[$className=Extidi.sistema.dinamico.view.Importar]').modelo
						}
					});
				}
			},

			'[$className=Extidi.sistema.dinamico.view.Importar] [name="btnImportar"]': {
				click: function(btn) {
					
					var formulario = btn.up('form').getForm();

					if(formulario.isValid()){
	                    formulario.submit({
	                        url: Extidi.sistema.dinamico.constantes.URL_IMPORTAR,
	                        waitMsg: 'Importando datos...',
	                        success: function(fp, o) {
	                            Extidi.Msj.info('Success', 'Processed file "' + o.result.file + '" on the server');
	                        }
	                    });
	                }
				}
			},

			'[$className=Extidi.sistema.dinamico.view.Importar] [name="btnCancelar"]': {
				click: function(btn) {
					var modal = btn.up('window');
					modal.close();
				}
			},
			
            '[$className=Extidi.sistema.dinamico.view.ComboValorParametro] [name="btnBuscar"]':{
				click: function(btn){
					me.BusquedaForaneo(btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.ComboValorParametro] [name="btnQuitar"]':{
				click: function(btn){
					var combo=btn.up().down('combo');
					combo.setValue();
					var botonQuitar=btn;
					botonQuitar.setVisible(false);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.ComboForaneo] [name="btnBuscar"]':{
				click: function(btn){
					me.BusquedaForaneo(btn);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.ComboForaneo] [name="btnQuitar"]':{
				click: function(btn){
					var combo=btn.up().down('combo');
					combo.setValue();
					var botonQuitar=btn;
					botonQuitar.setVisible(false);
				}
			},
            '[_="Extidi.sistema.dinamico.view.FormularioFiltro"] [name="btnBuscar"]':{
				click: function(btn){
					if(typeof(btn.up('[$className=Extidi.sistema.dinamico.view.ComboForaneo]'))=='undefined'){
						if(typeof(btn.up('[$className=Extidi.sistema.dinamico.view.ComboValorParametro]'))=='undefined'){
							me.BusquedaForaneo(btn);
						}
					}
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Formulario] [name="btnBuscar"]':{
				click: function(btn){
					if(typeof(btn.up('[$className=Extidi.sistema.dinamico.view.ComboForaneo]'))=="undefined"){
						if(typeof(btn.up('[$className=Extidi.sistema.dinamico.view.ComboValorParametro]'))=="undefined"){
							me.BusquedaForaneo(btn);
						}
					}
				}
			},
            '[_="Extidi.sistema.dinamico.view.FormularioFiltro"] [name="btnQuitar"]':{
				click: function(btn){
					var combo=btn.up().down('combo');
					combo.setValue();
					var botonModificar=btn.up().down('[name="btnModificarModal"]');
					var botonQuitar=btn;
					if(botonModificar!=null){
						botonModificar.setVisible(false);
					}
					botonQuitar.setVisible(false);
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Formulario] [name="btnQuitar"]':{
				click: function(btn){
					if(typeof(btn.up('[$className=Extidi.sistema.dinamico.view.ComboForaneo]'))=="undefined"){
						if(typeof(btn.up('[$className=Extidi.sistema.dinamico.view.ComboValorParametro]'))=="undefined"){
							var combo=btn.up().down('combo');
							combo.setValue();
							var botonModificar=btn.up().down('[name="btnModificarModal"]');
							var botonQuitar=btn;
							if(botonModificar!=null){
								botonModificar.setVisible(false);
							}
							botonQuitar.setVisible(false);
						}
					}
				}
			},
			'[$className=Extidi.sistema.dinamico.view.Formulario] [name="btnDescargar"]':{
				click: function(btn){
					var url=Extidi.BASE_PATH+btn.up().down('[name="'+btn.columna+'"]').valor;
					Ext.create('Ext.form.Panel', {
						standardSubmit: true
					}).getForm().submit({
						url : url,
						target : "_blank"
					});
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Formulario] combo':{
				change: function(combo, newValue){
					if(combo.up().$className!="Extidi.sistema.dinamico.view.Formulario"){
						var botonModificar=combo.up().down('[name="btnModificarModal"]');
						var botonQuitar=combo.up().down('[name="btnQuitar"]');
						if(newValue!=null){
							newValue=newValue.replace(/^\s+/,'').replace(/\s+$/,'')
							if(newValue!="" && newValue!="0"){
								if(botonModificar!=null){
									botonModificar.setVisible(true);
								}
								if(botonQuitar!=null){
									botonQuitar.setVisible(true);
								}
							}else{
								if(botonModificar!=null){
									botonModificar.setVisible(false);
								}
								if(botonQuitar!=null){
									botonQuitar.setVisible(false);
								}
							}
						}else{
							if(botonModificar!=null){
								botonModificar.setVisible(false);
							}
							if(botonQuitar!=null){
								botonQuitar.setVisible(false);
							}
						}
					}
				},
				select: function(combo, records, eOpts){
					if(combo.up().$className!="Extidi.sistema.dinamico.view.Formulario") {
						var botonModificar=combo.up().down('[name="btnModificarModal"]');
						var botonQuitar=combo.up().down('[name="btnQuitar"]');
                        combo.fireEvent('antesSeleccionar', combo, records);
						if(records.length == 1) {
							if(botonModificar != null)
								botonModificar.setVisible(true);
							if(botonQuitar!=null)
								botonQuitar.setVisible(true);
						} else {
							if(botonModificar!=null)
								botonModificar.setVisible(false);
							if(botonQuitar!=null)
								botonQuitar.setVisible(false);
						}
                        combo.fireEvent('despuesSeleccionar', combo, records);
					}
				}
			},
            '[accion="busqueda_combo"] [$className=Extidi.sistema.dinamico.view.Grilla]':{
				selectionchange: function(grid, seleccionados, eOpts){
					var grilla=grid.view.panel;
					var ventana=grilla.up('[accion="busqueda_combo"]');
					var combo=ventana.combo;
					if(seleccionados.length==1){
						var id=grilla.config.llave;
						combo.getStore().load({
							params: {
								dato: seleccionados[0].get(id),
								campo: id
							},
							callback: function(records, operation, success) {
                                combo.fireEvent('antesSeleccionar', combo, records);
								combo.setValue(seleccionados[0].get(id));
								ventana.close();
                                combo.fireEvent('despuesSeleccionar', combo, records);
							}
						});
						combo.dato = seleccionados[0];
						var botonModificar=combo.up().down('[name="btnModificarModal"]');
						var botonQuitar=combo.up().down('[name="btnQuitar"]');
						if(botonModificar!=null){
							botonModificar.setVisible(true);
						}
						if(botonQuitar!=null){
							botonQuitar.setVisible(true);
						}
					}
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Formulario] [name="btnCrearModal"]':{
				click: function(btn){
					var combo=btn.up('fieldcontainer').down('combo');
					var parametros=combo.getStore().extraParams;
					var ventana=btn.up('window')
					var parametro={};
					var modelo="";
					
					
					if(combo.getStore().$className=="Extidi.clases.StoreValorParametro"){
						modelo="extidi_valorparametro";
						Ext.apply(parametro, {
							NombreCampo: parametros.NombreCampo
						});
						tipoCombo="valorparametro";
					}else{
						modelo=parametros.tabla;
						tipoCombo="foraneo";
					}
					
					formulario=Ext.create('Extidi.sistema.dinamico.view.Formulario', {
						tipo: 'modalCombo',
						tipoCombo: tipoCombo,
						border: true,
						modelo: modelo,
						combo: combo,
						parametro: parametro//,
						//width: me.anchoFormulario
					});
					
					if(combo.getStore().$className=="Extidi.clases.StoreValorParametro"){
						formulario.down('[name="IdParametro"]').up().setVisible(false);
					}
					ventana.vensuperior=Ext.create('Extidi.clases.VentanaModal', {
						title: 'Creaci&oacute;n de '+combo.fieldLabel,
						draggable: false,
						closeAction: 'hide',
						autoShow: true,
						modal: true,
						//width: me.anchoFormulario,
						items: [
							formulario
						]
					});
				}
			},
            '[$className=Extidi.sistema.dinamico.view.Formulario] [name="btnModificarModal"]':{
				click: function(btn){
					var combo = btn.up('fieldcontainer').down('combo');
					var parametros = combo.getStore().extraParams;
					var ventana = btn.up('window');
                    var parametro = {};
					var modelo = "";
					var tipoCombo = "";
					if(combo.getStore().$className=="Extidi.clases.StoreValorParametro") {
						modelo = "extidi_valorparametro";
						Ext.apply(parametro, { NombreCampo: parametros.NombreCampo });
						tipoCombo = "valorparametro";
					} else {
						modelo = parametros.tabla;
						tipoCombo = "foraneo";
					}
					
					var valores = [];
					Ext.Ajax.request({
						async: false,
						url : Extidi.sistema.dinamico.constantes.URL_CARGAR_MODAL,
						method : 'POST',
						params: {
							modelo: modelo,
							id: combo.getValue()
						},
						success : function(result, request) {
							result=Ext.JSON.decode(result.responseText);
							if(result.success){
								valores=result.data;
								if(valores.length>0){
									valores=valores[0];
								}
							}
						}
					});
					
					
					ventana.vensuperior=Ext.create('Extidi.clases.VentanaModal', {
						title: 'Creaci&oacute;n de '+combo.fieldLabel,
						draggable: false,
						closeAction: 'hide',
						autoShow: true,
						modal: true,
						items: [
							Ext.create('Extidi.sistema.dinamico.view.Formulario', {
								tipo: 'modalCombo',
								tipoCombo: tipoCombo,
								border: true,
								modelo: modelo,
								combo: combo,
								parametro: parametro,
								valores: valores
							})
						]
					});
				}
			}
		});
	},
	BusquedaForaneo: function(btn){
		var me=this;
		var windows    = btn.up('fieldcontainer').up();
		var combo      = btn.up('fieldcontainer').down('combo');
		var parametros = combo.getStore().extraParams;
		var parametro  = {};
		var modelo     = "";
		if(combo.getStore().$className=="Extidi.clases.StoreValorParametro") {
			modelo="extidi_valorparametro";
		} else {
			modelo=parametros.tabla;
		}
		windows.setDisabled(true);
		var ventana=btn.up('window')
		
		venModal=Ext.create('Extidi.clases.VentanaModal', {
			accion: 'busqueda_combo',
			title: 'Buscar',
			draggable: true,
			combo: combo,
			autoShow: true,
			modal: false,
			width: 600,
			closeAction: 'hide',
			items: [
				Ext.create('Extidi.sistema.dinamico.view.Grilla', {
					modelo: modelo,
					mod: '1',
					parametros: parametro,
					con: parametros.con,
					flex: 1
				})
			],
			listeners: {
				close: function(ven){
					windows.setDisabled(false);
				}
			}
		});
		if(typeof(ventana)!='undefined'){
			ventana.vensuperior=venModal;
		}
	},
	PermisosDinamico: function(comp, permisos){
		var relaciones={
			'crear': 'btnCrear',
			'modificar': 'btnModificar',
			'eliminar': 'btnEliminar',
			'activar': 'btnActivar',
			'inactivar': 'btnInactivar',
			'exportarexcel': 'btnExportarExcel',
			'exportarpdf': 'btnExportarPdf',
			'exportarcsv': 'btnExportarCsv',
			'imprimir': 'btnImprimir',
			'importar': 'btnImportar'
		}
		var toolbar=comp.grilla.down('toolbar[name="acciones"]');
		if(toolbar!=null){
			Ext.Ajax.request({
				async: false,
				url : Extidi.sistema.dinamico.constantes.URL_MODELO_ACCIONES_ADICIONALES,
				method : 'POST',
				params: {
					modulo: comp.modelo
				},
				success : function(result, request) {
					result=Ext.JSON.decode(result.responseText);
					if(result.success){
						botones=result.data;
						for(var i=0; i<botones.length; i++){
							toolbar.add(botones[i]);
						}
					}
				}
			});
			for(var i=0; i<permisos.length; i++){
				var name=relaciones[permisos[i]];
				var boton=null;
				if(typeof(name)=='undefined'){
					boton=toolbar.down('[name="'+permisos[i]+'"]');
				}
				if(typeof(name)!='undefined'){
					if(name!='btnModificar'){
						boton=toolbar.down('[name="'+name+'"]');
					}else if(comp.posicionFormulario=='modal'){
						boton=toolbar.down('[name="'+name+'"]');
					}
				}
				if(boton!=null){
					boton.setVisible(true);
				}
			}
		}
		comp.fireEvent('CargoAcciones', comp, comp.grilla);
	},
	btnModificar: function(btn){
		var crud=btn.up('[$className=Extidi.sistema.dinamico.view.Crud]');
		var seleccionados = crud.grilla.getSelectionModel().getSelection();
		if(!crud.grilla.fireEvent('antesModificar', crud.grilla, btn, seleccionados)){
			return;
		}
		
		if(seleccionados.length>0){
			var formulario=null;
			if(crud.posicionFormulario=='modal'){
				crud.formulario.show();
				formulario=crud.formulario.down('[$className=Extidi.sistema.dinamico.view.Formulario]');
			}else{
				formulario=crud.formulario;
			}
			
			if(formulario.fireEvent('antesMostrarFormulario', formulario, seleccionados[0])){
				formulario.setDisabled(false);
				formulario.getForm().reset();
				
				var valores = seleccionados[0];
				Ext.Object.each(valores.data, function(key, value, myself) {
					var componente=formulario.down('[name="'+key+'"]');
					if(componente!=null){
						if(componente.$className=="Ext.form.field.ComboBox"){
							componente.getStore().load({
								params: {
									dato: valores.data[key]
								},
								callback: function(records, operation, success) {
									componente.setValue(value);
									var botonModificar=componente.up().down('[name="btnModificarModal"]');
									var botonQuitar=componente.up().down('[name="btnQuitar"]');
									if(value!=null){
										value=value.replace(/^\s+/,'').replace(/\s+$/,'');
									}
									if(botonModificar!=null){
										if(value!="" && value!=null && value!="0"){
											botonModificar.setVisible(true);
										}else{
											botonModificar.setVisible(false);
										}
									}
									if(botonQuitar!=null){
										if(value!="" && value!="0"){
											botonQuitar.setVisible(true);
										}else{
											botonQuitar.setVisible(false);
										}
									}
								}
							});
						}else if(componente.$className=="Ext.form.field.File"){
							var boton=componente.up().down('[name="btnDescargar"]');
							componente.valor=value;
							if(value!=null && value!=""){
								boton.setVisible(true);
							}else{
								boton.setVisible(false);
							}
						}else{
							componente.setValue(value);
						}
					}
				});
			}
			formulario.fireEvent('despuesMostrarFormulario', formulario, seleccionados[0]);
		}
		crud.grilla.fireEvent('despuesModificar', crud.grilla, btn, seleccionados);
	}
});