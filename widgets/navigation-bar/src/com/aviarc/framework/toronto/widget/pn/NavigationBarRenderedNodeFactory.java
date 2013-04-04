package com.aviarc.framework.toronto.widget.pn;

import java.util.ArrayList;
import java.util.List;

import javax.xml.transform.Templates;

import com.aviarc.framework.toronto.screen.CompiledWidget;
import com.aviarc.framework.toronto.screen.RenderedNode;
import com.aviarc.framework.toronto.screen.ScreenRenderingContext;
import com.aviarc.framework.toronto.util.JavascriptUtils;
import com.aviarc.framework.toronto.widget.DefaultDefinitionFile;
import com.aviarc.framework.toronto.widget.xslt.DefaultXSLTRenderedNodeImpl;
import com.aviarc.framework.toronto.widget.xslt.XSLTRenderedNodeFactory;
import com.aviarc.framework.xml.compilation.ResolvedElementContext;

public class NavigationBarRenderedNodeFactory implements XSLTRenderedNodeFactory {

    private static final long serialVersionUID = 1L;
    public static class NavigationBarRenderedNode extends DefaultXSLTRenderedNodeImpl {

        public NavigationBarRenderedNode(final ResolvedElementContext<CompiledWidget> resolvedContext,
                                  final ScreenRenderingContext renderingContext, 
                                  final DefaultDefinitionFile definition,
                                  final Templates widgetTemplate) {
            super(resolvedContext, renderingContext, definition, widgetTemplate);            
        }

        @Override
        public String getJavascriptDeclaration() {            
            List<String> widgetsToValidate = new ArrayList<String>();
            List<String> datasetsToValidate = new ArrayList<String>();
            
            for (ResolvedElementContext<?> element : this.getResolvedElementContext().getSubElements("validate")) {
                if(element.getAttribute("widget") == null){
                    if(element.getAttribute("dataset") == null){
                        continue;
                    }
                    datasetsToValidate.add(element.getAttribute("dataset").getResolvedValue());
                }else{
                    widgetsToValidate.add(element.getAttribute("widget").getResolvedValue());
                }
            }
            
            String widgetsToValidateString = JavascriptUtils.makeArrayFromList(widgetsToValidate);
            String datasetsToValidateString = JavascriptUtils.makeArrayFromList(datasetsToValidate);
            return String.format("new YAHOO.com.aviarc.framework.toronto.widget.pn.NavigationBar(%s, %s)", widgetsToValidateString, datasetsToValidateString);
        }

    }

    private Templates _widgetTemplate;
    private DefaultDefinitionFile _definitionFile;

    public void initialize(DefaultDefinitionFile definitionFile, Templates widgetTemplate) {
        _widgetTemplate = widgetTemplate;
        _definitionFile = definitionFile;
    }
    
    public RenderedNode createRenderedNode(ResolvedElementContext<CompiledWidget> elementContext,
                                           ScreenRenderingContext renderingContext) {
        return new NavigationBarRenderedNode(elementContext, renderingContext,  _definitionFile, _widgetTemplate);
    }
}
