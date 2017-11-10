Ext.define("Extidi.clases.ColumnValorParametro",{
    extend: "Ext.grid.column.Column",
    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
        var valor="";
        this.columns[colIndex-1].store.each(function(record){
            if(record.data.id==value){
                valor=record.data.ValorParametro;
            }
        });
        return valor;
    }
});
