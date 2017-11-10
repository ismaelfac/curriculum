/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Extidi.core.ShortcutModel
 * @extends Ext.data.Model
 * This model defines the minimal set of fields for desktop shortcuts.
 */
Ext.define('Extidi.core.ShortcutModel', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'name2', convert: function(v, record){
               return record.data.name.substr(0, 20)+(record.data.name.length>20?"...":"");
       }},
       { name: 'name' },
       { name: 'icon' },
       { name: 'module' },
       { name: 'url' },
       { name: 'data' },
       
       { name: 'modulo' },
       { name: 'div', convert: function(v, record){
               var div=record.data.modulo;
               while(div.indexOf(".")!=-1){
                   div=div.replace(".","_")
               }
               return div;
       }}
    ]
});
