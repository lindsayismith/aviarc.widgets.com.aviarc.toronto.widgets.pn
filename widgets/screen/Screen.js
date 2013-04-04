/*global
YAHOO
*/

(function () {
    
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    Toronto.widget.pn.Screen = function () {
        this.onResize = new Toronto.client.Event();
    };
    
    YAHOO.lang.extend(Toronto.widget.pn.Screen, Toronto.framework.DefaultWidgetImpl, {
    
        startup: function (widgetContext) {
            Toronto.widget.pn.Screen.superclass.startup.apply(this, arguments);

            // Disable screen timer
            if (!parseBoolean(this.getAttribute('timer'))) {
                widgetContext.getSystem().disableTimer();
            }

            window.onresize = this.onResize.makeDOMEventFunction();
        },
        
        getContentElement: function() {
            return this.getNamedElement("div");
        },

        isActive: function () {
            return true;
        },
        
        isVisible: function () {
            return true;
        }
    });
    
})();
