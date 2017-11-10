Ext.define('Extidi.sistema.dinamico.view.ComboForaneo',{
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
		var extra={};
		extra["tabla"]=me.tabla;
		if(typeof(me.orden)!="undefined"){
			extra["orden"]=me.orden;
		}
		if(typeof(me.columnas)!="undefined"){
			extra["columnas"]=me.columnas;
		}
		if(typeof(me.con)!="undefined"){
			extra["con"]=me.con;
		}
		var hacer=true;
		if(typeof(valor)!='undefined'){
			if(valor!=''){
				if(valor!=null){
					hacer=false;
				}
			}
		}
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
				displayField:"texto",
				valueField:"id",
				store:Ext.create('Extidi.clases.Store', {
					model: Ext.define('Extidi.sistema.dinamico.model.model', {
						extend : 'Ext.data.Model',
						fields:['id','texto']
					}),
					url: Extidi.sistema.dinamico.constantes.URL_VALOR_FORANEO,
					extraParams: extra,
					autoLoad: hacer
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
		if (hacer===false) {
			me.down('[name="btnQuitar"]').setVisible(true);
			me.down('combo').getStore().load({
				params: {
					dato: valor
				},
				callback: function(records, operation, success) {
					// the operation object
					// contains all of the details of the load operation
					//console.log(records);
					me.down('combo').setValue(valor+"");
				}
			});
		}
    }
})