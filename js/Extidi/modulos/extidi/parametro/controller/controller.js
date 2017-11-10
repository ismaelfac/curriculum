Ext.define('Extidi.modulos.extidi.parametro.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.modulos.extidi.parametro.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
        me.control({
            'FormularioDinamico[modelo="extidi_parametro"]':{
                antesGuardar: function(btnGuardar){
                    var correos=btnGuardar.up('FormularioDinamico').down('[name="NombreCampo"]').getValue();
					var validador=new RegExp("^([a-zA-Z0-9_-])*$");
					if (!validador.test(correos)) {
						Extidi.Msj.error("Caracteres invalidos, solo letras, numeros, _ y -.");
						return false;
					}
					
                }
            }
		});
	}
});