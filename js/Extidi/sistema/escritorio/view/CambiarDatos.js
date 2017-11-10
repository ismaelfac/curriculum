Ext.define('Extidi.sistema.escritorio.view.CambiarDatos', {
    extend: 'Extidi.clases.VentanaModal',
	title: 'Cambiar Datos',
	layout: 'fit',
	datos: {},
    initComponent: function() {
		var me=this;
		me.items= [
			Ext.create('Extidi.clases.Formulario', {
				layout: 'anchor',
				name: 'cambiar_datos',
				buttons: [
					{
						text: 'Guardar',
						name: 'btnGuardar'
					}
				],
				items: [
					{
						xtype: 'textfield',
						name: 'PrimerNombre',
						disabled: true,
						anchor: '-10',
						fieldLabel: 'Nombre',
						value: me.datos["PrimerNombre"]
					},
					{
						xtype: 'textfield',
						name: 'PrimerApellido',
						disabled: true,
						anchor: '-10',
						fieldLabel: 'Apellido',
						value: me.datos["PrimerApellido"]
					},
					{
						xtype: 'textfield',
						name: 'Usuario',
						disabled: true,
						anchor: '-10',
						fieldLabel: 'Usuario',
						value: me.datos["Usuario"]
					},
					{
						xtype: 'textfield',
						name: 'Email',
						disabled: false,
						anchor: '-10',
						fieldLabel: 'Correo',
						value: me.datos["Email"]
					},
					Ext.create('Extidi.sistema.dinamico.view.ComboForaneo', {
						tabla: 'extidi_gruposusuarios',
						columnas: Ext.JSON.encode(['NombreGrupo']),
						name: 'IdGruposUsuario',
						disabled: true,
						anchor: '-10',
						fieldLabel: 'Grupo',
						value: me.datos["IdGruposUsuario"]
					}),					
					{
						xtype: 'textfield',
						name: 'Password',
						anchor: '-10',
						fieldLabel: 'Contrase&ntilde;a',
						inputType: 'password',
						minLength: 8,
						hidden: me.datos["Password"]==""
					},
					{
						xtype: 'textfield',
						name: 'Password2',
						anchor: '-10',
						fieldLabel: 'Confirmar Contrase&ntilde;a',
						inputType: 'password',
						minLength: 8,
						hidden: me.datos["Password"]==""
					}
				]
			})
		];
        me.callParent();
    }
});
