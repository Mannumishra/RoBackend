const puppeteer = require('puppeteer');
const CustmorModel = require("../Model/CustmorModel");
const MyServiceModel = require("../Model/ServiceModel");

// Function to generate PDF invoice using Puppeteer
const generatePDF = async (saleData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch customer details
            const customer = await CustmorModel.findById(saleData.customer);
            // Fetch services details
            const services = await MyServiceModel.find({ _id: { $in: saleData.services } }).populate('serviceName');

            const htmlContent = `
            <!DOCTYPE html>
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
                        <p><strong>Terms and Conditions:</strong></p>
                        <p>Thank you for doing business with us.</p>
                    </div>

                    <div class="signature">
                        <p>For A S:</p>
                        <p>__________________________</p>
                        <p>Authorized Signatory</p>
                    </div>
                </div>
            </body>
            </html>`;

            // Launch puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // Set content to page
            await page.setContent(htmlContent, { waitUntil: 'load' });

            // Generate PDF buffer
            const pdfBuffer = await page.pdf({ format: 'A4' });

            // Close browser after PDF generation
            await browser.close();

            resolve(pdfBuffer);
        } catch (error) {
            reject(error);
        }
    });
};

// Utility function to convert numbers to words (for invoice amount)
const convertNumberToWords = (num) => {
    // Simplified conversion for demonstration
    return "Ten Rupees and Eight Paise";
};

module.exports = {
    generatePDF
};
