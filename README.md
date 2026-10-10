📄 DocuMint

A developer-first, self-hostable headless invoicing & PDF generation microservice API.

Turn JSON into gorgeous, tax-compliant PDF documents instantly using Puppeteer and Handlebars templates.

View Demo • API Reference • Contributing

⚡ The Problem

Styling HTML for print and generating pixel-perfect PDF invoices (@media print nightmares, headless browser setup hell, missing system dependencies) is painful for developers.

DocuMint gives you a lightweight, containerized microservice that takes your HTML templates and JSON data, fires up a managed headless Chromium instance, and returns a pristine PDF document via API.

🚀 Quickstart (Docker Compose)

The fastest way to run DocuMint is using Docker. No local Node.js setup required!

Clone the repository:

git clone https://github.com/itsayushacharya/documint.git
cd documint


Spin up the container:

docker compose up --build


The service will be live at http://localhost:3000.

📡 API Endpoints

1. Health Check

GET /health

Response: 200 OK

{
  "status": "ok",
  "service": "DocuMint PDF API"
}


2. Generate PDF

POST /api/generate-pdf

Content-Type: application/json

Example curl Request:

curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "template": "invoice",
    "data": {
      "companyName": "Acme Tech Solutions",
      "companyAddress": "123 Tech Park, Silicon Valley",
      "invoiceNumber": "INV-2026-001",
      "date": "Oct 10, 2026",
      "dueDate": "Oct 24, 2026",
      "clientName": "Dev Inc.",
      "clientEmail": "billing@devinc.io",
      "items": [
        { "description": "API Integration Consulting", "quantity": 10, "rate": 150, "amount": 1500 },
        { "description": "Cloud Architecture Review", "quantity": 1, "rate": 500, "amount": 500 }
      ],
      "subtotal": "2000.00",
      "taxRate": 10,
      "taxAmount": "200.00",
      "total": "2200.00"
    }
  }' --output invoice.pdf


🛠️ Adding Custom Templates

Create a new HTML file inside the templates/ directory (e.g., templates/receipt.html).

Use standard Handlebars syntax for dynamic variables:

<h1>Hello, {{customerName}}!</h1>


Pass your template name in the API request body:

{
  "template": "receipt",
  "data": { "customerName": "Alice" }
}


📦 Local Development (Without Docker)

If you prefer running it locally via Node.js:

Install dependencies:

npm install


(Note: Ensure Chromium or Google Chrome is installed on your machine for Puppeteer).

Start the server:

npm start


🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or check out good first issue labels.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License

Distributed under the MIT License. See LICENSE for more information.
