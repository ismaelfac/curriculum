Ext.define('Extidi.sistema.escritorio.view.Reloj', {
    extend: 'Ext.toolbar.TextItem',
    text: '&#160;HH:MM:SS',
	fecha: new Date(),
    initComponent: function () {
        var me = this;
		Extidi.Helper.construirHerencia(me);
        me.callParent();
		me.fireEvent('Cargo', me);
    }
});
