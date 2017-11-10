Ext.define('Extidi.sistema.escritorio.view.MenuInicio', {
    extend: 'Ext.panel.Panel',
    requires: [
    ],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
    ariaRole: 'menu',
    defaultAlign: 'bl-tl',
    floating: true,
    shadow: true,
    width: 400,
    height : 350,
	title: '-',
    initComponent: function() {
        var me = this;
		Extidi.Helper.construirHerencia(me);
		var menu = [];
        me.items = [
			new Ext.menu.Menu({
				name: 'Menu',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				flex: 1,
				border: false,
				floating: false,
				autoScroll: true,
				items: menu
			}),
			new Ext.menu.Menu({
				name: 'Acciones',
				width : 180,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				border: false,
				floating: false,
				items : [
					/*{
						text : 'Cambiar Contrase&ntilde;a',
						icon : Extidi.BASE_PATH+"js/Extidi/sistema/escritorio/images/cambiar_contrasena.png",
						name: 'CambiarContrasena'
					},*/
					{
						xtype: 'displayfield',
						flex: 1
					},
					{
						text : 'Cambiar datos',
						icon : Extidi.BASE_PATH+"js/Extidi/sistema/escritorio/images/cambiar_datos.png",
						name: 'cambiar_datos'
					},
					{
						xtype: 'menuseparator'
					},
					{
						text : 'Cerrar sesi&oacute;n',
						icon : Extidi.BASE_PATH+"js/Extidi/sistema/escritorio/images/logout.png",
						name: 'Logout'
					}
				]
			})
		];
        //me.layout = 'fit';
		
		Ext.menu.Manager.register(me);
        
		me.callParent();

        delete me.toolItems;
		
		me.fireEvent('Cargo', me, menu);
    }
});
