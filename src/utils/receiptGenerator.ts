import { Order, OrderItem } from '../types/wine';

/**
 * Format currency in Philippine Peso (PHP / ₱)
 */
const formatPeso = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Generate a standalone, luxury-styled HTML receipt matching VÍNEA's signature aesthetic:
 * Midnight Bordeaux, Champagne Gold foil, Cormorant Garamond typography,
 * Davao cold-chain provenance seal, and Master Sommelier Kent Jorich Rabago certification.
 */
export const generateVineaReceiptHtml = (order: Order): string => {
  const trackingNumber = order.tracking_number || `VNX-DVO-${order.order_id}`;
  const orderDate = order.order_date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const subtotal = order.items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.12;

  const itemsHtml = order.items
    .map(
      (item: OrderItem, idx: number) => `
      <tr style="border-bottom: 1px solid rgba(72, 21, 31, 0.45);">
        <td style="padding: 14px 10px; vertical-align: middle; width: 44px; text-align: center; color: #D5B15C; font-family: monospace; font-size: 11px;">
          ${String(idx + 1).padStart(2, '0')}
        </td>
        <td style="padding: 14px 12px; vertical-align: middle;">
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 600; color: #FDFBF7; letter-spacing: 0.02em;">
            ${escapeHtml(item.name)}
          </div>
          <div style="font-size: 11px; color: #B7AAA1; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 2px;">
            Vintage Allocation · Climate Sealed
          </div>
        </td>
        <td style="padding: 14px 10px; vertical-align: middle; text-align: center; color: #FDFBF7; font-size: 13px; font-weight: 600;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 12px; vertical-align: middle; text-align: right; color: #E5D7B7; font-size: 13px; font-family: monospace;">
          ${formatPeso(item.price)}
        </td>
        <td style="padding: 14px 12px; vertical-align: middle; text-align: right; color: #FDFBF7; font-size: 13px; font-weight: 700; font-family: monospace;">
          ${formatPeso(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VÍNEA Official Cellar Receipt - Order #${escapeHtml(order.order_id)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #130B0D;
      color: #FDFBF7;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 30px 16px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .receipt-container {
      max-width: 640px;
      margin: 0 auto;
      background: #210D12;
      border: 1px solid #C6A15B;
      border-radius: 14px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
      position: relative;
      overflow: hidden;
    }
    .receipt-container::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #C6A15B 0%, #F5EFE7 50%, #C6A15B 100%);
    }
    .header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid rgba(72, 21, 31, 0.8);
      background: linear-gradient(180deg, rgba(72, 21, 31, 0.35) 0%, rgba(33, 13, 18, 0) 100%);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .brand-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 32px;
      letter-spacing: 0.15em;
      color: #FFFFFF;
      font-weight: 600;
      text-transform: uppercase;
      line-height: 1;
    }
    .brand-subtitle {
      font-size: 10px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #D5B15C;
      font-weight: 600;
      margin-top: 6px;
    }
    .brand-tagline {
      font-size: 11px;
      color: #B7AAA1;
      margin-top: 4px;
      font-style: italic;
    }
    .receipt-badge {
      background: rgba(19, 11, 13, 0.85);
      border: 1px solid #C6A15B;
      border-radius: 10px;
      padding: 10px 16px;
      text-align: right;
    }
    .receipt-badge-title {
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #D5B15C;
      font-weight: 700;
    }
    .receipt-badge-number {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 20px;
      color: #FFFFFF;
      font-weight: 700;
      margin-top: 2px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 18px;
      padding: 24px 36px;
      background: rgba(19, 11, 13, 0.45);
      border-bottom: 1px solid rgba(72, 21, 31, 0.7);
    }
    .detail-item {
      font-size: 12px;
    }
    .detail-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #B7AAA1;
      margin-bottom: 4px;
      display: block;
    }
    .detail-value {
      color: #FDFBF7;
      font-weight: 600;
      font-size: 13px;
    }
    .detail-value-gold {
      color: #D5B15C;
      font-weight: 600;
      font-family: monospace;
    }
    .table-container {
      padding: 24px 36px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #D5B15C;
      font-weight: 700;
      padding: 10px 12px;
      border-bottom: 1px solid #48151F;
    }
    .summary-section {
      padding: 20px 36px 28px;
      border-top: 1px solid #48151F;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 24px;
      background: rgba(19, 11, 13, 0.3);
    }
    .sommelier-endorsement {
      flex: 1;
      min-width: 250px;
      background: rgba(72, 21, 31, 0.2);
      border: 1px solid rgba(198, 161, 91, 0.25);
      border-radius: 12px;
      padding: 16px 20px;
    }
    .sommelier-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 16px;
      font-weight: 700;
      color: #E5D7B7;
    }
    .sommelier-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #B7AAA1;
      margin-top: 2px;
    }
    .sommelier-quote {
      font-size: 11px;
      color: #FDFBF7;
      font-style: italic;
      margin-top: 8px;
      line-height: 1.4;
    }
    .totals-box {
      width: 280px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 12px;
      color: #B7AAA1;
    }
    .total-row.grand {
      border-top: 1px solid #C6A15B;
      margin-top: 8px;
      padding-top: 12px;
      font-size: 18px;
      color: #FDFBF7;
      font-weight: 700;
    }
    .total-row.grand .amount {
      color: #D5B15C;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 22px;
    }
    .footer {
      padding: 20px 36px;
      background: #130B0D;
      border-top: 1px solid rgba(72, 21, 31, 0.8);
      text-align: center;
      font-size: 11px;
      color: #B7AAA1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .actions-bar {
      max-width: 780px;
      margin: 20px auto 0;
      display: flex;
      justify-content: center;
      gap: 14px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    .btn-gold {
      background: #C6A15B;
      color: #130B0D;
    }
    .btn-gold:hover {
      background: #D5B15C;
    }
    .btn-outline {
      background: transparent;
      color: #FDFBF7;
      border: 1px solid #48151F;
    }
    .btn-outline:hover {
      border-color: #C6A15B;
      color: #D5B15C;
    }
    @media print {
      body {
        background: #FFFFFF !important;
        color: #111111 !important;
        padding: 0 !important;
      }
      .actions-bar {
        display: none !important;
      }
      .receipt-container {
        border: 1px solid #CCCCCC !important;
        box-shadow: none !important;
        background: #FFFFFF !important;
        max-width: 100% !important;
      }
      .receipt-container::before {
        background: #861F32 !important;
      }
      .header {
        background: #F9F7F5 !important;
        border-bottom: 2px solid #861F32 !important;
      }
      .brand-title {
        color: #861F32 !important;
      }
      .brand-subtitle {
        color: #8B6B2B !important;
      }
      .brand-tagline, .detail-label, .sommelier-title, .total-row, .footer {
        color: #555555 !important;
      }
      .details-grid {
        background: #FAFAFA !important;
        border-bottom: 1px solid #E0E0E0 !important;
      }
      .detail-value, .receipt-badge-number, tr td div, .total-row.grand {
        color: #111111 !important;
      }
      .detail-value-gold, .total-row.grand .amount {
        color: #861F32 !important;
      }
      .receipt-badge {
        background: #FFFFFF !important;
        border-color: #8B6B2B !important;
      }
      .receipt-badge-title, th {
        color: #8B6B2B !important;
        border-bottom-color: #CCCCCC !important;
      }
      tr {
        border-bottom-color: #E8E8E8 !important;
      }
      .sommelier-endorsement {
        background: #F9F7F5 !important;
        border-color: #D5B15C !important;
      }
      .sommelier-name {
        color: #861F32 !important;
      }
      .sommelier-quote {
        color: #333333 !important;
      }
      .footer {
        background: #FFFFFF !important;
        border-top-color: #CCCCCC !important;
      }
    }
  </style>
</head>
<body>

  <div class="receipt-container">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-title">V Í N E A</div>
        <div class="brand-subtitle">Haute Sommellerie · Est. 2026</div>
        <div class="brand-tagline">Fine Vintage Allocations & Climate-Controlled Cellar Service</div>
      </div>
      <div class="receipt-badge">
        <div class="receipt-badge-title">Official Cellar Receipt</div>
        <div class="receipt-badge-number">#${escapeHtml(order.order_id)}</div>
      </div>
    </div>

    <!-- Allocation Metadata -->
    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-label">Order Date</span>
        <span class="detail-value">${escapeHtml(orderDate)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Cold-Chain Tracking</span>
        <span class="detail-value-gold">${escapeHtml(trackingNumber)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Payment Method</span>
        <span class="detail-value">${escapeHtml(order.payment_method)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Order Status</span>
        <span class="detail-value" style="color: #68D391;">${escapeHtml(order.status || 'Confirmed & Vault Allocated')}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Client Name</span>
        <span class="detail-value">${escapeHtml(order.customer_name)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Contact Email</span>
        <span class="detail-value">${escapeHtml(order.email)}</span>
      </div>
      <div class="detail-item" style="grid-column: span 2;">
        <span class="detail-label">Davao Delivery Destination</span>
        <span class="detail-value">
          ${escapeHtml(order.delivery_address.street)}, ${escapeHtml(order.delivery_address.city)}, ${escapeHtml(order.delivery_address.state)} ${escapeHtml(order.delivery_address.postalCode)}
        </span>
      </div>
    </div>

    <!-- Itemized Allocation Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 44px; text-align: center;">No.</th>
            <th>Vintage & Selection</th>
            <th style="text-align: center; width: 60px;">Qty</th>
            <th style="text-align: right; width: 110px;">Unit Price</th>
            <th style="text-align: right; width: 120px;">Allocation Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <!-- Summary & Sommelier Guarantee -->
    <div class="summary-section">
      <div class="sommelier-endorsement">
        <div class="sommelier-name">Kent Jorich Rabago</div>
        <div class="sommelier-title">Master Sommelier · Davao Cellar Master</div>
        <div class="sommelier-quote">
          "Every bottle in this allocation has undergone rigorous visual inspection, seal verification, and strict subterranean cold-chain temperature preservation at 12°C prior to release."
        </div>
      </div>

      <div class="totals-box">
        <div class="total-row">
          <span>Subtotal</span>
          <span style="font-family: monospace;">${formatPeso(subtotal)}</span>
        </div>
        <div class="total-row">
          <span>Cold-Chain Handling (Davao)</span>
          <span style="color: #68D391; font-weight: 600;">Complimentary</span>
        </div>
        <div class="total-row">
          <span>Estimated 12% VAT Included</span>
          <span style="font-family: monospace;">${formatPeso(vat)}</span>
        </div>
        <div class="total-row grand">
          <span>Total Paid</span>
          <span class="amount">${formatPeso(order.total_amount)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>
        <span>VÍNEA Flagship Cellar: J.P. Laurel Ave, Bajada, Davao City, 8000</span>
      </div>
      <div>
        <span>Davao Concierge: (082) 298-VINE · concierge@vinea.ph</span>
      </div>
    </div>
  </div>

  <!-- Print & Download Control Bar (hidden when printed) -->
  <div class="actions-bar">
    <button onclick="window.print()" class="btn btn-gold">
      Print / Save as PDF
    </button>
    <button onclick="window.close()" class="btn btn-outline">
      Close Window
    </button>
  </div>

</body>
</html>`;
};

/**
 * Escapes HTML characters to prevent XSS in generated receipt files.
 */
function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Triggers a direct browser download of the standalone VÍNEA receipt as an HTML file
 * styled with the exact luxury burgundy & gold design of the website.
 */
export const downloadVineaReceipt = (order: Order): void => {
  const htmlContent = generateVineaReceiptHtml(order);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `VINEA_Receipt_${order.order_id}.html`;
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
};

/**
 * Opens a print-ready window with the VÍNEA luxury receipt so users can print directly or save as PDF.
 */
export const printVineaReceipt = (order: Order): void => {
  const htmlContent = generateVineaReceiptHtml(order);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // If pop-up blocked, fall back to direct file download
    downloadVineaReceipt(order);
  }
};
