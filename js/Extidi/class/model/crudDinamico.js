Ext.define("Extidi.class.model.crudDinamico", {
    table: '',
    conditions: '',
    columnsUnique: [
        
    ],
    botonesAdicionales: [
        /*{
            text: 'Enviar',
            name: 'btnEnviar'
        }*/
    ],
    isFormShow: true,
    columns: [
    {
        name: '',
        type: '',
        length: null,
        values: {
        },
        notNull: false,
        text: {
            grid: '',
            form: ''
        },
        visible: {
            grid: true,
            form: true
        },
        editable: true,
        parameterValue: '',
        foreignKey: {
            table: '',
            column: '',
            conditions: {
            },
            view: [
            ],
            columnsShow: [
            ]
        },
        formatDate:'Y-m-d',
        formatTime:'H:i',
        fileupload: false,
        filter: true,
        specialproperties: {            
        },
        unique:false,
        dateNow: false,
        allowed_types:'',
        max_width:'',
        max_height:'',        
        fieldNameTime:'',
        isFather: false,
        isHtml: false
    }    
    ],
    detailsModels:[        
    ],
    initComponent: function() {
        var me = this;
        me.callParent(arguments)
    }
});
