Ext.define('Extidi.modulos.extidi.usuarios.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	title: 'Usuarios',
	//icon: Extidi.modulos.extidi.usuarios.constantes.ICONO16,
	maximized: true,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_usuarios',
				anchoFormulario: 500
				//, posicionFormulario: 'derecha'
			})
        ];
		me.callParent();
    }
});