const puppeteer = require('puppeteer-core');
const CustmorModel = require("../Model/CustmorModel");
const MyServiceModel = require("../Model/ServiceModel");
const path = require('path');

// Convert number to words function
const convertNumberToWords = (num) => {
    if (num === 0) return "Zero";
    
    const belowTwenty = [
        "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
        "Seventeen", "Eighteen", "Nineteen"
    ];
    
    const tens = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
    
    const aboveThousand = [
        "", "Thousand", "Million", "Billion"
    ];

    const words = (n) => {
        if (n < 20) return belowTwenty[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + belowTwenty[n % 10] : "");
        if (n < 1000) return belowTwenty[Math.floor(n / 100)] + " Hundred" + (n % 100 > 0 ? " " + words(n % 100) : "");
        
        for (let i = 0; i < aboveThousand.length; i++) {
            const divisor = Math.pow(1000, i);
            if (n < divisor * 1000) {
                return words(Math.floor(n / divisor)) + " " + aboveThousand[i] + (n % divisor > 0 ? " " + words(n % divisor) : "");
            }
        }
    };

    return words(num).trim();
};

const chromiumPath = '/usr/bin/chromium-browser'; // Path to Chromium

const generatePDF = async (saleData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch customer details
            const customer = await CustmorModel.findById(saleData.customer);
            // Fetch services details
            const services = await MyServiceModel.find({ _id: { $in: saleData.services } }).populate('serviceName');

            const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tax Invoice</title>
                <style>
                    body {
                        padding: 20px;
                        background-color: #f7f7f7;
                        font-family: Arial, sans-serif;
                    }
                    .invoice-box {
                        max-width: 800px;
                        margin: auto;
                        padding: 30px;
                        border: 1px solid #eee;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                        background-color: white;
                    }
                    h2.title {
                        text-align: center;
                        font-size: 28px;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    .company-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }
                    .company-info .logo {
                        max-width: 100px;
                    }
                    .billing-info table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .billing-info table th,
                    .billing-info table td {
                        padding: 10px;
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    .item-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .item-table th,
                    .item-table td {
                        border: 1px solid #ddd;
                        padding: 10px;
                        text-align: center;
                    }
                    .terms {
                        margin: 20px 0;
                        font-size: 14px;
                    }
                    .signature {
                        text-align: right;
                        margin-top: 40px;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <h2 class="title">Tax Invoice</h2>
                    
                    <div class="company-info">
                        <div class="left" style="width: 50%;">
                            <img src="https://digiindiasolutions.com/images/white-logo.png" alt="Company Logo" class="logo">
                            <p>A S</p>
                            <p>Phone: 7985905058</p>
                            <p>Email: ayushsrivastava5050@gmail.com</p>
                        </div>
                    </div>

                    <div class="billing-info">
                        <h4>Billing Information</h4>
                        <table>
                            <tr>
                                <th>Bill To:</th>
                                <th>Invoice Details:</th>
                            </tr>
                            <tr>
                                <td>
                                    <p>${customer.customerName}</p>
                                    <p>Contact No: ${saleData.mobileNumber}</p>
                                </td>
                                <td>
                                    <p>No: ${saleData._id}</p>
                                    <p>Date: ${new Date(saleData.createdAt).toLocaleDateString()}</p>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <h4>Services</h4>
                    <table class="item-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>HSN/SAC</th>
                                <th>Quantity</th>
                                <th>Price (₹)</th>
                                <th>Discount (₹)</th>
                                <th>GST (%)</th>
                                <th>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${services.map(service => `
                                <tr>
                                    <td>${service.serviceName?.serviceName || 'N/A'}</td>
                                    <td>${service.serviceName?.hsnCode || 'N/A'}</td>
                                    <td>${service.quantity || 'N/A'}</td>
                                    <td>₹${service.rate || 'N/A'}</td>
                                    <td>₹${(service.rate * (service.serviceName?.discountPercentage / 100)).toFixed(2) || 'N/A'}</td>
                                    <td>${service.serviceName?.discountPercentage || 'N/A'}%</td>
                                    <td>₹${service.totalAmount || 'N/A'}</td>
                                </tr>
                            `).join('')}
                            <tr>
                                <td colspan="6" style="text-align: right;"><strong>Total</strong></td>
                                <td><strong>₹${saleData.totalAmount}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <p><strong>Invoice Amount in Words:</strong> ${convertNumberToWords(saleData.totalAmount)} Only</p>

                    <div class="terms">
                        <p>Terms and Conditions:</p>
                        <p>1. Payment is due within 30 days.</p>
                        <p>2. Please refer to the attached document for detailed terms.</p>
                    </div>

                    <div class="signature">
                        <p>Authorized Signature</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            // Launch browser with necessary flags
            const browser = await puppeteer.launch({
                executablePath: chromiumPath,
                headless: true, // Run in headless mode
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add sandbox flags
            });
            const page = await browser.newPage();

            // Set content and wait for it to be rendered
            await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

            // Generate PDF buffer
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true
            });

            // Close browser after PDF generation
            await browser.close();

            // Resolve the promise with the PDF buffer
            resolve(pdfBuffer);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generatePDF };
