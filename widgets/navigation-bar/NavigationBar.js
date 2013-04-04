(function () {   
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;

    Toronto.widget.pn.NavigationBar = function (widgetsToValidate, datasetsToValidate) {
        this.onButtonClicked = new Toronto.client.Event();
        
        this._widgetsToValidate = widgetsToValidate;
        this._datasetsToValidate = datasetsToValidate;
    };
    
    YAHOO.lang.extend(Toronto.widget.pn.NavigationBar, Toronto.framework.DefaultWidgetImpl, {
        startup: function (widgetContext) {
            Toronto.widget.pn.NavigationBar.superclass.startup.apply(this, arguments);
            this._widgetContext = widgetContext; 
            this._container = this.getNamedElement("div");
            this._id = this.getAttribute("name");  
            
            this._datasetName = this.getAttribute("dataset");
            this._idField = this.getAttribute("id-field");
            this._displayField = this.getAttribute("display-field");
            this._classField = this.getAttribute("class-field");
            
            this._buttonVisibleField = this.getAttribute("visible-field");
            this._buttonEnabledField = this.getAttribute("enabled-field");
            this._buttonRenderField = this.getAttribute("render-field");

            this._validateField = this.getAttribute("validate-field");
            this._serverValidateField = this.getAttribute("server-validate-field");
            
            //Global validate
            this._validate = parseBoolean(this.getAttribute("validate"));
            
            this._actionField = this.getAttribute('action-field'); 
            this._actionTypeField = this.getAttribute('action-type-field'); 
            this._id = this.getAttribute('name');
            
            this._list = this._container.firstChild;
            this._list.className = "navigationBar";
        },
        bind:function(dataContext){
            Toronto.widget.pn.NavigationBar.superclass.bind.apply(this, arguments);
            var self = this;   
            this._dataContext = dataContext;

            this._dataset = dataContext.findDataset(this._datasetName);                
            this._dataset_onDataChanged = this._dataset.onDataChanged.bindHandler(function() { 
                self.refresh();
            });
        },    
        refresh:function() {           
            var self = this,
                item, 
                list = this._list,
                screenName = self._id.split(":")[0],
                actionType,
                action;
            
            list.innerHTML = "";
            var count = 0;
            var rowCount = this._dataset.getRowCount();          
            
            this._dataset.getAllRows().doLoop(function(row) {
                var render = (self._buttonRenderField ? (row.getField(self._buttonRenderField)? parseBoolean(row.getField(self._buttonRenderField)) : true) : true);            
                count++;
                if(render){ 
                    item = document.createElement("li");            
                    item.row = row;
                    item.className = "navigationBarButton";
                    
                    item.className += count === 1 ? " first" : "";
                    item.className += count === rowCount ? " last" : "";

                    if(self._classField){
                        item.className += (" " + row.getField(self._classField));
                    }
                    
                    if(self._idField){ 
                        item.id = self._id + ':' + row.getField(self._idField); 
                     }
                    
                    if (row.isCurrentRow()) {
                        item.className += " navigationButtonSelected";  
                    }

                    if(self._buttonEnabledField){
                        var enabled = (row.getField(self._buttonEnabledField)? parseBoolean(row.getField(self._buttonEnabledField)) : true);   
                         if(!enabled){
                            item.setAttribute("disabled", "disabled");
                            item.className += " disabled"; 
                         }                                                    
                    }  
                    
                    if(self._buttonVisibleField){
                        var visible = (row.getField(self._buttonVisibleField)? parseBoolean(row.getField(self._buttonVisibleField)) : true);
                        if(!visible){
                            item.className += " display-none";
                        }
                    }             
                    
                    var text = document.createElement('div');
                    text.className = 'navigationButtonTextBox';
                    text.innerHTML = row.getField(self._displayField);
                    item.appendChild(text);

                    action = row.getField(self._actionField);  
                    actionType = row.getField(self._actionTypeField); 
                                       
                    if(action){                
                        if (!this._actionType || this._actionType === "") {
                            this._actionType = "workflow";
                        } 
                                            
                        switch(actionType.toLowerCase()){
                            case 'url':
                                item.setAttribute("href", action);
                                break;
                                
                            case 'workflow':
                                item.setAttribute("workflow", action);
                                break;
                        }
                    }

                    item.onclick = function(e){
                         if(!this.row.isCurrentRow()){
                            if(self.getButtonEnabled(this.id)){
                                this.row.makeCurrentRow();
                                if (this.getAttribute("href")) {
                                    if (this.getAttribute("href") != "#") {
                                        self.onButtonClicked.fireEvent();
                                        window.location.href = this.getAttribute("href");
                                    }
                                }
                                else if (this.getAttribute("workflow")) {
                                    self._callWorkflow(this.getAttribute("workflow"),this.row);
                                }
                            }
                        }
                    };
                   
                    list.appendChild(item);
                }
            });
        },
        _callWorkflow: function(workflow,row) {
            var self = this,
                validate = (row.getField(this._validateField) ? parseBoolean(row.getField(this._validateField)) : this._validate),
                serverValidate = (row.getField(this._serverValidateField) ? parseBoolean(row.getField(self._serverValidateField)) : validate),
                noValidateActions = [
                    "Restart",
                    "Cancel",
                    "Undo"
                ],
                callback = function(context) {
                    // Validation Failure
                    if (context.result.length > 0){
                        return;
                    }
                    
                    self.onButtonClicked.fireEvent({
                        widget: self.getWidgetContext().getWidgetNode(),
                        action: workflow
                    });
                    
                    self.getWidgetContext().getSystem().submitScreen({
                        action: workflow,
                        validate: validate,
                        serverValidate: serverValidate,
                        widgetNames : this._widgetsToValidate,
                        datasetNames : this._datasetsToValidate,
                        formFields: {} 
                    });
                    
                };
            
            if (validate && !noValidateActions.contains(workflow)){
                 return this.getWidgetContext().getSystem().validate({
                            serverValidate: serverValidate,
                            widgetNames : this._widgetsToValidate,
                            datasetNames : this._datasetsToValidate,
                            callback : callback
                });
            }
            return callback({'result':[]});
        
            this.onButtonClicked.fireEvent();
             this.getWidgetContext().getSystem().submitScreen({
                 action: workflow,
                 formFields: {} 
             });
        },
        _getButtonById: function(id){
            var parts = id.split(":");
            var x = parts.length;                
            if(x > 1){
                id = parts[x-1];               
            }
            var li = document.getElementById(this._id + ':' + id);
            return li;
        },
        clickButton: function(id) {
            var button = this._getButtonById(id);
            button.click();
            this.onButtonClicked.fireEvent();
        },   
        setButtonEnabled: function(id,enabled){
            enabled = parseBoolean(enabled);
            var button = this._getButtonById(id);
            var oldEnabled = this.getButtonEnabled(id); 
            var self = this;
            if (enabled !== oldEnabled) {
                if (enabled) {
                    YahooDom.removeClass(button, "disabled");
                    button.removeAttribute("disabled");
                    button.onclick = function(e){
                         if(!this.row.isCurrentRow()){
                            this.row.makeCurrentRow();
                            if (this.getAttribute("href")) {
                                if (this.getAttribute("href") != "#") {
                                    self.onButtonClicked.fireEvent();
                                    window.location.href = this.getAttribute("href");
                                }
                            }
                            else if (this.getAttribute("workflow")) {
                                self._callWorkflow(this.getAttribute("workflow"),this.row);
                            }
                        }
                    };
                }
                else {
                    button.setAttribute("disabled", "disabled");
                    YahooDom.addClass(button, "disabled");
                    button.onclick = function(){}; 
                }
                
                var self = this;
                this._dataset_onDataChanged.disable();
                this._dataset.getAllRows().doLoop(function(row){
                    if(row.getField(self._idField) === button.row.getField('id')){
                        row.setField('enabled', enabled);
                    }
                });
                this._dataset_onDataChanged.enable();                
            }
        },
        getButtonEnabled: function(id){
            var button = this._getButtonById(id);
            return (!YahooDom.hasClass(button,"disabled"));
        },
        setActiveButton: function(id){
            var button = this._getButtonById(id);
            var self = this;
            this._dataset.getAllRows().doLoop(function(row){
                if(row.getField(self._idField) === button.row.getField('id')){
                    row.makeCurrentRow();
                }
            });
        },
        resetActiveButton: function(){
            this._dataset.clearCurrentRow();
        }
    });
})();
