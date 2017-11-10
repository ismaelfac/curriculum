Ext.define("Extidi.clases.EstadoStore", {

    extend : 'Ext.data.Store',
    autoLoad : true,
    fields : ['estado', 'valor'],
    data : [{
        "estado" : "Activo",
        "valor" : "1"
    }, {
        "estado" : "Inactivo",
        "valor" : "0"
    }]
			

});