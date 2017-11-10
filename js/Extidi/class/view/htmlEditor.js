Ext.define('Extidi.class.view.htmlEditor', {
    extend : 'Ext.form.FieldSet',
	height: 150,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
    initComponent: function(){
        var me=this;
		me.items=[
			{
				xtype: 'hiddenfield',
				name: me.nameComponent,
				listeners: {
					change: function(comp){
						comp.up('fieldset').down('panel').update({html:comp.getValue()})
					}
				}
			},
			{
				xtype: "panel",
				border: true,
				autoScroll: true,
				flex: 1,
				listeners: {
					render: function(c) {
						c.body.on('click', function() { 
							var ventana=Ext.create("Extidi.clases.VentanaModal",{
								title: c.up('fieldset').title,
								maximizable: true,
								width: 600,
								height: 500,
								items: [
									{
										xtype: 'htmleditor',
										value: c.up('fieldset').down('hiddenfield').getValue()
									}
								],
								buttons: [
									{
										text: 'Cambiar',
										handler: function(btn){
											c.up('fieldset').down('hiddenfield').setValue(ventana.down('htmleditor').getValue())
											ventana.close();
										}
									}
								]
							})
						});
					},
					scope: this
				}
			}
		]
        me.callParent(arguments);
    }
});

