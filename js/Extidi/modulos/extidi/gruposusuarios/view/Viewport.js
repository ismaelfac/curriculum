Ext.define('Extidi.modulos.extidi.gruposusuarios.view.Viewport',{
	extend: 'Extidi.sistema.escritorio.view.VentanaModuloEscritorio',
	maximized: true,
	title: 'Grupos Usuarios',
	//icon: Extidi.modulos.extidi.usuarios.constantes.ICONO16,
	requires: [
	],
    initComponent: function() {
		var me=this;
		Extidi.Helper.construirHerencia(me);
		me.items = [
			Ext.create('Extidi.sistema.dinamico.view.Crud',{
				modelo: 'extidi_gruposusuarios',
				posicionFormulario: 'derecha',
				detalles: [
					{
						permiso: 'Extidi.modulos.extidi.usuarios',
						modelo: 'extidi_usuarios',
						nombre: 'Usuarios',
						campo: 'IdGruposUsuario'
					}
				]
			})
        ];
		me.callParent();
    }
});