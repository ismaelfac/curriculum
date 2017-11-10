Ext.define('Extidi.modulos.monitores.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.modulos.monitores.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            '[_="Extidi.modulos.monitores.view.Viewport"]':{
				prueba: function(cmp){
					console.debug(cmp)
				}
			}
		});
	}
});