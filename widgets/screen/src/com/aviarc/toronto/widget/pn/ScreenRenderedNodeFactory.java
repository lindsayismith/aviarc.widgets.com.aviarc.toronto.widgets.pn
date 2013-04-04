package com.aviarc.toronto.widget.pn;

import static java.lang.Integer.parseInt;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.aviarc.core.components.AviarcURN;
import com.aviarc.framework.toronto.screen.CompiledWidget;
import com.aviarc.framework.toronto.screen.RenderedNode;
import com.aviarc.framework.toronto.screen.ScreenRenderingContext;
import com.aviarc.framework.toronto.screen.ScreenRequirementsCollector;
import com.aviarc.framework.toronto.util.CssUtils;
import com.aviarc.framework.toronto.widget.DefaultDefinitionFile;
import com.aviarc.framework.toronto.widget.DefaultRenderedNodeFactory;
import com.aviarc.framework.toronto.widget.DefaultRenderedWidgetImpl;
import com.aviarc.framework.util.BrowserDetection;
import com.aviarc.framework.xml.compilation.ResolvedElementContext;

public class ScreenRenderedNodeFactory implements DefaultRenderedNodeFactory {

    private static final long serialVersionUID = 1L;
    public class ScreenRenderedNode extends DefaultRenderedWidgetImpl implements RenderedNode {

        public ScreenRenderedNode(final ResolvedElementContext<CompiledWidget> resolvedContext,
                                  final ScreenRenderingContext renderingContext, 
                                  final DefaultDefinitionFile definition) {
            super(resolvedContext, renderingContext, definition);  
        }

        private static final String EMPTY_STRING = "";
        
        @Override
        public void registerRequirements(ScreenRequirementsCollector collector) {
            super.registerRequirements(collector);
            
            String title = this.getAttributeValue("title");
            collector.requestPageTitle(title);
            
            /* TODO: this is only needed because we still use the old-style WidgetSearch mechanism for these.
             *       Change to do the searching / override resolution here instead and use the unique URN in the URN,
             *       and remove the applicationName parameter too.
             */
            AviarcURN widgetURN = this.getDefinitionFile().getWidgetURN();
            AviarcURN nonUniqueURN = widgetURN.builder().sharedComponent(false).applicationID(null).applicationName(null).build();
            collector.requestFavIcon(getResolvedElementContext().getApplicationName(), nonUniqueURN, "favicon.ico");
        }

        @Override
        public Node createXHTML(XHTMLCreationContext context) {
            return createScreenContainer(context);
        }

        private Element createScreenContainer(XHTMLCreationContext context) {
          
            final String name = this.getAttributeValue("name");
            final String customClasses = this.hasAttribute("class") ? this.getAttributeValue("class") : EMPTY_STRING;
            
            if(!customClasses.equals("")){                
	            NodeList list = context.getCurrentDocument().getDocumentElement().getElementsByTagName("body");
	            Element body = (Element) list.item(0);
	            body.setAttribute("class", customClasses);
            }
            
            Element screenContainer = context.getCurrentDocument().createElement("div");
            screenContainer.setAttribute("id", name);

            Node child;        
            for (RenderedNode node : this.getChildren()) {
                child = node.createXHTML(context);
                if (child != null) {
                    screenContainer.appendChild(child);
                }
            }
            return screenContainer;
        }   
    }

    private DefaultDefinitionFile _definitionFile;

    public void initialize(DefaultDefinitionFile definitionFile) {
        _definitionFile = definitionFile;
    }

    public RenderedNode createRenderedNode(ResolvedElementContext<CompiledWidget> elementContext,
                                           ScreenRenderingContext renderingContext) {
        return new ScreenRenderedNode(elementContext, renderingContext, _definitionFile);
    }

}