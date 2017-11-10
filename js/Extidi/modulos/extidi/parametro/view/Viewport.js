Ext.define('Extidi.modulos.extidi.parametro.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	title: 'Parametros',
	//icon: Extidi.modulos.extidi.parametro.constantes.ICONO16,
	maximized: true,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_parametro',
				posicionFormulario: 'derecha',
				detalles: [
					{
						permiso: 'Extidi.modulos.extidi.valorparametro',
						modelo: 'extidi_valorparametro',
						posicionFormulario: 'derecha',
						nombre: 'Valor parametro',
						campo: 'IdParametro'
					}
				]
			})
        ];
		me.callParent();
    }
});