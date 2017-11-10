Ext.define('Extidi.clases.VentanaImportar', {
    extend : 'Extidi.clases.VentanaModal',
    height : 580,
    width : 680,
    draggable : true,
    tieneBuscar : false,
    tienePaginador : false,
    titulo : '',
    descripcion : 'Aqui va la Descripcion',
    link : '',
    linkBoton : {},
    linkUrl : '',
    columnas : [{
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
    }],
    storex : null,

    initComponent : function() {

        var me = this;
        var cadena = Extidi.Helper.trimAll(this.titulo).toLowerCase();
        var id = 'importar' + cadena;
        this.title = 'Importar ' + this.titulo;
        var storeA = this.storex;
        Ext.applyIf(me, {
            items : [{
                xtype : 'form',
                frame : true,
                name: 'formularioImportar',
                bodyPadding : 10,
                autoSroll: true,
                bbar: [
                '->',{	
                    name: 'botonGuardar',
                    icon : Extidi.Constantes.URL_ICONO_GUARDAR_IMPORTE,
                    text : 'Guardar',
                    disabled:true,
                    handler : function(btn) {
                        var botonGuardar = btn.up().down('button[name="botonGuardar"]');
                        var botonCancelar = btn.up().down('button[name="botonCancelar"]');
                        var botonImportar = btn.up().down('button[name="botonImportar"]');
                        var formulario = btn.up().up().getForm();
                        me.fireEvent('Guardar', formulario,
                            storeA, botonCancelar, botonGuardar,
                            botonImportar);
                    }
                }, {
                    name: 'botonImportar',
                    icon : Extidi.Constantes.URL_ICONO_IMPORTAR_IMPORTE,
                    text : 'Importar',
                    handler : function(btn) {
                        var botonGuardar = btn.up().down('button[name="botonGuardar"]');
                        var botonCancelar = btn.up().down('button[name="botonCancelar"]');
                        var botonImportar = btn.up().down('button[name="botonImportar"]');
                        var formulario = btn.up().up().getForm();
                        me.fireEvent('Importar', formulario,
                            storeA, botonCancelar, botonGuardar,
                            botonImportar);
                    }
                }, {
                    name: 'botonCancelar',
                    icon : Extidi.Constantes.URL_ICONO_CANCELAR_IMPORTE,
                    text : 'Cancelar',
                    handler : function(btn) {
                        var botonGuardar = btn.up().down('button[name="botonGuardar"]');
                        var botonCancelar = btn.up().down('button[name="botonCancelar"]');
                        var botonImportar = btn.up().down('button[name="botonImportar"]');
                        var formulario = btn.up().up().getForm();
                        me.fireEvent('Cancelar', formulario,
                            storeA, botonCancelar, botonGuardar,
                            botonImportar);
                    }
                }
                ],
                items : [{
                    xtype : 'displayfield',
                    width : 500,
                    value : '<b> Importar ' + this.titulo + '<b>'
                }, 
                {
                    xtype: 'fieldcontainer',
                    fieldLabel : 'Descripción',
                    layout: 'hbox',
                    items:[
                    {
                        xtype : 'displayfield',
                        value : 'Presione el botón para obtener informacion detallada.'
                    }, {
                        xtype : 'button',
                        name: 'botonInfo',
                        margin: '0 0 0 5',
                        icon : Extidi.Constantes.URL_ICONO_INFORMACION_IMPORTE,
                        handler : function() {
                            var ventana = me.crearVentana();								
                            ventana.show();
                        }
                    }
                    ]
                }, this.link!=''?{
                    xtype : 'displayfield',
                    width : 210,
                    value : this.link,
                    fieldLabel : 'Plantilla'
                }:{
                    xtype: 'button',
                    text: 'Descargar Plantilla',
                    handler: function(btn){
                        Ext.create('Ext.form.Panel', {
                            standardSubmit: true
                        }).getForm().submit({
                            url : me.linkUrl,
                            target : "_blank",
                            params: {
                                clase:me.linkBoton.clase,
                                table:me.linkBoton.table,
                                data: Ext.JSON.encode(me.linkBoton.auxmodelo)  
                            }
                        });
                    }
                }, {
                    xtype : 'filefield',
                    name : 'userfile',
                    allowBlank : false,
                    blankText : 'No ha selecionado un archivo .csv',
                    fieldLabel : 'Importar Csv',
                    regex : /^(.+\.csv)$/,
                    regexText : 'Solo se aceptan archivos con extension .csv',
                    width : 400,
                    buttonText : 'Examinar...'
                }, Ext.create('Extidi.clases.Grilla', {
                    xtype : 'Extidi.Grilla',
                    height : 290,
                    title : this.titulo,
                    tieneBuscar : this.tieneBuscar,
                    tienePaginador : this.tienePaginador,
                    store : storeA,
                    columns : this.columnas
                })]
            }]
        });

        me.callParent(arguments);
    },
    crearVentana : function() {
        var ventanaDescripcion = Ext.create('Ext.window.Window', {
            height : 270,
            autoDestroy : true,
            modal: true,
            width : 507,
            layout : {
                type : 'fit'
            },
            title : 'Descripción',
            items : [{
                xtype : 'form',
                layout : {
                    type : 'fit'
                },
                bodyPadding : 10,
                items : [{
                    xtype : 'displayfield',
                    value : this.descripcion,
                    anchor : '100%',
                    autoScroll : true

                }]
            }]

        });

        return ventanaDescripcion;
    }

}

);