Ext.define("Extidi.clases.VentanaModal", {
    extend : "Ext.Window",
    autoShow : true,
    layout : "fit",
    modal : true,
    draggable : false,
    resizable : false,
    closable : true,
    bodyPadding : 10,
    width : 500,
    height : 480,
    constrain : true,
    //constrainHeader: true,
    listeners : {
        'afterrender' : function(component, eOpts) {
            //console.debug(component)
            if(component.getWidth() > Ext.getBody().getWidth()) {
                component.setWidth(Ext.getBody().getWidth() - 10);
            }
            if(component.getHeight() > Ext.getBody().getHeight()) {
                component.setHeight(Ext.getBody().getHeight() - 10);
            }
            if( typeof (component.header) != 'undefined') {
                component.constrainHeader=true;
            }
        //		console.debug(component.setSize)
        }
    }

});
