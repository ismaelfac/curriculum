Ext.define("Extidi.clases.VentanaFlotante", {
    singleton : true,
    alternateClassName : 'Extidi.VentanaFlotante',
    msgCt: null,
    createBox: function(t, s){
       // return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
	   var css = 'min-height: 60px;'+
	   'border: 2px solid #ccc;'+
	   'margin-top: 2px;'+
	   'padding: 0px 10px ; '+
	   'font-size:12px; '+
	   '  color: #555; '+
	   'border-radius: 8px;'+
	   '  -moz-border-radius: 8px;'+
	   ' background: #F6F6F6';
		return '<div style="'+css+'"><h3>' + t + '</h3><p>' + s + '</p></div>';
	
    },
    msg : function(title, format, funcion, pos, posd, time){
        /*pos: posición del mensaje donde tc= topcenter, tr= topright, tl= topleft, bl=bottomleft, br=bottomright, bc= bottomcenter mc=middlecenter, ml= middleleft, mr= middleright
	width:ancho de la ventana del mensaje.
	*/
		pos=pos || 'tc';
		pos2=pos;
		time=time || 1300;
		var estilo={
		'position':'absolute',
		'width':'300px',
		'z-index':'99999', 
		'height':'120px'
		};
		var mitadx=0;
		var mitady=0;
		if(Ext.getDom('container_principal_extidi')!=null){
			mitadx=(Ext.getDom('container_principal_extidi').style.width.replace("px", "")/2)-150;
			mitady=(Ext.getDom('container_principal_extidi').style.height.replace("px", "")/2)-60;
		}else{
			mitadx=200;
			mitady=150;
		}
			if(pos=='tc'){
				pos2="t";
				estilo["bottom"]=null;
				estilo["right"]=null;
				estilo["top"]="10px";
				estilo["left"]=mitadx+"px";
			}if(pos=='tr'){
				estilo["bottom"]=null;
				estilo["left"]=null;
				estilo["right"]="10px";
				estilo["top"]="10px";
			}if(pos=='tl'){
				estilo["bottom"]=null;
				estilo["right"]=null;
				estilo["left"]="10px";
				estilo["top"]="10px";
			}if(pos=='bl'){
				estilo["top"]=null;
				estilo["right"]=null;
				estilo["left"]="10px";
				estilo["bottom"]="10px";
			}if(pos=='br'){
				estilo["top"]=null;
				estilo["left"]=null;
				estilo["right"]="10px";
				estilo["bottom"]="10px";
			}if(pos=='bc'){
				pos2="b";
				estilo["top"]=null;
				estilo["right"]=null;
				estilo["left"]=mitadx+"px";
				estilo["bottom"]="10px";
			}if(pos=='mc'){
				pos2="m";
				estilo["bottom"]=null;
				estilo["right"]=null;
				estilo["left"]=mitadx+"px";
				estilo["top"]=mitady+"px";
			}if(pos=='ml'){
				pos2="l";
				estilo["bottom"]=null;
				estilo["right"]=null;
				estilo["left"]="10px";
				estilo["top"]=mitady+"px";
			}if(pos=='mr'){
				pos2="r";
				estilo["bottom"]=null;
				estilo["left"]=null;
				estilo["right"]="10px";
				estilo["top"]=mitady+"px";
			}
		pos2=posd || pos2;
		if(this.msgCt==null){
			if(Ext.getDom('container_principal_extidi')!=null){
				this.msgCt = Ext.DomHelper.insertFirst(Ext.getDom('container_principal_extidi'), {
				   // id:'msg-div'
					style: estilo
				}, true);
            }else{
				this.msgCt = Ext.DomHelper.insertFirst(Ext.getBody(), {
				   // id:'msg-div'
					style: estilo
				}, true);
			}
        }else{
			this.msgCt.setStyle(estilo);
		}
		
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.DomHelper.append(this.msgCt, this.createBox(title, s), true);
        this.msgCt.hide();
        this.msgCt.fadeIn().ghost(pos2, {
            delay: time, 
            remove: true,
			callback: funcion || Ext.emptyFn
        });
		this.msgCt=null;
    },
    init : function(){
    }
});

/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*
Ext.ventana = function(){
    var msgCt;

    function createBox(t, s){
        // return ['<div class="msg">',
        //         '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
        //         '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
        //         '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
        //         '</div>'].join('');
        return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {
                    id:'msg-div'
                }, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", {
                delay: 1300, 
                remove: true
            });
        },

        init : function(){
        }
    };
}();




// old school cookie functions
var Cookies = {};
Cookies.set = function(name, value){
    var argv = arguments;
    var argc = arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : '/';
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape (value) +
    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == true) ? "; secure" : "");
};

Cookies.get = function(name){
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while(i < clen){
        j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return Cookies.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if(i == 0)
            break;
    }
    return null;
};

Cookies.clear = function(name) {
    if(Cookies.get(name)){
        document.cookie = name + "=" +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};

Cookies.getCookieVal = function(offset){
    var endstr = document.cookie.indexOf(";", offset);
    if(endstr == -1){
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
};
*/