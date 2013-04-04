/*global
YAHOO
*/

(function () {

    YAHOO.namespace("com.aviarc.framework.toronto.widget.pn");
    var Toronto = YAHOO.com.aviarc.framework.toronto;
    
    Toronto.widget.pn.DeleteAllRows = function () {
        
    };

    YAHOO.lang.extend(Toronto.widget.pn.DeleteAllRows, Toronto.framework.DefaultActionImpl, {

        run: function (state, timeline) {
            
            var datasetName = this.getAttribute("dataset", state);

            var ds = state.getApplicationState().getDatasetStack().findDataset(datasetName);
            ds.deleteAllRows();
          //  timeline.resume(state);
        }

    });

})();
