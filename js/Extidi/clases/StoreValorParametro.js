Ext.define("Extidi.clases.StoreValorParametro",{
    extend	: "Extidi.clases.Store",
    url : Extidi.Constantes.URL_CARGAR_VALOR_PARAMETRO,
    model : "Extidi.clases.ModeloValorParametro",
    extraParams: {
        NombreCampo: ''
    }
});
