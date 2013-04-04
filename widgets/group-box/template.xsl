<xsl:stylesheet
     version="2"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

     xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
     xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
     
     extension-element-prefixes="aviarc"
     exclude-result-prefixes="aviarc xsltutils"
     >
  
    <xsl:template match="group-box">
        <div id="{@name}:div">
            <xsl:attribute name="class">group-box <xsl:if test="@class"><xsl:value-of select="@class"/></xsl:if>
                    <xsl:if test="xsltutils:isFalse(@visible)"> display-none</xsl:if>
                    <xsl:if test="xsltutils:isFalse(@enabled)"> disabled</xsl:if>
            </xsl:attribute>
            <xsl:if test="@label">
                <span class="group-box-label">
                    <xsl:attribute name="class">group-box-label <xsl:if test="xsltutils:isFalse(@enabled)"> disabled</xsl:if></xsl:attribute>
                    <xsl:value-of select="@label"/>
                </span>
            </xsl:if>
            <aviarc:add-children/>
        </div>
    </xsl:template>
</xsl:stylesheet>
