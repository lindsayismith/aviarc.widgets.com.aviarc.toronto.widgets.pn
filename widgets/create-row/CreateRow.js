/*global
YAHOO
*/

(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    
    Toronto.widget.pn.CreateRow = function () {
        
    };

    YAHOO.lang.extend(Toronto.widget.pn.CreateRow, Toronto.framework.DefaultActionImpl, {

        run: function (state) {
            var datasetName = this.getAttribute("dataset", state);
            var ds = state.getApplicationState().getDatasetStack().findDataset(datasetName);
            
            // process sub elements if any
            var fieldNodes = this.getActionContext().getActionNode().getSubElements("field");
            var fieldValues = {};
            for (var i = 0; i < fieldNodes.length; i++) {
                var fieldName = fieldNodes[i].getXMLContext().getAttribute("name")(state);
                var fieldValue = fieldNodes[i].getXMLContext().getAttribute("value")(state);
                fieldValues[fieldName] = fieldValue;
            }
                
            ds.createRow(fieldValues);
        }

    });

})();
