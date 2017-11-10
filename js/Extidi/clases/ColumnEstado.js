Ext.define("Extidi.clases.ColumnEstado",{
    extend: "Ext.grid.column.Column",
    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
        var valor="";
        if(value=="1"){
            valor="Activo";
        }else if(value=="0"){
            valor="Inactivo";
        }
        return valor;
    }
});
