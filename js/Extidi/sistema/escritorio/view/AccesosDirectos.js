Ext.define('Extidi.sistema.escritorio.view.AccesosDirectos', {
    extend: 'Ext.view.View',
	width: 220,
	requires: [
	],
	padding: 5,
	store: Ext.create('Ext.data.ArrayStore', {
		fields: ['id','texto'],
		data : [
		]
	}),
    itemSelector: 'div.thumb-wrap',
	autoScroll: true,
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		
		me.tpl= new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" style="cursor:pointer;margin-bottom: 10px;display:block;overflow: hidden;width: {[Extidi.config.accesos.ancho_acceso]}px; height: {[Extidi.config.accesos.alto_acceso]}px;text-align: center; vertical-align:text-top;">',
				  '<img src="{[Extidi.BASE_PATH+\'js/\'+Extidi.clases.Helper.cambiarRuta(values.id)+\'/images/icon/\'+Extidi.config.accesos.ancho_icono+\'.png\']}" style="width: {[Extidi.config.accesos.ancho_icono]}px; height: {[Extidi.config.accesos.alto_icono]}px;"/>',
				  '<br/><span style="color: white;">{texto}</span>',
				'</div>',
			'</tpl>'
		);
        me.callParent();
		me.fireEvent('Cargo', me);
    }
});
