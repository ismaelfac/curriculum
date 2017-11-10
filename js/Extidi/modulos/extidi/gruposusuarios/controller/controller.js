Ext.define('Extidi.modulos.extidi.gruposusuarios.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.modulos.extidi.gruposusuarios.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            '[_="Extidi.modulos.extidi.gruposusuarios.view.Viewport"]':{
				prueba: function(cmp){
					console.debug(cmp)
				}
			}
		});
	}
});