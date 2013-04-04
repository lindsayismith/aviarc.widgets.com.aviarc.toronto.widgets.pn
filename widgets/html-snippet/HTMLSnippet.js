(function () {
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    
    Toronto.widget.pn.HTMLSnippet = function () {};

    YAHOO.lang.extend(Toronto.widget.pn.HTMLSnippet, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            Toronto.widget.pn.HTMLSnippet.superclass.startup.apply(this, arguments);
            this.container = this.getNamedElement("div");
            this.container.innerHTML = "<span>" + this.getAttribute("text") + "</span>";
        }

        
    });
    
})();
