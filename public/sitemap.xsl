<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Kitzbühel rail guide sitemap</title>
      </head>
      <body>
        <h1>Kitzbühel rail guide sitemap</h1>
        <ul>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <li><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a></li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
