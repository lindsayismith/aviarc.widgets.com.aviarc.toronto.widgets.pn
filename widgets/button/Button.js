(function () {   
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;

    Toronto.widget.pn.Button = function (widgetsToValidate, datasetsToValidate) {
        this.onClick = new Toronto.client.Event();
        this.onEnabledChanged = new Toronto.client.Event();
     
        this._widgetsToValidate = widgetsToValidate;
        this._datasetsToValidate = datasetsToValidate;
    };
    
    YAHOO.lang.extend(Toronto.widget.pn.Button, Toronto.framework.DefaultWidgetImpl, {
        startup: function (widgetContext) {
            Toronto.widget.pn.Button.superclass.startup.apply(this, arguments);
            this._widgetContext = widgetContext; 
            this._action = this.getAttribute('action');
            this._actionType = this.getAttribute('action-type');  
                         
            this._container = this.getNamedElement("div");
            this._id = this.getAttribute("name");
            
            this._button = document.getElementById(this._id);
            
            this._enabled = parseBoolean(this.getAttribute('enabled'));
         },
        bind:function(dataContext){
            Toronto.widget.pn.Button.superclass.bind.apply(this, arguments);
            var self = this;   
            this._dataContext = dataContext;

            if(!this._action){
                this._button.onclick = function(e){
                    if(self._enabled){
                        self._validate(function(){
                            self.onClick.fireEvent({
                                widget: self.getWidgetContext().getWidgetNode(),
                                action: self._action
                            });
                        });
                    }
                };
            }
            else {
                if (!this._actionType || this._actionType === "") {
                    this._actionType = "workflow";
                }         
                
                if (this._actionType.toLowerCase() === 'workflow'){
                    this._button.onclick = function(e){
                        if(self._enabled){
                            self._validate(function(){
                                self.onClick.fireEvent({
                                    widget: self.getWidgetContext().getWidgetNode(),
                                    action: self._action
                                });
                                self._callWorkflow(self._action);
                            });
                        }
                    };
                }
                else if (this._actionType.toLowerCase() === 'url'){
                    this._button.onclick = function(e){
                        if(self._enabled){
                            self.onClick.fireEvent({
                                widget: self.getWidgetContext().getWidgetNode(),
                                action: self._action
                            });
                            window.parent.location.href = this._action;
                        }
                    };
                }
            }
        },
        _callWorkflow: function(workflow) {
            this.getWidgetContext().getSystem().submitScreen({
                action: workflow,
                validate: false,
                serverValidate: false,
                forceServerValidate: false,
                formFields: {} 
            });
        },
        _validate: function(successCallback) {
            var validate = parseBoolean(this.getAttribute('validate'));
            var serverValidate = parseBoolean(this.getAttribute('server-validate') || validate);
            var noValidateActions = [
                "Restart",
                "Cancel",
                "Undo"
            ];
            
            if (validate && !noValidateActions.contains(this._action)){
                 var valid = false;
                 this.getWidgetContext().getSystem().validate({
                            serverValidate: serverValidate,
                            forceServerValidate: serverValidate,
                            widgetNames : this._widgetsToValidate,
                            datasetNames : this._datasetsToValidate,
                            callback : function(context) {
                                if (context.result.length == 0){
                                    valid = true;
                                    if(successCallback){
                                        successCallback();
                                    };
                                }
                            }
                });
                return valid;
            } else {
                if(successCallback){
                    successCallback();
                };
            }
            return true;
        },
        refresh:function(){
        },         
        setValue:function(value){
            this._button.innerHTML= value;
        },
        setEnabled: function(enabled) {
            enabled = parseBoolean(enabled);
            var oldEnabled = this._enabled;
            if (enabled !== oldEnabled) {
                if (enabled) {
                    this._container.removeAttribute("disabled");
                    YahooDom.removeClass(this._container, "disabled");
                    this._button.removeAttribute("disabled");
                    YahooDom.removeClass(this._button, "disabled");
                }
                else {
                    this._container.setAttribute("disabled", "disabled");
                    YahooDom.addClass(this._container, "disabled");
                    this._button.setAttribute("disabled", "disabled");
                    YahooDom.addClass(this._button, "disabled");
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
        },
        click: function() {
            this._button.click();
        }
    });
})();
