Ext.define('Extidi.sistema.login.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.sistema.login.view.Formulario"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            '[_="Extidi.sistema.login.view.Formulario"] [name="usuario"]':{
                specialkey : function(f, e) {
					if(e.getKey() == e.ENTER) {
						me.getPrincipal().down('[name="contrasena"]').focus(true);
					}
				}
            },
            '[_="Extidi.sistema.login.view.Formulario"] [name="contrasena"]':{
                specialkey : function(f, e) {
					if(e.getKey() == e.ENTER) {
						var btn=me.getPrincipal().down('[name="btnEntrar"]');
						//btn.focus();
						me.validarLogin(btn)
					}
				}
            },
            '[_="Extidi.sistema.login.view.Formulario"] [name="btnCancelar"]':{
                click: function(btn) {
					me.getPrincipal().getForm().reset();
					var usuario = me.getPrincipal().down("textfield[name=usuario]");
					usuario.focus();
				}
            },
            '[_="Extidi.sistema.login.view.Formulario"] [name="btnEntrar"]':{
                click: me.validarLogin
            }
		});
	},
	validarLogin: function(btn) {
		var me=this;
		var formulario=me.getPrincipal().getForm();
		if(formulario.isValid()) {
			var values = formulario.getValues();
			Ext.Ajax.request({
				url : Extidi.sistema.login.constantes.URL_VALIDAR,
				params : values,
				success :function(result, request) {
					result=Ext.JSON.decode((result.responseText))
					var resultado = result.datos.conectado;
					if(resultado) {
						document.location = Extidi.BASE_PATH;
					} else {
						Extidi.Msj.error(result.datos.mensaje, function() {
							var usuario = me.getPrincipal().down("textfield[name=usuario]");
							usuario.focus(true);
						});
					}
				} 
			});
		}
	}
});