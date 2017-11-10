Ext.define('Extidi.sistema.dinamico.view.InsetarImagen',{
    extend : "Extidi.clases.Formulario",
	alias: 'widget.InsetarImagen',
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
    border: false,
	modelo: '',
	valores: {},
	fieldDefaults: {
        labelAlign: 'rigth',
        labelWidth: 140
    },
	bbar: [
		{
			text: 'Seleccionar',
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnGuardar.png",
			name: 'btnGuardar'
		},
		{
			text: 'Cancelar',
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnCancelar.png",
			name: 'btnCancelar'
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