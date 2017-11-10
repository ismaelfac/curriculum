Ext.define('Extidi.class.view.grilla', {
    extend : 'Ext.grid.GridPanel',
    alias: 'widget.Grilla',
    columns:[{
        header : "",
        width : 160,
        sortable : true,
        dataIndex : ''
    }],
    store: new Ext.data.ArrayStore({
        fields : [{
            name: ''
        }],
        data : []
    }),
    tbar: [],
    bbar: [],
    /**
     * Propiedades especiales
     */
    tienePaginador: false,
    tieneBuscar: false,
    cantidadRegistrosPaginador: 20,
    tittle: '',
    /**
     * Fin de propiedades especiales
     */
    initComponent: function(){
        var me=this;
        if(me.tienePaginador){
            me.bbar=new Ext.PagingToolbar({
                name: 'paginador',
                store : me.getStore(),
                displayInfo : true,
                displayMsg : '{0} - {1} de {2} ' + me.title,
                emptyMsg : 'No hay datos para mostrar.',
                pageSize : me.cantidadRegistrosPaginador,
                prevText : "P&aacute;gina anterior",
                nextText : "P&aacute;gina siguiente",
                firstText : "Primera p&aacute;gina",
                lastText : "Ultima p&aacute;gina",
                beforePageText : "P&aacute;gina",
                afterPageText : 'de {0}',
                plugins : Ext.create('Extidi.ux.ProgressBarPager', {}),
                listeners : {
                    afterrender : function(component, eOpts) {
                        component.down('#refresh').hide();
                        component.items.get(9).hide();
                    }
                }
            });
        }
        if(me.tieneBuscar){
            me.tbar=Ext.Array.push(me.tbar, 
                ['->',{
                    text: 'Filtrar',
                    name: 'btnFiltrar',
                    icon: Extidi.Constantes.URL_ICONO_EXAMINAR_IMPORTE
                }]
            );
        }
        me.callParent(arguments);
    }
});

