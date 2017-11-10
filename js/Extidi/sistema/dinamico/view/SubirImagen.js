Ext.define('Extidi.sistema.dinamico.view.SubirImagen',{
    extend : "Extidi.clases.VentanaModal",
	alias: 'widget.SubirImagen',
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
	modelo: '',
	columna: '',
	archivos: [],
	width: 650,
	tbar: [
		{
			xtype: 'numberfield',
			name: 'txtAncho',
			fieldLabel: 'Ancho',
			width: 120,
			labelWidth: 40,
			minValue: 0,
			value: 0
		},
		{
			xtype: 'numberfield',
			name: 'txtAlto',
			fieldLabel: 'Alto',
			width: 120,
			labelWidth: 40,
			minValue: 0,
			value: 0
		},'->',
		{
			xtype: 'form',
			layout: 'hbox',
			width: 200,
			items: [
				{
					xtype: 'filefield',
					name: 'archivo',
					fieldLabel: 'Subir',
					labelWidth: 50,
					width: 130,
					msgTarget: 'side',
					regex: new RegExp("(\.((j|J)(p|P)(g|G)|(j|J)(p|P)(e|E)(g|G)|(b|B)(m|M)(p|P)|(g|G)(i|I)(f|F)|(p|P)(n|N)(g|G))$)"),
					regexText: 'Extensi&oacute;n no valida',
					buttonText: '...'
				},
				{
					xtype: 'button',
					text: 'Subir',
					name: 'btnSubir',
					margin: '0 0 0 10',
					width: 60
				}
			]
		}
	],
	bbar: [
		{
			text: 'Escoger',
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnGuardar.png",
			name: 'btnEscoger'
		},
		{
			text: 'Cancelar',
			icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnCancelar.png",
			name: 'btnCancelar'
		}
	],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
    initComponent: function(){
        var me=this;
		Extidi.Helper.construirHerencia(me);
        me.items= [
			Ext.create('Ext.tree.Panel', {
				name: 'treArchivos',
				border: 2,
				flex: 1,
				store: Ext.create('Ext.data.TreeStore', {
					root: {
						expanded: true,
						children: []
					}
				}),
				rootVisible: false
			}),
			{
				xtype: 'panel',
				border: 2,
				width: 350,
				layout: 'fit',
				margin: '0 0 0 5',
				items: [
					{
						xtype: 'container',
						name:'conImagen',
						html:''
					}
				]
			}
        ];
        me.callParent();
		me.recargar(me.archivos);
		me.fireEvent('Cargo', me);
    },
	recargar: function(archivos){
		var me=this;
		var tree=me.down('[name="treArchivos"]');
		for(var i=0; i<archivos.length;i++){
			archivos[i]={
				text: archivos[i],
				leaf: true
			};
		}
		tree.getRootNode().removeAll();
		if(archivos.length>0){
			tree.getRootNode().appendChild(archivos);
		}
	}
})