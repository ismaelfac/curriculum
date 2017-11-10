Ext.define('Extidi.widget.consola_mysql.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.WidgetEscritorio',
	requires: [
	],
	height: 260,
	layout: 'fit',
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Ext.panel.Panel', {
				title: 'Consola MySQL',
				layout: 'fit',
				buttons: [
					'->',{
						text: 'Ejecutar',
						name: 'btnEjecutar'
					}
				],
				items: [
					{
						xtype: 'textareafield',
						name: 'sql'
					}
				]
			})
        ];
		//console.debug(me)
		me.callParent();
    }
});