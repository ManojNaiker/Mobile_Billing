import React from "react";
import { formatIndianCurrency } from "@/lib/indian-utils";
import { QRCodeSVG } from "qrcode.react";
import { BrandBadgeInline, BrandDealerBanner } from "@/lib/brand-icons";

interface Format2Props {
  invoice: any;
  company: any;
  isInterState: boolean;
  includeGst: boolean;
  qrData: string;
}

export function InvoicePreviewFormat2({ invoice, company, isInterState, includeGst, qrData }: Format2Props) {
  const taxTotal = invoice.cgst_total + invoice.sgst_total + invoice.igst_total;

  return (
    <div className="bg-white text-black print:m-0 print:shadow-none shadow-md overflow-hidden relative" style={{ minHeight: '297mm', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
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

      <div className="relative z-10" style={{ padding: '8mm 8mm 6mm 8mm' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', borderBottom: '2px solid #1a56db', paddingBottom: '8px' }}>
          {/* Logo */}
          {company.logo_url ? (
            <img src={company.logo_url} alt="Logo" style={{ width: '64px', height: '64px', objectFit: 'contain', marginRight: '12px' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', background: '#1a56db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
              {(company.name || 'B').charAt(0)}
            </div>
          )}
          {/* Company name + address */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a56db', lineHeight: 1.1 }}>{company.name}</div>
            <div style={{ fontSize: '11px', color: '#444', marginTop: '2px', whiteSpace: 'pre-wrap' }}>{company.address}</div>
            {company.phone && <div style={{ fontSize: '11px', color: '#444' }}>Ph: {company.phone}</div>}
          </div>
        </div>

        {/* GSTIN + Title row */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1a56db', marginBottom: '0' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 8px', border: '1px solid #1a56db', width: '33%' }}>
                {company.gstin && <><span style={{ fontWeight: 700 }}>GSTIN : </span>{company.gstin}</>}
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #1a56db', textAlign: 'center', fontWeight: 800, fontSize: '15px', width: '34%', color: '#1a56db', letterSpacing: '1px' }}>
                {includeGst ? 'TAX INVOICE' : 'INVOICE'}
              </td>
              <td style={{ padding: '4px 8px', border: '1px solid #1a56db', textAlign: 'right', width: '33%', fontWeight: 600, fontSize: '11px' }}>
                ORIGINAL FOR RECIPIENT
              </td>
            </tr>
          </tbody>
        </table>

        {/* Customer detail + Invoice info */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1a56db' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #1a56db', width: '60%', verticalAlign: 'top', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <td colSpan={2} style={{ background: '#e8f0fe', fontWeight: 700, padding: '3px 8px', borderBottom: '1px solid #1a56db', fontSize: '11px' }}>Customer Detail</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '2px 8px', fontWeight: 600, width: '30%', borderBottom: '1px solid #e5e7eb' }}>Name</td>
                      <td style={{ padding: '2px 8px', borderBottom: '1px solid #e5e7eb' }}>{invoice.buyer_name}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 8px', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Address</td>
                      <td style={{ padding: '2px 8px', borderBottom: '1px solid #e5e7eb', whiteSpace: 'pre-wrap' }}>{invoice.buyer_address || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 8px', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>PHONE</td>
                      <td style={{ padding: '2px 8px', borderBottom: '1px solid #e5e7eb' }}>{invoice.buyer_phone || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 8px', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>GSTIN</td>
                      <td style={{ padding: '2px 8px', borderBottom: '1px solid #e5e7eb' }}>{invoice.buyer_gstin || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 8px', fontWeight: 600 }}>Place of Supply</td>
                      <td style={{ padding: '2px 8px' }}>{invoice.buyer_state_name || '-'} {invoice.buyer_state_code ? `( ${invoice.buyer_state_code} )` : ''}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style={{ border: '1px solid #1a56db', width: '40%', verticalAlign: 'top', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '3px 8px', fontWeight: 600, borderBottom: '1px solid #e5e7eb', width: '45%', background: '#e8f0fe', borderRight: '1px solid #1a56db' }}>Invoice No.</td>
                      <td style={{ padding: '3px 8px', borderBottom: '1px solid #e5e7eb', fontWeight: 700 }}>{invoice.invoice_number}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 8px', fontWeight: 600, background: '#e8f0fe', borderRight: '1px solid #1a56db' }}>Invoice Date</td>
                      <td style={{ padding: '3px 8px', fontWeight: 700 }}>{new Date(invoice.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    </tr>
                    {invoice.e_way_bill_number && (
                      <tr>
                        <td style={{ padding: '3px 8px', fontWeight: 600, background: '#e8f0fe', borderRight: '1px solid #1a56db', borderTop: '1px solid #e5e7eb' }}>E-Way Bill</td>
                        <td style={{ padding: '3px 8px', borderTop: '1px solid #e5e7eb' }}>{invoice.e_way_bill_number}</td>
                      </tr>
                    )}
                    {invoice.payment_mode && (
                      <tr>
                        <td style={{ padding: '3px 8px', fontWeight: 600, background: '#e8f0fe', borderRight: '1px solid #1a56db', borderTop: '1px solid #e5e7eb' }}>Payment</td>
                        <td style={{ padding: '3px 8px', borderTop: '1px solid #e5e7eb' }}>{invoice.payment_mode}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Brand Banner */}
        <div style={{ border: '1px solid #1a56db', borderTop: 'none', borderBottom: 'none' }}>
          <BrandDealerBanner />
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1a56db', marginTop: '0', borderTop: 'none' }}>
          <thead>
            <tr style={{ background: '#e8f0fe' }}>
              <th style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'center', width: '4%' }}>Sr. No.</th>
              <th style={{ border: '1px solid #1a56db', padding: '4px 6px', textAlign: 'left', width: '30%' }}>Name of Product / Service</th>
              <th style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'center', width: '8%' }}>HSN / SAC</th>
              <th style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'center', width: '6%' }}>Qty</th>
              <th style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'right', width: '10%' }}>Rate</th>
              <th style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'right', width: '12%' }}>Taxable Value</th>
              {includeGst && (
                <>
                  {!isInterState ? (
                    <>
                      <th colSpan={2} style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'center', width: '12%' }}>CGST</th>
                      <th colSpan={2} style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'center', width: '12%' }}>SGST</th>
                    </>
                  ) : (
                    <th colSpan={2} style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'center', width: '12%' }}>IGST</th>
                  )}
                </>
              )}
              <th style={{ border: '1px solid #1a56db', padding: '4px 4px', textAlign: 'right', width: '12%' }}>Total</th>
            </tr>
            {includeGst && (
              <tr style={{ background: '#f0f4ff' }}>
                <th style={{ border: '1px solid #1a56db', padding: '2px' }}></th>
                <th style={{ border: '1px solid #1a56db', padding: '2px' }}></th>
                <th style={{ border: '1px solid #1a56db', padding: '2px' }}></th>
                <th style={{ border: '1px solid #1a56db', padding: '2px' }}></th>
                <th style={{ border: '1px solid #1a56db', padding: '2px' }}></th>
                <th style={{ border: '1px solid #1a56db', padding: '2px' }}></th>
                {!isInterState ? (
                  <>
                    <th style={{ border: '1px solid #1a56db', padding: '2px 3px', textAlign: 'center', fontSize: '10px' }}>%</th>
                    <th style={{ border: '1px solid #1a56db', padding: '2px 3px', textAlign: 'center', fontSize: '10px' }}>Amount</th>
                    <th style={{ border: '1px solid #1a56db', padding: '2px 3px', textAlign: 'center', fontSize: '10px' }}>%</th>
                    <th style={{ border: '1px solid #1a56db', padding: '2px 3px', textAlign: 'center', fontSize: '10px' }}>Amount</th>
                  </>
                ) : (
                  <>
                    <th style={{ border: '1px solid #1a56db', padding: '2px 3px', textAlign: 'center', fontSize: '10px' }}>%</th>
                    <th style={{ border: '1px solid #1a56db', padding: '2px 3px', textAlign: 'center', fontSize: '10px' }}>Amount</th>
                  </>
                )}
                <th style={{ border: '1px solid #1a56db', padding: '2px' }}></th>
              </tr>
            )}
          </thead>
          <tbody>
            {invoice.items.map((item: any, i: number) => (
              <tr key={i}>
                <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{i + 1}</td>
                <td style={{ border: '1px solid #1a56db', padding: '4px 6px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600 }}>
                    <BrandBadgeInline description={item.description} />
                    {item.description}
                  </div>
                  {item.notes && <div style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>{item.notes}</div>}
                </td>
                <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.hsnSac || '-'}</td>
                <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.quantity} {item.unit || 'NOS'}</td>
                <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>{formatIndianCurrency(item.rate).replace('₹', '')}</td>
                <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>{formatIndianCurrency(item.taxableValue ?? item.rate * item.quantity).replace('₹', '')}</td>
                {includeGst && (
                  !isInterState ? (
                    <>
                      <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.cgstPercent}%</td>
                      <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>{formatIndianCurrency(item.cgstAmount).replace('₹', '')}</td>
                      <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.sgstPercent}%</td>
                      <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>{formatIndianCurrency(item.sgstAmount).replace('₹', '')}</td>
                    </>
                  ) : (
                    <>
                      <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.igstPercent}%</td>
                      <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>{formatIndianCurrency(item.igstAmount).replace('₹', '')}</td>
                    </>
                  )
                )}
                <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right', verticalAlign: 'top', fontWeight: 600 }}>{formatIndianCurrency(item.total ?? item.rate * item.quantity).replace('₹', '')}</td>
              </tr>
            ))}
            {/* Blank padding rows */}
            {Array.from({ length: Math.max(0, 4 - invoice.items.length) }).map((_, i) => (
              <tr key={`pad-${i}`}>
                <td style={{ border: '1px solid #1a56db', padding: '4px', height: '26px' }}></td>
                <td style={{ border: '1px solid #1a56db' }}></td>
                <td style={{ border: '1px solid #1a56db' }}></td>
                <td style={{ border: '1px solid #1a56db' }}></td>
                <td style={{ border: '1px solid #1a56db' }}></td>
                <td style={{ border: '1px solid #1a56db' }}></td>
                {includeGst && (!isInterState ? <><td style={{ border: '1px solid #1a56db' }}></td><td style={{ border: '1px solid #1a56db' }}></td><td style={{ border: '1px solid #1a56db' }}></td><td style={{ border: '1px solid #1a56db' }}></td></> : <><td style={{ border: '1px solid #1a56db' }}></td><td style={{ border: '1px solid #1a56db' }}></td></>)}
                <td style={{ border: '1px solid #1a56db' }}></td>
              </tr>
            ))}
            {/* Total row */}
            <tr style={{ fontWeight: 700, background: '#e8f0fe' }}>
              <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right' }} colSpan={3}>Total</td>
              <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'center' }}>{invoice.items.reduce((s: number, it: any) => s + it.quantity, 0)}</td>
              <td style={{ border: '1px solid #1a56db', padding: '4px' }}></td>
              <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.taxable_value).replace('₹', '')}</td>
              {includeGst && (
                !isInterState ? (
                  <>
                    <td style={{ border: '1px solid #1a56db', padding: '4px' }}></td>
                    <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.cgst_total).replace('₹', '')}</td>
                    <td style={{ border: '1px solid #1a56db', padding: '4px' }}></td>
                    <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.sgst_total).replace('₹', '')}</td>
                  </>
                ) : (
                  <>
                    <td style={{ border: '1px solid #1a56db', padding: '4px' }}></td>
                    <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.igst_total).replace('₹', '')}</td>
                  </>
                )
              )}
              <td style={{ border: '1px solid #1a56db', padding: '4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.grand_total).replace('₹', '')}</td>
            </tr>
          </tbody>
        </table>

        {/* Bottom section: Amount in words + Bank + QR (left) | Tax summary (right) */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1a56db', borderTop: 'none' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #1a56db', padding: '6px 8px', verticalAlign: 'top', width: '60%' }}>
                <div style={{ fontWeight: 700, marginBottom: '2px', borderBottom: '1px solid #e5e7eb', paddingBottom: '3px' }}>Total in words</div>
                <div style={{ fontStyle: 'italic', fontSize: '11px', marginBottom: '8px' }}>{invoice.amount_in_words}</div>

                {/* Bank Details */}
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Bank Details</div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <table style={{ borderCollapse: 'collapse', fontSize: '11px' }}>
                      <tbody>
                        {company.bank_name && <tr><td style={{ paddingRight: '8px', fontWeight: 600 }}>Name</td><td>{company.bank_name}</td></tr>}
                        {company.branch_name && <tr><td style={{ paddingRight: '8px', fontWeight: 600 }}>Branch</td><td>{company.branch_name}</td></tr>}
                        {company.account_number && <tr><td style={{ paddingRight: '8px', fontWeight: 600 }}>Acc. Number</td><td>{company.account_number}</td></tr>}
                        {company.ifsc_code && <tr><td style={{ paddingRight: '8px', fontWeight: 600 }}>IFSC</td><td>{company.ifsc_code}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ padding: '4px', background: '#fff', border: '1px solid #ccc', display: 'inline-block' }}>
                      <QRCodeSVG value={qrData} size={64} level="L" />
                    </div>
                    <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>Scan to verify<br />invoice details</div>
                  </div>
                </div>
              </td>
              <td style={{ border: '1px solid #1a56db', padding: '6px 8px', verticalAlign: 'top', width: '40%' }}>
                {/* Tax summary */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '3px 4px', fontWeight: 600 }}>Taxable Amount</td>
                      <td style={{ padding: '3px 4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.taxable_value).replace('₹', '')}</td>
                    </tr>
                    {includeGst && !isInterState && (
                      <>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '3px 4px', fontWeight: 600 }}>Add : CGST</td>
                          <td style={{ padding: '3px 4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.cgst_total).replace('₹', '')}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '3px 4px', fontWeight: 600 }}>Add : SGST</td>
                          <td style={{ padding: '3px 4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.sgst_total).replace('₹', '')}</td>
                        </tr>
                      </>
                    )}
                    {includeGst && isInterState && (
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '3px 4px', fontWeight: 600 }}>Add : IGST</td>
                        <td style={{ padding: '3px 4px', textAlign: 'right' }}>{formatIndianCurrency(invoice.igst_total).replace('₹', '')}</td>
                      </tr>
                    )}
                    {includeGst && (
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '3px 4px', fontWeight: 600 }}>Total Tax</td>
                        <td style={{ padding: '3px 4px', textAlign: 'right' }}>{formatIndianCurrency(taxTotal).replace('₹', '')}</td>
                      </tr>
                    )}
                    <tr style={{ borderTop: '2px solid #1a56db', background: '#e8f0fe' }}>
                      <td style={{ padding: '4px', fontWeight: 700 }}>Total Amount After Tax</td>
                      <td style={{ padding: '4px', textAlign: 'right', fontWeight: 700, fontSize: '13px' }}>{formatIndianCurrency(invoice.grand_total)}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '8px', fontSize: '10px', color: '#555', fontStyle: 'italic', borderTop: '1px solid #e5e7eb', paddingTop: '4px' }}>
                  (E &amp; O.E.)
                </div>
                <div style={{ marginTop: '4px', fontSize: '10px', color: '#555' }}>
                  Certified that the particulars given above are true and correct.
                </div>
                <div style={{ fontWeight: 700, marginTop: '4px' }}>For {company.name}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Terms + Signatory */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1a56db', borderTop: 'none' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #1a56db', padding: '6px 8px', verticalAlign: 'top', width: '60%' }}>
                <div style={{ fontWeight: 700, borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '4px', textAlign: 'center' }}>Terms and Conditions</div>
                <div style={{ fontSize: '11px', whiteSpace: 'pre-wrap', color: '#444' }}>{company.declaration_text || 'Subject to local jurisdiction.\nGoods once sold will not be taken back.'}</div>
              </td>
              <td style={{ border: '1px solid #1a56db', padding: '6px 8px', verticalAlign: 'bottom', width: '40%', height: '80px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{company.authorized_signatory || ''}</div>
                  <div style={{ fontSize: '11px' }}>Authorised Signatory</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: 'center', fontSize: '10px', color: '#888', marginTop: '6px', fontStyle: 'italic' }}>
          This is a computer generated invoice
        </div>
      </div>
    </div>
  );
}
