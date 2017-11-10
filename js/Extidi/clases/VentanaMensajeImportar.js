Ext.define('Extidi.clases.VentanaMensajeImportar', {
    extend: 'Extidi.clases.VentanaModal',
    require:['Extidi.clases.Constantes'],
    height: 484,
    width: 813,
    title: 'Mensaje',
    mensaje:'Display Field Display Field Display Field Display Field Display FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay FieldDisplay Field\n',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    height: 218,
                    width: 719,
                    frame: true,
                    layout: {
                        type: 'absolute'
                    },
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'image',
                            height: 93,
                            width: 93,
                            src: Extidi.Constantes.URL_ICONO_MENSAJE_IMPORTE,
                            x: 10,
                            y: 20
                        },
                        {
                            xtype: 'displayfield',
                            height: 200,
                            width: 590,
                            autoScroll:true,
                            value:this.mensaje ,
                            x: 140,
                            y: 10
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});