Ext.define("Extidi.class.view.crudDinamico", {
    extend : 'Ext.panel.Panel',
    alias : 'widget.cruddinamico',
    
    padding: 0,
    border: false,
    layout: {
        type: 'vbox',
        padding:'10',
        align:'stretch'
    },
    initComponent: function() {
        var me = this;
        /*
        if(typeof(me.clase)=='undefined'){
            me.clase=me.up().$className;
        }
        */
        me.modelo.clase=typeof(me.modelo.clase)!='undefined'?me.modelo.clase:me.modelo.$className.split('.model')[0];
        
        var cabecera=Ext.create('Extidi.class.view.nucleoCrudDinamico', {  
            clase: me.modelo.clase,
            modelo: this.modelo,
            flex: 1,
            cabecera: me.cabecera,
            esDetalle: me.esDetalle
        });
        var tabpanel={};           
		if(typeof(me.esDetalle)!='undefined' && me.esDetalle===true){
			me.title=this.modelo.titulo;
		}

        if(typeof(this.modelo.detailsModels)!='undefined' && this.modelo.detailsModels.length>0){

            var items=[];
            Ext.Array.forEach(this.modelo.detailsModels, function(item, index){  
                var detalle=Ext.create('Extidi.class.view.crudDinamico', {
                    modelo: item,
                    esDetalle: true,
                    cabecera: cabecera
                })
                items.push(detalle)
            })

            tabpanel={
                xtype: 'tabpanel',                
                flex: 1,
                border: true,
				plain: true,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: items
            }
           
        } 

        me.items= [
            cabecera,
            tabpanel                      
        ];
        this.callParent(arguments);
        
    }
});