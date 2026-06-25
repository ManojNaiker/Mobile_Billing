export function calculateInvoiceItem(
  rate: number,
  quantity: number,
  discountPercent: number,
  taxPercent: number,
  isInterState: boolean
) {
  const amount = rate * quantity;
  const taxableValue = amount * (1 - discountPercent / 100);
  
  let cgstPercent = 0;
  let cgstAmount = 0;
  let sgstPercent = 0;
  let sgstAmount = 0;
  let igstPercent = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstPercent = taxPercent;
    igstAmount = taxableValue * (taxPercent / 100);
  } else {
    cgstPercent = taxPercent / 2;
    cgstAmount = taxableValue * (cgstPercent / 100);
    sgstPercent = taxPercent / 2;
    sgstAmount = taxableValue * (sgstPercent / 100);
  }

  const total = taxableValue + cgstAmount + sgstAmount + igstAmount;

  return {
    amount: Number(amount.toFixed(2)),
    taxableValue: Number(taxableValue.toFixed(2)),
    cgstPercent,
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstPercent,
    sgstAmount: Number(sgstAmount.toFixed(2)),
    igstPercent,
    igstAmount: Number(igstAmount.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

export function calculateInvoiceTotals(items: any[]) {
  return items.reduce((acc, item) => {
    // If items haven't been calculated yet, fall back to safe defaults
    const amount = item.amount || (item.rate * item.quantity) || 0;
    const taxableValue = item.taxableValue || (amount * (1 - (item.discountPercent || 0) / 100)) || 0;
    
    return {
      subtotal: acc.subtotal + amount,
      discount_amount: acc.discount_amount + (amount - taxableValue),
      taxable_value: acc.taxable_value + taxableValue,
      cgst_total: acc.cgst_total + (item.cgstAmount || 0),
      sgst_total: acc.sgst_total + (item.sgstAmount || 0),
      igst_total: acc.igst_total + (item.igstAmount || 0),
      grand_total: acc.grand_total + (item.total || 0),
    };
  }, {
    subtotal: 0,
    discount_amount: 0,
    taxable_value: 0,
    cgst_total: 0,
    sgst_total: 0,
    igst_total: 0,
    grand_total: 0
  });
}
