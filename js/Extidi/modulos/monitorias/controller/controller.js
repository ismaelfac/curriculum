Ext.define('Extidi.modulos.monitorias.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.modulos.monitorias.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            '[_="Extidi.modulos.monitorias.view.Viewport"]':{
				prueba: function(cmp){
					console.debug(cmp)
				}
			}
		});
	}
});