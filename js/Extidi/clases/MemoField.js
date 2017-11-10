Ext.define('Extidi.clases.MemoField',{
      extend:'Ext.form.field.Trigger',
      alias: 'widget.memofield',
      triggerConfig:{
        tag: "img",
        src:Extidi.Constantes.URL_ICONO_MODIFICAR,
        cls: "x-form-trigger "
    },  onTriggerClick:function(){
        if(!this.disabled){
            var field=this;
            var win=Ext.create('Ext.window.Window',{
                heigth:150,
                width:300,
                modal:true,
                items:[{
                    xtype:'textarea',
                    height:150,
                    width:290,
                    value:this.getValue()
                }],
                bbar:[{
                    icon:Extidi.Constantes.URL_ICONO_ACEPTAR,
                    handler:function(){
                        var value=win.items.getAt(0).getValue();
                        field.setValue(value);
                        win.close();
                    }
                }]
            });
             
            win.show(field.getEl());
            win.items.getAt(0).focus(true,50);
           
        }
    }
});

