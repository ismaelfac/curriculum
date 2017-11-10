Ext.define('Extidi.sistema.escritorio.view.BarraTareas', {
    extend: 'Ext.toolbar.Toolbar',
	region: 'south',
	height: 40,
    requires: [
        
    ],
    initComponent: function () {
        var me = this;
		Extidi.Helper.construirHerencia(me);
        me.items = [
            {
				menu: Ext.create('Extidi.sistema.escritorio.view.MenuInicio'),
				icon: Extidi.BASE_PATH+"js/Extidi/sistema/escritorio/images/home.png",
				scale: "medium",
                text: "Inicio"
            },
			'-',
			Ext.create('Extidi.sistema.escritorio.view.BarraEstado'),
			'-',
			Ext.create('Extidi.sistema.escritorio.view.Reloj')
        ];

        me.callParent();
    }
});
