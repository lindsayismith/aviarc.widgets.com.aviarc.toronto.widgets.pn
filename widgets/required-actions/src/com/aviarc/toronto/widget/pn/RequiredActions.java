package com.aviarc.toronto.widget.pn;
 
import org.w3c.dom.Node;

import com.aviarc.core.dataset.Dataset;
import com.aviarc.core.dataset.DatasetRow;
import com.aviarc.framework.toronto.screen.CompiledWidget;
import com.aviarc.framework.toronto.screen.RenderedNode;
import com.aviarc.framework.toronto.screen.ScreenRenderingContext;
import com.aviarc.framework.toronto.screen.ScreenRequirementsCollector;
import com.aviarc.framework.toronto.widget.DefaultDefinitionFile;
import com.aviarc.framework.toronto.widget.DefaultRenderedNodeFactory;
import com.aviarc.framework.toronto.widget.DefaultRenderedWidgetImpl;
import com.aviarc.framework.xml.compilation.ResolvedElementContext;
 
public class RequiredActions implements DefaultRenderedNodeFactory {   
    private static final long serialVersionUID = 0L;
    private DefaultDefinitionFile _definition;
 
    public void initialize(DefaultDefinitionFile definitionFile) {
        // Store the definition - our rendered node class requires it as it derives from DefaultRenderedNodeImpl
        this._definition = definitionFile;
    }
 
    public RenderedNode createRenderedNode(ResolvedElementContext<CompiledWidget> elementContext,
                                           ScreenRenderingContext renderingContext) {
        
        return new RequiredActionsImpl(elementContext, renderingContext, _definition);
    }
 
    /**
     * Our custom implementation of RenderedNode.  
     * 
     * It derives from DefaultRenderedNodeImpl so that all the normal behaviour for widgets, e.g. javascript
     * constructors, requirements registering, required datasets etc are taken from the definition file.
     * 
     * We override the HTML generation method to provide our own markup.
     * 
     */
    public static class RequiredActionsImpl extends DefaultRenderedWidgetImpl {
 
        public RequiredActionsImpl(ResolvedElementContext<CompiledWidget> resolvedContext,
                                            ScreenRenderingContext renderingContext, 
                                            DefaultDefinitionFile definition) {
            super(resolvedContext, renderingContext, definition);                        
        }
 
        @Override
        public void registerRequirements(ScreenRequirementsCollector collector) {
            super.registerRequirements(collector);
            
            String datasetName = getAttributeValue("dataset");
            String fieldName = getAttributeValue("field-name");
            
            Dataset dataset = getScreenRenderingContext().getCurrentState().getApplicationState().getDatasetStack().findDataset(datasetName);
            for (DatasetRow row : dataset.getAllRows()) {
                String actionName = row.getField(fieldName);
                collector.requireScreenAction(actionName);
            }
       }
 
        /**
         * Overridden to generate custom markup.
         */
        @Override
        public Node createXHTML(XHTMLCreationContext context) {
            // Don't want any actual elements rendered
            return context.getCurrentDocument().createDocumentFragment();            
        }
    }
}

