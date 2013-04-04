<xsl:stylesheet
     version="2"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

     xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
     xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
     
     extension-element-prefixes="aviarc"
     exclude-result-prefixes="aviarc xsltutils"
     >

    <xsl:template match="button">
        <div id="{@name}:div" >
            <xsl:attribute name="class">button <xsl:if test="@class"><xsl:value-of select="@class"/></xsl:if>
                    <xsl:if test="xsltutils:isFalse(@enabled)"> disabled</xsl:if>
                    <xsl:if test="xsltutils:isFalse(@visible)"> display-none</xsl:if>
            </xsl:attribute>
            <button id="{@name}">          
                <xsl:if test="@type"><xsl:attribute name="type"><xsl:value-of select="@type"/></xsl:attribute></xsl:if>   
                <xsl:if test="@tooltip"><xsl:attribute name="title"><xsl:value-of select="@tooltip"/></xsl:attribute></xsl:if>
                <xsl:choose>
                    <xsl:when test="@class">
                        <xsl:attribute name="class">
                            <xsl:value-of select="@class"/>
                            <xsl:choose>
                                <xsl:when test="xsltutils:isFalse(@enabled)"><xsl:attribute name="class"> disabled</xsl:attribute></xsl:when>
                                <xsl:otherwise></xsl:otherwise>
                            </xsl:choose>
                        </xsl:attribute>
                    </xsl:when>
                    <xsl:when test="xsltutils:isFalse(@enabled)"><xsl:attribute name="class">disabled</xsl:attribute></xsl:when>
                    <xsl:otherwise></xsl:otherwise>
                </xsl:choose>
                <xsl:if test="xsltutils:isFalse(@enabled)"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
                <xsl:value-of select="@value"/>
            </button>
        </div>
    </xsl:template>
    
</xsl:stylesheet>
