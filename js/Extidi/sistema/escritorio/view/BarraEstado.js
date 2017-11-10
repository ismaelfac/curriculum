Ext.define('Extidi.sistema.escritorio.view.BarraEstado', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [

    ],
	layout: {
		overflowHandler: 'Scroller'
	},
	flex: 1,
    initComponent: function () {
        var me = this;
		Extidi.Helper.construirHerencia(me);
        me.items = [

        ];
        me.callParent();
    },
    getItems: function () {
        var me = this;
        return me.items.items;
    }
});
