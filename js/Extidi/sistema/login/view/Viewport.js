Ext.define('Extidi.sistema.login.view.Viewport',{
	extend: 'Ext.container.Viewport',
	requires: [
	],
	layout: 'border',
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		var fondo=Ext.create('Extidi.sistema.escritorio.view.Wallpaper');
		me.items = [
			fondo
        ];
        fondo.setWallpaper(Extidi.config.wallpaper, true);
		me.callParent();
		Ext.create('Extidi.sistema.login.view.Ventana');
    }
});