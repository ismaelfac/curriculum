Ext.define('Extidi.sistema.login.view.Ventana',{
	extend: "Extidi.clases.VentanaModal",
    layout: "auto",
    modal: false,
    width: 420,
    height: 300,
    closable: false,
	forward: true,
	initComponent: function(){
        var me=this;
		Extidi.Helper.construirHerencia(me);
        me.items=[
			{
				xtype	: "component",
				html 	: '<center><img src="'+Extidi.Constantes.URL_BASE_LOGO+Extidi.config.logo+'" /></center>' 
			},
			Ext.create("Extidi.sistema.login.view.Formulario", {
				margin: '0 0 10 0'
			})
        ];
		me.bbar=[
			'->',
			{
				xtype	: "container",
				//width   : 200,
				html 	: '<font style="cursor:pointer" onclick="window.open(\'http://fundacionidi.org\')">Desarrollado por la Fundaci&oacute;n I+D+I</font>',
				padding: '3 10 3 0'
			}
        ];
        me.callParent();
    }
});