Ext.define('Extidi.ux.FilterRow', {
    extend:'Ext.util.Observable',
 
    remoteFilter:true,
 
    init: function(grid) {
        this.grid = grid;
        this.applyTemplate();
        this.grid.filterRow = this;
    },
 
    applyTemplate: function() {
 
        if(this.grid.rendered == false) {
            Ext.Function.defer(this.applyTemplate, 50, this);
            return;
        }
 
        // Does it contain a locked grid
        if(this.grid.lockedGrid) {
            this.applyTemplateToColumns(this.grid.lockedGrid);
            this.applyTemplateToColumns(this.grid.normalGrid);
        }
        else {
            this.applyTemplateToColumns(this.grid);
        }
 
    },
 
    applyTemplateToColumns:function(grid) {
 
        // Add events
        if(!grid.gridFilterEvent) {
            // when Ext grid state restored (untested)
            grid.on("staterestore", this.resetFilterRow, this);
 
            // when column width programmatically changed
            grid.on("columnresize", this.resizeFilterField, this);
 
            grid.on("columnmove", this.resetFilterRow, this);
            grid.on("columnshow", this.resetFilterRow, this);
            grid.on("columnhide", this.resetFilterRow, this);   
 
            if(grid.horizontalScroller) {
                grid.horizontalScroller.on('bodyscroll', this.scrollFilterField, grid);
            }
 
            grid.gridFilterEvent = true;
        }
 
        var searchItems = [];
        this.eachColumn(grid.columns, function(col) {
 
            var filterDivId = this.getFilterDivId(col.id);
 
            if (!col.xfilterField) {
 
                if(col.nofilter || col.isCheckerHd != undefined) {
                    col.xfilter = { };
                } else if(!col.xfilter){
                    col.xfilter = { };
                    col.xfilter.xtype = 'textfield';
                }
 
                var width = col.getWidth();
 
                col.xfilter = Ext.apply({
                    id:filterDivId,
                    hidden:col.hidden,
                    xtype:'component',
                    baseCls: "xfilter-row",
                    width:width-2,
                    enableKeyEvents:true,
                    style:{
                        margin:'1px 1px 1px 1px'
                    },
                    hideLabel:true
                }, col.xfilter);
 
                col.xfilterField = Ext.ComponentManager.create(col.xfilter);
 
            } else {
                if(col.hidden != col.xfilterField.hidden) {
                    col.xfilterField.setVisible(!col.hidden);
                }
            }
 
            /*if(col.xfilterField.xtype == 'combo') {
               col.xfilterField.on("select", this.onSelect, this);
            } else if(col.xfilterField.xtype == 'datefield') {
                col.xfilterField.on("change", this.onChange, this);
            }
 */
            col.xfilterField.on("change", this.onKeyDown, this);
 
            searchItems.push(col.xfilterField);
        });
 
        if(searchItems.length > 0) {
            grid.addDocked(grid.dockedFilter = Ext.create('Ext.container.Container', {
                id:grid.id+'docked-filter',
                weight: 100,
                dock: 'top',
                border: false,
                baseCls: Ext.baseCSSPrefix + 'grid-header-ct',
                items:searchItems,
                layout:{
                    type: 'hbox'
                }
            }));
        }           
 
    },
 
    onSelect: function(field, value, option) {
        if(!this.onChangeTask) {
            this.onChangeTask = new Ext.util.DelayedTask(function(){
                this.storeSearch();
            }, this);
        }
 
        this.onChangeTask.delay(1000);
    },
 
    onChange: function(field, newValue, oldValue) {
 
        if(!this.onChangeTask) {
            this.onChangeTask = new Ext.util.DelayedTask(function(){
                this.storeSearch();
            }, this);
        }
 
        this.onChangeTask.delay(1000);
 
    },
 
    onKeyDown: function(field, e) {
        
            this.storeSearch();
        
    },
 
    getSearchValues: function() {
        var values = {};
 
        // Does it contain a locked grid
        if(this.grid.lockedGrid) {
            values = Ext.apply(this.getGridSearchValues(this.grid.lockedGrid), this.getGridSearchValues(this.grid.normalGrid));
        } else {
            values = this.getGridSearchValues(this.grid);
        }
        return values;
    },
 
    getGridSearchValues:function(grid) {
        var values = {};
        this.eachColumn(grid.columns, function(col) {
            if(col.xfilterField && col.xfilterField.xtype != 'component') {
            	if(typeof(col.xfilterField.valorMostrado)!='undefined' && col.xfilterField.valorMostrado){
            		values[col.dataIndex] = col.xfilterField.getRawValue();
            	}else{
                	values[col.dataIndex] = col.xfilterField.getValue();
            	}
            }
        });
        return values;
    },
 
    storeSearch: function() {
 
        if(this.remoteFilter) {
            if(!this.grid.store.proxy.extraParams) {
                this.grid.store.proxy.extraParams = {};
            }
            this.grid.store.proxy.extraParams.search = Ext.JSON.encode(this.getSearchValues());
            this.grid.store.currentPage = 1;
            this.grid.store.load();
        } else {
            var values = this.getSearchValues();
            this.grid.store.clearFilter();
            for(key in values) {
                if(values[key] != undefined && values[key] != "") {
                    this.grid.store.filter(key, values[key]);
                }
            }
        }
    },
 
    clearSearchValues:function() {
        // Does it contain a locked grid
        if(this.grid.lockedGrid) {
            this.clearGridSearchValues(this.grid.lockedGrid);
            this.clearGridSearchValues(this.grid.normalGrid);
        } else {
            this.clearGridSearchValues(this.grid);
        }
    },
 
    clearGridSearchValues:function(grid) {
        this.eachColumn(grid.columns, function(col) {
            if(col.xfilterField && col.xfilterField.xtype != 'component') {
                col.xfilterField.setValue('');
            }
        });
    },
 
    clearSearch:function() {
        this.clearSearchValues();
        this.storeSearch();
    },
 
    resetFilterRow: function () {
        if(this.grid.lockedGrid) {
            this.removeDockedFilter(this.grid.lockedGrid);
            this.removeDockedFilter(this.grid.normalGrid);
        } else {
            this.removeDockedFilter(this.grid);
        }
        this.applyTemplate();
    },
 
    removeDockedFilter:function(grid) {
        grid.removeDocked(grid.id+'docked-filter', true);
        delete grid.dockedFilter;
 
        //This is because of the reconfigure
        var dockedFilter = document.getElementById(grid.id+'docked-filter');
        if (dockedFilter) {
            dockedFilter.parentNode.removeChild(dockedFilter);
        }
    },
 
    resizeFilterField: function (headerCt, column, newColumnWidth) {
        var editor;
        if (!column.xfilterField) {
            //This is because of the reconfigure
            this.resetFilterRow();
            editor = this.grid.headerCt.items.findBy(function (item) { return item.dataIndex == column.dataIndex; }).xfilterField;
        } else {
            editor = column.xfilterField;
        }
        if(editor) {
            editor.setWidth(newColumnWidth - 2);
        }
    },
 
    scrollFilterField:function(e, target) {
        var width = this.headerCt.el.dom.firstChild.style.width;
        this.dockedFilter.el.dom.firstChild.style.width = width;
        this.dockedFilter.el.dom.scrollLeft = target.scrollLeft;
    },
 
    // Returns HTML ID of element containing filter div
    getFilterDivId: function(columnId) {
        return this.grid.id + '-filter-' + columnId;
    },
 
    // Iterates over each column that has filter
    eachFilterColumn: function(func) {
        Ext.each(this.grid.columns, function(col, i) {
            if (col.xfilterField) {
                func.call(this, col, i);
            }
        }, this);
    },
 
    // Iterates over each column in column config array
    eachColumn: function(columns, func) {
        Ext.each(columns, func, this);
    }
});

