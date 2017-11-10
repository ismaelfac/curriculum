/**
 * @description: Clase Module padre de todos los modulos del desktop de Extidi.
 */

Ext.define('Extidi.core.Module', {
    extend: 'Ext.window.Window',
    autoShow: true,
    width:640,
    height:480,
    maximized: true, 
    layout: 'fit',
    desktop: null,
    permisos: [],
	tools: [
		{
			type:'help',
			tooltip: 'Ayuda',
			callback: function(panel, tool, event) {
				Ext.Ajax.request({
					url : Extidi.Constantes.URL_AYUDA,
					params: {
						'modulo': panel.idModulo
					},
					method : 'POST',
					success : function(result, request) {
						result=Ext.JSON.decode(result.responseText)
						var resultado = result.success;
						var datos = result.data;
						if(resultado) {
							Ext.create('Extidi.clases.VentanaModal', {
								title: 'Ayuda',
								items: [
									{
										xtype: 'panel',
										html: datos.Ayuda
									}
								]
							});
						}
					}
				});
				
			}
		}
	],
    initComponent: function() {
        var me = this;
        var modulo=me.idModulo;
        Ext.Ajax.request({
            url : Extidi.Constantes.URL_PERMISOS,
            params: {
                'modulo': modulo
            },
            method : 'POST',
            success : function(result, request) {
                result=Ext.JSON.decode(result.responseText)
                
                var resultado = result.success;
                var datos = result.datos;
                if(resultado) {
                    var puede=false;
                    for (var i = 0; i < datos.length; i++) {
                        if(datos[i].NombreAccion=="ver"){
                            puede=true;
                        }
                    }
                    if(!puede){
                        me.destroy();
                        Extidi.Msj.error("No tienes permisos para ver este modulo")
                    }else{
                        me.fireEvent("asignarPermisos2", me, datos)
                    }
                }
            }
        });
        me.callParent();
    },
    listeners: {
        beforeclose: function(panel, eOpts){
            panel.destroy();
            return false;
        },
        
        render: function(win, eOpts ){
            //console.debug(win)
			if(win.desktop!=null){
				win.desktop.loading.hide();
			}
        },
        restore: function(win, eOpts ){
            //console.debug(win)
            if(win.desktop!=null){
				win.desktop.loading.hide();
			}
        },
        asignarPermisos2: function(me, datos){
            this.asignarPermisos(me, datos);
        }
    },
    asignarPermisos: function(me, datos){
        var ol=this;
        me.fireEvent('asignarPermisos', datos,me);
        if(typeof(me.items)!='undefined'){
            for(var i=0;i<me.items.items.length;i++){
                ol.asignarPermisos(me.items.items[i], datos);
            }
        }
    }
});