Ext.define('Extidi.modulos.extidi.permisos.view.Modificacion',{
	extend: 'Extidi.clases.VentanaModal',
	title: 'Modificar Grupos',
	layout: 'fit',
	width: 700,
	buttons: [
		{
			text: 'Guardar',
			name: 'btnGuardar'
		}
	],
    initComponent: function() {
		var me=this;
		var datos=[];
		var model=[
			'id',
			'NombreGrupo'
		];
		var columnas=[
			{
				dataIndex: 'id',
				hidden: true
			},
			{
				dataIndex: 'NombreGrupo',
				text: 'Grupo',
				minWidth: 300,
				sortable: false,
				draggable: false,
				resizable: false
			}
		];
		var entro=false;
		Ext.Ajax.request({
			async:false,
			url: Extidi.modulos.extidi.permisos.constantes.URL_OBTENER_GRUPOS,
			method:"post",
			params: {
				id: me.id_dato
			},
			success:function(result,request){
				result=Ext.JSON.decode((result.responseText));
				var correcto=result.success;
				if(correcto){
					for(var i=0;i<result.data.length;i++){
						var valor={
							id: result.data[i].id,
							NombreGrupo: result.data[i].NombreGrupo
						};
						for(var j=0;j<result.data[i].acciones.length;j++){
							if(i===0){
								columnas.push({
									xtype : 'checkcolumn',
									dataIndex: 'accion_'+result.data[i].acciones[j].IdAccion,
									text: result.data[i].acciones[j].NombreAccion,
									tooltip: result.data[i].acciones[j].NombreAccion+": "+result.data[i].acciones[j].DescripcionAccion,
									minWidth: 60,
									sortable: false,
									draggable: false,
									resizable: false
								});
								model.push('accion_'+result.data[i].acciones[j].IdAccion);
							}
							valor['accion_'+result.data[i].acciones[j].IdAccion]=result.data[i].acciones[j].cantidad==1;
						}
						datos.push(valor);
					}
				}
			}
		});
		me.items = [
			Ext.create('Extidi.clases.Grilla',{
				columnLines: true,
				tienePaginador: false,
				columns: columnas,
				store: Ext.create('Ext.data.JsonStore', {
					data: datos,
					fields: model
				})
			})

        ];
		me.callParent();
		//console.debug(me.down('grilla'))
		//me.down('grilla').columns.push(Ext.clone(me.down('grilla').columns[1]));
		//me.down('grilla').columns[me.down('grilla').columns.length-1].dataIndex='id';
		//console.debug(me.down('grilla').columns)
		//console.debug(me.down('grilla').getHeader())
		//me.fireEvent('Cargo', me);
    }
});