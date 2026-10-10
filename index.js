const express = require('express');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

let browser;

// Launch headless Chromium browser once on server boot
async function initBrowser() {
  browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  console.log('🚀 Headless Chromium Engine Ready');
}

initBrowser();

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'DocuMint PDF API' }));

// Core PDF Generation Route
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { template = 'invoice', data = {}, pdfOptions = {} } = req.body;

    const templatePath = path.join(__dirname, 'templates', `${template}.html`);
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ error: `Template '${template}' not found` });
    }

    // Compile template using Handlebars
    const htmlSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(htmlSource);
    const htmlContent = compiledTemplate(data);

    // Render HTML to PDF in Chrome tab
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: pdfOptions.format || 'A4',
      printBackground: true,
      margin: pdfOptions.margin || { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    await page.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${template}-${Date.now()}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return res.status(500).json({ error: 'Failed to generate PDF document' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⚡ DocuMint running on port ${PORT}`));
