import React, { useEffect } from "react";
import { useGetInvoice, useGetCompany } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { formatIndianCurrency, numberToWordsIndian } from "@/lib/indian-utils";
import { Button } from "@/components/ui/button";
import { Printer, Edit2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { QRCodeSVG } from "qrcode.react";

export default function InvoicePreview() {
  const { id } = useParams();
  
  const { data: invoice, isLoading: loadingInvoice } = useGetInvoice(Number(id), { 
    query: { enabled: !!id, queryKey: ['invoice', id] } 
  });
  
  const { data: company, isLoading: loadingCompany } = useGetCompany();

  // Determine if it's interstate
  const isInterState = company?.state_code && invoice?.buyer_state_code 
    ? company.state_code !== invoice.buyer_state_code 
    : false;

  const handlePrint = () => {
    window.print();
  };

  if (loadingInvoice || loadingCompany) {
    return <div className="p-8 space-y-4 max-w-4xl mx-auto"><Skeleton className="h-12 w-48" /><Skeleton className="h-[800px] w-full" /></div>;
  }

  if (!invoice || !company) return <div className="p-8 text-center">Invoice not found.</div>;

  // Group tax summary by HSN/Tax %
  const taxSummary = invoice.items.reduce((acc: any, item: any) => {
    const key = `${item.hsnSac || 'N/A'}-${item.taxPercent}`;
    if (!acc[key]) {
      acc[key] = {
        hsnSac: item.hsnSac || 'N/A',
        taxableValue: 0,
        cgstPercent: item.cgstPercent,
        cgstAmount: 0,
        sgstPercent: item.sgstPercent,
        sgstAmount: 0,
        igstPercent: item.igstPercent,
        igstAmount: 0,
        taxPercent: item.taxPercent
      };
    }
    acc[key].taxableValue += (item.taxableValue || 0);
    acc[key].cgstAmount += (item.cgstAmount || 0);
    acc[key].sgstAmount += (item.sgstAmount || 0);
    acc[key].igstAmount += (item.igstAmount || 0);
    return acc;
  }, {});

  const taxSummaryList = Object.values(taxSummary);

  const qrData = `Inv:${invoice.invoice_number}|Dt:${invoice.invoice_date}|To:${invoice.buyer_name}|Total:${invoice.grand_total}`;

  return (
    <div className="max-w-[210mm] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center no-print">
        <Link href="/history">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/billing/${invoice.id}/edit`}>
            <Button variant="secondary"><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
          </Link>
          <Button onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print Invoice</Button>
        </div>
      </div>

      <div className="bg-white text-black print:m-0 print:shadow-none shadow-md overflow-hidden relative" style={{ minHeight: '297mm', padding: '10mm', fontFamily: 'var(--font-serif)' }}>
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

        <div className="relative z-10" style={{ border: '1px solid black' }}>
          {/* Header */}
          <div className="text-center font-bold text-xl border-b border-black py-2 tracking-widest">
            TAX INVOICE
          </div>

          <div className="flex border-b border-black">
            {/* Left Col - Seller */}
            <div className="w-1/2 p-3 border-r border-black">
              <h2 className="font-bold text-lg">{company.name}</h2>
              <div className="text-sm whitespace-pre-wrap mt-1">{company.address}</div>
              {company.phone && <div className="text-sm mt-1">Ph: {company.phone}</div>}
              {company.email && <div className="text-sm">Email: {company.email}</div>}
              <div className="text-sm mt-2"><span className="font-semibold">GSTIN/UIN:</span> {company.gstin}</div>
              <div className="text-sm"><span className="font-semibold">State Name:</span> {company.state_name}, Code: {company.state_code}</div>
            </div>

            {/* Right Col - Invoice Details */}
            <div className="w-1/2 flex flex-col">
              <div className="flex border-b border-black flex-1">
                <div className="w-1/2 p-2 border-r border-black">
                  <div className="text-xs font-semibold">Invoice No.</div>
                  <div className="font-bold">{invoice.invoice_number}</div>
                </div>
                <div className="w-1/2 p-2">
                  <div className="text-xs font-semibold">Dated</div>
                  <div className="font-bold">{new Date(invoice.invoice_date).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
              <div className="flex border-b border-black flex-1">
                <div className="w-1/2 p-2 border-r border-black">
                  <div className="text-xs font-semibold">Delivery Note</div>
                  <div>{invoice.delivery_note || '-'}</div>
                </div>
                <div className="w-1/2 p-2">
                  <div className="text-xs font-semibold">Mode/Terms of Payment</div>
                  <div>{invoice.payment_mode} {invoice.payment_terms ? `/ ${invoice.payment_terms}` : ''}</div>
                </div>
              </div>
              <div className="flex border-b border-black flex-1">
                <div className="w-1/2 p-2 border-r border-black">
                  <div className="text-xs font-semibold">Buyer's Order No.</div>
                  <div>{invoice.buyer_order_number || '-'}</div>
                </div>
                <div className="w-1/2 p-2">
                  <div className="text-xs font-semibold">Order Date</div>
                  <div>{invoice.order_date ? new Date(invoice.order_date).toLocaleDateString('en-IN') : '-'}</div>
                </div>
              </div>
              <div className="flex flex-1">
                <div className="w-1/2 p-2 border-r border-black">
                  <div className="text-xs font-semibold">Dispatch Doc No.</div>
                  <div>{invoice.dispatch_doc_number || '-'}</div>
                </div>
                <div className="w-1/2 p-2">
                  <div className="text-xs font-semibold">Dispatched through</div>
                  <div>{invoice.dispatched_through || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="flex border-b border-black">
            <div className="w-1/2 p-3 border-r border-black">
              <div className="text-xs font-semibold italic mb-1">Billed to:</div>
              <h3 className="font-bold">{invoice.buyer_name}</h3>
              <div className="text-sm whitespace-pre-wrap mt-1">{invoice.buyer_address}</div>
              {invoice.buyer_phone && <div className="text-sm mt-1">Ph: {invoice.buyer_phone}</div>}
              {invoice.buyer_gstin && <div className="text-sm mt-2"><span className="font-semibold">GSTIN/UIN:</span> {invoice.buyer_gstin}</div>}
              <div className="text-sm"><span className="font-semibold">State Name:</span> {invoice.buyer_state_name}, Code: {invoice.buyer_state_code}</div>
            </div>
            <div className="w-1/2 p-3">
              <div className="text-xs font-semibold italic mb-1">Shipped to (Destination):</div>
              <div className="text-sm">{invoice.destination || 'Same as Billing Address'}</div>
              {invoice.e_way_bill_number && (
                <div className="text-sm mt-2"><span className="font-semibold">E-Way Bill No:</span> {invoice.e_way_bill_number}</div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm">
            <thead className="border-b border-black">
              <tr>
                <th className="border-r border-black p-1">S.No</th>
                <th className="border-r border-black p-1 text-left">Description of Goods</th>
                <th className="border-r border-black p-1">HSN/SAC</th>
                <th className="border-r border-black p-1 text-right">Quantity</th>
                <th className="border-r border-black p-1 text-right">Rate</th>
                <th className="border-r border-black p-1 text-right">per</th>
                <th className="border-r border-black p-1 text-right">Disc. %</th>
                <th className="p-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody style={{ minHeight: '150px' }}>
              {invoice.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="border-r border-black p-1 text-center align-top">{i + 1}</td>
                  <td className="border-r border-black p-1 align-top font-medium">
                    {item.description}
                  </td>
                  <td className="border-r border-black p-1 text-center align-top">{item.hsnSac}</td>
                  <td className="border-r border-black p-1 text-right align-top">{item.quantity}</td>
                  <td className="border-r border-black p-1 text-right align-top">{formatIndianCurrency(item.rate).replace('₹', '')}</td>
                  <td className="border-r border-black p-1 text-right align-top text-xs">{item.unit}</td>
                  <td className="border-r border-black p-1 text-right align-top">{item.discountPercent > 0 ? item.discountPercent : '-'}</td>
                  <td className="p-1 text-right align-top">{formatIndianCurrency(item.taxableValue).replace('₹', '')}</td>
                </tr>
              ))}
              {/* Padding row */}
              <tr>
                <td className="border-r border-black p-1 py-8"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="p-1"></td>
              </tr>
              {/* Sub Totals */}
              {!isInterState ? (
                <>
                  <tr className="font-semibold">
                    <td className="border-r border-black p-1" colSpan={7} style={{ textAlign: 'right' }}>CGST</td>
                    <td className="p-1 text-right">{formatIndianCurrency(invoice.cgst_total).replace('₹', '')}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="border-r border-black p-1" colSpan={7} style={{ textAlign: 'right' }}>SGST</td>
                    <td className="p-1 text-right">{formatIndianCurrency(invoice.sgst_total).replace('₹', '')}</td>
                  </tr>
                </>
              ) : (
                <tr className="font-semibold">
                  <td className="border-r border-black p-1" colSpan={7} style={{ textAlign: 'right' }}>IGST</td>
                  <td className="p-1 text-right">{formatIndianCurrency(invoice.igst_total).replace('₹', '')}</td>
                </tr>
              )}
              {/* Grand Total */}
              <tr className="border-t border-black font-bold">
                <td className="border-r border-black p-1" colSpan={7} style={{ textAlign: 'right' }}>Total</td>
                <td className="p-1 text-right">{formatIndianCurrency(invoice.grand_total)}</td>
              </tr>
            </tbody>
          </table>

          {/* Amount in words */}
          <div className="border-t border-black p-2 text-sm">
            <span className="italic">Amount Chargeable (in words)</span><br />
            <span className="font-bold">{invoice.amount_in_words}</span>
          </div>

          {/* Tax Summary Table */}
          <div className="border-t border-black border-b border-black">
            <table className="w-full text-xs">
              <thead className="border-b border-black">
                <tr>
                  <th className="border-r border-black p-1" rowSpan={2}>HSN/SAC</th>
                  <th className="border-r border-black p-1" rowSpan={2}>Taxable Value</th>
                  {!isInterState ? (
                    <>
                      <th className="border-r border-black p-1" colSpan={2}>Central Tax</th>
                      <th className="border-r border-black p-1" colSpan={2}>State Tax</th>
                    </>
                  ) : (
                    <th className="border-r border-black p-1" colSpan={2}>Integrated Tax</th>
                  )}
                  <th className="p-1" rowSpan={2}>Total Tax Amount</th>
                </tr>
                <tr>
                  {!isInterState ? (
                    <>
                      <th className="border-r border-black border-t border-black p-1">Rate</th>
                      <th className="border-r border-black border-t border-black p-1">Amount</th>
                      <th className="border-r border-black border-t border-black p-1">Rate</th>
                      <th className="border-r border-black border-t border-black p-1">Amount</th>
                    </>
                  ) : (
                    <>
                      <th className="border-r border-black border-t border-black p-1">Rate</th>
                      <th className="border-r border-black border-t border-black p-1">Amount</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {taxSummaryList.map((ts: any, i: number) => (
                  <tr key={i}>
                    <td className="border-r border-black p-1 text-center">{ts.hsnSac}</td>
                    <td className="border-r border-black p-1 text-right">{formatIndianCurrency(ts.taxableValue).replace('₹', '')}</td>
                    {!isInterState ? (
                      <>
                        <td className="border-r border-black p-1 text-center">{ts.cgstPercent}%</td>
                        <td className="border-r border-black p-1 text-right">{formatIndianCurrency(ts.cgstAmount).replace('₹', '')}</td>
                        <td className="border-r border-black p-1 text-center">{ts.sgstPercent}%</td>
                        <td className="border-r border-black p-1 text-right">{formatIndianCurrency(ts.sgstAmount).replace('₹', '')}</td>
                      </>
                    ) : (
                      <>
                        <td className="border-r border-black p-1 text-center">{ts.igstPercent}%</td>
                        <td className="border-r border-black p-1 text-right">{formatIndianCurrency(ts.igstAmount).replace('₹', '')}</td>
                      </>
                    )}
                    <td className="p-1 text-right font-medium">
                      {formatIndianCurrency(ts.cgstAmount + ts.sgstAmount + ts.igstAmount).replace('₹', '')}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-black font-bold">
                  <td className="border-r border-black p-1 text-right">Total</td>
                  <td className="border-r border-black p-1 text-right">{formatIndianCurrency(invoice.taxable_value).replace('₹', '')}</td>
                  {!isInterState ? (
                    <>
                      <td className="border-r border-black p-1"></td>
                      <td className="border-r border-black p-1 text-right">{formatIndianCurrency(invoice.cgst_total).replace('₹', '')}</td>
                      <td className="border-r border-black p-1"></td>
                      <td className="border-r border-black p-1 text-right">{formatIndianCurrency(invoice.sgst_total).replace('₹', '')}</td>
                    </>
                  ) : (
                    <>
                      <td className="border-r border-black p-1"></td>
                      <td className="border-r border-black p-1 text-right">{formatIndianCurrency(invoice.igst_total).replace('₹', '')}</td>
                    </>
                  )}
                  <td className="p-1 text-right">{formatIndianCurrency(invoice.cgst_total + invoice.sgst_total + invoice.igst_total).replace('₹', '')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex">
            {/* Left Bank details and QR */}
            <div className="w-1/2 p-2 border-r border-black text-sm flex flex-col justify-between">
              <div>
                <div className="underline font-semibold mb-1">Bank Details</div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Bank Name:</div>
                  <div className="col-span-2 font-medium">{company.bank_name || '-'}</div>
                  <div className="text-muted-foreground">A/c No:</div>
                  <div className="col-span-2 font-medium">{company.account_number || '-'}</div>
                  <div className="text-muted-foreground">Branch & IFSC:</div>
                  <div className="col-span-2 font-medium">{company.branch_name || ''} {company.ifsc_code ? `(${company.ifsc_code})` : ''}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <div className="p-1 bg-white inline-block border border-gray-200">
                  <QRCodeSVG value={qrData} size={64} level="L" />
                </div>
                <div className="text-xs text-gray-500 italic">Scan to verify<br/>invoice details</div>
              </div>
            </div>

            {/* Right Declaration and Signatory */}
            <div className="w-1/2 flex flex-col">
              <div className="p-2 border-b border-black flex-1 text-xs">
                <div className="underline font-semibold mb-1">Declaration:</div>
                <div>{company.declaration_text}</div>
              </div>
              <div className="p-2 h-32 relative text-sm">
                <div className="text-right font-bold">for {company.name}</div>
                <div className="absolute bottom-2 right-2 text-right">
                  <div className="text-xs mb-1">Authorised Signatory</div>
                  <div className="font-semibold">{company.authorized_signatory}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs mt-2 italic text-gray-500">
          This is a computer generated invoice
        </div>
      </div>
    </div>
  );
}