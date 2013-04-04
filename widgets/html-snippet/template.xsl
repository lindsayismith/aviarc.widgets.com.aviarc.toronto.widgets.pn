<xsl:stylesheet
     version="2"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

     xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
     xmlns:cssutils="java:com.aviarc.framework.toronto.util.CssUtils"
     xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
     
     extension-element-prefixes="aviarc"
     exclude-result-prefixes="aviarc cssutils xsltutils"
     >

    <xsl:template match="html-snippet">
        <div id="{@name}:div" class="html-snippet">
			<xsl:attribute name="data-text"><xsl:value-of select="." disable-output-escaping="yes"/></xsl:attribute>
        </div>
		
    </xsl:template>
</xsl:stylesheet>
