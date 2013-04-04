(function () {
 
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
   
    Toronto.widget.pn.TextDynamic = function () {
 
    };
 
    YAHOO.lang.extend(Toronto.widget.pn.TextDynamic, Toronto.framework.DefaultWidgetImpl, {
        getDisplayName: function () {
            return this.getAttribute('display-name') || this.getWidgetID();
        },
 
        startup: function (widgetContext) {
            Toronto.widget.pn.TextDynamic.superclass.startup.apply(this, arguments);
 
            // Split dataset/field if we are bound
            if (this.getAttribute("field")) {
                this._field = this.getAttribute("field").split(".");
                this._isBound = true;
            } else {
                this._isBound = false;
            }
        },
 
        bind: function (dataContext) {
            Toronto.widget.pn.TextDynamic.superclass.bind.apply(this, arguments);
 
            if (!this._isBound) {
                return;
            }
 
            this._ds = dataContext.findDataset(this._field[0]);
            this._dsChangeHandler = this._ds.onDataChanged.bindHandler(this.refresh, this);
            this._ds.onCurrentRowChanged.bindHandler(this.refresh, this);
            this._ds.onContentsReplaced.bindHandler(this.refresh, this);
        },
 
        refresh: function () {
            if (!this._isBound) {
                return;
            }
 
            var text;
            if (this._ds.getRowCount() > 0 && this._ds.getCurrentRow() !== null) {
                text = this._ds.getCurrentRowField(this._field[1]);
            }
            else {
                text = "";
            }
            var containerEl = this.getContainerElement();
            if (containerEl) {
                containerEl.innerHTML = escapeHTML(text);
            }
            
        }
    });
 
})();
