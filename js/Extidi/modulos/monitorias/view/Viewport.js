Ext.define('Extidi.modulos.monitorias.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	title: 'monitorias',
	//icon: Extidi.modulos.monitorias.constantes.ICONO16,
	maximized: true,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_monitores',
				//anchoFormulario: 500
				posicionFormulario: 'derecha',
				nombre: 'Monitores',
				detalles: [
					{
						permiso:'Extidi.modulos.monitorias',
						modelo: 'extidi_monitorias',
						posicionFormulario: 'derecha',
						nombre: 'Monitorias',
						campo: 'id_monitor'
					}
				]
			})
        ];
		me.callParent();
    }
});