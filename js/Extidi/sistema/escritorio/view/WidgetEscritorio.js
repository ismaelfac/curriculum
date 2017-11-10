Ext.define("Extidi.sistema.escritorio.view.WidgetEscritorio", {
    extend : "Ext.container.Container",
	alias: 'widget.WidgetEscritorio',
    width: 200,
	height: 200,
	padding: 5,
    initComponent: function() {
        var me = this;
		Extidi.Helper.construirHerencia(me);
		me.callParent();
		//console.debug(me)
		me.fireEvent('Cargo', me);
	}
});
