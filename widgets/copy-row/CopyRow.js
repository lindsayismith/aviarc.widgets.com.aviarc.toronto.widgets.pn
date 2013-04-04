/*global
YAHOO
*/

(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;

    Toronto.widget.pn.CopyRow = function () {
        
    };

    YAHOO.lang.extend(Toronto.widget.pn.CopyRow, Toronto.framework.DefaultActionImpl, {

        run: function (state) {
            var fromDatasetName = this.getAttribute("from-dataset", state);
            var toDatasetName = this.getAttribute("to-dataset", state);
            var dsFrom = state.getApplicationState().getDatasetStack().findDataset(fromDatasetName);
            var dsTo = state.getApplicationState().getDatasetStack().findDataset(toDatasetName);
            
            if (dsFrom.getCurrentRow()) {
                var sourceRow = dsFrom.getCurrentRow();
                var targetRow = dsTo.getCurrentRow();
                if (!targetRow) {
                    targetRow = dsTo.createRow();
                }
                sourceRow.getFieldNames().doLoop(function(col) {
                    targetRow.setField(col, sourceRow.getField(col));
                });
            }
        }

    });

})();

