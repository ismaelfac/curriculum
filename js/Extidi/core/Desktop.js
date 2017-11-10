/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Extidi.core.Desktop
 * @extends Ext.panel.Panel
 * <p>This class manages the wallpaper, shortcuts and taskbar.</p>
 */
Ext.define('Extidi.core.Desktop', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.desktop',

    uses: [
    'Ext.util.MixedCollection',
    'Ext.menu.Menu',
    'Ext.view.View', // dataview
    'Ext.window.Window',
    //'Extidi.core.FitAllLayout',

    'Extidi.core.TaskBar',
    'Extidi.core.Wallpaper'
    ],

    activeWindowCls: 'ux-desktop-active-win',
    inactiveWindowCls: 'ux-desktop-inactive-win',
    lastActiveWindow: null,

    border: false,
    html: '&#160;',
    layout: 'fit',

    xTickSize: 1,
    yTickSize: 1,

    app: null,

    /**
     * @cfg {Array|Store} shortcuts
     * The items to add to the DataView. This can be a {@link Ext.data.Store Store} or a
     * simple array. Items should minimally provide the fields in the
     * {@link Extidi.core.ShorcutModel ShortcutModel}.
     */
    shortcuts: null,
    shortcutsWidget: null,

    /**
     * @cfg {String} shortcutItemSelector
     * This property is passed to the DataView for the desktop to select shortcut items.
     * If the {@link #shortcutTpl} is modified, this will probably need to be modified as
     * well.
     */
    shortcutItemSelector: 'div.ux-desktop-shortcut',

    /**
     * @cfg {String} shortcutTpl
     * This XTemplate is used to render items in the DataView. If this is changed, the
     * {@link shortcutItemSelect} will probably also need to changed.
     */
    shortcutTpl: [
    '<tpl for=".">',
    '<div class="ux-desktop-shortcut" title="{name}">',
    '<center><div class="ux-desktop-shortcut-icon" style="background-image: url({icon}64.png) !important;">',
    '<img src="',Ext.BLANK_IMAGE_URL,'" height="64">',
    '</div>',
    '<span class="ux-desktop-shortcut-text" style="color: #000000;">{name2}</span>',
    '</div>',
    '</tpl>',
    '<div class="x-clear"></div>'
    ],
    shortcutItemSelectorWidget: 'div.ux-desktop-widget',

    widgets: [],
    shortcutTplWidget: [
    '<tpl for=".">',
    '<div class="ux-desktop-widget">',
    '<div id="widget-{modulo}">',
    '</div>',
    //'<span class="ux-desktop-shortcut-text">widget-{modulo}</span>',
    '</div>',
    '</tpl>',
    '<div class="x-clear"></div>'
    ],

    /**
     * @cfg {Object} taskbarConfig
     * The config object for the TaskBar.
     */
    taskbarConfig: null,

    windowMenu: null,

    initComponent: function () {
        var me = this;

        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());

        me.bbar = me.taskbar = new Extidi.core.TaskBar(me.taskbarConfig);
        me.taskbar.windowMenu = me.windowMenu;

        me.windows = new Ext.util.MixedCollection();

        //me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

        me.items = [
            {
                xtype: 'wallpaper', 
                id: me.id+'_wallpaper'
            },
            {
                xtype: 'container',
                border: false,
                layout: 'fit',
                style: {
                    position: 'absolute'
                },
                x: 0, 
                y: 0,
                items:[
                    {
                        xtype: 'container',
                        //region: 'east',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        items: [
                            me.createDataView(),
                            me.createDataViewWidget()
                        ]
                    }
                ]
            }
        ];
        //console.debug(me.items)

        me.callParent();

        me.shortcutsView = me.items.getAt(1).items.getAt(0);
        //me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

        var wallpaper = me.wallpaper;
        me.wallpaper = me.items.getAt(0);
        if (wallpaper) {
            me.setWallpaper(wallpaper, me.wallpaperStretch);
        }
    },

    afterRender: function () {
        var me = this;
        me.callParent();
        //me.el.on('contextmenu', me.onDesktopMenu, me);
    },

    //------------------------------------------------------
    // Overrideable configuration creation methods

    createDataViewWidget: function () {
        var me = this;
        
        return {
            xtype: 'dataview',
            nombre: 'widget',
            overItemCls: 'x-view-over2',
            trackOver: true,
            itemSelector: me.shortcutItemSelectorWidget,
            store: me.shortcutsWidget,
            //region: 'center',
            /*style: {
                position: 'absolute'
            },
            x: 0, 
            y: 0,*/
            width: 290,
            overflowY: 'auto',
            overflowX: 'hidden',
            tpl: new Ext.XTemplate(me.shortcutTplWidget)
        };
    },
    createDataView: function () {
        var me = this;
        return {
            xtype: 'dataview',
            nombre: 'principal',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            //region: 'center',
            /*style: {
                position: 'absolute'
            },
            x: 0, 
            y: 0,*/
            flex: 1,
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },
    
    createWidget: function () {
        var me = this;
        var modulosController=[];
        for(var i=0;i<me.shortcutsWidget.length; i++){
            var module=me.shortcutsWidget[i];
            modulosController.push(module.Controlador+".Constantes");
        }
        
        var retorno=Ext.create('Ext.panel.Panel',{
            nombre: 'widgets',
            border: false,
            //title: 'ola mm',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: []
        });
        Ext.require(modulosController, function(){
            for(var i=0;i<me.shortcutsWidget.length; i++){
                var module=me.shortcutsWidget[i];
                retorno.add(Ext.create(module.Controlador+".view.init"));
                //retorno.
            }
        });
        //console.debug(retorno)
        return retorno;
    },
/*
    createDesktopMenu: function () {
        var me = this, ret = {
            items: me.contextMenuItems || []
        };

        if (ret.items.length) {
            ret.items.push('-');
        }

        ret.items.push(
        {
            text: 'Tile', 
            handler: me.tileWindows, 
            scope: me, 
            minWindows: 1
        },
        {
            text: 'Cascade', 
            handler: me.cascadeWindows, 
            scope: me, 
            minWindows: 1
        })

        return ret;
    },
*/
    createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
            {
                text: 'Restaurar', 
                handler: me.onWindowMenuRestore, 
                scope: me
            },
            {
                text: 'Minimizar', 
                handler: me.onWindowMenuMinimize, 
                scope: me
            },
            {
                text: 'Maximizar', 
                handler: me.onWindowMenuMaximize, 
                scope: me
            },
            '-',
            {
                text: 'Cerrar', 
                handler: me.onWindowMenuClose, 
                scope: me
            }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },
    addCss: function(cssCode,i) {
        var control=document.getElementById(i);
        if(!control){
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            if (styleElement.styleSheet) {
                styleElement.styleSheet.cssText = cssCode;
            } else {
                styleElement.appendChild(document.createTextNode(cssCode))
            }
            styleElement.id =i;
            document.getElementsByTagName("head")[0].appendChild(styleElement);
        }
    },
    //------------------------------------------------------
    // Event handler methods

    onDesktopMenu: function (e) {
        var me = this//, menu = me.contextMenu;
		/*console.debug(e)/*
        e.stopEvent();
        if (!menu.rendered) {
            menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
        }
        menu.showAt(e.getXY());
        menu.doConstrain();*/
    },

    onDesktopMenuBeforeShow: function (menu) {
        var me = this, count = me.windows.getCount();

        menu.items.each(function (item) {
            var min = item.minWindows || 0;
            item.setDisabled(count < min);
        });
    },

    onShortcutItemClick: function (dataView, record) {
        var me = this, module = me.app.getModule(record.data.module),
        win = module// && module.createWindow();

        if (win) {
            me.restoreWindow(win);
        }
    },

    onWindowClose: function(win) {
        var me = this;
        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },

    //------------------------------------------------------
    // Window context menu handlers

    onWindowMenuBeforeShow: function (menu) {
        var items = menu.items.items, win = menu.theWin;
        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
        items[2].setDisabled(win.maximized === true || win.hidden === true); // Maximize
    },

    onWindowMenuClose: function () {
        var me = this, win = me.windowMenu.theWin;

        win.close();
    },

    onWindowMenuHide: function (menu) {
        Ext.defer(function() {
            menu.theWin = null;
        }, 1);
    },

    onWindowMenuMaximize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.maximize();
        win.toFront();
    },

    onWindowMenuMinimize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function () {
        var me = this, win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },

    //------------------------------------------------------
    // Dynamic (re)configuration methods

    getWallpaper: function () {
        return this.wallpaper.wallpaper;
    },

    setTickSize: function(xTickSize, yTickSize) {
        var me = this,
        xt = me.xTickSize = xTickSize,
        yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;

        me.windows.each(function(win) {
            var dd = win.dd, resizer = win.resizer;
            dd.xTickSize = xt;
            dd.yTickSize = yt;
            resizer.widthIncrement = xt;
            resizer.heightIncrement = yt;
        });
    },

    setWallpaper: function (wallpaper, stretch) {
        this.wallpaper.setWallpaper(wallpaper, stretch);
        return this;
    },

    //------------------------------------------------------
    // Window management methods

    cascadeWindows: function() {
        var x = 0, y = 0,
        zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },

    createWindow: function(config, cls, fijo) {
        var me = this;
        var win, cfg = Ext.applyIf(config || {}, {
            stateful: false,
            isWindow: true,
            constrainHeader: true,
            minimizable: true,
            maximizable: true,
            renderTo: me.shortcutsView.el.dom,
            desktop: me
        });
        fijo = fijo || false;
        if(!fijo){
            cls = cls+".view.init" || "Ext.window.Window";
        }
        //win = me.add(new Ext.create(cls, cfg));
        var encontrados=me.windows.findBy(function(opciones){
            //console.debug(cls)
            //console.debug(opciones.$className)
            return opciones.$className==cls;
        });
            
        //console.debug(encontrados)
        if(encontrados==null){
            
            me.loading=me.setLoading('Espere');
            win=new Ext.create(cls, cfg);
            me.windows.add(win);
            //win.loading=me.loading;
            win.taskButton = me.taskbar.addTaskButton(win);
            win.animateTarget = win.taskButton.el;

            win.on({
                activate: me.updateActiveWindow,
                beforeshow: me.updateActiveWindow,
                deactivate: me.updateActiveWindow,
                minimize: me.minimizeWindow,
                destroy: me.onWindowClose,
                scope: me
            });

            win.on({
                boxready: function () {
                    win.dd.xTickSize = me.xTickSize;
                    win.dd.yTickSize = me.yTickSize;

                    if (win.resizer) {
                        win.resizer.widthIncrement = me.xTickSize;
                        win.resizer.heightIncrement = me.yTickSize;
                    }
                },
                single: true
            });

            // replace normal window close w/fadeOut animation:
            win.doClose = function ()  {
                win.doClose = Ext.emptyFn; // dblclick can call again...
                win.el.disableShadow();
                win.el.fadeOut({
                    listeners: {
                        afteranimate: function () {
                            win.destroy();
                        }
                    }
                });
            };
            if (win) {
                me.loading.hide();
            }
        }else{
            win=encontrados;
            me.loading=me.setLoading('Espere');
            if (win) {
                me.restoreWindow(win);
                me.loading.hide();
            }
        }
        //console.debug(win)
        return win;
    },

    getActiveWindow: function () {
        var win = null,
        zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function (comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function () {
        var windows = this.windows;
        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    restoreWindow: function (win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        } else {
            win.show();
        }
        return win;
    },

    tileWindows: function() {
        var me = this, availWidth = me.body.getWidth(true);
        var x = me.xTickSize, y = me.yTickSize, nextY = y;

        me.windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                // Wrap to next row if we are not at the line start and this Window will
                // go off the end
                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
            }
        });
    },

    updateActiveWindow: function () {
        var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
        if (activeWindow === last) {
            return;
        }

        if (last) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    },
    
    abrirModulo: function(btn){
        
    }
});
