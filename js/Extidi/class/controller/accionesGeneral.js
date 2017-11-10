Ext.define("Extidi.class.controller.accionesGeneral",{
    extend: "Ext.app.Controller",
    refs: [
    {
        ref: 'ventana',
        selector: 'cruddinamico'
    }
    ],
    init: function() {
        this.control({
            'button[name="btnCerrarSesion"]':{
                click: this.cerrarSesion
            },
            'grilla [name="btnFiltrar"]': {
                click: function(btn){
                    var grilla=btn.up().up();
                    var columnas=grilla.columns;
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
                    var ventana=Ext.create("Extidi.clases.VentanaModal", {
                        title: 'Filtrador',
                        items: [
                        Ext.create('Extidi.clases.Formulario',{
                            frame: true,
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
            }
        });
    },
    cerrarSesion: function(but, eve, opc){
        Ext.Msg.confirm(
            'Cerrar sesi&oacute;n', 
            '&iquest;Desea cerrar la sesi&oacute;n actual?',
            function(btn){
                if(btn=="yes"){
                    Ext.Ajax.request({
                        url : Extidi.Constantes.URL_DESCONECTAR,
                        method : 'POST',
                        success : function(result, request) {
                            result=Ext.JSON.decode((result.responseText))
                            var resultado = result.success;
                            if(resultado) {
                                document.location=Extidi.BASE_PATH;
                            }
                        }
                    });
                }
            }
            );
    //console.debug(respuesta)
    }
});