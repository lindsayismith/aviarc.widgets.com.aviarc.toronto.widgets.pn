<xsl:stylesheet
     version="2"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

     xmlns:aviarc="urn:aviarc:xslt-extension-elements/com.aviarc.framework.toronto.widget.xslt.XSLTExtensionElementFactory"
     xmlns:xsltutils="com.aviarc.framework.toronto.widget.xslt.XSLTUtils"
     
     extension-element-prefixes="aviarc"
     exclude-result-prefixes="aviarc xsltutils"
     >

    <xsl:template match="input-field">
         <xsl:choose>
             <xsl:when test="@type = 'textarea'">
                <div id="{@name}:div">
					<xsl:attribute name="class">input-<xsl:value-of select="@type"/><xsl:if test="@class"><xsl:text> </xsl:text><xsl:value-of select="@class"/></xsl:if>
					    <xsl:if test="xsltutils:isTrue(@mandatory)"> mandatory</xsl:if>
					    <xsl:if test="xsltutils:isFalse(@visible)"> display-none</xsl:if>
					    <xsl:if test="xsltutils:isFalse(@enabled)"> disabled</xsl:if>
					</xsl:attribute>
                    <textarea id="{@name}">                     
                        <xsl:if test="xsltutils:isFalse(@enabled)"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>
                        <xsl:if test="xsltutils:isTrue(@html5-autofocus)"><xsl:attribute name="autofocus">autofocus</xsl:attribute></xsl:if>
                        <xsl:if test="@length"><xsl:attribute name="maxlength"><xsl:value-of select="@length"/></xsl:attribute></xsl:if>                  
                        <xsl:if test="@placeholder"><xsl:attribute name="placeHolder"><xsl:value-of select="@placeholder"/></xsl:attribute></xsl:if>                   
                        <xsl:if test="xsltutils:isTrue(@html5-required)"><xsl:attribute name="required">required</xsl:attribute></xsl:if>                         
                        <xsl:if test="xsltutils:isTrue(@readonly)"><xsl:attribute name="readonly">readonly</xsl:attribute></xsl:if>                                                 
                    </textarea>
                    <xsl:if test="xsltutils:isTrue(@mandatory)">
                        <span class="mandatory-display"><xsl:if test="@mandatory-display-text"><xsl:value-of select="@mandatory-display-text"/></xsl:if></span>
                    </xsl:if>
                </div>
             </xsl:when>
             <xsl:otherwise>
                 <div id="{@name}:div">
					<xsl:attribute name="class">input-<xsl:value-of select="@type"/><xsl:if test="@class"><xsl:text> </xsl:text><xsl:value-of select="@class"/></xsl:if>
					   <xsl:if test="xsltutils:isTrue(@mandatory)"><xsl:attribute name="class"> mandatory</xsl:attribute></xsl:if>
					   <xsl:if test="xsltutils:isFalse(@visible)"><xsl:attribute name="class"> display-none</xsl:attribute></xsl:if>
					   <xsl:if test="xsltutils:isFalse(@enabled)"><xsl:attribute name="class"> disabled</xsl:attribute></xsl:if>
					</xsl:attribute>
                    <input id="{@name}" type="{@type}">
                        <xsl:if test="@groupname"><xsl:attribute name="name"><xsl:value-of select="@groupname"/></xsl:attribute></xsl:if>                       
                        <xsl:if test="xsltutils:isFalse(@enabled)"><xsl:attribute name="disabled">disabled</xsl:attribute></xsl:if>                     
                        <xsl:if test="xsltutils:isTrue(@html5-autofocus)"><xsl:attribute name="autofocus">autofocus</xsl:attribute></xsl:if>                     
                        <xsl:if test="@length"><xsl:attribute name="maxlength"><xsl:value-of select="@length"/></xsl:attribute></xsl:if>                         
                        <xsl:if test="@value"><xsl:attribute name="value"><xsl:value-of select="@value"/></xsl:attribute></xsl:if>                  
                        <xsl:if test="@placeholder"><xsl:attribute name="placeHolder"><xsl:value-of select="@placeholder"/></xsl:attribute></xsl:if>                  
                        <xsl:if test="xsltutils:isTrue(@html5-required)"><xsl:attribute name="required">required</xsl:attribute></xsl:if>   
                        <xsl:if test="xsltutils:isTrue(@readonly)"><xsl:attribute name="readonly">readonly</xsl:attribute></xsl:if>                
                        <xsl:if test="@checked"><xsl:attribute name="checked">checked</xsl:attribute></xsl:if>
                    </input>
                    <xsl:if test="@type != 'checkbox' and @type != 'radio'">
                        <xsl:if test="xsltutils:isTrue(@mandatory)">
                            <span class="mandatory-display">
                                <xsl:if test="@mandatory-display-text"><xsl:value-of select="@mandatory-display-text"/></xsl:if>    
                            </span>
                        </xsl:if>
                    </xsl:if>
                    
                    <xsl:if test="@type = 'checkbox' or @type = 'radio'">
                        <xsl:if test="@label">
                            <label for="{@name}">
                                <xsl:if test="@class">
                                    <xsl:attribute name="class">
                                        <xsl:value-of select="@class"/>
                                        <xsl:if test="xsltutils:isTrue(@mandatory)"><xsl:attribute name="class"> mandatory</xsl:attribute></xsl:if>
                                    </xsl:attribute>
                                </xsl:if>
                                <xsl:value-of select="@label"/>
                            </label>
                        </xsl:if>
                    </xsl:if>
                </div>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>