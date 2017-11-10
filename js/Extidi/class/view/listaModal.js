Ext.define('Extidi.class.view.listaModal', {
    extend : 'Extidi.clases.VentanaModal',
    alias : 'widget.listaModalVista',
    autoShow: true,
    height : 500,
    width : 700,
    draggable : true,
    title: 'Seleccionar Registro',
    table: '', 
    view: [],
    columnsShow: [], 
    conditions: [], 
    initComponent : function() {
        var me = this;

        var fields=["id","texto"];

        var columns=[{
            header:'No.', 
            xtype: 'rownumberer', 
            width: 30, 
            xfilter:{
                disabled:true
            }
        }]
        Ext.Array.forEach(me.columnsShow, function(item, index){
            fields.push(item) 

            columns.push({
                header: item, 
                flex: 1,
                sortable: true, 
                dataIndex: item
            })                      
        })           

        var store=Ext.create('Extidi.clases.Store',{
            url : Extidi.BASE_PATH+"index.php/cruddinamico/listarCombos",   
            extraParams: {
                table: me.table,
                clase: me.clase,
                columnsShow: Ext.JSON.encode(me.columnsShow),
                data: Ext.JSON.encode(me.view),
                modelPrincipal: Ext.JSON.encode(me.modelPrincipal),
                condicion: Ext.JSON.encode(me.conditions),
                foreignKey: Ext.JSON.encode(me.foreignKey)
            },                        
            model : Ext.define("Extidi.class.view.model", {
                extend : "Ext.data.Model",
                fields : fields
            })
        });

        Ext.applyIf(me, {
            items : [Ext.create('Extidi.clases.Grilla',{                    
                tieneBuscar : true,
                tienePaginador:true,
                store: store,
                features: [{
                    ftype:'grouping',
                    groupHeaderTpl: '{name} ({rows.length})',                    
                    hideGroupedHeader: true
                }],

                selModel : Ext.create('Ext.selection.CheckboxModel', {
                    showHeaderCheckbox : false
                }),                   
                
                columns: columns
            
            })]
        });

        me.callParent(arguments);
    }
});