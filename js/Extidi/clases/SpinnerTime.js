Ext.define('Extidi.clases.SpinnerTime', {
    extend : 'Ext.form.field.Spinner',
	editable: false,
    initComponent : function() {
        var me = this;
        me.callParent(arguments);
    },
	intervalo: 30,
	minValue: '00:00:00',
	value: '00:00:00',
	maxValue: '24:00:00',
	onSpinUp: function() {
		var me = this;
		if (!me.readOnly) {
			var valor=Ext.Date.parse(me.getValue(), "H:i:s");
			if(me.getValue()=='24:00:00'){
				valor=Ext.Date.parse('23:59:59', "H:i:s");
			}
			var valorMax=Ext.Date.parse(me.maxValue, "H:i:s");
			if(me.maxValue=='24:00:00'){
				valorMax=Ext.Date.parse('23:59:59', "H:i:s");
			}
			if(valor.getTime()<valorMax.getTime()){
				var val = Ext.Date.format(Ext.Date.add(valor, Ext.Date.MINUTE, me.intervalo), "H:i:s");
				if(val=='00:00:00'){
					val='24:00:00';
				}
				me.setValue(val);
			}
		}
	},

	// override onSpinDown
	onSpinDown: function() {
		var me = this;
		var valor=Ext.Date.parse(me.getValue(), "H:i:s");
		if(me.getValue()=='24:00:00'){
			valor=Ext.Date.parse('23:59:59', "H:i:s");
		}
		var valorMin=Ext.Date.parse(me.minValue, "H:i:s");
		if(me.minValue=='24:00:00'){
			valorMin=Ext.Date.parse('23:59:59', "H:i:s");
		}
		if(valor.getTime()>valorMin.getTime()){
			var val = Ext.Date.format(Ext.Date.add(valor, Ext.Date.MINUTE, -me.intervalo), "H:i:s");
			if(val=='23:29:59'){
				val='23:30:00';
			}
			me.setValue(val);
		}
	}
});
