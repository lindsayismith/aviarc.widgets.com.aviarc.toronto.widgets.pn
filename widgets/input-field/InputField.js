(function () {   
    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;

    Toronto.widget.pn.InputField = function () {
        this.onValueChanged = new Toronto.client.Event();
        this.onKeyUp = new Toronto.client.Event();
        this.onEnabledChanged = new Toronto.client.Event();
        this.onReadOnlyChanged = new Toronto.client.Event();
        this.onKeyDown = new Toronto.client.Event();
        this.onEnterKey = new Toronto.client.Event();
        this.onValidate = new Toronto.client.Event();
    };

    YAHOO.lang.extend(Toronto.widget.pn.InputField, Toronto.framework.DefaultWidgetImpl, {
        startup: function (widgetContext) {
            Toronto.widget.pn.InputField.superclass.startup.apply(this, arguments);
            this._widgetContext = widgetContext; 
            this._attributes = this.getAttributes(); 
            this._id = this.getAttribute("name");
            this._displayName = this.getAttribute("display-name");
            this._validationMessage = this.getAttribute("validation-failed-message");
            this._container = this.getNamedElement("div");
            this._field = this.getAttribute("field");
            this._dataset = null;
            this._type = this.getAttribute("type");
            this._groupName = this.getAttribute("groupname");          
            this._focus = this.getAttribute("focus");
            
            //TODO apply data type 
            this._dataType = this.getAttribute("data-type");
            
            this._mandatory = parseBoolean(this.getAttribute("mandatory"));
            this._mandatoryDisplayText = this.getAttribute("mandatory-display-text");
            
            this._clearOnDisable = parseBoolean(this.getAttribute('clear-on-disable'));           
            this._enabled = parseBoolean(this.getAttribute('enabled'));
            this._readOnly = parseBoolean(this.getAttribute('readonly')); 
            
            this._checkedValue = this.getAttribute('checked-value');
            this._uncheckedValue = this.getAttribute('unchecked-value');
            
            this._disallowedChars = this.getAttribute("disallowed-chars"); 
            this._allowedChars = this.getAttribute("allowed-chars"); 
            
            this._isValid = true;

            if (this._field) {
                var parts = this._field.split('.');
                this._field = parts[1];
                this._dataset = parts[0];
            }
        },         
        bind:function(dataContext){
            Toronto.widget.pn.InputField.superclass.bind.apply(this, arguments);
             
            this._input = document.getElementById(this._id);
            var self = this;
            switch(this._type){
                case 'checkbox':
                case 'radio':
                    this._input.onchange = function(){
                        self._valueChanged();
                    };
                    break;
                case 'date':
                    this._input.onblur = function(){
                        self._valueChanged();
                    };
                    break;
                default:
                     if(this._dataType){
                         switch(this._dataType.toLowerCase()){
                             case 'number':
                                 this._allowedChars += '1234567890';
                                 break;
                             case 'decimal':
                                 this._allowedChars += '1234567890.';
                                 break;
                         }
                     }
                
                      
                    this._input.onchange = function(){
                        self._valueChanged();
                    }; 
                 
                    if(this._allowedChars || this._disallowedChars){
                        this._character_check_string = this._buildCharacterCheckString();
                        this._input.onpaste = function(e){
                            return self._onValuePaste(e);
                        };  
                        
                        this._input.onkeypress = function(e){
                            self._onKeyPress(e);
                        };  
                    } 
                  
                    this._input.onkeydown = function(e){
						if (!e) var e = window.event;
                        if(self._type.toLowerCase() !== 'textarea' && e.keyCode === 13){
                            self.onEnterKey.fireEvent({keyCode: e.keyCode});  
                        }
                        self.onKeyDown.fireEvent({keyCode: e.keyCode});
                    };   
                    
                    this._input.onkeyup = function(e){
						if (!e) var e = window.event;
                        self.onKeyUp.fireEvent({keyCode: e.keyCode});
                    }; 
                    
                    break;                 
            }                 
             
            

            this._dataContext = dataContext;
            if(this._dataset){
                this._dataset = dataContext.findDataset(this._dataset); 
 
                // check out the metadata
                var row = this._dataset.getCurrentRow();
                if (row !== null) {
                    var field = row.getFieldObject(this._field);
                    this._mandatory = (this._mandatory || field.getMetadata().isMandatory());

                    this._field_ValidHandler = field.getMetadata().onValidChange.bindHandler(this._fieldValidChanged, this);
                }
                                              
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
            
            if (this._mandatory) {
                this.setMandatory(this._mandatory);
            }
     
            if(parseBoolean(this._focus)){
                this._input.focus();
            }       
        },
        refresh:function(){
            if(this._dataset && this._dataset.getCurrentRow() !== null) {
                this._setValue(this._dataset.getCurrentRowField(this._field));
            } else {
                this._setValue(null);
            }
        },
        _setValue: function(value){
            switch(this._type){
                case 'checkbox':
                    ((this._checkedValue !== value || value === null) ?  this._input.removeAttribute("checked") : this._input.setAttribute("checked","checked"));
                    break;
                case 'radio':
                    (this._input.value !== value ?  this._input.removeAttribute("checked") : this._input.setAttribute("checked","checked"));
                    break;
                case 'label':
                    this._input.innerHTML = value || '';
                    break;
                default:
                    this._input.value = value || '';
                    break;            
            }
        },
        focus: function() {
            this._input.focus();
        },
        _valueChanged: function(e) {
            YahooDom.removeClass(this._input,'error');
            this._isValid = true;
        
            if(this._dataset){
                this._dataset_onCurrentRowFieldChanged.disable();
                this._dataset.setCurrentRowField(this._field,this.getValue());
                this._dataset_onCurrentRowFieldChanged.enable();
            }
            this.onValueChanged.fireEvent();
        },
        _onBlur: function(e){
            if(this._dataset){
                this._dataset_onCurrentRowFieldChanged.disable();
                this._dataset.setCurrentRowField(this._field,this._input.value);
                this._dataset_onCurrentRowFieldChanged.enable();
             }
        },
        _onKeyPress:function(e){
            var key = (!e.charCode ? String.fromCharCode(e.which):String.fromCharCode(e.charCode));
            if (this._character_check_string.indexOf(key) != -1) {
                e.preventDefault();
            } 
        },
        _onValuePaste:function(e){
            var data = (e.clipboardData ? e.clipboardData.getData("Text") : window.clipboardData.getData("Text"));
            var parts = data.split('');
            for ( var i = 0; i < parts.length; i++) {
                if (this._character_check_string.indexOf(parts[i]) != -1) {
                    //TODO: handle warning message better.
                    alert('Attempting to apply a value containing invalid characters.');
                    return false;
                }
            }
            
            return true;            
        },
        _validateEmail:function(){
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(this.getValue());
        },
        _buildCharacterCheckString:function(){
             var ch = "";
             if(this._allowedChars){
                var nchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
                var ichars = "!@#$%^&*()+=[]\\\';{}|\":<>?~`.- ,/_";
            
                var parts = this._allowedChars.split('');
                for ( var i = 0; i < parts.length; i++) {
                    if (ichars.indexOf(parts[i]) != -1) {
                        parts[i] = "\\" + parts[i];
                    }
                }

                this._allowedChars = parts.join('|');
                var reg = new RegExp(this._allowedChars, 'gi');
                ch = ichars + nchars;
                ch = ch.replace(reg, '');
            } else {
                ch = this._disallowedChars;  
            }
            
            return ch;           
        },
        setMandatory: function(mandatory){
            mandatory = parseBoolean(mandatory);
            this._input.mandatory = this._mandatory = mandatory;
            var span = this._container.getElementsByTagName('span')[0];
             
            if(mandatory){
                YahooDom.addClass(this._input,"mandatory");
                if(!span){
                    span = document.createElement("span");
                    span.className = "mandatory-display";
                    span.innerHTML = (this._mandatoryDisplayText ? this._mandatoryDisplayText : '');
                    this._container.appendChild(span);
                }
            } else {
                YahooDom.removeClass(this._input,"mandatory");
                if(span){
                   this._container.removeChild(span);
                }                     
            }       
        },
        getMandatory: function(){
            return this._mandatory;
        },
        _fieldValidChanged: function(){
            var metadata = this._dataset.getCurrentRow().getFieldObject(this._field).getMetadata();
            if(metadata.isValid()){
                this._isValid = true;
                YahooDom.removeClass(this._input,'error'); 
            } else {
                this._isValid = false;
                YahooDom.addClass(this._input,'error');
            }
            
        },
        validate: function () {
           //this code still requires improvement  
           YahooDom.removeClass(this._input,'error');

            switch(this._type){
               case 'checkbox':
               case 'radio':
                   break;
               default:
                   var value = this.getValue();
                   var valid = {isValid : true, reason : '', parsedValue : value, error:null, dataset:false}; 
                   if(this._mandatory && (value === null || value.trim() === '')){
                        valid.isValid = false;
                        valid.reason = (this._validationMessage ? this._validationMessage : 'This field must be completed');
                        YahooDom.addClass(this._input,'error');
                   } else {
                       if(this._dataType && this._dataType.toLowerCase() === 'email' && (!this._validateEmail()) && (value.trim() !== '')){
                           valid.isValid = false;
                           valid.reason = 'Invalid email address';
                           YahooDom.addClass(this._input,'error');
                       }
                   }
                   
                   this._isValid = (valid.isValid || valid.reason);
                   this.onValidate.fireEvent();
                   return this._isValid;
            }
        },
        getValue: function() {            
            switch(this._type){
                case 'checkbox':
                    if(this._checkedValue && this._uncheckedValue){
                        return (this._input.checked ?  this._checkedValue : this._uncheckedValue);
                    } else {
                        return this._input.value;
                    }
                default:
                    return this._input.value;            
            }
        },
        getGroupValue: function(){
            if (this._type == 'radio'){
                var array = document.getElementsByName(this._groupName);
                for(var i = 0; i < array.length; i++){
                    if(array[i].checked){
                        return array[i].value;
                    }
                }
            }     
        },
        setValid: function(valid, message) {
            valid = parseBoolean(valid);
            message = message || "invalid";
            if(valid === true){
                YahooDom.removeClass(this._input,'error');   
            } else {
                YahooDom.addClass(this._input,'error');
            }    
            this._isValid = valid ? true : message;
            this.onValidate.fireEvent();
        },
        getValid: function() { // currently used by the invalid-reason-text widget to display/hide messages
             return (this._isValid || true);
        },
        setValue: function(value) {
            this._setValue(value);
            this._valueChanged();
        },
        isChecked: function() {
            switch(this._type) {
                case 'checkbox':
                case 'radio':
                    return this._input.checked || false;
            default:
                return null;
            }
        },
        setEnabled: function(enabled) {
            enabled = parseBoolean(enabled);
            var oldEnabled = this._enabled;
            if (enabled !== oldEnabled) {
                if (enabled) {
                    YahooDom.removeClass(this._container, "disabled");
                    this._input.removeAttribute("disabled");
                }
                else {
                    YahooDom.addClass(this._container, "disabled");
                    this._input.setAttribute("disabled", "disabled");
                    
                    if(this._type !== 'checkbox' && this._type !== 'radio' && this._clearOnDisable){
                        this.setValue("");
                    }
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
        setReadOnly: function(readonly) {
            readonly= parseBoolean(readonly);
            var oldReadOnly = this._readOnly;
            if (readonly!== oldReadOnly) {
                if (readonly) {
                    this._input.setAttribute("readonly", "readonly");
                }
                else {
                    this._input.removeAttribute("readonly");
                }
                
                this._readOnly = readonly;
                this.onReadOnlyChanged.fireEvent({
                    widget: this.getWidgetContext().getWidgetNode(),
                    readonly: readonly
                });
            }
        },
        getReadOnly: function () {
            return this._readOnly;
        }
    });
})();

