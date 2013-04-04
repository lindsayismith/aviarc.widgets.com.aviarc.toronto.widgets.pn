<xsl:stylesheet
     version="2"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

     xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
     xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
     
     extension-element-prefixes="aviarc"
     exclude-result-prefixes="aviarc xsltutils"
     >
     <xsl:template match="select-list">
         <!-- It seems that all browsers give precedence to the 'height' css property anyway,
             all we have to do is set 1 for single line, 2 for multi -->
         <xsl:variable name="rows">
            <xsl:choose>
                <xsl:when test="xsltutils:isTrue(@multi-line)">2</xsl:when>
                <xsl:otherwise>1</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <!-- Prepare initial enabled state.  To agree with the javascript model:
             @selection-field dataset must have a current row
             @enabled set to true -->
        <xsl:variable name="selection-dataset-ok">
            <xsl:choose>
                <!--no selection-field is ok-->
                <xsl:when test="not(@selection-field)">y</xsl:when>
                <!--if present, must have a row-->
                <xsl:otherwise>
                    <xsl:variable name="selection-ds-name"><xsl:value-of select="xsltutils:getDatasetName(@selection-field)"/></xsl:variable>
                    <xsl:choose>
                        <xsl:when test="xsltutils:getDatasetCurrentRow($selection-ds-name)">y</xsl:when>
                        <xsl:otherwise>n</xsl:otherwise>
                    </xsl:choose>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
        <div id="{@name}:div">
            <xsl:attribute name="class">
                <xsl:text>select-list </xsl:text>
                
                <xsl:choose>
                   <xsl:when test="@class">
                       <xsl:attribute name="class">
                            <xsl:value-of select="@class"/>
                            <xsl:choose>
                                <xsl:when test="$selection-dataset-ok = 'n'"><xsl:attribute name="class"> disabled</xsl:attribute></xsl:when>
                                <xsl:when test="xsltutils:isFalse(@enabled)"><xsl:attribute name="class"> disabled</xsl:attribute></xsl:when>
                                <xsl:otherwise></xsl:otherwise>
                            </xsl:choose>
                        </xsl:attribute>
                   </xsl:when>
                   <xsl:otherwise>
                       <xsl:choose>
                            <xsl:when test="$selection-dataset-ok = 'n'"><xsl:attribute name="class"> disabled</xsl:attribute></xsl:when>
                            <xsl:when test="xsltutils:isFalse(@enabled)"><xsl:attribute name="class"> disabled</xsl:attribute></xsl:when>
                            <xsl:otherwise></xsl:otherwise>
                        </xsl:choose>
                   </xsl:otherwise>
                </xsl:choose>
        
            </xsl:attribute>
            
            <select size="{$rows}" >
                <xsl:if test="@name"><xsl:attribute name="id"><xsl:value-of select="@name"/></xsl:attribute></xsl:if>     
                 <xsl:choose>
                    <xsl:when test="xsltutils:isFalse(@enabled)"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:when>
                    <xsl:when test="$selection-dataset-ok = 'n'"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:when>
                    <xsl:otherwise></xsl:otherwise>
                 </xsl:choose>

            </select>
        </div>
    </xsl:template>
</xsl:stylesheet>
