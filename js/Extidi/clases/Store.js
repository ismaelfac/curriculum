Ext.define("Extidi.clases.Store",{
    extend	: "Ext.data.Store",
	
    autoLoad	: true,	
    pageSize:20,
    constructor	: function(options){
        var me = this;
		
        Ext.apply(me,options || {});
        me.proxy = {
            type		: "ajax",
            url		: me.url,
            model: me.model,
            extraParams:me.extraParams,
            actionMethods : {
                read : 'POST'
            },
            reader	: {
                type			: "json",
                root			: "data",
                successProperty	: "success",
                totalProperty	: "total"
            }
        };
	
        me.callParent(arguments);
    }
});
