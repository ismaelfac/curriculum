/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Extidi.core.Wallpaper
 * @extends Ext.Component
 * <p>This component renders an image that stretches to fill the component.</p>
 */
Ext.define('Extidi.core.Wallpaper', {
    extend: 'Ext.Component',

    alias: 'widget.wallpaper',

    cls: 'ux-wallpaper',
    html: '<img src="'+Ext.BLANK_IMAGE_URL+'">',

    stretch: false,
    wallpaper: null,
    stateful  : true,
    stateId  : 'desk-wallpaper',

    afterRender: function () {
        var me = this;
        me.callParent();
        me.setWallpaper(me.wallpaper, me.stretch);
    },

    applyState: function () {
        var me = this, old = me.wallpaper;
        me.callParent(arguments);
        if (old != me.wallpaper) {
            me.setWallpaper(me.wallpaper);
        }
    },

    getState: function () {
        return this.wallpaper && { wallpaper: this.wallpaper };
    },

    setWallpaper: function (wallpaper, stretch) {
        var me = this, imgEl, bkgnd;

        me.stretch = (stretch !== false);
        me.wallpaper = wallpaper;

        if (me.rendered) {
            imgEl = me.el.dom.firstChild;
			imgEl.src = Extidi.BASE_PATH+'images/wallpapers/'+wallpaper;
			me.el.removeCls('ux-wallpaper-tiled');
			Ext.fly(imgEl).setStyle({
				width: '100%'
			}).show();
            me.el.setStyle({
                backgroundImage: bkgnd || '',
				backgroundColor: '#A09D9F'
            });
            if(me.stateful) {
                me.saveState();
            }
        }
        return me;
    }
});
