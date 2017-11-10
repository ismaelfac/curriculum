Ext.define('Extidi.clases.Grilla', {
    alternateClassName : 'Extidi.Grilla',
    alias : 'widget.grilla',
    tieneBuscar : false,
    puedeCopiar: false,
    tienePaginador : true,
    tieneContador : false,
    extend : 'Ext.grid.GridPanel',
    enableColumnHide : false,
	ancho_filtro: 600,
    requires : ['Extidi.ux.ProgressBarPager'],
	border: true,
    initComponent : function() {
        var grilla = this;
        grilla.plugins= (grilla.puedeCopiar===true?[
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2,
                listeners: {
                    'edit': function(editor, e) {
                        // commit the changes right after editing finished
                        e.record.commit();
                    }
                }
            })
            ]:grilla.plugins);
        if(grilla.puedeCopiar===true){
            for(i=0;i<grilla.columns.length;i++){
                if(typeof(grilla.columns[i].editor)=='undefined' && typeof(grilla.columns[i].renderer) =='undefined'){
                    //console.debug(grilla.columns[i].renderer)
                    grilla.columns[i].editor={
                        xtype: 'textfield',
                        readOnly:true
                    };
                }
            }
        }
		var botonesAdicionales=[];
		
        if(this.tieneBuscar){
			botonesAdicionales={
				text: 'Filtrar',
				name: 'btn_filtrar',
				//icon: Extidi.Constantes.URL_ICONO_EXAMINAR_IMPORTE,
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
					var ventana=Ext.create("Extidi.clases.VentanaModal", {
						title: 'Filtrador',
						width: me.ancho_filtro,
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
			};
		}
        var toolbarPaginador = new Ext.PagingToolbar({
            name: 'paginador',
            store : grilla.getStore(),
            displayInfo : true,
            displayMsg : '{0} - {1} de {2} ' + (typeof(grilla.title)=='undefined'?'':grilla.title),
            emptyMsg : 'No hay ' + (typeof(grilla.title)=='undefined'?'':grilla.title) + ' para mostrar.',
            pageSize : grilla.cantidadRegistrosPaginador,
            prevText : "Pagina anterior",
            nextText : "Pagina siguiente",
            firstText : "Primera pagina",
            lastText : "Ultima pagina",
            beforePageText : "Pagina",
            afterPageText : 'de {0}',
            plugins : Ext.create('Extidi.ux.ProgressBarPager', {}),
            listeners : {
                afterrender : function(component, eOpts) {
                    //component.down('#refresh').hide();
                    component.items.get(9).hide();
                }
            },
			items: botonesAdicionales
        });

        if(this.tienePaginador){
            grilla.bbar = toolbarPaginador;
		}else{
			grilla.bbar=new Ext.Toolbar({
				items: botonesAdicionales
			})
		}
            
		if(grilla.tieneContador){
			Ext.Array.insert(grilla.columns, 0, [Ext.create('Ext.grid.RowNumberer')]);
		}
        grilla.callParent(arguments);
    },
    getToolbarGrilla: function(){
        var grilla=this;
        return grilla.getDockedItems('toolbar[dock="top"]')[0];
    },
    agregarBoton: function(botones, posicion){
        var grilla=this;
        grilla.getDockedItems('toolbar[dock="top"]')[0]=Ext.Array.insert(grilla.getDockedItems('toolbar[dock="top"]')[0], posicion, botones)
        
    }
});
