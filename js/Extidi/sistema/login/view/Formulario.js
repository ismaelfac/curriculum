Ext.define('Extidi.sistema.login.view.Formulario',{
    extend : "Extidi.clases.Formulario",
    frame: true,
    autoScroll: false,
    initComponent: function(){
        var me=this;
		Extidi.Helper.construirHerencia(me);
        me.items= [
        {
            xtype : "fieldcontainer",
            layout : "hbox",
            defaultType : "textfield",
            width : 360,
            items : [{
                labelAlign : "top",
                id : 'usuario',
                msgTarget : 'side',
                fieldLabel : "Usuario",
                name : "usuario",
                allowBlank : false,
                blankText : "Digite su usuario",
                flex : 1,
                margins : {
                    right : 3
                }
            }, {
                labelAlign : "top",
                msgTarget : 'side',
                inputType : 'password',
                fieldLabel : 'Contrase&ntilde;a',
                name : 'contrasena',
                allowBlank : false,
                blankText : 'Digite su contrase&ntilde;a',
                flex : 1,
                margins : {
                    left : 3
                }
            }]
        }];
		me.fbar= [{
            text : "Entrar",
            scope : this,
            name : "btnEntrar"
        }, {
            text : "Cancelar",
            scope : this,
            name: "btnCancelar"

        }]
        me.callParent();
    }
})