// Modificado 16/07/2012 Por: Yohany Cantillo Tag: YC
Ext.define("Extidi.clases.Helper", {
    singleton : true,
	applicationPrincipal: null,
    alternateClassName : 'Extidi.Helper',

    habilitar : function(formulario) {
        // YC
        try{
            var vector = formulario.getForm().getFields();
            for (var i = 0; i < vector.length; i++) {
                vector.getAt(i).setDisabled(false);
            }
        }catch(e){
            console.debug("error habilitar")
        }
    // YC
    },

    deshabilitar : function(formulario) {
        // YC
        try{
            var vector = formulario.getForm().getFields();
            for (var i = 0; i < vector.length; i++) {
                vector.getAt(i).setDisabled(true);
            }
            formulario.getForm().reset();
        }catch(e){
            console.debug("error habilitar")
        }
    // YC
    },

    deshabilitarBotones : function(barra, posicionBotones) {

        for (var i = 0; i < posicionBotones.length; i++) {
            barra.items.getAt(posicionBotones[i]).setDisabled(true);
        }
    },

    habilitarBotones : function(barra, posicionBotones) {
        for (var i = 0; i < posicionBotones.length; i++) {
            barra.items.getAt(posicionBotones[i]).setDisabled(false);
        }

    },
    trimAll : function(cadena) {
        if (cadena != "") {
            var sinesp = cadena;
            var re = /\s/g;
            if (cadena.search(re) != -1) {
                sinesp = cadena.replace(re, "");
            }
            return sinesp;
        }
    },
    toArray : function(record, columnas) {
        var vector;

        //alert(record.get(columnas[1].dataIndex));
        for (var i = 0; i < columnas.length; i++) {
            vector[columnas[i].dataIndex] = record.get(columnas[i].dataIndex);
        }
        return vector;
    },
    /**
     * Obtiene los valores del campo en la grilla de las filas que estan
     * seleccionadas en formato array.
     *
     * Grilla con valores:
     * | id | valor |
     * |  1 |  pepe |
     * |  2 | pablo |
     *
     * campo:id =>["1", "2"]
     * campo:valor =>["pepe", "pablo"]
     *
     * @param {String} campo
     * @return {Array}
     */
    idRegistrosSeleccionados : function(grilla, campo) {
        var registros = [];
        var s = grilla.getSelectionModel().getSelection();
        for (var i = 0, r; r = s[i]; i++) {
            if (r.get(campo) != '')
                registros.push(r.get(campo));
        }
        return registros;
    },
    /**
     * Convierte una cadena o valor numerico a formato de moneda, por ejemplo:
     *
     * "123029292"=> "$ 123.029.292"
     *
     * @param {String/Integer} value
     * @return {String}
     */
    monedaRender: function(value){
        //console.debug(value)
        var retorno="";
        var numeros=(value+"").split("");
        var con=0;
        for(var i=numeros.length-1;i>=0; i--){
            con++;
            var punto="";
            //console.debug(numeros[i])
            if(con==3){
                con=0;
                punto=".";
            }
            if(i==0){
                punto="";
            }
            retorno=punto+numeros[i]+retorno;
        }
        return "$ "+retorno;
    },
    /**
     * Obtiene el valor del componente con name = campo dentro del formulario suministrado.
     *
     * @param {FormPanel} form
     * @param {String} campo
     * @return {String}
     */
    obtenerValorFormulario: function(form, campo){
        var retorno="";
        try{
            var valores=form.getForm().getValues();
            Ext.Object.each(valores, function(key, value, myself){
                if(key==campo){
                    retorno=value;
                }
            })
        }catch(e){
            retorno="";
        }
        return retorno;
    },
    /**
     * Obtiene el componente con name = campo dentro del formulario suministrado.
     *
     * @param {FormPanel} form
     * @param {String} campo
     * @return {Field}
     */
    obtenerCampoFormulario: function(form, campo){
        try{
            return form.down('[name="'+campo+'"]');
        }catch(e){
            return null;
        }
    },
    /**
     * Crea el menu de un tab arbol
     * @param {Ext.data.NodeInterface} node
     * @param {Array} menu. array del modelo de un modulo
     *
     */
    creacionMenuTabArbol: function(node, menu){
        //console.debug(menu)
        if(Ext.isArray(menu)){
            Ext.Array.forEach(menu, function(item){
                //console.debug(item)
                var nodeNuevo=node.appendChild(
                    {
                        text: item.NombreModulo,
                        leaf: item.TipoModulo!='CarpetaArbol',
                        expanded: item.TipoModulo=='CarpetaArbol',
                        data: item,
                        href: item.Controlador
                    }
                );
                if(item.TipoModulo=='CarpetaArbol'){
                    Extidi.Helper.creacionMenuTabArbol(nodeNuevo, item.menu);
                }

            })
        }
    },
    /**
     * Crea el menu de un tab arbol
     * @param {Ext.data.NodeInterface} node
     * @param {Array} menu. array del modelo de un modulo
     *
     */
    creacionMenu: function(node, menu){
        //console.debug(menu)
        if(Ext.isArray(menu)){

            Ext.each(menu, function (module) {
                var urlImagen='';
                if(module.Controlador!=null){
                    urlImagen=module.Controlador;
                    while(urlImagen.indexOf(".")>-1){
                        urlImagen=urlImagen.replace(".","/");
                    }
                    urlImagen=Extidi.BASE_PATH+"js/"+urlImagen+"/images/icon/";
                }
                var men={
                    data: module,
                    nombre: 'modulo',
                    text: module.NombreModulo,
                    icon: (urlImagen==''?Extidi.BASE_PATH+"themes/default/images/folder.png":urlImagen+"16.png"),
                    url: module.Controlador,
                    menu: {
                        items:[]
                    }
                };
                if(typeof(module.menu)!='undefined' && module.TipoModulo=='CarpetaMenu'){
                    Extidi.Helper.creacionMenu(men.menu.items, module.menu);
                }else{
                    delete men.menu;
                }
                if(module.TipoModulo!='Widget'){
                    node.push(men);
                }
            });
        }
    },
    ocultarBotones : function(barra, posicionBotones) {

        for (var i = 0; i < posicionBotones.length; i++) {
            barra.items.getAt(posicionBotones[i]).setVisible(false);
        }
    },

    desocultarBotones : function(barra, posicionBotones) {
        for (var i = 0; i < posicionBotones.length; i++) {
            barra.items.getAt(posicionBotones[i]).setVisible(true);
        }

    },

	descargarArchivo: function(url, parametros){
		Ext.create('Ext.form.Panel', {
			standardSubmit: true
		}).getForm().submit({
			url : url,
			target : "_blank",
			params: parametros
		});
	},

	cambiarRuta: function(clase){
		var retorno="";
		var partes=clase.split(".");
		for(var j=0; j<partes.length; j++){
			retorno+="/"+partes[j];
		}
		return retorno;
	},

	iniciarApp: function(ruta){
		var me=this;
		Ext.Loader.require([
			ruta+'.constantes'
		], function(){
			var directorio=me.cambiarRuta(ruta);
			var app=Ext.create(ruta+'.app');
			app.name=ruta;
			app.appFolder=Extidi.BASE_PATH +'js'+directorio;
			app.paths={
				ruta: Extidi.BASE_PATH +'js'+directorio
			};
			//console.debug(me.applicationPrincipal)
			if(me.applicationPrincipal!=null){
				var APPINSTANCE = me.applicationPrincipal;
				for(var i=0; i<app.controllers.length; i++){
					var control=app.controllers[i];
					var controller = APPINSTANCE.controllers.get(control);
					if (!controller) {
						controller = Ext.create(control, {
							application:APPINSTANCE,
							id:control
						});
						APPINSTANCE.controllers.add(controller);
						controller.init();
					}
				}
				app.controllers=[];
				/*console.debug(controller)
				console.debug(controller.application)*/
			}
			Ext.application(Ext.apply(app, {
				launch: function() {
					if(me.applicationPrincipal==null){
						me.applicationPrincipal=eval(app.name+".getApplication()");
					}
				}
			}));
		});
	},

	iniciarAppWidget: function(ruta, componente){
		var me=this;
		Ext.Loader.require([
			ruta+'.constantes'
		], function(){
			var directorio=me.cambiarRuta(ruta);
			var app=Ext.create(ruta+'.app');
			app.name=ruta;
			app.appFolder=Extidi.BASE_PATH +'js'+directorio;
			app.paths={
				ruta: Extidi.BASE_PATH +'js'+directorio
			};

			if(me.applicationPrincipal!=null){
				var APPINSTANCE = me.applicationPrincipal;
				for(var i=0; i<app.controllers.length; i++){
					var control=app.controllers[i];
					var controller = APPINSTANCE.controllers.get(control);
					if (!controller) {
						controller = Ext.create(control, {
							application:APPINSTANCE,
							id:control
						});
						APPINSTANCE.controllers.add(controller);
						controller.init();
					}
				}
				app.controllers=[];
				/*console.debug(controller)
				console.debug(controller.application)*/
			}
			Ext.application(Ext.apply(app, {
				launch: function() {
					componente.add(Ext.create(ruta+'.view.Viewport'))
					if(me.applicationPrincipal==null){
						me.applicationPrincipal=eval(app.name+".getApplication()");
					}
					/*
					console.debug(me)
					console.debug(me.applicationPrincipal)
					console.debug(eval(app.name+".getApplication()"))*/
				}
			}));
		});
	},

	construirHerencia: function(me){
		var tem=me;
		var variable="_";
		while(typeof(tem)!='undefined'){
			eval("me."+variable+"=\""+tem.$className+"\"");
			variable+="_";
			tem=tem.superclass;
		}
	},
	encode64: function(decStr){
        if (typeof btoa === 'function') {
             return btoa(decStr);
        }
        var base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var bits;
        var dual;
        var i = 0;
        var encOut = "";
        while(decStr.length >= i + 3){
            bits = (decStr.charCodeAt(i++) & 0xff) <<16 | (decStr.charCodeAt(i++) & 0xff) <<8 | decStr.charCodeAt(i++) & 0xff;
            encOut += base64s.charAt((bits & 0x00fc0000) >>18) + base64s.charAt((bits & 0x0003f000) >>12) + base64s.charAt((bits & 0x00000fc0) >> 6) + base64s.charAt((bits & 0x0000003f));
        }
        if(decStr.length -i > 0 && decStr.length -i < 3){
            dual = Boolean(decStr.length -i -1);
            bits = ((decStr.charCodeAt(i++) & 0xff) <<16) |    (dual ? (decStr.charCodeAt(i) & 0xff) <<8 : 0);
            encOut += base64s.charAt((bits & 0x00fc0000) >>18) + base64s.charAt((bits & 0x0003f000) >>12) + (dual ? base64s.charAt((bits & 0x00000fc0) >>6) : '=') + '=';
        }
        return(encOut);
    },

	decode64: function(encStr){
        if (typeof atob === 'function') {
            return atob(encStr);
        }
        var base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var bits;
        var decOut = "";
        var i = 0;
        for(; i<encStr.length; i += 4){
            bits = (base64s.indexOf(encStr.charAt(i)) & 0xff) <<18 | (base64s.indexOf(encStr.charAt(i +1)) & 0xff) <<12 | (base64s.indexOf(encStr.charAt(i +2)) & 0xff) << 6 | base64s.indexOf(encStr.charAt(i +3)) & 0xff;
            decOut += String.fromCharCode((bits & 0xff0000) >>16, (bits & 0xff00) >>8, bits & 0xff);
        }
        if(encStr.charCodeAt(i -2) == 61){
            return(decOut.substring(0, decOut.length -2));
        }
        else if(encStr.charCodeAt(i -1) == 61){
            return(decOut.substring(0, decOut.length -1));
        }
        else {
            return(decOut);
        }
    },

    obtenerCrud: function (elemento, modelo) {
        return elemento.up("CrudDinamico[modelo='" + modelo + "']");
    },

    obtenerGrilla: function (elemento, modeloCrud, modeloGrilla) {
        var crud = this.obtenerCrud(elemento, modeloCrud);
        var modelo = modeloCrud;
        if (typeof modeloGrilla !== 'undefined') {
            modelo = modeloGrilla;
        }
        return crud.down("GrillaDinamico[modelo='" + modelo + "']");
    }

});
