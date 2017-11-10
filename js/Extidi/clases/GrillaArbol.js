Ext.define('Extidi.clases.GrillaArbol', {
    alternateClassName : 'Extidi.GrillaArbol',
    alias : 'widget.grillaArbol',
    tieneBuscar : false,    
    extend : 'Ext.tree.Panel',
    enableColumnHide : false,
    requires : ['Extidi.ux.ProgressBarPager'],
    rootVisible: false,
    initComponent : function() {
        var grilla = this;
        
        if(this.tieneBuscar){
            grilla.bbar = [{
                text: 'Filtrar',
                icon: Extidi.Constantes.URL_ICONO_EXAMINAR_IMPORTE,
                handler: function(btn){
                    var columnas=btn.up().up().columns;
                    var columnasQuery={};
                    var columnasFiltro=[];
                    var searhOriginal=[];
                    if(typeof(grilla.getStore().proxy.extraParams.search)!='undefined'){
                        searhOriginal=Ext.JSON.decode(grilla.getStore().proxy.extraParams.search)
                    }
                    //console.debug(searhOriginal)
						
                    var keys=Ext.Object.getKeys(searhOriginal)
                    var values=Ext.Object.getValues(searhOriginal)
                    for (var i = 0; i < columnas.length; i++) {
                        var entro=false;
                        if(typeof(columnas[i].xfilter)=='undefined'){
                            if(!columnas[i].hidden && columnas[i].dataIndex!="" && columnas[i].text!=""){
                                entro=true;
                                columnasFiltro.push({
                                    xtype: 'textfield'
                                })
                            }
                        }else{
                            if(typeof(columnas[i].xfilter.disabled)=='undefined' || (typeof(columnas[i].xfilter.disabled)!='undefined' && !columnas[i].xfilter.disabled)){
                                entro=true;
                                columnasFiltro.push(columnas[i].xfilter)
                            }
                        }
                        if(entro){
                            Ext.apply(columnasQuery, Ext.Object.fromQueryString(
                                columnas[i].dataIndex+"="
                                ));
                            var posi=Ext.Array.indexOf(keys, columnas[i].dataIndex);
                            if(posi!=-1){
                                columnasFiltro[columnasFiltro.length-1].value=values[posi];
                            }else{
                                columnasFiltro[columnasFiltro.length-1].value="";
                            }
                            columnasFiltro[columnasFiltro.length-1].name=columnas[i].dataIndex;
                            columnasFiltro[columnasFiltro.length-1].fieldLabel=columnas[i].text;
                            columnasFiltro[columnasFiltro.length-1].anchor='-10';
                        }
                    }
                    /*
					Ext.Object.each(searhOriginal, function(key, value) {
						var componente=win.down("form").down('[name="'+key+'"]');
						if(typeof(componente)!='undefined' && componente!=null){
							componente.setValue(value);
						}
					});*/
                    var ventana=Ext.create("Extidi.clases.VentanaModal", {
                        title: 'Filtrador',
                        items: [
                        Ext.create('Extidi.clases.Formulario',{
                            items: columnasFiltro,
                            buttons: [
                            {
                                text: 'Filtrar',
                                handler: function(btn){
                                    var form=ventana.down("form");
                                    var valores="";
                                    Ext.Object.each(form.getForm().getValues(), function(key, value) {
                                        valores+=(valores==""?"":"&")+key+"="+value;
                                    });
                                    Ext.apply(columnasQuery, Ext.Object.fromQueryString(valores));
                                    grilla.getStore().proxy.setExtraParam("search",Ext.JSON.encode(columnasQuery));
                                    grilla.getStore().load();
                                    ventana.destroy();
                                }
                            },
                            {
                                text: 'Restaurar',
                                handler: function(btn){
                                    var valores="";
                                    Ext.Object.each(columnasQuery, function(key, value) {
                                        valores+=(valores==""?"":"&")+key+"=";
                                    });
                                    Ext.apply(columnasQuery, Ext.Object.fromQueryString(valores));
                                    grilla.getStore().proxy.setExtraParam("search",Ext.JSON.encode(columnasQuery));
                                    grilla.getStore().load();
                                    ventana.destroy();
                                }
                            }
                            ]
                        })
                        ]
						
                    });
                }    
            }]
        }
        grilla.callParent(arguments);
    }
});