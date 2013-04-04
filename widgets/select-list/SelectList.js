(function () {   
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;
    
    Toronto.widget.pn.SelectList = function () {
        this.onEnabledChanged = new Toronto.client.Event();
        this.onSelectedChanged = new Toronto.client.Event();
        this.onValueChanged = this.onSelectedChanged;
        this.onValidate = new Toronto.client.Event();
    };

    YAHOO.lang.extend(Toronto.widget.pn.SelectList, Toronto.framework.DefaultWidgetImpl, {
        startup: function (widgetContext) {
            Toronto.widget.pn.SelectList.superclass.startup.apply(this, arguments);
            this._initialised = false;
            
            this._widgetContext = widgetContext; 

            this._id = this.getAttribute("name");
            this._container = this.getNamedElement("div");
            
            this._displayField = this.getAttribute('display-field'); 
            this._dataset = this.getAttribute('dataset');
            this._nullOptionText = this.getAttribute('null-option-text');  
            this._idField = this.getAttribute('id-field'); 
            this._selectionField = this.getAttribute('selection-field');
            this._selectRow = parseBoolean(this.getAttribute('select-row'));

            this._selectList = document.getElementById(this._id);
            
            this._mandatory = parseBoolean(this.getAttribute("mandatory"));
            this._mandatoryDisplayText = this.getAttribute("mandatory-display-text");
            
            this._enabled = parseBoolean(this.getAttribute('enabled'));
            if(this._selectList.disabled){ 
                this._enabled = false;
            }
            
            var self = this;
            this._selectList.onchange = function(){
                self._selectListChanged();
            };
            
            this.getWidgetContext().getSystem().onUnload.bindHandler(this._cleanup, this);
        },
       
        bind:function(dataContext){
            Toronto.widget.pn.SelectList.superclass.bind.apply(this, arguments);

            this._dataContext = dataContext;
            this._dataset = dataContext.findDataset(this._dataset);                
            this._dataset_onCurrentRowChanged = this._dataset.onCurrentRowChanged.bindHandler(this._datasetCurrentRowChanged, this);               
            this._dataset_onDataChanged = this._dataset.onDataChanged.bindHandler(this.refresh, this);
            this._dataset_onRowCommitActionChanged = this._dataset.onRowCommitActionChanged.bindHandler(this.refresh, this);
              
            if (this._selectionField) {
                var parts = this._selectionField.split('.');
                this._selectionField = parts[1];
                this._selectionDataset = dataContext.findDataset(parts[0]);

                this._selectionDataset.onCurrentRowChanged.bindHandler(this._selectionFieldChanged, this);
                this._selectionField_onCurrentRowFieldChanged = this._selectionDataset.bindOnCurrentRowFieldChangedHandler(this._selectionField, this._selectionFieldChanged, this);
                this._selectionDataset.onContentsReplaced.bindHandler(this._selectionFieldChanged, this);
                
                var row = this._selectionDataset.getCurrentRow();
                if(row){
                    var field = row.getFieldObject(this._selectionField);
                    this._mandatory = (this._mandatory || field.getMetadata().isMandatory());
                }
            }     
        
            if (this._mandatory) {
                this.setMandatory(this._mandatory);
            }    
        },
        refresh:function(){  
            this._loadOptions();
            this._datasetCurrentRowChanged();
            this._selectionFieldChanged();
        },
        
        _cleanup: function () {
            /*this._selectList.onchange.unbind();*/
        },
        
        _loadOptions: function(){
            var destroyList = this._selectList;
            while (destroyList.firstChild) {
                destroyList.removeChild(destroyList.firstChild);
            }
            
            if (this._nullOptionText) {
                var nulloption = document.createElement("option");
                nulloption.value = '';
                nulloption.datasetRowIndex = -1;
                nulloption.appendChild(document.createTextNode(this._nullOptionText));
                this._selectList.appendChild(nulloption );
            }
            
            var selectionFieldValue = null;
            
            if (this._selectionField) {
                var row = this._selectionDataset.getCurrentRow();
                if(row){
                    selectionFieldValue = row.getField(this._selectionField);
                }
            }
            
            var self = this;
            this._dataset.getAllRows().doLoop(function(row){
                if (row.getFieldNames().length === 0 || row.getField(self._displayField) === null){ return; }
                
                var option = document.createElement("option");
                option.value = row.getField(self._idField);
                option.datasetRowIndex = row.getDatasetRowIndex();
                
                if (selectionFieldValue && option.value == selectionFieldValue) {
                    option.selected = true;
                }
                else if (self._selectRow && row.isCurrentRow()) {
                    option.selected = true;
                }
                option.appendChild(document.createTextNode(row.getFieldObject(self._displayField).getFormattedValue()));
                self._selectList.appendChild(option);
            });
            
            this._initialised = true;
        },
        _unloadOptions: function(){
            var destroyList = this._selectList;
            while (destroyList.firstChild) {
                destroyList.removeChild(destroyList.firstChild);
            }
        },
        _datasetCurrentRowChanged: function(){
           if (this._dataset.getRowCount() === 0) {
                return;
           }

           if (this._dataset.getCurrentRow() === null && this._nullOptionText) {
                if (this._nullOptionText) {
                    this._selectList.value = "";
                    this._dataset_onCurrentRowChanged.disable();
                    this._dataset.clearCurrentRow();
                    this._dataset_onCurrentRowChanged.enable();
                }
            } else {
                this._selectList.value = this._dataset.getCurrentRowField(this._idField);
            }
        }, 
        _selectionFieldChanged: function() {
            if (this._selectionField && this._selectionDataset.getCurrentRow()) {
                this._selectionField_onCurrentRowFieldChanged.disable();

                var newValue = this._selectionDataset.getCurrentRowField(this._selectionField);
                
                if (!newValue) {
                    newValue = "";
                }
                
                var oldValue = this._selectList.value;
                this._selectList.value = newValue;
                
                //(1): Is used to ensure Aviarc postbacks via uploads or selectlist option selected on page load
                // do not clear out selected row from dataset
                if(newValue !== "" && this._dataset.getCurrentRow() === null){
                    this._dataset_onCurrentRowChanged.disable();
                    var option = this._selectList.options[this._selectList.selectedIndex];
                    var rowIndex = parseInt(option.datasetRowIndex, 10);
                    this._dataset.setCurrentRowIndex(rowIndex);
                    this._dataset_onCurrentRowChanged.enable();
                }
                //END (1)
                
                if (oldValue !== newValue) {        
                    this.onSelectedChanged.fireEvent({
                      value: newValue,
                      widget: this.getWidgetContext().getWidgetNode()
                    });
                }
                                        
                this._selectionField_onCurrentRowFieldChanged.enable();
            }
        },        
        _selectListChanged: function () {
            var value = this._selectList.value;

            if (this._selectionField) {
                this._selectionField_onCurrentRowFieldChanged.disable();
                this._selectionDataset.getCurrentRow().setField(this._selectionField, value);
                this._selectionField_onCurrentRowFieldChanged.enable();
            }
            
            var selectedOption = this._selectList.options[this._selectList.selectedIndex];
            var newRowIndex = parseInt(selectedOption.datasetRowIndex, 10);
            this._dataset_onCurrentRowChanged.disable();
            if (newRowIndex === -1) {
                this._dataset.clearCurrentRow();
            } else {
                this._dataset.setCurrentRowIndex(newRowIndex);
            }
            this._dataset_onCurrentRowChanged.enable();

            this.onSelectedChanged.fireEvent({
                value: value,
                widget: this.getWidgetContext().getWidgetNode()
            });
        },  
        validate: function () {
           //this code still requires improvement  
           YahooDom.removeClass(this._input,'error');
           var value = this.getValue();
           var valid = {isValid : true, reason : '', parsedValue : value, error:null, dataset:false}; 
           if(this._mandatory && (value === null || value.trim() === '')){
                valid.isValid = false;
                valid.reason = (this._validationMessage ? this._validationMessage : 'This field must be completed');
                YahooDom.addClass(this._input,'error');
           }
           
           this._valid = (valid.isValid || valid.reason);
           this.onValidate.fireEvent();
           return this._valid;
        },
        getValid: function() {
            return (this._valid || true);
        },
        getValue: function() {            
            return this._selectList.value;
        },
        getText: function(){
            var x = this._selectList.selectedIndex;
            return this._selectList.options[x].text;
        },
        setValue: function(value) {
            this._inputElement.value = value;
            this._selectListChanged();
        },
		getElementsByClassName: function (node, classname) {
            var a = [];
            var re = new RegExp('(^| )'+classname+'( |$)');
            var els = node.getElementsByTagName("*");
            for(var i=0,j=els.length; i<j; i++){
                if(re.test(els[i].className)){
                    a.push(els[i]);
                }
            }
            return a;
        },
        setMandatory: function(mandatory){
            mandatory = parseBoolean(mandatory);
            this._selectList.mandatory = this._mandatory = mandatory;
            var span = this.getElementsByClassName(this._container,'mandatory-display')[0];
             
            if(mandatory){
                YahooDom.addClass(this._selectList,"mandatory");
                if(!span){
                    span = document.createElement("span");
                    span.className = "mandatory-display";
                    span.innerHTML = (this._mandatoryDisplayText ? this._mandatoryDisplayText : '');
                    this._container.appendChild(span);
                }
            } else {
                YahooDom.removeClass(this._selectList,"mandatory");
                if(span){
                   this._container.removeChild(span);
                }                     
            }
        },
        getMandatory: function(){
            return this._mandatory;
        },
        setEnabled: function(enabled) {
            enabled = parseBoolean(enabled);
            var oldEnabled = this._enabled;
            if (enabled !== oldEnabled) {
                if (enabled) {
                    this._container.removeAttribute("disabled");
                    YahooDom.removeClass(this._container,"disabled");
                    this._selectList.removeAttribute("disabled");
                }
                else {
                    this._container.setAttribute("disabled", "disabled");
                    YahooDom.addClass(this._container,"disabled");
                    this._selectList.setAttribute("disabled", "disabled");
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
        getStyledElements: function () {
            return [this._container];
        }
    });
    YAHOO.lang.augmentProto(Toronto.widget.pn.SelectList, Toronto.util.CssUtils);
})();
