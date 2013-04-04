(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    Toronto.widget.pn.Image = function () {
        this.onClick = new Toronto.client.Event();

    };

    YAHOO.lang.extend(Toronto.widget.pn.Image, Toronto.framework.DefaultWidgetImpl, {

        startup: function (widgetContext) {
            Toronto.widget.pn.Image.superclass.startup.apply(this, arguments);
            this._container = this.getNamedElement("div");
            this._defaultUrl = this.getAttribute("default-url");
            this._baseUrl = this.getAttribute("base-url");
            this._imageUrl = this.getAttribute("url");
            this._id = this.getAttribute("name");
            
            this._action = this.getAttribute("action");
            this._actionType = this.getAttribute("action-type");            
            this._defaultOnNull = parseBoolean(this.getAttribute("default-on-null"));

            this._enabled = parseBoolean(this.getAttribute("enabled"));
            this._field = this.getAttribute("field");
        },
        bind: function(dataContext) {
            Toronto.widget.pn.Image.superclass.bind.apply(this, arguments);
            var self = this;
            if (this._field && (!this._imageUrl)) {
                var parts = this._field.split(".");
                if (parts.length == 2) {
                    this._datasetName = parts[0];
                    this._field = parts[1];
                    this._dataset = dataContext.findDataset(this._datasetName);                
                    
                    this._dataset_onCurrentRowFieldChanged = this._dataset.onCurrentRowFieldChanged.bindHandler(function(info) { 
                        if (info.fieldName == self._field) {
                            self.refresh(); 
                        }
                    });
                    this._dataset_onCurrentRowChanged = this._dataset.onCurrentRowChanged.bindHandler(function() { 
                        self.refresh(); 
                    });
                    this._dataset_onContentsReplaced = this._dataset.onContentsReplaced.bindHandler(function() { 
                        self.refresh(); 
                    });
                }
            }
            
            if(this._action){
                if (!this._actionType || this._actionType === "") {
                    this._actionType = "workflow";
                }         
                
               if (this._actionType.toLowerCase() === 'workflow'){
                    this._container.onclick = function(e){
                        if(self._enabled){
                            self.onClick.fireEvent({
                                widget: self.getWidgetContext().getWidgetNode(),
                                action: self._action
                            });
                            self._callWorkflow(self._action);
                        }
                    };
                 }
                else if (this._actionType.toLowerCase() === 'url'){
                    this._container.onclick = function(e){
                        if(self._enabled){
                            self.onClick.fireEvent({
                                widget: self.getWidgetContext().getWidgetNode(),
                                action: self._action
                            });
                            window.parent.location.href = self._action;
                        }
                    };
                }
            } else {
                this._container.onclick = function() {
                    if (self._enabled) {
                        self.onClick.fireEvent({
                            widget: self.getWidgetContext().getWidgetNode(),
                            action: self._action
                        });
                    }
                };
            }
        },
        _callWorkflow: function(workflow) {
            this.getWidgetContext().getSystem().submitScreen({
                action: workflow,
                formFields: {} 
            });
        },
        refresh: function() {
            if (this._dataset) {
                if (this._dataset.getCurrentRow() && this._dataset.getCurrentRowField(this._field)) {
                    var baseurl = (this._baseUrl ? this._baseUrl + (this._baseUrl.substr(-1) !== '/' ? '/': '') : "");
                    this.setUrl(baseurl + this._dataset.getCurrentRowField(this._field));
                } else {
                    if (this._defaultUrl && this._defaultOnNull) {
                        this.setUrl(this._defaultUrl);
                    }
                }
            }
        },
        
        getContainerElement : function() {
            return this.getNamedElement("img");
        },
        
        _click: function() {
             this.onClick.fireEvent()
        },
        
        setUrl: function(url) {
            var self = this;
            this._container.innerHTML = "";
            var img = document.createElement("img");
            this._container.appendChild(img);
            img.id = this._id;
            img.onload = function() {
                //this.width = parseInt(this.parentNode.style.width);
                
                //this.parentNode.style.width = this.width + "px";
                // this.parentNode.style.height = this.height + "px";
            };
            img.onerror = function() {
                this.src = self._defaultUrl;
            };
            img.src = url;
        },
        show: function(){
            this._container.style.display = "block";
        },
        hide: function(){
            this._container.style.display = "none";
        }
    });

})();