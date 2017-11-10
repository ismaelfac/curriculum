Ext.define('Extidi.sistema.dinamico.view.Importar',{
    extend : "Extidi.clases.Formulario",
	alias: 'widget.ImportarDinamico',
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
    border: false,
	modelo: '',
	bbar: [
		{
			text: 'Importar',
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnImportar.png",
			name: 'btnImportar'
		},
		{
			text: 'Cancelar',
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnCancelar.png",
			name: 'btnCancelar'
		}
	],
    initComponent: function(){
        var me=this;
		//Extidi.Helper.construirHerencia(me);
        me.items= [
			{
				xtype: 'fieldcontainer',
				anchor: '-10',
				layout: 'hbox',
				items: [
					{
						xtype: 'displayfield',
						value: 'Panel para importaci&oacute;n de datos.',
						flex: 1
					},
					{
						xtype: 'button',
						name: 'btnPlantilla',
						text: 'Plantilla'
					}
				]
			},
			{
				xtype: 'filefield',
				fieldLabel: 'Archivo',
				allowBlank: false,
				anchor: '-10',
				name: 'fileArchivo',
				buttonText: 'Seleccionar archivo'
			}
        ];
        me.callParent();
		me.fireEvent('Cargo', me);
    }
})