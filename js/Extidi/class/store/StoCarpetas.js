Ext.define("Extidi.class.store.StoCarpetas", {
	extend: 'Ext.data.TreeStore',
    autoLoad: true,
    //url : Extidi.Constantes.URL_LISTAR_CARPETAS,
    proxy: {
        type: 'ajax',
        //url: Extidi.Constantes.modulos.URL_CONTROLLER,
        api: {
            read: Extidi.Constantes.URL_LISTAR_CARPETAS
        },
        actionMethods : {
            read : 'POST'
        },
        reader	: {
            type: "json",
            root: "data",
            successProperty: "success",
            totalProperty: "total"
        }
    },
    root: {
        expanded: true
    }

    /*root: {
        expanded: true,
        children: [
            { text: "detention", leaf: true },
            { text: "homework", expanded: true, children: [
                { text: "book report", leaf: true },
                { text: "alegrbra", leaf: true}
            ] },
            { text: "buy lottery tickets", leaf: true }
        ]
    }*/
			
});