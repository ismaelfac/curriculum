Ext.define("Extidi.sistema.escritorio.view.VentanaModuloEscritorio", {
    extend : "Extidi.clases.VentanaModal",
	alias: 'widget.VentanaModuloEscritorio',
    resizable : true,
    closable : true,
	modal: false,
	draggable: true,
	maximizable: true,
	minimizable: true,
	width: 700,
	height: 600,
	minWidth: 350,
	minHeight: 300,
	tools: [
		{
			type:'help',
			tooltip: 'Ayuda',
			name: 'toolAyuda'
		}
	],
    initComponent: function() {
        var me = this;
		Extidi.Helper.construirHerencia(me);
		me.callParent();
		//console.debug(me)
		me.fireEvent('Cargo', me);
	}
});
