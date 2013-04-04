/*global
YAHOO
*/

(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    var StateUtils = Toronto.framework.StateUtils;

    Toronto.widget.pn.DatasetEmpty = function () {
        
    };

    YAHOO.lang.extend(Toronto.widget.pn.DatasetEmpty, Toronto.framework.DefaultActionImpl, {

        run: function (state) {
            // Add the action implementation here
            var retVal = false;
            var dsName = this.getAttribute("dataset", state);
            var dataset = state.getApplicationState().getDatasetStack().findDataset(dsName);
            if (dataset && dataset.getRowCount() == 0) {
                retVal = true;
            }
            state.getExecutionState().setReturnValue(retVal);

        }

    });

})();
