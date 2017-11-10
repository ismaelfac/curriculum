Ext.define('Extidi.sistema.dinamico.view.FormularioFiltro',{
    extend : "Extidi.clases.Formulario",
	alias: 'widget.FormularioFiltroDinamico',
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
    border: false,
	modelo: '',
	fieldDefaults: {
        labelAlign: 'rigth',
        labelWidth: 140
    },
	bbar: [
		{
			text: "Filtrar",
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnFiltrar.png",
			name: "btnFiltrar"
		},
		{
			text: "Cancelar",
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnCancelar.png",
			name: "btnCancelar"
		}
	],
    initComponent: function(){
        var me=this;
		Extidi.Helper.construirHerencia(me);
        me.items= [
        ];
        me.callParent();
		me.fireEvent('Cargo', me);
    }
})