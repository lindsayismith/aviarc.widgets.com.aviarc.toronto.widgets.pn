<xsl:stylesheet
     version="2"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

     xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
     xmlns:cssutils="java:com.aviarc.framework.toronto.util.CssUtils"
     xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
     
     extension-element-prefixes="aviarc"
     exclude-result-prefixes="aviarc cssutils xsltutils"
     >

    <xsl:template match="image">
        <xsl:choose>
            <xsl:when test="@url">
                <div id="{@name}:div" title="{@tooltip}">
                    <xsl:attribute name="class">image <xsl:if test="@class"><xsl:value-of select="@class"/></xsl:if>
                        <xsl:if test="xsltutils:isFalse(@visible)"> display-none</xsl:if>
                        <xsl:if test="xsltutils:isFalse(@enabled)"> disabled</xsl:if>
                    </xsl:attribute>    
                    <img id="{@name}" src="{@url}"/>
                </div>
            </xsl:when>
            <xsl:otherwise>
                <div id="{@name}:div" title="{@tooltip}">
                    <xsl:attribute name="class">image <xsl:if test="@class"><xsl:value-of select="@class"/></xsl:if>
                        <xsl:if test="xsltutils:isFalse(@visible)"> display-none</xsl:if>
                        <xsl:if test="xsltutils:isFalse(@enabled)"> disabled</xsl:if>
                    </xsl:attribute> 
                </div>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
</xsl:stylesheet>