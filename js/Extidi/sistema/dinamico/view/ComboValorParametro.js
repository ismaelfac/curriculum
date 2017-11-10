Ext.define('Extidi.sistema.dinamico.view.ComboValorParametro',{
    extend : "Ext.form.FieldContainer",
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
	layout:"hbox",
	anchor:"-10",
	labelWidth: 100,
	allowBlank: true,
	atributosAdicionales:{
	},
    initComponent: function(){
        var me=this;
		var valor=me.value;
		me.items=[
			Ext.applyIf({
				xtype:"combo",
				name: me.name,
				fieldLabel: me.fieldLabel,
				labelWidth: me.labelWidth,
				anchor:"-10",
				allowBlank:me.allowBlank,
				forceSelection:true,
				flex:1,
				typeAhead:false,
				hideTrigger:true,
				listConfig:{
					"loadingText":"Buscando...",
					"emptyText":"No existen registros con ese filtro."
				},
				displayField:"ValorParametro",
				valueField:"id",
				store: Ext.create('Extidi.clases.StoreValorParametro', {
					extraParams: me.crearStore(me.nombre_campo)
				})
			}, me.atributosAdicionales),
			{
				xtype:"button",
				width:25, 
				margin:"0 0 0 5",
				name:"btnQuitar",
				tabIndex: -9999,
				hidden:true,
				icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnQuitar.png"
			},{
				xtype:"button",
				width:25,
				margin:"0 0 0 5",
				name:"btnBuscar",
				tabIndex: -9999,
				icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnBuscar.png"
			}
		];
		me.name="";
		me.fieldLabel="";
        me.callParent();
		if(typeof(valor)!='undefined'){
			if(valor!=''){
				if(valor!=null){
				me.down('[name="btnQuitar"]').setVisible(true);
					me.down('combo').getStore().load({
						params: {
							dato: valor
						},
						callback: function(records, operation, success) {
							// the operation object
							// contains all of the details of the load operation
							//console.log(records);
							me.down('combo').setValue(valor);
						}
					});
				}
			}
		}
    },
	crearStore: function(campo){
		return {
			NombreCampo: campo,
			con: Extidi.clases.Helper.encode64("IdParametro in(SELECT id FROM extidi_parametro WHERE NombreCampo='"+campo+"') ")
		};
	}
})