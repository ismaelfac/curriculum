Ext.define("Extidi.core.TabArbolDinamico", {
    extend: 'Extidi.core.Module',
    alias: 'widget.tabarboldinamico',
    initComponent: function() {
        var me = this;
        var tabArbol=Ext.create('Extidi.clases.TabArbol');
        /*tabArbol.down('treepanel').on("itemclick", function(view, record, item, index, e, eOpts ){
            console.debug(view.up().up())
        }, this);*/
        var root=tabArbol.down('treepanel').getRootNode();
        root.removeAll();
        
        Extidi.Helper.creacionMenuTabArbol(root, me.menu);
        
        Ext.applyIf(me, {
            items: [
                tabArbol
            ]
        });
        me.callParent(arguments);
    }
});