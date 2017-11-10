Ext.define('Extidi.sistema.dinamico.view.Crud',{
    extend : "Ext.panel.Panel",
	alias: 'widget.CrudDinamico',
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	//autoCargarGrilla: true,
    frame: false,
    autoScroll: false,
	modelo: '',
	columns: [],
	condicion:'',
	posicionAcciones: 'arriba', //(arriba | derecha | izquierda)
	posicionFormulario: 'modal', //(modal | derecha | izquierda)
	anchoFormulario: 480,
	posicionDetalles: 'abajo', 	//posicion ("abajo", "derecha", "izquierda", "modal")
	detalles: [
		/*{
			permiso: '', 		//url de extjs para permiso
			modelo: '', 		//modelo del detalle
			nombre: '',			//nombre del detalle
			autoCargarGrilla: true
		}*/
	],
	atributosAdicionalesGrilla:{
	},
	atributosAdicionalesFormulario:{
	},
    initComponent: function(){
        var me=this;
		Extidi.Helper.construirHerencia(me);
		//console.debug(typeof(me.permiso)=='undefined')
		var auto=typeof(me.permiso)=='undefined';
		if(me.autoCargarGrilla===false){
			auto=false;
		}else if(me.autoCargarGrilla===true){
			auto=true;
		}
		me.grilla=Ext.create('Extidi.sistema.dinamico.view.Grilla', Ext.applyIf({
			modelo: me.modelo,
			con: me.condicion,
			flex: 1,
			AutoCargar: auto
		}, me.atributosAdicionalesGrilla));
		me.grilla.getStore().removeAll();
		me.formulario = Ext.create('Extidi.sistema.dinamico.view.Formulario', Ext.applyIf({
				border: true,
				modelo: me.modelo,
				grilla: me.grilla,
				width: me.anchoFormulario
			}, me.atributosAdicionalesFormulario
		));
		var items=[me.grilla];
		if(me.posicionFormulario=="modal"){
			me.formulario.border=false;
			//console.debug(me.up())
			me.formulario=Ext.create('Extidi.clases.VentanaModal', {
				title: 'Edici&oacute;n de '+me.title,
				tipo: 'modal',
				draggable: true,
				closeAction: 'hide',
				grilla: me.grilla,
				autoShow: false,
				modal: false,
				width: me.anchoFormulario,
				items: [
					me.formulario
				],
				renderTo: me.getEl()
			});
		}
		items=[
			{
				xtype: 'panel',
				name: 'cabecera',
				flex: 1,
				layout: {
					type: 'hbox',
					align: 'stretch'
				}
			}
		];
		if(me.posicionFormulario=="derecha"){
			items[0].items=[me.grilla, {xtype: 'displayfield', width: 5} ,me.formulario];
		}
		if(me.posicionFormulario=="izquierda"){
			items[0].items=[me.formulario, {xtype: 'displayfield', width: 5} ,me.grilla];
		}
		if(me.posicionFormulario=="modal"){
			items[0].items=[me.grilla];
		}
		
		me.acciones=Ext.create('Ext.toolbar.Toolbar', {
			name: 'acciones',
			layout: {
				type: 'hbox',
				align: 'stretch',
				overflowHandler: 'Scroller' 
			},
			items: [
				{
					text: 'Crear',
					name: 'btnCrear',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnNuevo.png",
					hidden: true
				},{
					text: 'Modificar',
					name: 'btnModificar',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnModificar.png",
					hidden: true
				},
				{
					text: 'Eliminar',
					name: 'btnEliminar',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnEliminar.png",
					hidden: true
				},
				{
					text: 'Activar',
					name: 'btnActivar',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnActivar.png",
					hidden: true
				},
				{
					text: 'Inactivar',
					name: 'btnInactivar',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnInactivar.png",
					hidden: true
				},
				{
					text: 'Exportar Excel',
					name: 'btnExportarExcel',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnExportarExcel.png",
					hidden: true
				},
				{
					text: 'Exportar Pdf',
					name: 'btnExportarPdf',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnExportarPdf.png",
					hidden: true
				},
				{
					text: 'Exportar Csv',
					name: 'btnExportarCsv',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnExportarCsv.png",
					hidden: true
				},
				{
					text: 'Imprimir',
					name: 'btnImprimir',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnImprimir.png",
					hidden: true
				},
				{
					text: 'Importar',
					name: 'btnImportar',
					icon: Extidi.BASE_PATH+"js/Extidi/sistema/dinamico/images/btnImportar.png",
					hidden: true
				}
			]
		});
			
		if(me.posicionAcciones=="arriba"){
			me.grilla.addDocked(me.acciones, "top");
		}/*
		if(me.posicionAcciones=="abajo"){
			me.grilla.bbar=me.acciones;
		}*/
		if(me.posicionAcciones=="derecha"){
			me.grilla.addDocked(me.acciones, "right");
			me.acciones.layout={
				type: 'vbox',
				align: 'stretch'
			};
			me.acciones.overflowY='auto';
		}
		if(me.posicionAcciones=="izquierda"){
			me.grilla.addDocked(me.acciones, "left");
			me.acciones.layout={
				type: 'vbox',
				align: 'stretch'
			};
			me.acciones.overflowY='auto';
		}
		
		
		
		if(me.detalles.length>0){ 
			var detall={
				xtype: 'tabpanel',
				plain: true,
				name: 'detalle',
				flex: 1,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [
				]
			};
			for(var i=0; i<me.detalles.length; i++){
				var detal=Ext.create('Extidi.sistema.dinamico.view.Crud',Ext.apply({
					permiso: me.detalles[i].permiso,
					title: me.detalles[i].nombre,
					superior: me
				}, me.detalles[i]));
				detall.items.push(detal);
			}
			if(me.posicionDetalles=="abajo"){
				items.push({xtype: 'displayfield', width: 5});
				items.push(detall);
			}
			if(me.posicionDetalles=="derecha"){
				/*me.acciones.layout={
					type: 'vbox',
					align: 'stretch',
					overflowHandler: 'Scroller' 
				};*/
				me.layout= {
					type: 'hbox',
					align: 'stretch'
				};
				items.push({xtype: 'displayfield', width: 5});
				items.push(detall);
			}
			if(me.posicionDetalles=="izquierda"){
				/*me.acciones.layout={
					type: 'vbox',
					align: 'stretch',
					overflowHandler: 'Scroller' 
				};*/
				me.layout= {
					type: 'hbox',
					align: 'stretch'
				};
				items=[detall,{xtype: 'displayfield', width: 5} ,items[0]];
			}
		}
		
		me.items=items;
		
        me.callParent();
		me.fireEvent('Cargo', me);
    }
})