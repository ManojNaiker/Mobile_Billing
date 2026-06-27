import React from "react";
import { formatIndianCurrency } from "@/lib/indian-utils";
import { QRCodeSVG } from "qrcode.react";
import { BrandBadgeInline, BrandDealerBanner } from "@/lib/brand-icons";

interface Format3Props {
  invoice: any;
  company: any;
  isInterState: boolean;
  includeGst: boolean;
  qrData: string;
}

export function InvoicePreviewFormat3({ invoice, company, isInterState, includeGst, qrData }: Format3Props) {
  const taxTotal = invoice.cgst_total + invoice.sgst_total + invoice.igst_total;

  return (
    <div className="bg-white text-black print:m-0 print:shadow-none shadow-md overflow-hidden relative" style={{ minHeight: '297mm', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#111' }}>
      {/* Watermark */}
      {company.watermark_text && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ opacity: parseInt(company.watermark_opacity || "20") / 100, zIndex: 0 }}
        >
          <div
            style={{
              transform: 'rotate(-45deg)',
              fontSize: company.watermark_size === 'large' ? '8rem' : company.watermark_size === 'medium' ? '5rem' : '3rem',
              color: company.watermark_color || '#e2e8f0',
              fontFamily: company.watermark_font === 'monospace' ? 'monospace' : company.watermark_font === 'serif' ? 'serif' : 'sans-serif',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            {company.watermark_text}
          </div>
        </div>
      )}

      <div className="relative z-10" style={{ padding: '14mm 14mm 10mm 14mm' }}>
        {/* Top Header: Logo + Company name left | INVOICE title + number right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          {/* Left: Logo + Company */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {company.logo_url ? (
              <img src={company.logo_url} alt="Logo" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
            ) : null}
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{company.name}</div>
              {company.gstin && <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>GSTIN: {company.gstin}</div>}
              {company.phone && <div style={{ fontSize: '10px', color: '#555' }}>+ {company.phone}</div>}
            </div>
          </div>
          {/* Right: INVOICE label + number + date */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '2px', color: '#111' }}>
              {includeGst ? 'INVOICE' : 'INVOICE'}
            </div>
            <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>
              NO. {invoice.invoice_number}
            </div>
            <div style={{ fontSize: '10px', color: '#555' }}>
              DATE {new Date(invoice.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            {includeGst && (
              <div style={{ fontSize: '10px', color: '#555', marginTop: '2px', fontWeight: 600 }}>
                {isInterState ? 'IGST INVOICE' : 'CGST + SGST INVOICE'}
              </div>
            )}
          </div>
        </div>

        {/* Horizontal rule */}
        <div style={{ borderBottom: '2px solid #111', marginBottom: '12px' }} />

        {/* Two-column: Seller (left) | Billed To (right) */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', marginBottom: '4px' }}>From</div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>{company.name}</div>
            <div style={{ fontSize: '11px', color: '#444', whiteSpace: 'pre-wrap', marginTop: '2px' }}>{company.address}</div>
            {company.email && <div style={{ fontSize: '11px', color: '#444' }}>{company.email}</div>}
            {company.state_name && <div style={{ fontSize: '11px', color: '#444' }}>{company.state_name}{company.state_code ? ` (${company.state_code})` : ''}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', marginBottom: '4px' }}>Billed To</div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>{invoice.buyer_name}</div>
            <div style={{ fontSize: '11px', color: '#444', whiteSpace: 'pre-wrap', marginTop: '2px' }}>{invoice.buyer_address}</div>
            {invoice.buyer_phone && <div style={{ fontSize: '11px', color: '#444' }}>+ {invoice.buyer_phone}</div>}
            {invoice.buyer_gstin && <div style={{ fontSize: '11px', color: '#444' }}>GSTIN: {invoice.buyer_gstin}</div>}
            {invoice.buyer_state_name && <div style={{ fontSize: '11px', color: '#444' }}>{invoice.buyer_state_name}{invoice.buyer_state_code ? ` (${invoice.buyer_state_code})` : ''}</div>}
          </div>
        </div>

        {/* Brand Banner */}
        <BrandDealerBanner />

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
          <thead>
            <tr style={{ borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', background: '#f7f7f7' }}>
              <th style={{ padding: '7px 8px', textAlign: 'left', fontWeight: 700, fontSize: '11px', width: '5%' }}>S.No</th>
              <th style={{ padding: '7px 8px', textAlign: 'left', fontWeight: 700, fontSize: '11px', width: '35%' }}>Description</th>
              <th style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 700, fontSize: '11px', width: '8%' }}>HSN</th>
              <th style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 700, fontSize: '11px', width: '8%' }}>Qty</th>
              <th style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', width: '12%' }}>Price</th>
              {includeGst && !isInterState && (
                <>
                  <th style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', width: '8%' }}>CGST</th>
                  <th style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', width: '8%' }}>SGST</th>
                </>
              )}
              {includeGst && isInterState && (
                <th style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', width: '10%' }}>IGST</th>
              )}
              <th style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', width: '12%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '7px 8px', textAlign: 'left', verticalAlign: 'top', color: '#555' }}>{i + 1}</td>
                <td style={{ padding: '7px 8px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600 }}>
                    <BrandBadgeInline description={item.description} />
                    {item.description}
                  </div>
                  {item.notes && <div style={{ fontSize: '10px', color: '#666', marginTop: '1px' }}>{item.notes}</div>}
                  {item.discountPercent > 0 && <div style={{ fontSize: '10px', color: '#888' }}>Disc: {item.discountPercent}%</div>}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', verticalAlign: 'top', color: '#555' }}>{item.hsnSac || '-'}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center', verticalAlign: 'top' }}>{item.quantity} <span style={{ fontSize: '10px', color: '#777' }}>{item.unit}</span></td>
                <td style={{ padding: '7px 8px', textAlign: 'right', verticalAlign: 'top' }}>{formatIndianCurrency(item.rate).replace('₹', '')}</td>
                {includeGst && !isInterState && (
                  <>
                    <td style={{ padding: '7px 8px', textAlign: 'right', verticalAlign: 'top', fontSize: '11px' }}>
                      {formatIndianCurrency(item.cgstAmount || 0).replace('₹', '')}
                      <div style={{ fontSize: '9px', color: '#888' }}>{item.cgstPercent || 0}%</div>
                    </td>
                    <td style={{ padding: '7px 8px', textAlign: 'right', verticalAlign: 'top', fontSize: '11px' }}>
                      {formatIndianCurrency(item.sgstAmount || 0).replace('₹', '')}
                      <div style={{ fontSize: '9px', color: '#888' }}>{item.sgstPercent || 0}%</div>
                    </td>
                  </>
                )}
                {includeGst && isInterState && (
                  <td style={{ padding: '7px 8px', textAlign: 'right', verticalAlign: 'top', fontSize: '11px' }}>
                    {formatIndianCurrency(item.igstAmount || 0).replace('₹', '')}
                    <div style={{ fontSize: '9px', color: '#888' }}>{item.igstPercent || 0}%</div>
                  </td>
                )}
                <td style={{ padding: '7px 8px', textAlign: 'right', verticalAlign: 'top', fontWeight: 700 }}>
                  {formatIndianCurrency(item.total ?? item.rate * item.quantity).replace('₹', '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Divider */}
        <div style={{ borderBottom: '2px solid #111', marginBottom: '14px' }} />

        {/* Bottom section: Payment Method + Bank + QR (left) | Summary (right) */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left */}
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', marginBottom: '4px' }}>Payment Method</div>
            <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px' }}>{invoice.payment_mode}</div>

            {(company.bank_name || company.account_number) && (
              <>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#777', marginBottom: '4px', marginTop: '6px' }}>Bank Details</div>
                <table style={{ borderCollapse: 'collapse', fontSize: '11px' }}>
                  <tbody>
                    {company.bank_name && <tr><td style={{ paddingRight: '10px', color: '#666' }}>Bank</td><td style={{ fontWeight: 600 }}>{company.bank_name}</td></tr>}
                    {company.branch_name && <tr><td style={{ paddingRight: '10px', color: '#666' }}>Branch</td><td style={{ fontWeight: 600 }}>{company.branch_name}</td></tr>}
                    {company.account_number && <tr><td style={{ paddingRight: '10px', color: '#666' }}>Account No.</td><td style={{ fontWeight: 600 }}>{company.account_number}</td></tr>}
                    {company.ifsc_code && <tr><td style={{ paddingRight: '10px', color: '#666' }}>IFSC</td><td style={{ fontWeight: 600 }}>{company.ifsc_code}</td></tr>}
                  </tbody>
                </table>
              </>
            )}

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '4px', background: '#fff', border: '1px solid #ddd', display: 'inline-block' }}>
                <QRCodeSVG value={qrData} size={90} level="M" />
              </div>
              <div style={{ fontSize: '9px', color: '#888', fontStyle: 'italic' }}>Scan to verify<br />invoice details</div>
            </div>
          </div>

          {/* Right: Summary */}
          <div style={{ width: '200px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '5px 0', color: '#555' }}>Subtotal</td>
                  <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatIndianCurrency(invoice.subtotal).replace('₹', '')}</td>
                </tr>
                {invoice.discount_amount > 0 && (
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '5px 0', color: '#555' }}>Discount</td>
                    <td style={{ padding: '5px 0', textAlign: 'right', color: '#e53e3e' }}>{formatIndianCurrency(invoice.discount_amount).replace('₹', '')}</td>
                  </tr>
                )}
                {includeGst && invoice.taxable_value !== invoice.subtotal && (
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '5px 0', color: '#555' }}>Taxable Value</td>
                    <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatIndianCurrency(invoice.taxable_value).replace('₹', '')}</td>
                  </tr>
                )}
                {includeGst && !isInterState && (
                  <>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '5px 0', color: '#555' }}>CGST</td>
                      <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatIndianCurrency(invoice.cgst_total).replace('₹', '')}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '5px 0', color: '#555' }}>SGST</td>
                      <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatIndianCurrency(invoice.sgst_total).replace('₹', '')}</td>
                    </tr>
                  </>
                )}
                {includeGst && isInterState && (
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '5px 0', color: '#555' }}>IGST</td>
                    <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatIndianCurrency(invoice.igst_total).replace('₹', '')}</td>
                  </tr>
                )}
                {includeGst && (
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '5px 0', color: '#555' }}>Tax ({(invoice.cgst_total + invoice.sgst_total + invoice.igst_total) > 0 ? '' : '0'})</td>
                    <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatIndianCurrency(taxTotal).replace('₹', '')}</td>
                  </tr>
                )}
                <tr style={{ borderTop: '2px solid #111' }}>
                  <td style={{ padding: '7px 0', fontWeight: 800, fontSize: '13px' }}>TOTAL</td>
                  <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 800, fontSize: '13px' }}>{formatIndianCurrency(invoice.grand_total)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic', marginTop: '4px' }}>{invoice.amount_in_words}</div>
          </div>
        </div>

        {/* Signature + Declaration row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          <div style={{ fontSize: '10px', color: '#555', maxWidth: '55%', whiteSpace: 'pre-wrap' }}>
            {company.declaration_text || 'Subject to local jurisdiction.\nGoods once sold will not be taken back.'}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '20px', fontSize: '10px', color: '#888', fontStyle: 'italic' }}>Signature</div>
            <div style={{ borderTop: '1px solid #333', paddingTop: '4px', minWidth: '120px' }}>
              <div style={{ fontWeight: 700, fontSize: '11px' }}>{company.authorized_signatory || company.name}</div>
              <div style={{ fontSize: '10px', color: '#666' }}>Authorised Signatory</div>
            </div>
          </div>
        </div>

        {company.email && (
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#888', marginTop: '6px', fontStyle: 'italic' }}>
            {company.email}
          </div>
        )}
        <div style={{ textAlign: 'center', fontSize: '9px', color: '#aaa', marginTop: '4px' }}>
          This is a computer generated invoice
        </div>
      </div>
    </div>
  );
}
