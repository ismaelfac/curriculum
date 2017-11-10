Ext.define('Extidi.sistema.escritorio.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
	],
	layout: 'border',
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			{
				xtype: 'container',
				region: 'center',
				layout: 'absolute',
				id: 'container_principal_extidi',
				name: 'container_principal',
				items:[
					Ext.create('Extidi.sistema.escritorio.view.Wallpaper'),
					{
						xtype: 'container',
						x: 0,
						y: 0,
						anchor: '100% 100%',
						region: 'center',
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						items:[
							Ext.create('Extidi.sistema.escritorio.view.AccesosDirectos', {
								flex: 1
							}),
							Ext.create('Extidi.sistema.escritorio.view.Widgets', {
								width: Extidi.config.widgets.ancho
							})
						]
					}
				]
			},
			Ext.create('Extidi.sistema.escritorio.view.BarraTareas')
        ];
		me.callParent();
		if(Ext.isIE7m){
			me.down('[name="container_principal"]').add({
				xtype: 'container',
				x: 0,
				y: 0,
				anchor: '100% 100%',
				region: 'center',
				name: 'render_ventanas'
			});
		}
		me.fireEvent('Cargo', me);
    }
});