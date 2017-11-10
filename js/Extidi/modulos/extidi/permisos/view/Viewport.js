Ext.define('Extidi.modulos.extidi.permisos.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	title: 'Permisos',
	//icon: Extidi.modulos.extidi.usuarios.constantes.ICONO16,
	maximized: true,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_modulos_permisos',
				anchoFormulario: 500
				//, posicionFormulario: 'derecha'
			})
        ];
		me.callParent();
    }
});