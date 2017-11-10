Ext.define('Extidi.modulos.extidi.valorparametro.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	title: 'Parametros',
	//icon: Extidi.modulos.extidi.valorparametro.constantes.ICONO16,
	maximized: true,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_valorparametro'
			})
        ];
		me.callParent();
    }
});