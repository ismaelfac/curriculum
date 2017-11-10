Ext.define('Extidi.sistema.escritorio.view.Widgets', {
    extend: 'Ext.container.Container',
	//region: 'east',
	width: 220,
	requires: [
	],
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	overflowX: 'hidden',
	overflowY: 'auto',
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
        me.callParent();
		me.fireEvent('Cargo', me);
    }
});
