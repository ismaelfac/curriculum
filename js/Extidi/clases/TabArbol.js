Ext.define("Extidi.clases.TabArbol", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tabarbol',
    requires:[
    ],
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            layout: {
                type: 'border',
                padding: 5
            },
            items: [
            new Ext.tree.Panel({
                width: 200,
                store: Ext.create('Ext.data.TreeStore', {
                    root: {
                        expanded: true,
                        children: [
                            { text: "detention", leaf: true },
                            { text: "homework", expanded: true, children: [
                                { text: "book report", leaf: true },
                                { text: "alegrbra", leaf: true}
                            ] },
                            { text: "buy lottery tickets", leaf: true }
                        ]
                    }
                }),
                rootVisible: false,
                region: 'west',
                lines: false,
                border: false
            }),
            new Ext.TabPanel({
                activeTab : 0,
                region : 'center',
                items : []
            })

            ]
        });
        me.callParent(arguments);
        
    }
});