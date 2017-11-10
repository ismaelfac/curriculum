Ext.define('Extidi.modulos.extidi.modulos.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.modulos.extidi.modulos.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            '[_="Extidi.modulos.extidi.modulos.view.Viewport"]':{
				prueba: function(cmp){
					console.debug(cmp)
				}
			}
		});
	}
});