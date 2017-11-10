Ext.define("Extidi.clases.BusquedaEstadoStore", {

    extend : 'Ext.data.Store',
    fields : ['estado', 'valor'],
    data : [{
        "estado" : "Activo",
        "valor" : "1"
    }, {
        "estado" : "Inactivo",
        "valor" : "0"
    },{
        "estado" : "-",
        "valor" : ""
    }],
    autoLoad : true

});