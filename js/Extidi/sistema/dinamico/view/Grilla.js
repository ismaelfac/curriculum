Ext.define('Extidi.sistema.dinamico.view.Grilla',{
    extend : "Extidi.clases.Grilla",
	alias: 'widget.GrillaDinamico',
	requires: [
		'Extidi.sistema.dinamico.constantes'
	],
    frame: false,
    autoScroll: false,
	modelo: '',
	parametros: {},
	con: '',
	columns: [],
	selType: 'checkboxmodel',
	initComponent: function(){
        var me=this;
		Extidi.Helper.construirHerencia(me);
		me.fireEvent('AntesCargar', me);
        me.callParent();
		me.fireEvent('Cargo', me);
    }
})