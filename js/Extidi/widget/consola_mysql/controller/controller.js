Ext.define('Extidi.widget.consola_mysql.controller.controller',{
    extend: 'Ext.app.Controller',
    refs: [
    {
        ref: 'Principal',
        selector: '[_="Extidi.widget.consola_mysql.view.Viewport"]'
    }
    ],
    init: function(){
		var me=this;
		me.control({
			'[$className=Extidi.widget.consola_mysql.view.Viewport] [name="btnEjecutar"]':{
                click:function(boton){
					var sql=boton.up('[$className=Extidi.widget.consola_mysql.view.Viewport]').down('[name="sql"]').getValue();
					if(sql!=""){
						Ext.Ajax.request({
							async:false,
							url: Extidi.widget.consola_mysql.constantes.URL_EJECUTAR,
							method:"post",
							params: {
								sql: sql
							},
							success:function(result,request){
								result=Ext.JSON.decode((result.responseText));
								var data=result.data;
								//var datos=result.data.data;
								var correcto=result.success;
								if(correcto){
									Ext.create('Extidi.clases.VentanaModal', {
										title: 'Resultado Consola',
										maximized: true,
										layout: 'fit',
										autoScroll: true,
										html: "Cantidad: "+data.num_rows+"<br>JSON:<br>"+data.result
									})
								}
							},
							failure: function(result, opt){
								Ext.create('Extidi.clases.VentanaModal', {
									title: 'Resultado Consola Error '+result.status,
									maximized: true,
									autoScroll: true,
									html: result.responseText
								})
							}
						});
					}
                }
            }
		});
	}//end function
});