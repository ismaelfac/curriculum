Ext.define('Extidi.clases.TabCrud', {
    extend : 'Ext.form.Panel',
    layout : 'border',
    region : 'center',
    /*Campos para cambio significativo*/
    camposSignificativo: [],
    /* Variables con Valores Por Defecto */
    tieneDetalle : false,
    idGrilla : '',
    panelDetalle : true, // YC
    toolbarGrilla : true,
    tieneCheckColumn : true,
    toolbarFormulario : true,
    groupingGrillaPrincipal : false,
    tieneBuscarGrillaPrincipal : true,
    //propiedad añadida para efectos de deshabilitar el paginador en un treestore de modulos
    tienePaginadorGrillaPrincipal: true,
    esGrillaArbol:false,
    ubicacionDetalle: '',
    //fin
    cantidadRegistrosPaginador : 20,
    tituloGrillaDetalle : '',
    columnasGrillaDetalle : null,
    tieneBuscarDetalle : null,
    storeGrillaDetalle : null,
    nombreCampoGrouping : 'OBLIGATORIO',

    botonEliminarDetalle : [true],
    itemsFieldSetDefecto : {
        xtype : 'label',
        html : 'Se debe Crear un Fieldset con todos los elementos del formulario'
    },
    /*Eventos de Tab Crud*/

    /*
	 /*	Eventos(
	  'grillaNuevo',
	  'grillaEliminar',
	  'grillaExportarExcel',
	  'grillaExportarPdf',
	  'grillaActivarEstado',
	  'grillaInactivarEstado',
	  'grillaExportarCsv',
	  'grillaImprimir',
	  'grillaImportar',
	  'formularioGuardar',
	  'formularioBorrar',
	  'clickElementoGrilla',
	  'dobleClickElementoGrilla',
	  'detallePrueba'
	  );
	 */

    toolbarDetalle : true,
    tituloGrillaPrincipal : '',
    columnasGrillaPrincipal : [
    {
        id : 'compania',
        header : "Compañia",
        width : 160,
        sortable : true,
        dataIndex : 'compania'
    }, {
        header : "Precio",
        width : 75,
        sortable : true,
        dataIndex : 'precio'
    }, {
        header : "Cambio",
        width : 75,
        sortable : true,
        dataIndex : 'cambio'
    }, {
        header : "% de cambio",
        width : 75,
        sortable : true,
        dataIndex : 'pctCambio'
    }, {
        header : "Actualizado",
        width : 85,
        sortable : true,
        renderer : Ext.util.Format.dateRenderer('m/d/Y'),
        dataIndex : 'actualizado'
    }
    ],
    storeGrillaPrincipal : new Ext.data.ArrayStore({
        fields : [
        {
            name : 'compania'
        }, {
            name : 'precio',
            type : 'float'
        }, {
            name : 'cambio',
            type : 'float'
        }, {
            name : 'pctCambio',
            type : 'float'
        }, {
            name : 'actualizado',
            type : 'date',
            dateFormat : 'n/j h:ia'
        }
        ],
        data : [
        [
        '3m Co', 
        71.72, 
        0.02, 
        0.03, 
        '9/1 12:00am'
        ]
        ]
    }),
    obtenerDetalle: function(lugar){
        return this.down('tabpanel').getComponent(lugar);
    },
    agregarBotonGrillaPrincipal: function(btn, name){
        var me=this;
        btn.name=name;
        btn.handler=function(boton, event, eOpts){
/*            var tabpanel = me.down('tabpanel');
            tabpanel.setActiveTab(0);
            if(tabpanel.isHidden())
                tabpanel.expand();
*/
            me.fireEvent('click'+name, me, me.getFormularioEdicion(), me.getGrillaPrincipal(), me.getToolbarGrillaPrincipal(), me.getToolbarFormulario());
        };
        this.getToolbarGrillaPrincipal().add(btn);
        
    },
    getBotonGrillaPrincipal: function(name){
        return this.getToolbarGrillaPrincipal().down('button[name="'+name+'"]');
    },
	mostrarBotonesToolbarGrilla : {
		nuevo : true,
		eliminar : true,
		exportarExcel : true,
		exportarPdf : true,
		exportarCsv : true,
		imprimir : true,
		importar : true,
		activar : true,
		inactivar : true
	},
	habilitarBotonesToolbarGrilla : {
		nuevo : true,
		eliminar : false,
		exportarExcel : true,
		exportarPdf : true,
		exportarCsv : true,
		imprimir : true,
		importar : true,
		activar : false,
		inactivar : false
	},
	habilitarBotonesToolbarFormulario : {
		guardar : false,
		borrar : false
	},
	mostrarBotonesToolbarFormulario : {
		guardar : true,
		borrar : true
	},
    initComponent : function() {

        var formulario = this;
        var tbarGrilla = [];
        var tbarFormulario = [];
        var itemsDetalle = [];
        var itemsFormularioPadre = [];
        var barraFormularioEdicion = null;

        if(formulario.toolbarGrilla) {

            tbarGrilla.push({

                text : 'Nuevo',
				name: 'btnNuevo',
                icon : Extidi.Constantes.URL_ICONO_AGREGAR,
                disabled : !formulario.habilitarBotonesToolbarGrilla.nuevo,
                hidden : !formulario.mostrarBotonesToolbarGrilla.nuevo,
                handler : function() {

                    //var tabpanel = formulario.down('tabpanel');

                    //tabpanel.setActiveTab(0);
                    //if(tabpanel.isHidden())
                        //tabpanel.expand();
                    formulario.getGrillaPrincipal().getSelectionModel().deselectAll();
                    formulario.fireEvent('grillaNuevo', formulario, formulario.getFormularioEdicion(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Activar',
				name: 'btnActivar',
                icon : Extidi.Constantes.URL_ICONO_ACTIVAR,
                disabled : !formulario.habilitarBotonesToolbarGrilla.activar,
                hidden : !formulario.mostrarBotonesToolbarGrilla.activar,
                handler : function() {
                    formulario.fireEvent('grillaActivarEstado', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Inactivar',
				name: 'btnInactivar',
                icon : Extidi.Constantes.URL_ICONO_INACTIVAR,
                disabled : !formulario.habilitarBotonesToolbarGrilla.inactivar,
                hidden : !formulario.mostrarBotonesToolbarGrilla.inactivar,
                handler : function() {
                    formulario.fireEvent('grillaInactivarEstado', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Eliminar',
				name: 'btnEliminar',
                icon : Extidi.Constantes.URL_ICONO_ELIMINAR,
                disabled : !formulario.habilitarBotonesToolbarGrilla.eliminar,
                hidden : !formulario.mostrarBotonesToolbarGrilla.eliminar,
                handler : function() {
                    formulario.fireEvent('grillaEliminar', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Exportar  Excel',
				name: 'btnExportarExcel',
                icon : Extidi.Constantes.URL_ICONO_EXPORTAR_EXCEL,
                disabled : !formulario.habilitarBotonesToolbarGrilla.exportarExcel,
                hidden : !formulario.mostrarBotonesToolbarGrilla.exportarExcel,
                handler : function() {
                    formulario.fireEvent('grillaExportarExcel', formulario, formulario.getFormularioEdicion(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Exportar PDF',
				name: 'btnExportarPDF',
                icon : Extidi.Constantes.URL_ICONO_EXPORTAR_PDF,
                disabled : !formulario.habilitarBotonesToolbarGrilla.exportarPdf,
                hidden : !formulario.mostrarBotonesToolbarGrilla.exportarPdf,
                handler : function() {
                    formulario.fireEvent('grillaExportarPdf', formulario, formulario.getFormularioEdicion(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Exportar Csv',
				name: 'btnExportarCsv',
                icon : Extidi.Constantes.URL_ICONO_EXPORTAR_CSV,
                disabled : !formulario.habilitarBotonesToolbarGrilla.exportarCsv,
                hidden : !formulario.mostrarBotonesToolbarGrilla.exportarCsv,
                handler : function() {
                    formulario.fireEvent('grillaExportarCsv', formulario, formulario.getFormularioEdicion(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Imprimir',
				name: 'btnImprimir',
                icon : Extidi.Constantes.URL_ICONO_IMPRIMIR,
                disabled : !formulario.habilitarBotonesToolbarGrilla.imprimir,
                hidden : !formulario.mostrarBotonesToolbarGrilla.imprimir,
                handler : function() {
                    formulario.fireEvent('grillaImprimir', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }, {

                text : 'Importar',
				name: 'btnImportar',
                icon : Extidi.Constantes.URL_ICONO_IMPORTAR,
                disabled : !formulario.habilitarBotonesToolbarGrilla.importar,
                hidden : !formulario.mostrarBotonesToolbarGrilla.importar,
                handler : function() {
                    formulario.fireEvent('grillaImportar', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            });

        }

        Ext.apply(formulario, {
            tbar : tbarGrilla,
            items : itemsFormularioPadre
        })

        /**
		 * *************************** PANEL DE ABAJO
		 * **************************************************
		 */
        if(formulario.toolbarFormulario)
            barraFormularioEdicion = [{

                text : 'Guardar',
                icon : Extidi.Constantes.URL_ICONO_GUARDAR,
                disabled : true,//!formulario.habilitarBotonesToolbarFormulario.guardar,
                hidden : !formulario.mostrarBotonesToolbarFormulario.guardar,
                handler : function() {
                    var valores=formulario.getFormularioEdicion().down('fieldset').items.items;
                    var seleccion=formulario.getGrillaPrincipal().getSelectionModel().getSelection();
                    if(seleccion.length==1){
                        var cambio=false;
                        var cambioOpcional=true;
                        var pregunta=false;
                        for(var i=0;i<valores.length;i++){
                            var nombre=valores[i].name;
                            if(Ext.Array.indexOf(formulario.camposSignificativo, nombre)!=-1){
                                if(valores[i].getValue()!=seleccion[0].get(nombre)){
                                    cambio=true;
                                    if(valores[i].xtype=='textfield'){
                                        pregunta=true;
                                    }else{
                                        cambioOpcional=false;
                                    }
                                }
                            }
                        }
                        if(cambioOpcional && pregunta){
                            Extidi.Msj.confirm("La modificacion realizada cambia el significado/sentido?",function(res){
                                if(res=='no'){
                                    cambio=false;
                                }
                                if(formulario.getFormularioEdicion().down('[name="extidi_cambio_significativo"]')==null){
                                    formulario.getFormularioEdicion().add({
                                        xtype: 'hidden',
                                        name: 'extidi_cambio_significativo',
                                        value: cambio?1:0
                                    });
                                }else{
                                    formulario.getFormularioEdicion().down('[name="extidi_cambio_significativo"]').setValue(cambio?1:0)
                                }
                                //console.debug(formulario.getFormularioEdicion().getForm().getValues())
                                //return
                                formulario.fireEvent('formularioGuardar', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                            })
                        }else{
                            if(formulario.getFormularioEdicion().down('[name="extidi_cambio_significativo"]')==null){
                                formulario.getFormularioEdicion().add({
                                    xtype: 'hidden',
                                    name: 'extidi_cambio_significativo',
                                    value: cambio?1:0
                                });
                            }else{
                                formulario.getFormularioEdicion().down('[name="extidi_cambio_significativo"]').setValue(cambio?1:0)
                            }
                            //console.debug(formulario.getFormularioEdicion().getForm().getValues())
                            //return
                            formulario.fireEvent('formularioGuardar', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                        }
                        
                    }else{
                        formulario.fireEvent('formularioGuardar', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                    }
                    //console.debug(formulario.getFormularioEdicion().getForm().getValues())
                    //return;
                    //formulario.fireEvent('formularioGuardar', formulario, formulario.getFormularioEdicion(), formulario.getGrillaPrincipal(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                    
                }
            }, {

                text : 'Cancelar',
                icon : Extidi.Constantes.URL_ICONO_BORRAR,
                disabled : !formulario.habilitarBotonesToolbarFormulario.borrar,
                hidden : !formulario.mostrarBotonesToolbarFormulario.borrar,
                handler : function() {
                    formulario.fireEvent('formularioBorrar', formulario, formulario.getFormularioEdicion(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario());
                }
            }];
        formularioEdicion = Ext.create('Ext.form.Panel', {
            layout : 'fit',
            //title : 'Edición',
			region: formulario.ubicacionDetalle || 'east',
			width: 450,
            //frame : true,
            border : true,
            bodyPadding : 0,
            tbar : {
                xtype : 'toolbar',
                dock : 'top',
                items : barraFormularioEdicion
            },
            items : [formulario.itemsFieldSetDefecto],
            plugins : Ext.create('Extidi.ux.ProgressBarPager', {})

        });

        //itemsDetalle.push(formularioEdicion);
		detalle = formularioEdicion;
		/*new Ext.TabPanel({
            activeTab : 0,
            region : formulario.ubicacionDetalle || 'east',
            collapsible : false,
            //animCollapse : !Ext.isIE8,
            minHeight: 200,
            width : 450,
            items : itemsDetalle,
            title : ''
        });*/

        //var checkBoxModel=	Ext.create('Ext.selection.CheckboxModel');

        // YC
        if(this.tieneCheckColumn)
            var checkBoxModel = Ext.create('Ext.selection.CheckboxModel');
        else
            var checkBoxModel = 'rowmodel';
        // YC
        var tipoGrilla='Extidi.clases.Grilla';
        if(this.esGrillaArbol){
            tipoGrilla='Extidi.clases.GrillaArbol';
        }
        var grillaPrincipal = Ext.create(
            tipoGrilla, {
                id : this.idGrilla,
                nombre: 'grilla',
                title : formulario.tituloGrillaPrincipal,
                tieneBuscar : this.tieneBuscarGrillaPrincipal,
                tienePaginador: this.tienePaginadorGrillaPrincipal,
                store : formulario.storeGrillaPrincipal,
                region : 'center',
                features : formulario.groupingGrillaPrincipal ? [{
                    ftype : 'grouping',
                    groupHeaderTpl : this.nombreCampoGrouping + ": {name}"
                }] : '',
                selModel : checkBoxModel,
                columns : formulario.columnasGrillaPrincipal,
                sortableColumns : true,
                listeners : {

                    render : function() {
                        this.headerCt.on('headerclick', function(headerCt, header, e) {
                            if(header.isCheckerHd) {
                                e.stopEvent();
                                var isChecked = header.el.hasCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
                                if(isChecked) {

                                    Extidi.Helper.deshabilitarBotones(formulario.getToolbarGrillaPrincipal(), [Extidi.Constantes.BOTON_ACTIVAR_TABCRUD, Extidi.Constantes.BOTON_INACTIVAR_TABCRUD, Extidi.Constantes.BOTON_ELIMINAR_TABCRUD]);

                                    Extidi.Helper.deshabilitar(formulario.getFormularioEdicion());
                                    Extidi.Helper.deshabilitarBotones(formulario.getToolbarFormulario(), [Extidi.Constantes.BOTON_BORRAR_TABCRUD,
                                        Extidi.Constantes.BOTON_GUARDAR_TABCRUD]);
                                } else {
                                    Extidi.Helper.habilitarBotones(formulario.getToolbarGrillaPrincipal(), [Extidi.Constantes.BOTON_ACTIVAR_TABCRUD, Extidi.Constantes.BOTON_INACTIVAR_TABCRUD, Extidi.Constantes.BOTON_ELIMINAR_TABCRUD]);
                                    
                                    Extidi.Helper.deshabilitar(formulario.getFormularioEdicion());
                                    Extidi.Helper.deshabilitarBotones(formulario.getToolbarFormulario(), [Extidi.Constantes.BOTON_BORRAR_TABCRUD,
                                        Extidi.Constantes.BOTON_GUARDAR_TABCRUD]);
                                }

                                var tabpanel = formulario.down('tabpanel');
                                //tabpanel.collapse();

                            }
                        })
                    },
                    itemclick : function(s, record) {
                        var s = this.getSelectionModel().getSelection();
                        var cantidad = s.length;
                        cantidad == 1 ? record = s[0] : record = null;

                        if(cantidad == 0) {
                            Extidi.Helper.deshabilitarBotones(formulario.getToolbarGrillaPrincipal(), [Extidi.Constantes.BOTON_ACTIVAR_TABCRUD, Extidi.Constantes.BOTON_INACTIVAR_TABCRUD, Extidi.Constantes.BOTON_ELIMINAR_TABCRUD]);
                        } else {

                            Extidi.Helper.habilitarBotones(formulario.getToolbarGrillaPrincipal(), [Extidi.Constantes.BOTON_ACTIVAR_TABCRUD, Extidi.Constantes.BOTON_INACTIVAR_TABCRUD, Extidi.Constantes.BOTON_ELIMINAR_TABCRUD]);
                        }

                        var tabpanel = formulario.down('tabpanel');
                        formulario.fireEvent('clickElementoGrilla', record, formulario, formulario.getFormularioEdicion(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario(), this)
                    },
                    itemdblclick : function(s, record) {
                        formulario.fireEvent('dobleClickElementoGrilla', record, formulario, formulario.getFormularioEdicion(), formulario.getToolbarGrillaPrincipal(), formulario.getToolbarFormulario())
                    }
                }
            });

        itemsFormularioPadre.push(grillaPrincipal);
        if(this.panelDetalle)// YC
            itemsFormularioPadre.push(detalle);
        if(this.tieneDetalle)
            this.crearGrillaDetalle(this.storeGrillaDetalle, this.columnasGrillaDetalle, this.tituloGrillaDetalle, this.tituloGrillaPrincipal, detalle, formulario, this.botonEliminarDetalle, this.tieneBuscarDetalle);

        formulario.callParent(arguments);
        Extidi.Helper.deshabilitar(formulario.down('form'));
    },
    /**
	 * ************************************ Funciones
	 * ****************************************
	 */
    crearFieldSetFormulario : function(elementos) {
        this.itemsFieldSetDefecto = elementos;
    },
    getFormularioEdicion : function() {
        return this.down("form");
    },
    getGrillaPrincipal : function() {
        return this.down('[nombre="grilla"]');
    },
    getToolbarGrillaPrincipal : function() {
        return this.down("toolbar");
    },
    getToolbarFormulario : function() {
        return this.getFormularioEdicion().down("toolbar");
    },
    crearGrillaDetalle : function(stores, columnas, titulos, tituloGrillaPrincipal, tabPanelDetalle, formulario, botonEliminarDetalle, tieneBuscarDetalle) {
        for(var i = 0; i < stores.length; i++) {
            var cadena = (tituloGrillaPrincipal==''?'':Extidi.Helper.trimAll(tituloGrillaPrincipal).toLowerCase());
            var id = 'detalle' + cadena + (i + 1);
            tabPanelDetalle.add(this.crearGrilla(stores[i], columnas[i], titulos[i], id, formulario, botonEliminarDetalle[i], tieneBuscarDetalle[i]));
        }
    },
    crearGrilla : function(store, columnas, titulo, id, formulario, botonEliminarDetalle, tieneBuscarDetalle) {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit : 1,
            autoCancel : false,
            errorSummary : false,
            listeners : {
                edit : function(editor, e) {
                    formulario.fireEvent(id + 'Actualizar', editor, e);
                },
                cancelEdit : function(grid) {

                    try {
                        var rec = store.getAt(0);
                        formulario.fireEvent(id + 'Cancelar', grid, store, rec);

                    } catch(e) {
                    }
                }
            }
        });

        var columnaEliminar = Ext.create('Ext.grid.column.Action', {
            
            width : 50,
            hidden : !botonEliminarDetalle,
            items : [{
                icon : Extidi.Constantes.URL_ICONO_ELIMINAR_FILA,
                tooltip : 'Eliminar',
                handler : function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);

                    formulario.fireEvent(id + 'Eliminar', grid, rec, rowIndex, colIndex);
                }
            }]
        });
        Ext.Array.insert(columnas, 0, [columnaEliminar]);
        //columnas.reverse().push(columnaEliminar).reverse();
        var grilla = Ext.create('Extidi.clases.Grilla', {
            name : id,
            title : titulo,
            store : store,
            region : 'center',
            columns : columnas,
            minHeight: 200,
            tieneBuscar : tieneBuscarDetalle,
            plugins : [rowEditing],
            tbar : [{
                text : 'Agregar',
                name : 'BotonAgregar',
                disabled : true,
                icon : Extidi.Constantes.URL_ICONO_AGREGAR_FILA,
                handler : function() {

                    rowEditing.cancelEdit();
                    store.insert(0, {});
                    rowEditing.startEdit(0, 0);
                    formulario.fireEvent('BotonAgregar');
                }
            }],
            listeners : {

                itemclick : function(s, record) {
                    formulario.fireEvent('clickElementoGrillaDetalle', record, store);

                }
            }
        });

        return grilla;
    }
});
