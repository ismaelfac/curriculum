Ext.define('Extidi.sistema.escritorio.view.Wallpaper', {
    extend: 'Ext.container.Container',
	//region: 'center',
	x: 0,
	y: 0,
	anchor: '100% 100%',
    afterRender: function () {
        var me = this;
		Extidi.Helper.construirHerencia(me);
        me.callParent();
        me.setWallpaper(Extidi.config.wallpaper, me.stretch);
    },
    setWallpaper: function (wallpaper, stretch) {
        var me = this;

        if (me.rendered) {
			me.el.removeCls('ux-wallpaper-tiled');
			me.el.setStyle({
				'background-image': "url('"+Extidi.BASE_PATH+"images/wallpapers/"+wallpaper+"')",
				'background-repeat': 'no-repeat',
				'background-position': 'center center',
                '-webkit-background-size': 'cover',
                '-moz-background-size': 'cover',
                '-o-background-size': 'cover',
                'background-size': 'cover'
			});
        }
        return me;
    }
});
