<xsl:stylesheet version="2"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
    xmlns:cssutils="java:com.aviarc.framework.toronto.util.CssUtils"
    xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
    extension-element-prefixes="aviarc"
    exclude-result-prefixes="aviarc cssutils xsltutils">
     
  <xsl:template match="text-dynamic">
    <xsl:variable name="invisible-style"><xsl:if test="xsltutils:isFalse(@visible)">display-none</xsl:if></xsl:variable>

    <div id="{@name}:div" class="{@class}"></div>
  </xsl:template>
     
</xsl:stylesheet>
