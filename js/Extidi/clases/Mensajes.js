Ext.define("Extidi.clases.Mensajes",{
    extend: "Ext.window.MessageBox",
    alternateClassName: "Extidi.Msj",
    requires: [
        "Extidi.clases.VentanaFlotante"
    ],
    buttonText:{
        ok: "OK", 
        yes: "Si", 
        no: "No", 
        cancel: "Cancelar"
    },
    singleton: true,
	autoScroll: true,
	
    alert: function(message,funcion){
        this.show({
            title	: "Alert",
            modal	: true,
            icon	: Ext.Msg.WARNING,
            buttons	: Ext.Msg.OK,
            msg		: message,
            fn		: funcion || Ext.emptyFn
        });
    },
	
    info	: function(message, funcion, pos, posd, time){
        //console.debug(Extidi.VentanaFlotante)
        Extidi.VentanaFlotante.msg('Información',message, funcion, pos, posd, time);
    },
	
    error	: function(message,funcion){
        this.show({
            title	: "Error",
            modal	: true,
            icon	: Ext.Msg.ERROR,
            buttons	: Ext.Msg.OK,
            //closable: false,
            msg		: message,
            fn		: funcion || Ext.emptyFn
        });
    },
	
    warning	: function(message,funcion){
        this.show({
            title	: "Advertencia",
            modal	: true,
            icon	: Ext.Msg.WARNING,
            buttons	: Ext.Msg.OK,
            msg		: message,
            fn		:funcion
        });
    },
	
    confirm	: function(message,callback,scope){
        this.show({
            title	: "Confirmaci&oacute;n",
            modal	: true,
            closable:false,
            icon	: Ext.Msg.QUESTION,
            buttons	: Ext.Msg.YESNO,
            msg		: message,
            fn		: callback || Ext.emptyFn,
            scope	: scope || this
        });
    },
	
    importar:function(mensaje){
        var ventana=Ext.create('Extidi.clases.VentanaMensajeImportar',{
            mensaje:mensaje
        });
        ventana.show();
    }
	
	
	
});