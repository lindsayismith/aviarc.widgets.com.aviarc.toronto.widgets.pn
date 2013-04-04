(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;

    Toronto.widget.pn.GroupBox = function () {
        this.onEnabledChanged = new Toronto.client.Event();

    };

    YAHOO.lang.extend(Toronto.widget.pn.GroupBox, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            Toronto.widget.pn.GroupBox.superclass.startup.apply(this, arguments);
           
            this._groupBox = this.getNamedElement("div"); 
            this._enabled = parseBoolean(this.getAttribute('enabled'));
            
            if(this.getAttribute('label')){
                this._groupBoxLabel = this._groupBox.firstChild;
            }
        },
        refresh: function() {
           if(!this._enabled){
               this._setChildrenEnabledState(this._enabled);
           }
        },
        setEnabled: function(enabled) {
            enabled = parseBoolean(enabled);
            var oldEnabled = this._enabled;
            if (enabled !== oldEnabled) {
                if (enabled) {
                    YahooDom.removeClass(this._groupBox,"disabled");
                    if(this._groupBoxLabel){
                        YahooDom.removeClass(this._groupBoxLabel,"disabled");
                    }
                }
                else {
                    YahooDom.addClass(this._groupBox,"disabled");
                    if(this._groupBoxLabel){
                        YahooDom.addClass(this._groupBoxLabel,"disabled");
                    }
                }
                this._setChildrenEnabledState(enabled);
                this._enabled = enabled;
                this.onEnabledChanged.fireEvent({
                    widget: this.getWidgetContext().getWidgetNode(),
                    enabled: enabled
                });
            }
        },
        _setChildrenEnabledState: function(enabled){
            var children = this._widgetContext.getWidgetNode().getChildWidgets();
            for (var i = 0; i < children.length; i++) {
               if(children[i].setEnabled){
                   children[i].setEnabled(enabled);
               }
            }
        
        },
        getEnabled: function () {
            return this._enabled;
        }
        
       
    });

})();
