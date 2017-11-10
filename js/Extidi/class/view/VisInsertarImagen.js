Ext.define('Extidi.class.view.VisInsertarImagen', {
    extend : 'Extidi.clases.VentanaModal',
    alias : 'widget.insertarimagenvista',
    autoShow: true,
    height : 580,
    width : 680,
    draggable : true,
    maximized: true,   
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    title: 'Insertar Imagen',

    initComponent : function() {
        var me = this;
        
        me._=me.$className;

        var store=Ext.create('Extidi.class.store.StoImagenes');

        /*var imageTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="ux-desktop-shortcut" title="{caption}">',
        '<center><div class="ux-desktop-shortcut-icon" style="background-image: url({src}) !important;">',
        '<img src="',Ext.BLANK_IMAGE_URL,'" height="32">',
        '</div>',
        '<span class="ux-desktop-shortcut-text">{caption}</span>',
        '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
         );*/

        /*var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="archivos">',
            '<img src="{src}" title="{caption}" width="{ancho}" height="{alto}>',
            '</div>',
            '<span class="archivos-text">{caption}</span>',
            '</div>',
            '</tpl>',
            '<div class="x-clear"></div>'
            );*/

        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap">',
            '<div class="thumb"><img src="{src}" title="{caption}" width="120" height:"90"></div>',
            '<span class="x-editable">{caption}</span></div>',
            '</tpl>',
            '<div class="x-clear"></div>'
            );

        me.dockedItems= [       
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [                               
            {
                xtype: 'button',                
                text: 'Crear Carpeta',                
                name: 'crearCarpeta',
                icon : Extidi.Constantes.URL_ICONO_ACEPTAR
            }]
        }]


        Ext.applyIf(me, {
            items : [            
            {
                xtype: 'treepanel',
                width: 250,
                name: 'carpetas',
                store: Ext.create('Extidi.class.store.StoCarpetas')
            },
            {
                xtype: 'hiddenfield',                
                name: 'ubicacionActual'   
            },
            {
                xtype : 'form',
                name : 'formSubirImagen',
                frame : true,            
                bodyPadding : 10,
                autoSroll: true, 
                flex : 1,           
                items : [{
                    xtype : 'displayfield',
                    flex : 1,
                    value : '<b> Insertar Imagen<b>'
                }, { 
                    xtype : 'container',
                    frame : true,
                    layout: 'hbox', 
                    flex : 1,

                    items : [{
                        xtype : 'filefield',
                        name : 'userfiles',
                        allowBlank : false,
                        blankText : 'No ha selecionado un archivo jpg, png, gif o bmp',
                        fieldLabel : 'Insertar Imagen',
                        regex : /^(.+\.(jpg|png|gif|jpeg|bmp))$/,
                        regexText : 'Solo se aceptan archivos con extension jpg, png, gif o bmp',
                        width: 300,                       
                        buttonText : 'Examinar...'
                    },  {
                        xtype:'textfield',                                           
                        name:'Nombre',                      
                        allowBlank : false,
                        fieldLabel : 'Nombre',                       
                        maskRe: Extidi.Constantes.REGEX_NOMBRE,
                        maxLength:10,
                        labelWidth: 50,
                        flex : 1
                    },  {  
                        xtype: 'button',                        
                        name: 'btnSubir',
                        text: 'Subir',
                        flex : 1                        
                    } 
                    ]
                }, {                     
                    xtype: 'dataview',
                    name: 'principal',
                    //multiSelect: true,
                    autoSroll: true, 
                    overItemCls: 'x-item-over',
                    itemSelector: 'div.thumb-wrap',
                    emptyText: 'No hay imagenes a mostrar',
                    trackOver: true,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    store: store,                    
                    tpl: imageTpl,
                    style: {
                        'background-color':'white'
                    }, 
                    height: 500                    
                }]
                    
            }]
        });

        me.callParent(arguments);
    }
});