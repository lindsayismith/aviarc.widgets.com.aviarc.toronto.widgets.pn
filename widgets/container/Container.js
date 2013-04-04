(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;

    Toronto.widget.pn.Container = function () {
        this.onEnabledChanged = new Toronto.client.Event();

    };

    YAHOO.lang.extend(Toronto.widget.pn.Container, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            Toronto.widget.pn.Container.superclass.startup.apply(this, arguments);
           
            this._container = this.getNamedElement("div");
            
            this._enabled = parseBoolean(this.getAttribute('enabled'));
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
                    YahooDom.removeClass(this._container,"disabled");
                }
                else {
                    YahooDom.addClass(this._container,"disabled");
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
