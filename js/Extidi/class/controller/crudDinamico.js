Ext.define("Extidi.class.controller.crudDinamico",{
    extend		: "Ext.app.Controller",
    selectors : [],
    init	: function() {
        var me = this;
        me.control({
            "nucleocruddinamico"	: {
                clickElementoGrilla : this.clickElementoGrilla,
                grillaNuevo : this.grillaNuevo,
                formularioGuardar : this.formularioGuardar,
                grillaActivarEstado : this.grillaActivarEstado,
                grillaInactivarEstado: this.grillaInactivarEstado,
                grillaEliminar: this.grillaEliminar,
                formularioBorrar: this.formularioBorrar,
                grillaExportarPdf: this.grillaExportarPdf,               
                grillaExportarCsv: this.grillaExportarCsv,
                grillaExportarExcel: this.grillaExportarExcel,
                asignarPermisos: this.asignarPermisos,
                grillaImprimir: this.grillaImprimir,
                grillaImportar: this.grillaImportar
            },
            'window[name="importarvista"]': {
                Importar: this.importarImportar,
                Guardar : this.importarGuardar,
                Cancelar: this.importarCancelar
            },
            'nucleocruddinamico > form > fieldset > fieldcontainer > button[name="verArchivo"]': {
                click: this.verArchivo         
            },
			'[title="Filtrador"] combo':{
                expand: this.expand
			},
            'nucleocruddinamico > form > fieldset > combo': {
                expand: this.expand
            },
            'listaModalVista > grilla' : {                
                itemclick: this.clickElementoForaneos             
            },
            'nucleocruddinamico [name="html"]': {
				'render': function(panel) {
					panel.getEl().on('click', function() {
						me.abrirVentanaText(panel.up('fieldcontainer').down('textareafield'))
					});
				}
            },
            'window[name="ventanaText"] [name=btnAceptar]' : {                
                click: this.aceptarVentanaText            
            },
            'window[name="ventanaText"] [name=btnCancelar]' : {                
                click: this.cancelarVentanaText            
            },
            'window[name="ventanaText"] [name=btnInsertarImagen]' : {                
                click: this.insertarImagen            
            },
            'insertarimagenvista > form > dataview':{
                itemclick: this.seleccionarImagen
            },
            'insertarimagenvista button[name=btnSubir]':{
                click: this.subirImagen
            },
            'insertarimagenvista [name=carpetas]':{
                itemclick: this.seleccionarCarpeta
            },
            'insertarimagenvista [name=crearCarpeta]':{
                click: this.crearCarpeta
            }
        });
    },
	
    /**
	 * This method add the window id to the selectors, this way we can create more the one
	 * instance of the same window. 
	 * @param {Object} actions An object with the selectors
	 */
    control		: function(actions){
        /*var me = this;
		if(Ext.isObject(actions)){
			var obj = {};
			Ext.Object.each(actions,function(selector){
				var s = "#"+this.win.id+" "+selector;
				obj[s] = actions[selector];
			},this);
			delete actions;
			me.selectors.push(obj);
			this.callParent([obj]);
		}else{*/
        this.callParent(arguments);
    //}
    },
   
    asignarPermisos: function (permisos, field) {

        var botonesAOcultar=Array();
        var nuevo=false;
        var modificar=false;
        var eliminar=false;
        var activar=false;
        var inactivar=false;
        var exportarexcel=false;
        var exportarpdf=false;
        var exportarcsv=false;        
        var importar=false;
        var imprimir=false;
        
        for (var i = 0; i < permisos.length; i++) {
            if(permisos[i].NombreAccion==="crear"){
                nuevo=true;
            }
            if(permisos[i].NombreAccion==="modificar"){
                modificar=true;
            }
            if(permisos[i].NombreAccion==="eliminar"){
                eliminar=true;
                
            }
            if(permisos[i].NombreAccion==="activar"){
                activar=true;
            }
            if(permisos[i].NombreAccion==="inactivar"){
                inactivar=true;
            }
            if(permisos[i].NombreAccion==="exportarexcel"){
                exportarexcel=true;
            }
            if(permisos[i].NombreAccion==="exportarpdf"){
                exportarpdf=true;
            }
            if(permisos[i].NombreAccion==="exportarcsv"){
                exportarcsv=true;
            }           
            if(permisos[i].NombreAccion==="importar"){
                importar=true;
            }
            if(permisos[i].NombreAccion==="imprimir"){
                imprimir=true;
            }
        }
        if(nuevo){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_NUEVO_TABCRUD
                )    
        }
        if(eliminar){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_ELIMINAR_TABCRUD
                )
        }
        if(activar){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_ACTIVAR_TABCRUD
                )
        }
        if(inactivar){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_INACTIVAR_TABCRUD
                )
        }
        if(exportarexcel){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_EXPORTAR_EXCEL_TABCRUD
                )
        }
        if(exportarpdf){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_EXPORTAR_PDF_TABCRUD
                )
        }
        if(exportarcsv){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_EXPORTAR_CSV_TABCRUD
                )
        }       
        if(importar){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_IMPORTAR_TABCRUD
                )
        }
        if(imprimir){
            botonesAOcultar.push(
                Extidi.Constantes.BOTON_IMPRIMIR_TABCRUD
                )
        }
        Extidi.Helper.desocultarBotones(
            field.getToolbarGrillaPrincipal(), 
            botonesAOcultar
            );
        botonesAOcultar=Array();
        if(modificar){
            botonesAOcultar.push(Extidi.Constantes.BOTON_GUARDAR_TABCRUD);
            botonesAOcultar.push(Extidi.Constantes.BOTON_BORRAR_TABCRUD);
        }
        Extidi.Helper.desocultarBotones(
            field.getToolbarFormulario(),
            botonesAOcultar
            )

        if(field.esDetalle){
            //if(field.up().up().$className=="Ext.tab.Panel"){
            //field.up().setTitle(field.table);
            field.setDisabled(true);
        }

        if(field.modelo.isFormShow==false){
            //field.down('tabpanel').hide()
        }        
		field.fireEvent("afterAsignarPermisos", field, field.getFormularioEdicion(), field.getGrillaPrincipal(),field.getToolbarGrillaPrincipal(), field.getToolbarFormulario());

    },

    crearCarpeta: function (esto) {

        Ext.Msg.prompt('Nombre de Carpeta', 'Por favor, ingrese el nombre de la carpeta:', function(btn, text){
            if (btn == 'ok'){

                Ext.Ajax.request({
                    url : Extidi.BASE_PATH+"index.php/cruddinamico/crearCarpeta",
                    params : {
                        text: text,
                        ubicacionActual: esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('[name=ubicacionActual]').getValue()
                    },
                    method : 'POST',
                    success : function(result, request) {
                        esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('[name=carpetas]').getStore().load()
                    }
                });
            }

        });

    },

    seleccionarCarpeta: function(esto, record) {
        esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('[name=ubicacionActual]').setValue(record.get('id'));
        esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('[name=principal]').getStore().proxy.setExtraParam('carpeta', record.get('id'));                
        esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('[name=principal]').getStore().load()
    },

    seleccionarImagen: function(esto, record) {

        var html='<img src="'+record.data.src+'">';        
        esto.up('[_="Extidi.class.view.VisInsertarImagen"]').campoTexto.insertAtCursor(html);       
        esto.up('[_="Extidi.class.view.VisInsertarImagen"]').close();
    },

    subirImagen: function (esto, e, eOpts) {

        var me=this;
        
        var form=esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('form').getForm();

        if(form.isValid()){
            form.submit({
                url : Extidi.Constantes.URL_SUBIR_IMAGEN,
                method : 'POST',
                params : {
                    ubicacionActual: esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('[name=ubicacionActual]').getValue()
                },
                //waitMsg : 'Cargando Archivo...',
                success : function(request, result) {
                    var resultado = Ext.JSON.decode((result.response.responseText)).success;
                    var mensaje = Ext.JSON.decode((result.response.responseText)).mensaje;
                    if (resultado) {
                        esto.up('[_="Extidi.class.view.VisInsertarImagen"]').down('form').down('dataview').getStore().load();
                        form.reset(); 
                    }
                },
                failure : function(request, result) {
                    var mensaje = Ext.JSON.decode((result.response.responseText)).mensaje;
                    Extidi.Msj.error(mensaje);
                }
            });
        }
    },

    insertarImagen: function (esto){       
        var win=Ext.create("Extidi.class.view.VisInsertarImagen", {
            campoTexto: esto.up().up().down('[name=texto]')
        });
    },

    cancelarVentanaText: function (esto){        

        esto.up().up().close();
    },

    aceptarVentanaText: function (esto){        

        esto.up().up().campoTexto.setValue(esto.up().up().down('[name=texto]').getValue());
        esto.up().up().close();
    },
	abrirVentanaText: function(esto) {
		var ventana=esto.up('[_="Extidi.class.view.nucleoCrudDinamico"]');
		if(!esto.isDisabled()){                
			var type='textareafield';
			var btnInsertarImagen = {};
			var mostrar=true;
			Ext.Array.forEach(ventana.auxmodelo, function(item, index){
				if(item.name==esto.name && item.editable===false){
					mostrar=false;
				}
				if(item.name==esto.name && typeof(item.isHtml)!='undefined' && item.isHtml==true){ 
					
					type = 'htmleditor';
					btnInsertarImagen = {
						xtype: 'button',                
						text: 'Insertar Imagen',                
						name: 'btnInsertarImagen'/*,
						icon : Extidi.Constantes.URL_ICONO_ACEPTAR*/                        
					};
				}
			})
			if(mostrar===false){
				return;
			}
			Ext.create('Extidi.clases.VentanaModal', {               
				name: 'ventanaText',
				autoShow: true,
				height : 500,
				width : 700,
				draggable : true,
				maximizable: true,                     
				title: 'Texto',  
				layout: 'fit',
				campoTexto: esto,   
				dockedItems: [       
				{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [
					btnInsertarImagen,         
					'->', 
					{
						xtype: 'button',                
						text: 'Aceptar',                
						name: 'btnAceptar',
						icon : Extidi.Constantes.URL_ICONO_ACEPTAR
					},          
					{
						xtype: 'button',                
						text: 'Cancelar',                
						name: 'btnCancelar',
						icon : Extidi.Constantes.URL_ICONO_BORRAR
					}
					]
				}],
				items:[{
					xtype: type, 
					name: 'texto',
					value: esto.getValue()
				}]

			});    

		}       

	},/*
    abrirVentanaText: function (esto){

        var ventana=esto.up('[_="Extidi.class.view.nucleoCrudDinamico"]');        
		var me=this;
        esto.getEl().on('mouseup', function(){
			me.eventoHTMLEditor(ventana,esto)
		});
        esto.getEl().on('DOMFocusIn', function(){
			me.eventoHTMLEditor(ventana,esto)
		});
        
    },*/

    clickElementoForaneos: function (grid, record, item, index, e, eOpts) {
	
        var data = [[record.get('id'),record.get('texto')]];
		
        grid.up().up().combo.store.loadData(data); 
        grid.up().up().combo.setValue(record.get('id')); 
        grid.up().up().close();
      
    },

    expand: function (esto){
        var ventana=typeof(esto.up().up().up())!="undefined"?esto.up().up().up():esto.ventana; 
		//console.debug(ventana)
		if(typeof(ventana)=="undefined"){
			return
		}
        Ext.Array.forEach(ventana.auxmodelo, function(item, index){

            if(item.name==esto.name && esto.store.$className=="Ext.data.ArrayStore" && typeof(item.foreignKey)!='undefined'){              

                Ext.create('Extidi.class.view.listaModal',{
                    foreignKey: item.foreignKey,
                    table: item.foreignKey.table,
                    clase: ventana.clase,
                    view: item.foreignKey.view,
                    columnsShow: item.foreignKey.columnsShow,
                    conditions: item.foreignKey.conditions,
                    modelPrincipal: {
                        tabla: ventana.table,
                        id: typeof(esto.up().up().up())!="undefined"?esto.up().down('[name="id"]').getValue():""
                    },
                    combo: esto
                });               
                return;
            }
        })            
       
    },

    verArchivo: function (btn) {

        var me=this;

        var ventana=btn.up().up().up().up();

        var seleccion=ventana.getGrillaPrincipal().getSelectionModel().getSelection();
        var nombreCmp=btn.up().items.items[0].name;
        var ide=Extidi.Helper.obtenerValorFormulario(ventana.getFormularioEdicion(), "id");   
		if(seleccion.length!=1){
			return;
		}
		       
        Ext.create('Ext.form.Panel', {
            standardSubmit: true
        }).getForm().submit({
            url : Extidi.BASE_PATH+seleccion[0].get(nombreCmp),
            target : "_blank"
        });

		/*
        Ext.create('Extidi.clases.VentanaModal', {               
            name: 'visorimagenes',
            autoShow: true,
            height : 1000,
            width : 400,
            draggable : true,
            title: 'Visor de Imagenes',  
            layout: 'fit',  
            items:[{
                xtype: 'panel',
                frame: true,
                html: '<img src="'+(typeof(seleccion[0])!='undefined'&&seleccion[0].get(nombreCmp)!=''?seleccion[0].get(nombreCmp):'')+'" />'                                                                                          
            }]

        });*/
    },
	
    clickElementoGrilla: function (record, formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario, grillaPrincipal){ 
		if(grillaPrincipal.up('nucleocruddinamico').fireEvent("beforeClickElementoGrilla", record, formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario, grillaPrincipal)){
			var registros=Extidi.Helper.idRegistrosSeleccionados(grillaPrincipal,'id');		
			//Codigo para colapsar el panel formulario
			if(registros.length == 0){
				
				Extidi.Helper.deshabilitarBotones(toolbarGrillaPrincipal, [Extidi.Constantes.BOTON_ACTIVAR_TABCRUD,
					Extidi.Constantes.BOTON_INACTIVAR_TABCRUD,
					Extidi.Constantes.BOTON_ELIMINAR_TABCRUD]);
				Extidi.Helper.deshabilitar(formularioEdicion);
				while(formularioEdicion.down('fieldcontainer[disabled=false]')!=null){
					formularioEdicion.down('fieldcontainer[disabled=false]').setDisabled(true)
				}
				Extidi.Helper.deshabilitarBotones(toolbarFormulario, [Extidi.Constantes.BOTON_BORRAR_TABCRUD,
					Extidi.Constantes.BOTON_GUARDAR_TABCRUD]);

				if(formulario.up().up().$className!="Ext.tab.Panel"){
					var valores=formulario.up().items.items[1].items.items;
					//console.debug(valores)
					for (var i = 0; i < valores.length; i++) {
						var detalle=valores[i].down('nucleocruddinamico');                   
						detalle.setDisabled(true);
					}

				}

			}else{
				if(record != null){
					if(formularioEdicion.isVisible()){
						formularioEdicion.down('[name=estado]').setVisible(true);    
									
						formularioEdicion.loadRecord(record);
						
					}
					////RECARGO STORE DE LOS DETALLES Y LOS HABILITO              
					if(!formulario.esDetalle){
						//if(formulario.up().up().$className!="Ext.tab.Panel"){
						//console.debug(formulario.up())
						var valores=formulario.up().items.items[1].items.items;
						//console.debug(valores)
						for (var i = 0; i < valores.length; i++) {
							var detalle=valores[i].down('nucleocruddinamico');
							//console.debug(detalle)
							detalle.storeGrillaPrincipal.proxy.setExtraParam('IdEncabezado', record.get('id'));                
							detalle.storeGrillaPrincipal.load()
							detalle.setDisabled(false);
							Extidi.Helper.deshabilitar(detalle.getFormularioEdicion());
							Extidi.Helper.deshabilitarBotones(
								detalle.getToolbarFormulario(), 
								[
									Extidi.Constantes.BOTON_GUARDAR_TABCRUD,
									Extidi.Constantes.BOTON_BORRAR_TABCRUD
								]
							);

						 
							Ext.Array.forEach(detalle.auxmodelo, function(item, index){ 

								if(typeof(item.foreignKey)!='undefined'){

									var combo= Extidi.Helper.obtenerCampoFormulario(detalle.getFormularioEdicion(), item.name)

									if(combo.store.$className=="Ext.data.ArrayStore"){

										var camposMostrar='';
										Ext.Array.forEach(item.foreignKey.view, function(item2, index2){
											var campo=item2;                        
											camposMostrar=camposMostrar+campo;                         
										}) 
									
										var data = [[record.get('id'),record.get(camposMostrar)]];

										combo.store.loadData(data);  
										combo.setValue(record.get('id'));  
									}
								}

							})


						};                           

					}

					if(formularioEdicion.isVisible()){
						////SELECCIONO VALOR PARA LA LISTA MODAL
						Ext.Array.forEach(grillaPrincipal.up().auxmodelo, function(item, index){ 

							if(typeof(item.foreignKey)!='undefined'){


								var combo= Extidi.Helper.obtenerCampoFormulario(formularioEdicion, item.name)

								if(combo.store.$className=="Ext.data.ArrayStore"){

									var camposMostrar='';
									Ext.Array.forEach(item.foreignKey.view, function(item2, index2){
										var campo=item.foreignKey.table+'_'+item.foreignKey.column+'_'+item2;                        
										camposMostrar=camposMostrar+campo;                         
									})   

									var data = [[record.get(item.foreignKey.column),record.get(camposMostrar)]];

									combo.store.loadData(data);  
									combo.setValue(record.get(item.foreignKey.column));  
								} 
							}else if(item.type=='datetime'){

								var fechaHora=record.get(item.name);

								if(fechaHora!=null){

									var fechaHora = record.get(item.name);
									var nuevaFechaHora=fechaHora.split(' ');

									Extidi.Helper.obtenerCampoFormulario(formularioEdicion, item.name).setValue(nuevaFechaHora[0]);

									var nuevaHora=nuevaFechaHora[1].split(':');
									Extidi.Helper.obtenerCampoFormulario(formularioEdicion, item.name+'tf').setValue(nuevaHora[0]+':'+nuevaHora[1]);
								}

							}

						})


						//Extidi.Helper.obtenerCampoFormulario(formularioEdicion, 'Conclusion').focus();
						Extidi.Helper.habilitar(formularioEdicion);
						
						while(formularioEdicion.down('fieldcontainer[disabled=true]')!=null){
							formularioEdicion.down('fieldcontainer[disabled=true]').setDisabled(false)
						}
						Extidi.Helper.habilitarBotones(
							toolbarFormulario, 
							[
							Extidi.Constantes.BOTON_BORRAR_TABCRUD,
							Extidi.Constantes.BOTON_GUARDAR_TABCRUD
							]
							);                
					}
					Extidi.Helper.habilitarBotones(
						toolbarGrillaPrincipal, 
						[
						Extidi.Constantes.BOTON_ACTIVAR_TABCRUD,
						Extidi.Constantes.BOTON_INACTIVAR_TABCRUD,
						Extidi.Constantes.BOTON_ELIMINAR_TABCRUD
						]
						);
					
				}else{
					if(formularioEdicion.isVisible()){
					
						Extidi.Helper.deshabilitarBotones(toolbarFormulario, [Extidi.Constantes.BOTON_BORRAR_TABCRUD,
							Extidi.Constantes.BOTON_GUARDAR_TABCRUD]);  
						Extidi.Helper.deshabilitar(formularioEdicion);

						while(formularioEdicion.down('fieldcontainer[disabled=false]')!=null){
							formularioEdicion.down('fieldcontainer[disabled=false]').setDisabled(true)
						}
						if(formulario.up().up().$className!="Ext.tab.Panel"){
							var valores=formulario.up().items.items[1].items.items;
							//console.debug(valores)
							for (var i = 0; i < valores.length; i++) {
								var detalle=valores[i].down('nucleocruddinamico');                   
								detalle.setDisabled(true);
							}

						}
					}
				}
			}
		}
        grillaPrincipal.up('nucleocruddinamico').fireEvent("afterClickElementoGrilla", record, formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario, grillaPrincipal);
                 
    },
	
    grillaNuevo: function(formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario) {
		if(toolbarGrillaPrincipal.up('nucleocruddinamico').fireEvent("beforeGrillaNuevo", formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario)){
			Extidi.Helper.habilitar(formularioEdicion);
			formularioEdicion.getForm().reset();
			formularioEdicion.down('[name=estado]').setValue("1");
			formularioEdicion.down('[name=estado]').setVisible(false);
			Extidi.Helper.desocultarBotones(
				toolbarFormulario, 
				[
				Extidi.Constantes.BOTON_GUARDAR_TABCRUD,
				Extidi.Constantes.BOTON_BORRAR_TABCRUD
				]
				);
			Extidi.Helper.habilitarBotones(
				toolbarFormulario, 
				[
				Extidi.Constantes.BOTON_GUARDAR_TABCRUD,
				Extidi.Constantes.BOTON_BORRAR_TABCRUD
				]
				);										
			Extidi.Helper.deshabilitarBotones(
				toolbarGrillaPrincipal, 
				[
				Extidi.Constantes.BOTON_ACTIVAR_TABCRUD,
				Extidi.Constantes.BOTON_INACTIVAR_TABCRUD,
				Extidi.Constantes.BOTON_ELIMINAR_TABCRUD
				]
				);


			if(formulario.esDetalle){

				var datos=formulario.cabecera.items.items[0].getStore().data.items;
				var encabezado=formulario.getGrillaPrincipal().getStore().proxy.extraParams.IdEncabezado;
				
				var seleccion=null;
				for(var i=0;i<datos.length; i++){
					if(datos[i].data.id==encabezado){
						seleccion=datos[i];
						break;
					}
				}
				Ext.Array.forEach(formulario.auxmodelo, function(item, index){ 

					if(typeof(item.foreignKey)!='undefined'){

						var combo= Extidi.Helper.obtenerCampoFormulario(formulario.getFormularioEdicion(), item.name)                    

						if(combo.store.$className=="Ext.data.ArrayStore" && item.isFather==true){                    

							var camposMostrar='';
							Ext.Array.forEach(item.foreignKey.view, function(item2, index2){
								var campo=item2;                        
								camposMostrar=camposMostrar+" "+seleccion.get(campo);                         
							}) 
							var data = [[seleccion.get('id'), camposMostrar]];
							combo.store.loadData(data);
							combo.setValue(seleccion.get('id'));  
						}
					}

				})                      

			}
		}
        toolbarGrillaPrincipal.up('nucleocruddinamico').fireEvent("afterGrillaNuevo", formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario);
    },
        
	validarFormulario: function(elementos){
        var me=this;
        for(var i=0;i<elementos.length;i++){
		//console.debug(elementos[i])
            if(elementos[i].$className!="Ext.form.field.Hidden" && elementos[i].$className!="Ext.button.Button"
			 && elementos[i].$className!="Ext.container.Container"){
                if(elementos[i].$className=="Ext.form.FieldContainer"){
                    var retorno=me.validarFormulario(elementos[i].items.items);
                    if(!retorno.correcto){
                        return retorno;
                    }
                }else{
                    if(!elementos[i].isValid()){
                        return {
                            correcto: false,
                            componente: elementos[i]
                        };
                    }
                }
            }
        }
        return {
            correcto: true
        };
    },
    formularioGuardar: function (formulario, formularioEdicion, grillaPrincipal,toolbarGrillaPrincipal, toolbarFormulario){
		if(grillaPrincipal.up('nucleocruddinamico').fireEvent("beforeFormularioGuardar", formulario, formularioEdicion, grillaPrincipal,toolbarGrillaPrincipal, toolbarFormulario)){
			var me=this;
			var items=formularioEdicion.items.items[0].items.items;
			var estado=me.validarFormulario(items);
			
			if(estado.correcto){
				

				////VALIDAR CAMPOS PASSWORD

				var notValidPassword=false;
				var camposPassword=[];

				Ext.Array.forEach(grillaPrincipal.up().auxmodelo, function(item, index){

					if(typeof(item.specialproperties)!='undefined' && typeof(item.specialproperties.inputType)!='undefined'
						&& item.specialproperties.inputType=='password'){

						var pass = Extidi.Helper.obtenerValorFormulario(formularioEdicion, item.name);
						var confirPass = Extidi.Helper.obtenerValorFormulario(formularioEdicion, "Confirm"+item.name);

						if(pass!=confirPass){
							camposPassword.push(item.text.form);
							notValidPassword=true;
						}
						
					}
					if(typeof(item.originalValue)!='undefined'){
						if(formularioEdicion.down('[name="'+item.name+'"]').getValue()==''){
							if(formularioEdicion.down('[name="id"]').getValue()==''){
								formularioEdicion.down('[name="'+item.name+'"]').setValue(item.originalValue)
							}
						}
					}

				})

				if(notValidPassword==true){

					var nombreCampos='';
					Ext.Array.each(camposPassword, function(item, index){

						nombreCampos=nombreCampos+(index==0?'':',')+item;
					})

					var msj=(camposPassword.length>1?'Los ':'El ')+(camposPassword.length>1?'campos ':'campo ')+nombreCampos+
					' no '+(camposPassword.length>1?'coinciden ':'coincide ')+'con '+(camposPassword.length>1?'las ':'la ')+
					(camposPassword.length>1?'contrase&ntilde;as ':'contrase&ntilde;a ')+'de '+(camposPassword.length>1?'sus ':'su ')+(camposPassword.length>1?'confirmaciones':'confirmacion');

					Extidi.Msj.error(msj);
					return;
				}
				if(grillaPrincipal.up('nucleocruddinamico').fireEvent("afterValidFormularioGuardar", formulario, formularioEdicion, grillaPrincipal,toolbarGrillaPrincipal, toolbarFormulario)){
		
					formularioEdicion.getForm().submit({
						url : Extidi.BASE_PATH+"index.php/cruddinamico/guardar",
						params : {
							clase: grillaPrincipal.up().clase,
							datos : Ext.JSON.encode(formularioEdicion.getForm().getValues()),
							table: grillaPrincipal.up().table,
							data: Ext.JSON.encode(grillaPrincipal.up().auxmodelo),
							columnsUnique: Ext.JSON.encode(grillaPrincipal.up().columnsUnique)
						},
						method : 'POST',
						success : function(request, result) {
							var resultado = Ext.JSON.decode((result.response.responseText)).success;
							var mensaje = Ext.JSON.decode((result.response.responseText)).mensaje;
							if (resultado) {                        
								Extidi.Msj.info(mensaje[0]);  
								formularioEdicion.getForm().reset();
								grillaPrincipal.getSelectionModel().deselectAll();
								grillaPrincipal.getStore().load();                       
								formulario.idGuardado=mensaje[1];             
								formulario.estadoGuardado=mensaje[2];
								Extidi.Helper.deshabilitar(formularioEdicion);
								Extidi.Helper.deshabilitarBotones(
									toolbarGrillaPrincipal,
									[
									Extidi.Constantes.BOTON_ACTIVAR_TABCRUD,
									Extidi.Constantes.BOTON_INACTIVAR_TABCRUD, 
									Extidi.Constantes.BOTON_ELIMINAR_TABCRUD
									]
									);
				
								Extidi.Helper.deshabilitarBotones(
									toolbarFormulario,
									[
									Extidi.Constantes.BOTON_GUARDAR_TABCRUD, 
									Extidi.Constantes.BOTON_BORRAR_TABCRUD
									]
									);
								
								grillaPrincipal.up('nucleocruddinamico').fireEvent("afterFormularioGuardar", formulario, formularioEdicion,
								toolbarGrillaPrincipal, toolbarFormulario, grillaPrincipal);
							  
								formularioEdicion.down('[name=estado]').setVisible(true);
							}
						},
						failure: function(form, action){
							
							if (action.failureType === Ext.form.action.Action.CONNECT_FAILURE) {
							   Extidi.Msj.error('Estado:'+action.response.status+': '+
									action.response.statusText);
							}
							if (action.failureType === Ext.form.action.Action.SERVER_INVALID){
								// server responded with success = false
								Extidi.Msj.error(Ext.JSON.decode(action.response.responseText).mensaje);
							}
						}
					});           
				}
			}else{
				var nombreCampo=estado.componente.fieldLabel;
				if(typeof(nombreCampo)=='undefined'){
					nombreCampo=estado.componente.name;
				}
				Extidi.Msj.error("Faltan datos requeridos por llenar, revise el campo "+nombreCampo);
			}
		}
		//grillaPrincipal.up('nucleocruddinamico').fireEvent("afterFormularioGuardar", formulario, formularioEdicion, grillaPrincipal,toolbarGrillaPrincipal, toolbarFormulario);		
    },
	
    grillaActivarEstado: function (formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario){
		if(grillaPrincipal.up('nucleocruddinamico').fireEvent("beforeGrillaActivarEstado", formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario)){
			var me=this;
			Ext.Ajax.request({
				url : Extidi.BASE_PATH+"index.php/cruddinamico/activar",
				params : {
					clase:grillaPrincipal.up().clase,
					datos:Ext.JSON.encode(Extidi.Helper.idRegistrosSeleccionados(grillaPrincipal,'id')),
					table:grillaPrincipal.up().table,
					data: Ext.JSON.encode(grillaPrincipal.up().auxmodelo)  
				},
						
				method : 'POST',
				success : function(result, request) {
					result=Ext.JSON.decode((result.responseText))
					var mensaje = result.mensaje;
					//console.debug(mensaje)
					Extidi.Msj.info(mensaje);
					grillaPrincipal.getStore().load();
					formularioEdicion.getForm().reset();
				}
			});
					
			Extidi.Helper.deshabilitarBotones(
				toolbarGrillaPrincipal,
				[
				Extidi.Constantes.BOTON_ACTIVAR_TABCRUD, 
				Extidi.Constantes.BOTON_INACTIVAR_TABCRUD,
				Extidi.Constantes.BOTON_ELIMINAR_TABCRUD
				]
				);
			
			Extidi.Helper.deshabilitarBotones(
				toolbarFormulario,
				[
				Extidi.Constantes.BOTON_GUARDAR_TABCRUD, 
				Extidi.Constantes.BOTON_BORRAR_TABCRUD
				]
				);
			
			Extidi.Helper.deshabilitar(formularioEdicion);
		}
		grillaPrincipal.up('nucleocruddinamico').fireEvent("afterGrillaActivarEstado", formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario);
    },
	
    grillaInactivarEstado: function (formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario){
		if(grillaPrincipal.up('nucleocruddinamico').fireEvent("beforeGrillaInactivarEstado", formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario)){
			var me=this;		

			Ext.Ajax.request({
				url : Extidi.BASE_PATH+"index.php/cruddinamico/inactivar",
				params : {               
					clase:grillaPrincipal.up().clase,
					datos: Ext.JSON.encode(Extidi.Helper.idRegistrosSeleccionados(grillaPrincipal,'id')),
					table:grillaPrincipal.up().table,
					data: Ext.JSON.encode(grillaPrincipal.up().auxmodelo)   
				},
				method : 'POST',
				success : function(result, request) {
					result=Ext.JSON.decode((result.responseText))
					var mensaje = result.mensaje;
					Extidi.Msj.info(mensaje);
					grillaPrincipal.getStore().load();
					formularioEdicion.getForm().reset();
				}
			});
					
			Extidi.Helper.deshabilitarBotones(
				toolbarGrillaPrincipal,
				[
				Extidi.Constantes.BOTON_ACTIVAR_TABCRUD, 
				Extidi.Constantes.BOTON_INACTIVAR_TABCRUD,
				Extidi.Constantes.BOTON_ELIMINAR_TABCRUD
				]
				);
			
			Extidi.Helper.deshabilitarBotones(
				toolbarFormulario,
				[
				Extidi.Constantes.BOTON_GUARDAR_TABCRUD, 
				Extidi.Constantes.BOTON_BORRAR_TABCRUD
				]
				);

			
			Extidi.Helper.deshabilitar(formularioEdicion);
		}
        grillaPrincipal.up('nucleocruddinamico').fireEvent("afterGrillaInactivarEstado", formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario);
        
    },
	
    grillaEliminar: function (formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario){
		if(grillaPrincipal.up('nucleocruddinamico').fireEvent("beforeGrillaEliminar", formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario)){
			var me=this;

			var numCheckd = Extidi.Helper.idRegistrosSeleccionados(grillaPrincipal,'IdConclusion').length;
			Extidi.Msj.confirm("¿Esta Seguro que desea Eliminar lo(s) "+ numCheckd +" registros(s) seleccionada(s)?",
				function(btn) {
					if (btn == "yes") {
						Ext.Ajax.request({
							url : Extidi.BASE_PATH+"index.php/cruddinamico/eliminar",
							params : {
								clase:grillaPrincipal.up().clase,
								datos:  Ext.JSON.encode(Extidi.Helper.idRegistrosSeleccionados(grillaPrincipal,'id')),
								table:grillaPrincipal.up().table,
								data: Ext.JSON.encode(grillaPrincipal.up().auxmodelo)   
							},
							method : 'POST',
							success : function(result, request) {
								result=Ext.JSON.decode((result.responseText))
								var resultado = result.success;
								var mensaje = result.mensaje;

								if (resultado) {
									Extidi.Msj.info(mensaje);
									grillaPrincipal.getStore().load();
									formularioEdicion.getForm().reset();
								} else {

									Extidi.Msj.importar(mensaje);
									grillaPrincipal.getStore().load();
									formularioEdicion.getForm().reset();
								}
							}
						});

						Extidi.Helper.deshabilitarBotones(
							toolbarGrillaPrincipal,
							[
							Extidi.Constantes.BOTON_ACTIVAR_TABCRUD,
							Extidi.Constantes.BOTON_INACTIVAR_TABCRUD,
							Extidi.Constantes.BOTON_ELIMINAR_TABCRUD]);

						Extidi.Helper.deshabilitarBotones(
							toolbarFormulario,
							[
							Extidi.Constantes.BOTON_GUARDAR_TABCRUD,
							Extidi.Constantes.BOTON_BORRAR_TABCRUD]);
						Extidi.Helper.deshabilitar(formularioEdicion);
						Extidi.Helper.deshabilitar(formularioEdicion);
						
						
					}
				});
		}
		grillaPrincipal.up('nucleocruddinamico').fireEvent("afterGrillaEliminar", formulario, formularioEdicion, grillaPrincipal, toolbarGrillaPrincipal, toolbarFormulario);	
    },
	
    formularioBorrar: function (formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario){
		if(toolbarGrillaPrincipal.up('nucleocruddinamico').fireEvent("beforeFormularioBorrar", formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario)){
			Extidi.Helper.deshabilitarBotones(
				toolbarGrillaPrincipal, 
				[
				Extidi.Constantes.BOTON_ACTIVAR_TABCRUD,
				Extidi.Constantes.BOTON_INACTIVAR_TABCRUD,
				Extidi.Constantes.BOTON_ELIMINAR_TABCRUD
				]
				);
																			
			Extidi.Helper.deshabilitarBotones(
				toolbarFormulario, 
				[
				Extidi.Constantes.BOTON_GUARDAR_TABCRUD,
				Extidi.Constantes.BOTON_BORRAR_TABCRUD
				]
				);
			Extidi.Helper.deshabilitar(formularioEdicion);    
			formularioEdicion.down('[name=estado]').setVisible(true);    
		}
        toolbarGrillaPrincipal.up('nucleocruddinamico').fireEvent("afterFormularioBorrar", formulario, formularioEdicion, toolbarGrillaPrincipal, toolbarFormulario);
    },

    grillaExportarPdf: function(btn){
       
        Ext.create('Ext.form.Panel', {
            standardSubmit: true
        }).getForm().submit({
            url : Extidi.BASE_PATH+"index.php/cruddinamico/exportarPdf",
            target : "_blank",
            params: {
                clase:btn.clase,
                table:btn.table,
                data: Ext.JSON.encode(btn.auxmodelo) ,
				condicion: btn.modelo.conditions,
				search: typeof(btn.storeGrillaPrincipal.extraParams)=="undefined"?"":btn.storeGrillaPrincipal.extraParams.search 
            }
        });

    },
	
    grillaExportarCsv: function(btn){

        Ext.create('Ext.form.Panel', {
            standardSubmit: true
        }).getForm().submit({
            url : Extidi.BASE_PATH+"index.php/cruddinamico/exportarCsv",               
            target : "_blank",
            params: {
                clase:btn.clase,
                table:btn.table,
                data: Ext.JSON.encode(btn.auxmodelo),
				condicion: btn.modelo.conditions,
				search: typeof(btn.storeGrillaPrincipal.extraParams)=="undefined"?"":btn.storeGrillaPrincipal.extraParams.search 
            }
        });       
        
    },
	
    grillaExportarExcel: function(btn){
        Ext.create('Ext.form.Panel', {
            standardSubmit: true
        }).getForm().submit({
            url : Extidi.BASE_PATH+"index.php/cruddinamico/exportarExcel",               
            target : "_blank",
            params: {
                clase:btn.clase,
                table:btn.table,
                data: Ext.JSON.encode(btn.auxmodelo),
				condicion: typeof(btn.modelo.conditions)=="undefined"?"":btn.modelo.conditions,
				search: typeof(btn.storeGrillaPrincipal.extraParams)=="undefined"?"":btn.storeGrillaPrincipal.extraParams.search
            }
        });
      
    },

    grillaImprimir: function(btn) {    
		Ext.create('Ext.form.Panel', {
            standardSubmit: true
        }).getForm().submit({
            url : Extidi.BASE_PATH+"index.php/cruddinamico/imprimir",
            target : "_blank",
            params: {
                clase:btn.clase,
                table:btn.table,
                data: Ext.JSON.encode(btn.auxmodelo),
				condicion: btn.modelo.conditions,
				search: typeof(btn.storeGrillaPrincipal.extraParams)=="undefined"?"":btn.storeGrillaPrincipal.extraParams.search  
            }
        });
    },

    grillaImportar: function(formulario, formularioEdicion, grillaPrincipal,toolbarGrillaPrincipal, toolbarFormulario){


        var me=this;       

        var columnas=[];
        var aux='';
        var i=3;
        var fields=["id","estado"];
        //console.debug(grillaPrincipal.up().auxmodelo)
        Ext.Array.forEach(grillaPrincipal.up().auxmodelo, function(item, index){ 

            var camposMostrar='';

            fields.push(item.name)
            
            var grid={
                header : typeof(item.text.grid)!='undefined'?item.text.grid:item.name,
                flex : 1,
                sortable : true,
                dataIndex : item.name
            }
            columnas.push(grid)  


            if(typeof(item.values)!='undefined'){
                aux=aux+''+i+'- '+item.text.grid+' debe existir.<br>';  
                i++;
            }else if (typeof(item.parameterValue)!='undefined'){
                aux=aux+''+i+'- '+item.text.grid+' debe existir.<br>';   
                i++;
            }else if(typeof(item.foreignKey)!='undefined'){

                Ext.Array.forEach(item.foreignKey.view, function(item2, index2){
                    var campo=item.foreignKey.table+'_'+item.foreignKey.column+'_'+item2;                        
                    camposMostrar=camposMostrar+campo;                         
                }) 

                aux=aux+''+i+'- \''+item.name+'\' debe existir.<br>';
                i++;
            }

            fields.push(camposMostrar)

        });


        var store=Ext.create('Extidi.clases.Store', {
            url : Extidi.BASE_PATH+"index.php/cruddinamico/listar",
            
            extraParams: {
                clase:grillaPrincipal.up().clase,
                table:grillaPrincipal.up().table,
                data: Ext.JSON.encode(grillaPrincipal.up().auxmodelo)  
            },
            model : Ext.define("Extidi.class.view.model", {
                extend : "Ext.data.Model",
                fields : fields
            }),
            autoLoad: false
        })

        var nombre=(grillaPrincipal.up().table).replace('_',' ');

        Ext.create('Extidi.clases.VentanaImportar' ,{
            name:'importarvista',
            titulo:nombre,
            descripcion: 'Para realizar exitosamente la importacion de '+nombre+' el archivo a subir debe tener las <br>' +
            'siguientes caracteristicas: <br> 1- Las cabeceras deben tener los mismos nombres que la plantilla de ejemplo y deben ser solo ('+columnas.length+'). <br>'+
            '2- El tamaño maximo del archivo debe ser de 5 MB. <br>'+
            aux+
            ''+i+'- Solo puede importar 1.000 registros en un archivo.',
            //link: "<a href='"+Extidi.BASE_PATH+"index.php/cruddinamico/plantilla"+"'target='_blank'>Plantilla.csv</a>",
            linkBoton: grillaPrincipal.up(),
            linkUrl: Extidi.BASE_PATH+"index.php/cruddinamico/plantilla",
            columnas: columnas,
            storex:store
        });
		grillaPrincipal.up('nucleocruddinamico').fireEvent("afterGrillaImportar", formulario, formularioEdicion, grillaPrincipal,toolbarGrillaPrincipal, toolbarFormulario);	
    },

    importarCancelar: function (form, store,bc,bg,bi){
        
        form.reset();
        bg.setDisabled(true);
        store.removeAll();
        
    },
	importarImportar : function(form, store, botonCancelar,botonGuardar,botonImportar) {
        var me=this;    
        if (form.isValid()) {
            form.submit({
                url : Extidi.BASE_PATH+"index.php/cruddinamico/subirArchivo", 
                params: {                    
                    table:botonGuardar.up('[name=importarvista]').linkBoton.table,
                    data: Ext.JSON.encode(botonGuardar.up('[name=importarvista]').linkBoton.auxmodelo),
                    columnsUnique: Ext.JSON.encode(botonGuardar.up('[name=importarvista]').linkBoton.getGrillaPrincipal().up().columnsUnique)
                },              
                success : function(request, result) {
                    var resultado = Ext.JSON.decode((result.response.responseText)).success;
                    var mensaje = Ext.JSON.decode((result.response.responseText)).mensaje;
                    var data = Ext.JSON.decode((result.response.responseText)).data;
                    if (resultado) {
                        store.loadData(data);
                        botonGuardar.setDisabled(false);
                        botonCancelar.setDisabled(false);
                    }else{
                        Extidi.Msj.error(mensaje);
                    }
                },
                failure : function(request, result) {
                    var mensaje = Ext.JSON.decode((result.response.responseText)).mensaje;
                    Extidi.Msj.error(mensaje);
                }
            });
        }
    },

    importarGuardar: function(f, store, bc, bg, bi) { 
        var me=this;
        var rec = new Array();

        store.each(function(records, a) {

            rec.push(records.data)
        });
        Ext.Ajax.request({
            url : Extidi.BASE_PATH+"index.php/cruddinamico/guardarCsv",               
            params : {               
                datos : Ext.JSON.encode(rec),
                clase:bg.up('[name=importarvista]').linkBoton.clase,
                table:bg.up('[name=importarvista]').linkBoton.table,
                data: Ext.JSON.encode(bg.up('[name=importarvista]').linkBoton.auxmodelo)
            },
            method : 'POST',
            success : function(result, request) {
                result=Ext.JSON.decode((result.responseText))
                var resultado = result.success;
                var mensaje = result.mensaje;
                if (resultado) {
                    Extidi.Msj.info(mensaje);
                    bg.up('[name=importarvista]').linkBoton.getGrillaPrincipal().getStore().load();
                } else {
                    Extidi.Msj.importar(mensaje);
                    bg.up('[name=importarvista]').linkBoton.getGrillaPrincipal().getStore().load();
                }
                bg.setDisabled(true);
            }
        });
    }
});