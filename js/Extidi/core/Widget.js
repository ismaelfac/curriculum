/**
 * @description: Clase Widget padre de todos los widgets del desktop de Extidi.
 */

Ext.define('Extidi.core.Widget', {
    extend: 'Ext.container.Container',
    width:250,
    height:150,
    layout: 'fit',
    border: true,
    //title: 'ola',
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});