<xsl:stylesheet
     version="2"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

     xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
     xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
     
     extension-element-prefixes="aviarc"
     exclude-result-prefixes="aviarc xsltutils"
     >
  
    <xsl:template match="container">
        <div id="{@name}:div">
            <xsl:choose>
                <xsl:when test="@class">
                    <xsl:attribute name="class">
                        <xsl:value-of select="@class"/>
                        <xsl:choose>
                            <xsl:when test="xsltutils:isFalse(@visible)"><xsl:attribute name="class"> display-none</xsl:attribute></xsl:when>
                            <xsl:when test="xsltutils:isFalse(@enabled)"><xsl:attribute name="class"> disabled</xsl:attribute></xsl:when>
                            <xsl:otherwise></xsl:otherwise>
                        </xsl:choose>
                    </xsl:attribute>
                </xsl:when>
                <xsl:when test="xsltutils:isFalse(@visible)"><xsl:attribute name="class">display-none</xsl:attribute></xsl:when>
                <xsl:when test="xsltutils:isFalse(@enabled)"><xsl:attribute name="class">disabled</xsl:attribute></xsl:when>
                <xsl:otherwise></xsl:otherwise>
            </xsl:choose>
            <aviarc:add-children/>
        </div>
    </xsl:template>
</xsl:stylesheet>
