Ext.define('Extidi.modulos.extidi.acciones.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	title: 'Acciones',
	//icon: Extidi.modulos.extidi.usuarios.constantes.ICONO16,
	maximized: true,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_acciones',
				anchoFormulario: 500
				//, posicionFormulario: 'derecha'
			})
        ];
		me.callParent();
    }
});