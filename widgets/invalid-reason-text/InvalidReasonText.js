/*global
YAHOO
*/

(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var YahooDom = YAHOO.util.Dom;

    Toronto.widget.pn.InvalidReasonText = function () {
        
    };

    YAHOO.lang.extend(Toronto.widget.pn.InvalidReasonText, Toronto.framework.DefaultWidgetImpl, {

        // The 'startup' method may be deleted if it is not required, the method from DefaultWidgetImpl will be used
        // Removing the superclass.startup method call may prevent your widget from functioning
        startup: function (widgetContext) {            
            Toronto.widget.pn.InvalidReasonText.superclass.startup.apply(this, arguments);
            var field = this.getAttribute("field");
            var widget = this.getAttribute("widget");
            if (field) {
                var parts = field.split(".");
                if (parts.length > 1) {
                    this._datasetName = parts[0];
                    this._fieldName = parts[1];
                } else {
                    throw new error("Field specifier '" + field + "' is not in dataset.field format");
                }
            }
            if (widget) {
                this._widget = widgetContext.findWidgetByID(widget);
            }
            
            // This disables the alert dialog for the whole page.
            widgetContext.getSystem().onValidationFailure.bindHandler(function(o){
                return false;
            });
        },

        // The 'bind' method may be deleted if it is not required, the method from DefaultWidgetImpl will be used
        // Removing the superclass.bind method call may prevent your widget from functioning
        bind: function (dataContext) {
            Toronto.widget.pn.InvalidReasonText.superclass.bind.apply(this, arguments);            
            if (this._datasetName) {
                this._ds = dataContext.findDataset(this._datasetName);
                this._ds.getEvents().onCurrentRowChanged.bindHandler(this.reBind, this);
            }
            if (this._widget) {
                if (this._widget.onValidate) {
                    this._widget.onValidate.bindHandler(this.refresh, this);
                }
                else {
                    throw new error("Invalid Reason Text: Specified widget '" + this._widget.getWidgetID() + "' doesn't raise an onValidate event");
                }
            }
            
            this.reBind();
        },
        
        reBind: function(){
            if (this._currentBind !== null && this._currentBind !== undefined ){
                this._currentBind.unbind();
            }
            if (this._ds) {
                var row = this._ds.getCurrentRow();
                if (row) {
                    this._currentBind = row.getFieldObject(this._fieldName).getMetadata().onValidChange.bindHandler(this.refresh, this);
                }
            }
        },

        refresh: function () {
            var fieldObj, value;            
            if (this._ds) {
                if (this._ds.getCurrentRow() !== null) {
                    fieldObj = this._ds.getCurrentRow().getFieldObject(this._fieldName)
                    if (fieldObj !== null) {
                        var messages = fieldObj.getMetadata().getInvalidReason();
                        if (messages.length == 0) {
                            value = ""
                        } else {
                            // we're displaying only the first one.  
                            // Multiple messages are not formatted well.
                            value = messages[0];
                        }
                    } else {
                        value = ""
                    }                
                    this.setDisplayedValue(value);
                } else {
                    this.setDisplayedValue("");
                }
            }
            else if (this._widget) {
				if(this._widget.validate && this._widget.getValid){			
					var result = this._widget.getValid();
					if (result === true) {
						this.setDisplayedValue("");
					}
					else {
						this.setDisplayedValue(result);
					}
				} else {
					throw new error("Invalid Reason Text: Specified widget '" + this._widget.getWidgetID() +" missing validate or getValid methods" );
				}
            }          
        },
        
        setDisplayedValue: function(value) {
            var div = this.getContainerElement();
            div.innerHTML = escapeHTML(value);
            YahooDom[((value || "") != "") ? "addClass" : "removeClass"].call(this, div, "invalid");
        }

    });

})();
