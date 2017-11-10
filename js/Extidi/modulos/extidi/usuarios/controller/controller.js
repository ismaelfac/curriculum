Ext.define('Extidi.modulos.extidi.usuarios.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.modulos.extidi.usuarios.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            '[_="Extidi.modulos.extidi.usuarios.view.Viewport"]':{
				prueba: function(cmp){
					console.debug(cmp)
				}
			}
		});
	}
});