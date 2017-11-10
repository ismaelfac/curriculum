Ext.define('Extidi.modulos.extidi.permisos.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.modulos.extidi.permisos.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            'GrillaDinamico[modelo="extidi_modulos_permisos"]':{
				antesSeleccionar: function(grilla, seleccionados){
					grilla.down('[name="modificar_grupos"]').setDisabled(false)
				}
			},
            'GrillaDinamico[modelo="extidi_modulos_permisos"] [name="modificar_grupos"]':{
				click: function(btn){
					var seleccionados=btn.up('GrillaDinamico').getSelectionModel().getSelection();
					if(seleccionados.length==1){
						Ext.create('Extidi.modulos.extidi.permisos.view.Modificacion', {
							id_dato: seleccionados[0].get("id")
						})
					}else{
						Extidi.Msj.error("Debe seleccionar un solo registro");
					}
				}
			},
            '[$className=Extidi.modulos.extidi.permisos.view.Modificacion] [name="btnGuardar"]':{
				click: function(btn){
					var ventana=btn.up('[$className=Extidi.modulos.extidi.permisos.view.Modificacion]');
					var grilla=ventana.down('grilla');
					var store=grilla.getStore();
					cambios=store.getUpdatedRecords();
					var datos=[];
					for(var i=0; i<cambios.length; i++){
						cambio=cambios[i].getChanges();
						Ext.Object.each(cambio, function(key, value, myself) {
							datos.push({
								grupo_id: cambios[i].get('id'),
								accion_id: key.split('_')[1],
								valor: value
							});
						});
					}
					//console.debug(datos);
					Ext.Ajax.request({
						async:false,
						url: Extidi.modulos.extidi.permisos.constantes.URL_GUARDAR,
						method:"post",
						params: {
							datos: Ext.JSON.encode(datos)
						},
						success:function(result,request){
							result=Ext.JSON.decode((result.responseText));
							var correcto=result.success;
							if(correcto){
								Extidi.Msj.info("Cambios guardados correctamente");
								ventana.close();
							}
						}
					});
				}
			}
		});
	}
});