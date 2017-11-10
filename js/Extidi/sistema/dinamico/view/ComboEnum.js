Ext.define('Extidi.sistema.dinamico.view.ComboEnum',{
    extend : "Ext.form.field.ComboBox",
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
	anchor:"-10",
	allowBlank:true,
	forceSelection:true,
	displayField:"texto",
	valueField:"id",	
    initComponent: function(){
        var me=this;
		me.store=Ext.create('Ext.data.ArrayStore', {
			fields: ['id','texto'],
			data : me.data
		});
        me.callParent();
    }
})