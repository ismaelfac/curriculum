Ext.define('Extidi.modulos.monitores.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	title: 'monitores',
	//icon: Extidi.modulos.monitores.constantes.ICONO16,
	maximized: true,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_monitores',
				posicionFormulario: 'derecha',
				detalles: [
					{
						permiso:'Extidi.modulos.monitorias',
						modelo: 'extidi_monitorias',
						nombre: 'Monitorias',
						campo:  'id'
					}
				]
			})
        ];
		me.callParent();
    }
});