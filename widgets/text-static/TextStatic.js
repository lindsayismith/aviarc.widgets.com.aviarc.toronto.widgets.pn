(function () {   
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;

    Toronto.widget.pn.TextStatic = function () {
        this.onEnabledChanged = new Toronto.client.Event();
        this.onTextChanged = new Toronto.client.Event();
        this.onClick = new Toronto.client.Event();
    };
    
    YAHOO.lang.extend(Toronto.widget.pn.TextStatic, Toronto.framework.DefaultWidgetImpl, {
        startup: function (widgetContext) {
            Toronto.widget.pn.TextStatic.superclass.startup.apply(this, arguments);
            this._container = this.getNamedElement("div");
            this._id = this.getAttribute('name');
            this._type = this.getAttribute('type').toLowerCase();
            this._link = this.getAttribute('link');
            this._target = this.getAttribute('link-target');
            this._image = this.getAttribute('image');
            this._action = this.getAttribute('action');
            this._enabled = parseBoolean(this.getAttribute('enabled'));
        },
        bind:function(){
            var self = this;
            if(this._action){
                this._container.onclick = function() {
                    if (self._enabled) {
                        self.onClick.fireEvent();
                        self.getWidgetContext().getSystem().submitScreen({
                            action: self._action
                        });            
                    }
                };
            }
        },
        refresh:function(){
            if (this._type == "hyperlink") {
                this._buildLink();
            }
        },
        _buildLink:function(){
            var txt = this._container.innerHTML;
            if (this._image) {
                txt = "<img src='" + this._image + "'/>";
            }
            this._container.innerHTML = "<a>" + txt + "</a>";
            this._anchor = this._container.getElementsByTagName("a")[0];
            this._anchor.href = (this._link ? this._link : (txt.split(".")[0] == "www" ? "http://" : "") + txt);
            this._anchor.target = (this._target.substring(0,1) === "_" ? this._target : "_" + this._target);
            
            var self = this;
            if(this._anchor){
                this._anchor.onclick = function(e){
                    if(!self._enabled){
                        return false;
                    }
                };
            }
        },
        setText: function(text) {
            text = escapeHTML(text);
            var oldText = this._container.innerHTML;
            if (text !== oldText) {
                this._container.innerHTML = text;
                this.onTextChanged.fireEvent({
                    newText: text,
                    oldText: oldText
                });
            }
        },
        getText: function() {
            return this._container.innerHTML;
        },
        
        setLink: function(href) {
            if(this._anchor){
                this._anchor.href = href;
            }
        },
        setEnabled: function(enabled) {
            enabled = parseBoolean(enabled);
            var oldEnabled = this._enabled;
            if (enabled !== oldEnabled) {
                if (enabled) {
                    YahooDom.removeClass(this._container, "disabled");
                }
                else {
                    YahooDom.addClass(this._container, "disabled");
                }
                
                this._enabled = enabled;
                this.onEnabledChanged.fireEvent({
                    widget: this.getWidgetContext().getWidgetNode(),
                    enabled: enabled
                });
            }
        },
        getEnabled: function () {
            return this._enabled;
        }    
    });
    YAHOO.lang.augmentProto(Toronto.widget.pn.TextStatic, Toronto.util.CssUtils);
})();
