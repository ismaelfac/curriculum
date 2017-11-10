Ext.define('Extidi.class.view.nucleoCrudDinamico', {
    extend : 'Extidi.clases.TabCrud',
    alias : 'widget.nucleocruddinamico',
	frame: false,
    auxmodelo:{},
    table:'',
    detailsModels:[],
	mostrarBotonesToolbarFormulario: {
		nuevo : true,
		eliminar : false,
		exportarExcel : false,
		exportarPdf : false,
		exportarCsv : false,
		imprimir : false,
		importar : false,
		activar : false,
		inactivar : false
	},
	mostrarBotonesToolbarGrilla:{
		guardar : false,
		borrar : false
	},
    initComponent : function() {

        var me=this;

        me._=me.$className;
        me.__=me.clase;
		
		
		
        ////TRAIGO EL modelo
        var modelo=me.modelo;
        me.auxmodelo=Ext.clone(modelo.columns);    
        me.table=modelo.table;
        me.mostrarId=typeof(modelo.mostrarId)!='undefined'?modelo.mostrarId:false;
        me.ocultarId=typeof(modelo.ocultarId)!='undefined'?modelo.ocultarId:false;
        me.ocultarEstado=typeof(modelo.ocultarEstado)!='undefined'?modelo.ocultarEstado:false;
        me.columnsUnique=modelo.columnsUnique;
        me.detailsModels=modelo.detailsModels;

    
        ////TRAIGO LAS COLUMNAS DE LA GRILLA DESDE EL modelo
        var fields=["id","estado"];      
        Ext.Array.forEach(modelo.columns, function(item, index){  
            fields.push(item.name)

            ///TRAIGO LOS CAMPOS FORANEOS CON SU SINTAXIS
            var camposMostrar='';
            if(typeof(item.foreignKey)!='undefined'){
            
                Ext.Array.forEach(item.foreignKey.view, function(item2, index2){
                    var campo=item.foreignKey.table+'_'+item.foreignKey.column+'_'+item2;                        
                    camposMostrar=camposMostrar+campo;                         
                })   

            } 
            if(typeof(item.parameterValue)!='undefined'){
				camposMostrar='extidi_valorparametro_'+item.name;
            }         

			if(typeof(item.foreignKeyMultiple)!='undefined'){
            
                Ext.Array.forEach(item.foreignKeyMultiple.view, function(item2, index2){
                    var campo=item.foreignKeyMultiple.table+'_'+item.foreignKeyMultiple.column+'_'+item2;                        
                    //camposMostrar=camposMostrar+campo;                         
					fields.push(campo) 
				//console.debug(campo)
                })   
            }else{
				fields.push(camposMostrar) 
			}
			//console.debug(fields)
            if(typeof(item.specialproperties)!='undefined'){

                if(typeof(item.specialproperties.regex)!='undefined'){
                    me.auxmodelo[index].specialproperties.regex='';                
                }else if(typeof(item.specialproperties.maskRe)!='undefined'){
                    me.auxmodelo[index].specialproperties.maskRe='';
                }                   
            }         
            
        })    

        var baseStore={
            autoLoad: !(me.esDetalle===true)
        } 
        
		if(typeof(me.modelo.jerarquia)!='undefined' && me.modelo.jerarquia){
			me.esGrillaArbol=true;
		}
		
		Ext.apply(baseStore, {
			url : Extidi.BASE_PATH+"index.php/cruddinamico/listar",
			extraParams: {
				table:modelo.table,
				clase: me.modelo.clase,
				data: Ext.JSON.encode(me.auxmodelo),
				condicion: Ext.JSON.encode(modelo.conditions),
				orden: Ext.JSON.encode(modelo.order),
				esArbol: me.esGrillaArbol
			},
			model : Ext.define("Extidi.class.view.model", {
				extend : "Ext.data.Model",
				fields : fields
			})
		});
        var store;
		if(typeof(me.modelo.jerarquia)!='undefined' && me.modelo.jerarquia){
			/*baseStore.proxy= {
				reader:{
					type: "json",
					root: "data",
					successProperty: "success",
					totalProperty: "total"
				}
			};*/
			store=Ext.create('Ext.data.TreeStore', {
				autoLoad: true,
				model : Ext.define("Extidi.class.view.model", {
					extend : "Ext.data.Model",
					fields : fields
				}),
				proxy: {
					type: 'ajax',
					//url: Extidi.Constantes.modulos.URL_CONTROLLER,
					api: {
						read: Extidi.BASE_PATH+"index.php/cruddinamico/listar"
					},
					actionMethods : {
						read : 'POST'
					},
					extraParams: {
						table:modelo.table,
						clase: me.modelo.clase,
						data: Ext.JSON.encode(me.auxmodelo),
						condicion: Ext.JSON.encode(modelo.conditions),
						esArbol: me.esGrillaArbol
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
				},

				folderSort: true,
				sorters: [{
					property: 'Orden',
					direction: 'ASC'
				}]
			});
		}else{
			store=Ext.create('Extidi.clases.Store', baseStore);
		}

        ///ASIGNO STORE A LA GRILLA
        this.storeGrillaPrincipal = store;

        ///COLUMNAS DE LA GRILLA
		this.columnasGrillaPrincipal = [];

		if(me.ocultarId===false){
			if(me.mostrarId===true){
				me.columnasGrillaPrincipal.push({
					header : 'Id',
					width : 80,
					sortable : false,
					draggable: false,
					dataIndex : 'id'
				})
			}else{
				me.columnasGrillaPrincipal.push({
					header : 'No.',
					xtype : 'rownumberer',
					xfilter : {
						disabled : true
					}
				});
			}
		}
		if(me.ocultarEstado===false){
			me.columnasGrillaPrincipal.push(Ext.create('Extidi.clases.ColumnEstado', {
				header : "Estado",
				width : 70,
				sortable : true,
				dataIndex : 'estado',
				xfilter : {
					xtype : 'combo',
					queryMode : 'local',
					store : Ext.create('Extidi.clases.BusquedaEstadoStore', {
						autoLoad : true
					}),
					editable : false,
					displayField : 'estado',
					forceSelection : false,
					valueField : 'valor'
				},
				value: 1
			}));
		}

        ///AGREGO EL ID AL FORMULARIO 
        var itemsFs=[{
            xtype : 'hiddenfield',
            name : 'id'
        }];

        ///RECORRO EL modelo
		
        Ext.Array.forEach(modelo.columns, function(item, index){  
            var type=''; 
            var typeCombo='';
            var typeNumber='';
            var fields=[];
            var storeParameter;
            var isDateTime=false;
			var isTextArea=false;
            baseStore={
                autoLoad: true  
            }

            if (item.name!="" && item.type!=""){    

                if(typeof(item.values)!='undefined'){
                    type='combo'; 
                    typeCombo='enum';   

                }else if (typeof(item.parameterValue)!='undefined'){
                    type='combo';
                    typeCombo='parameter';    

                }else if(typeof(item.foreignKey)!='undefined'){
                    type='combo'; 
                    typeCombo='foreign';   

                }else if(typeof(item.foreignKeyMultiple)!='undefined'){
                    type='combo'; 
                    typeCombo='foreignMulti';   

                }else if(typeof(item.fileupload)!='undefined' && item.fileupload==true){
                    type='filefield';   

                }else if(item.type=='varchar'){
                    type='textfield';  

                }else if(item.type=='text'){
                    type='textareafield';  
                    isTextArea=true; 

                }else if(item.type=='date'){
                    type='datefield';  

                }else if(item.type=='datetime'){
                    type='datefield';  
                    isDateTime=true;

                }else if(item.type=='int' || item.type=='bigint'){
                    type='numberfield';  
                    typeNumber='integer'; 

                }else if(item.type=='decimal'){
                    type='numberfield';  
                    typeNumber='double'; 

                }

                //GENERALIZAR GENERACION DE COMBOS Y FORMULARIOS

                var store;
                if(type=='combo'){

                    var claseStore='';                  
                    var foreign={};
                    var comboEnum={};

                    var extraParams={
                        extraParams: {                         
                    }
                    }

                    if (typeCombo=='enum'){

                        var data=[['','-']];
                        claseStore='Extidi.clases.Store';    
                        Ext.Object.each(item.values, function(key, value, myself){
                            if(Ext.isArray(item.values)){
                                data.push({
                                    'id':value,
                                    'texto':value
                                })
                            }else{
                                data.push({
                                    'id':key,
                                    'texto':value
                                })
                            }
                        })

                        comboEnum={
                            fields:["id","texto"],
                            data:data
                        };    

                        Ext.apply(baseStore,comboEnum)               
                        

                    }else if (typeCombo=='parameter'){

                        claseStore="Extidi.clases.StoreValorParametro";
                        extraParams.extraParams={
                            NombreCampo: item.parameterValue
                        }

                        Ext.apply(baseStore,extraParams)            

                    }else{

                        claseStore="Ext.data.ArrayStore";
                        var foreign={
                            fields : ['id','texto'],                                        
                            data : []
                        }                        

                        Ext.apply(baseStore,foreign)

                    }

                    store=Ext.create(claseStore, baseStore);                                
                }

                ///BASE DEL FORMULARIO
                var valorHidden=((typeof(item.visible)!='undefined')&&(typeof(item.visible.form)!='undefined')?!item.visible.form:false);
                var baseForm={
                    xtype : type,
                    name : item.name,
                    fieldLabel : item.text.form,
                    //maskRe: Extidi.Constantes.REGEX_NOMBRE,
                    hidden : valorHidden,
                    readOnly: (typeof(item.editable)!='undefined'?!item.editable:false),
                    allowBlank : (typeof(item.notNull)!='undefined'?(valorHidden?true:!item.notNull):true)
                }

                var baseUpload={
                    blankText : 'No ha selecionado un archivo',                  
                    regexText : 'Solo se aceptan archivos con determinadas extensiones',
                    width : 400,                    
                    buttonText : '...'
                }            

                ///BASE DEL FILTRO
                var baseFiltro={
                    xtype : 'textfield'                    
                };

                if (type=='filefield'){
                    Ext.apply(baseForm,
                    {
                        labelWidth: 120, 
                        flex : 1 
                    })  
                    Ext.apply(baseForm,baseUpload)                   
                }

                if(typeof(item.filter)!='undefined' && item.filter==false){                    
                    Ext.apply(baseFiltro, {
                        disabled:true
                    })
                }


                if(typeof(item.length)!='undefined'){
                    Ext.apply(baseForm, {
                        maxLength:item.length
                    })/*
                    Ext.apply(baseFiltro, {
                        maxLength:item.length
                    })*/
                }


                var baseNumberField={
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false
                }

                ///BASE DEL COMBO
                var baseCombo={
                    queryMode : 'local',
                    store : store,
                    editable : false,
                    displayField : (typeCombo=="parameter"?"ValorParametro":"texto"),
                    forceSelection : false,
                    valueField : "id"
                }

                var baseCombo2={
                    queryMode : 'local',
                    store : store,
                    editable : false,
                    displayField : (typeCombo=="parameter"?"ValorParametro":"texto"),
                    forceSelection : false,
                    valueField : "id"
                }

                if(type=='combo'){
    
                    ////                  
                    Ext.apply(baseForm, baseCombo)
					Ext.apply(baseFiltro, baseCombo2)
					baseFiltro.xtype='combo';
					baseFiltro.ventana=me;

                }else if(type=='datefield'){

                    Ext.apply(baseForm, {
                        format : item.formatDate,
						submitFormat: 'Y-m-d'
                    })
                    Ext.apply(baseFiltro, {
                        format : item.formatDate+(isDateTime?' H:i:s':''),
						submitFormat: 'Y-m-d'+(isDateTime?' H:i:s':'')
                    })
					baseFiltro.xtype='datefield'
                
                }else if(type=='numberfield'){

                    Ext.apply(baseForm, baseNumberField)
                    Ext.apply(baseFiltro, baseNumberField)

                    if(typeNumber=='integer'){

                        Ext.apply(baseForm, {
                            allowDecimals: false
                        })
                        Ext.apply(baseFiltro, {
                            allowDecimals: false
                        })

                    }else if(typeNumber=='double'){

                        Ext.apply(baseForm, {
                            decimalSeparator : '.'
                        })
                        Ext.apply(baseFiltro, {
                            decimalSeparator : '.'
                        })

                    }                  

                }else if(type=='textareafield'){ 
				/*
                    var condAdd={
                        //readOnly: true,
                        enableAlignments:false,
                        enableSourceEdit:false,
                        enableColors:false,
                        enableFont :false,
                        enableFontSize :false,
                        enableFormat :false,
                        enableLinks :false,
                        enableSourceEdit :false,
                        enableLists:false 
                    }
                */
					var condAdd={
						readOnly: true
					};
                    Ext.apply(baseForm, condAdd)
					baseForm.hidden=true;
                //Ext.apply(baseFiltro, condAdd)
                }

                //TRAIGO LOS CAMPOS FORANEOS CON SU SINTAXIS PARA CADA COMBO FORANEO
                var camposMostrar='';
                var camposMostrarMulti=[];
                var camposMostrarMultiHeader=[];
                if (typeCombo=='foreign'){

                    Ext.Array.forEach(item.foreignKey.view, function(item2, index2){
                        var campo=item.foreignKey.table+'_'+item.foreignKey.column+'_'+item2;                        
                        camposMostrar=camposMostrar+campo;                         
                    })               
            
                }
                if (typeCombo=='foreignMulti'){

                    Ext.Array.forEach(item.foreignKeyMultiple.view, function(item2, index2){
                        var campo=item.foreignKeyMultiple.table+'_'+item.foreignKeyMultiple.column+'_'+item2;                        
                        camposMostrarMulti.push(campo);
                        camposMostrarMultiHeader.push(typeof(item.foreignKeyMultiple.header[item2])!='undefined'?item.foreignKeyMultiple.header[item2]:campo);
                    })               
            
                }

                var columnsGrid={
                    header : item.text.grid,
                    width : 120,
                    sortable : false,
                    draggable: false,
                    dataIndex : item.name,
                    hidden : ((typeof(item.visible)!='undefined')&&(typeof(item.visible.grid)!='undefined')?!item.visible.grid:false)                                               
                };
                baseFiltro.disabled=columnsGrid.hidden;
				if(index==0 && typeof(me.modelo.jerarquia)!='undefined' && me.modelo.jerarquia) {
					columnsGrid.xtype='treecolumn';
				}
                var grid=columnsGrid;              

                if (typeCombo=='parameter'){
                    Ext.apply(grid, { 
                        renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						    return record.get('extidi_valorparametro_'+item.name);
                        }
                    })/*
                    store.load();
					//console.debug(store)
                    grid=Ext.create('Extidi.clases.ColumnValorParametro', columnsGrid);
                    Ext.apply(grid, {
                        store: store
                    })*/
                }else if (typeCombo=='enum'){
					var data=[['','-']];
					Ext.Object.each(item.values, function(key, value, myself){
						if(Ext.isArray(item.values)){
							data.push({
								'id':value,
								'texto':value
							})
						}else{
							data.push({
								'id':key,
								'texto':value
							})
						}
					})

					comboEnum={
						fields:["id","texto"],
						data:data
					};  
                    Ext.apply(grid, { 
                        renderer: function(value, metaData, record, rowIndex, colIndex, store, view){  

                            var valor="";
                            Ext.Object.each(item.values, function(key, value2, myself){

                                if (value==key){
                                    valor=value2;
                                }
                               
                            })

                            return valor;                     
                        }
                    });
					baseFiltro={
						xtype : 'combo',
						queryMode : 'local',
						store : Ext.create('Extidi.clases.Store',comboEnum),
						editable : false,
						displayField : 'texto',
						forceSelection : false,
						valueField : 'id'
					};
                }else if (typeCombo=='foreign'){
                    Ext.apply(grid, { 
                        renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                            return record.get(camposMostrar);                                
                        }
                    })
                }

                if(typeof(item.specialproperties)!='undefined'){
                    Ext.applyIf(baseForm, item.specialproperties)
					
                }
                Ext.apply(grid, {
                    xfilter : baseFiltro,
					sortable: true
                })   
                if(typeof(item.specialpropertiescolumn)!='undefined'){
					Ext.applyIf(grid, item.specialpropertiescolumn)
				}
                ////SE CONSTRUYE LA GRILLA
				if (typeCombo=='foreignMulti'){
					for(var imulti=0;imulti<camposMostrarMulti.length;imulti++){
//				console.debug(camposMostrarMulti[imulti])
						grid=columnsGrid;
						Ext.apply(grid, {
							xfilter: {
								xtype: 'textfield'
							},
							header : camposMostrarMultiHeader[imulti],
							dataIndex: camposMostrarMulti[imulti]
						})
						//console.debug(Ext.clone(grid))
						me.columnasGrillaPrincipal.push(Ext.clone(grid));
					}
                }else{
					me.columnasGrillaPrincipal.push(grid);
				}

                if (type=='filefield'){

                    var uploadTotal={
                        xtype: 'fieldcontainer',                  
                        layout: 'hbox',
                        listeners: {
                            disable: function(container, eOpts){
                                for(var i=0; i<container.items.items.length; i++){
                                    container.items.items[i].setDisabled(true)
                                }
                            }
                        },
                        items: [
							baseForm,
							{
								xtype: 'button',                               
								name : 'verArchivo',
								icon : Extidi.Constantes.URL_ICONO_EXAMINAR_IMPORTE,
								hidden: baseForm.hidden
								
							}                        
                        ]

                    } 
              
                    itemsFs.push(uploadTotal);


                }else if(typeof(item.specialproperties)!='undefined' && typeof(item.specialproperties.inputType)!='undefined'
                    && item.specialproperties.inputType=='password'){

                    itemsFs.push(baseForm); 

                    var confirmPassword=Ext.clone(baseForm); 

                    confirmPassword.name= 'Confirm'+item.name;                        
                    confirmPassword.fieldLabel='Confirmar'+item.name;

                    itemsFs.push(confirmPassword);    
                            
                }else if(isDateTime==true){
					var label=baseForm.fieldLabel;
                    baseForm.hiddenLabel= true;
					baseForm.fieldLabel= '';
                    var auxBaseForm=Ext.clone(baseForm);
					baseForm.flex=1;
					auxBaseForm.xtype= 'timefield';
					auxBaseForm.submitFormat="H:i:s";
					auxBaseForm.width=90;
                    auxBaseForm.name= item.name+'tf';
					auxBaseForm.hiddenLabel= true;
					auxBaseForm.fieldLabel= '';
                    auxBaseForm.format= typeof(item.formatTime)!='undefined'?item.formatTime:'H:i';
                    if(valorHidden!=true){
                        /*auxBaseForm.minValue= '06:00';
                        auxBaseForm.maxValue= '20:00'; */
                    }
                    //itemsFs.push(auxBaseForm);  
					itemsFs.push({
						xtype: 'fieldcontainer',
						layout: 'hbox',
						//labelWidth: 150,
						//fieldLabel: baseForm.fielLabel,
						items :[{
							xtype:'displayfield',
							value: label,
							width: 125
						},baseForm, auxBaseForm]
					});

                }else if(isTextArea==true){
					baseForm.listeners= {
						'change': function(item, newValue, oldValue){
							item.up('fieldcontainer').down('[name="html"]').update({
								html: newValue
							});
							item.up('fieldcontainer').down('[name="html"]').getEl().setStyle('border','1px solid black')
							
						}
					};
					var label=baseForm.fieldLabel;
                    itemsFs.push({
						xtype: 'fieldcontainer',
						layout: 'hbox',
						//labelWidth: 150,
						//fieldLabel: baseForm.fielLabel,
						items :[{
							xtype:'displayfield',
							value: label,
							width: 125
						},baseForm, {
							xtype: 'container',
							html: '',
							name: 'html',
							height: 60,
							disabled: true,
							flex: 1,
							style: {
								border: '1px solid black'
							}
						}]
					}); 
				}else{
                    itemsFs.push(baseForm);    
                } 
               
            }
                
        })  

        ////AGREGAR ESTADO AL FINAL DE LA GRILLA
        

        //AGREGAR ESTADO AL FINAL DEL FORMULARIO
        itemsFs.push({
            xtype : 'combobox',
            name : 'estado',
            allowBlank : false,
            store : Ext.create('Extidi.clases.EstadoStore'),
            fieldLabel : 'Estado',
            valueField : 'valor',
            displayField : 'estado',
            editable : false
        });

        ////CREO EL FORMULARIO
        var fs = Ext.create('Ext.form.FieldSet', {
            autoScroll: true,
            padding : 5,
            border: false,
            defaults: {
                anchor: '-20',
                labelWidth: 120,
                msgTarget: 'side'
            },

            items : itemsFs
        }); 

   
        this.crearFieldSetFormulario(fs); 
        this.callParent(arguments);
        if(typeof(me.modelo.botonesAdicionales)!='undefined'){
            for(var i=0;i<me.modelo.botonesAdicionales.length; i++){
                this.agregarBotonGrillaPrincipal(me.modelo.botonesAdicionales[i], me.modelo.botonesAdicionales[i].name)
            }
        }
    }
});
