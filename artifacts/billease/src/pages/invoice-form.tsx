import React, { useEffect, useState } from "react";
import { 
  useGetInvoice, 
  useGetNextInvoiceNumber, 
  useCreateInvoice, 
  useUpdateInvoice, 
  useListCustomers, 
  useListProducts,
  useGetCompany
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { calculateInvoiceItem, calculateInvoiceTotals } from "@/lib/invoice-utils";
import { numberToWordsIndian, formatIndianCurrency, INDIAN_STATES } from "@/lib/indian-utils";
import { Trash2, Plus, Save, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  invoice_date: z.string().min(1, "Invoice date is required"),
  buyer_name: z.string().min(1, "Buyer name is required"),
  buyer_address: z.string().min(1, "Buyer address is required"),
  buyer_gstin: z.string().optional().nullable(),
  buyer_phone: z.string().optional().nullable(),
  buyer_state_name: z.string().optional().nullable(),
  buyer_state_code: z.string().optional().nullable(),
  payment_terms: z.string().optional().nullable(),
  delivery_note: z.string().optional().nullable(),
  supplier_ref: z.string().optional().nullable(),
  e_way_bill_number: z.string().optional().nullable(),
  buyer_order_number: z.string().optional().nullable(),
  order_date: z.string().optional().nullable(),
  dispatch_doc_number: z.string().optional().nullable(),
  delivery_note_date: z.string().optional().nullable(),
  dispatched_through: z.string().optional().nullable(),
  destination: z.string().optional().nullable(),
  terms_of_delivery: z.string().optional().nullable(),
  payment_mode: z.string().min(1, "Payment mode is required"),
  status: z.string().min(1, "Status is required"),
  is_inter_state: z.boolean(),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    hsnSac: z.string().optional(),
    unit: z.string().min(1, "Unit is required"),
    quantity: z.coerce.number().min(1, "Qty must be > 0"),
    rate: z.coerce.number().min(0, "Rate must be >= 0"),
    discountPercent: z.coerce.number().min(0).max(100),
    taxPercent: z.coerce.number().min(0),
    amount: z.number().optional(),
    taxableValue: z.number().optional(),
    cgstPercent: z.number().optional(),
    cgstAmount: z.number().optional(),
    sgstPercent: z.number().optional(),
    sgstAmount: z.number().optional(),
    igstPercent: z.number().optional(),
    igstAmount: z.number().optional(),
    total: z.number().optional(),
  })).min(1, "At least one item is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function InvoiceForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const isEdit = !!id && id !== "new";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAdditional, setShowAdditional] = useState(false);

  const { data: invoice, isLoading: loadingInvoice } = useGetInvoice(Number(id), { 
    query: { enabled: isEdit, queryKey: ['invoice', id] } 
  });
  
  const { data: nextInv } = useGetNextInvoiceNumber({
    query: { enabled: !isEdit, queryKey: ['next-invoice-number'] }
  });
  
  const { data: company } = useGetCompany();
  const { data: customers } = useListCustomers();
  const { data: products } = useListProducts();

  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: "",
      invoice_date: new Date().toISOString().split('T')[0],
      buyer_name: "",
      buyer_address: "",
      buyer_gstin: "",
      buyer_phone: "",
      buyer_state_name: "",
      buyer_state_code: "",
      payment_terms: "",
      delivery_note: "",
      supplier_ref: "",
      e_way_bill_number: "",
      buyer_order_number: "",
      order_date: "",
      dispatch_doc_number: "",
      delivery_note_date: "",
      dispatched_through: "",
      destination: "",
      terms_of_delivery: "",
      payment_mode: "Bank Transfer",
      status: "draft",
      is_inter_state: false,
      items: [{
        description: "", hsnSac: "", unit: "PCS", quantity: 1, rate: 0, discountPercent: 0, taxPercent: 18
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const watchItems = form.watch("items");
  const watchIsInterState = form.watch("is_inter_state");

  // Initial load
  useEffect(() => {
    if (isEdit && invoice) {
      const isInter = company?.state_code && invoice.buyer_state_code && company.state_code !== invoice.buyer_state_code;
      
      form.reset({
        ...invoice,
        invoice_date: new Date(invoice.invoice_date).toISOString().split('T')[0],
        order_date: invoice.order_date ? new Date(invoice.order_date).toISOString().split('T')[0] : "",
        delivery_note_date: invoice.delivery_note_date ? new Date(invoice.delivery_note_date).toISOString().split('T')[0] : "",
        is_inter_state: isInter || false,
        items: invoice.items as any,
      });
    } else if (!isEdit && nextInv && company) {
      form.setValue("invoice_number", nextInv.invoice_number);
    }
  }, [isEdit, invoice, nextInv, company, form]);

  const handleCustomerSelect = (customerId: string) => {
    const cust = customers?.find(c => c.id.toString() === customerId);
    if (cust) {
      form.setValue("buyer_name", cust.name);
      form.setValue("buyer_address", cust.address);
      form.setValue("buyer_gstin", cust.gstin || "");
      form.setValue("buyer_phone", cust.phone || "");
      form.setValue("buyer_state_name", cust.state_name || "");
      form.setValue("buyer_state_code", cust.state_code || "");
      
      // Auto set inter-state
      if (company?.state_code && cust.state_code) {
        form.setValue("is_inter_state", company.state_code !== cust.state_code);
      }
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const prod = products?.find(p => p.id.toString() === productId);
    if (prod) {
      form.setValue(`items.${index}.description`, prod.name);
      form.setValue(`items.${index}.hsnSac`, prod.hsn_sac || "");
      form.setValue(`items.${index}.unit`, prod.unit);
      form.setValue(`items.${index}.rate`, prod.rate);
      form.setValue(`items.${index}.taxPercent`, prod.tax_percent);
    }
  };

  const totals = calculateInvoiceTotals(watchItems.map(item => {
    const calc = calculateInvoiceItem(
      item.rate || 0,
      item.quantity || 1,
      item.discountPercent || 0,
      item.taxPercent || 0,
      watchIsInterState
    );
    return { ...item, ...calc };
  }));

  const handleSave = (data: InvoiceFormValues, preview: boolean) => {
    // Process items
    const processedItems = data.items.map(item => {
      const calc = calculateInvoiceItem(
        item.rate,
        item.quantity,
        item.discountPercent,
        item.taxPercent,
        data.is_inter_state
      );
      return { ...item, ...calc };
    });

    const finalData = {
      ...data,
      subtotal: totals.subtotal,
      discount_amount: totals.discount_amount,
      taxable_value: totals.taxable_value,
      cgst_total: totals.cgst_total,
      sgst_total: totals.sgst_total,
      igst_total: totals.igst_total,
      grand_total: totals.grand_total,
      amount_in_words: numberToWordsIndian(totals.grand_total),
      items: processedItems,
    };
    
    // remove purely frontend fields
    const payload = { ...finalData };
    delete (payload as any).is_inter_state;

    if (isEdit) {
      updateInvoice.mutate({ id: Number(id), data: payload as any }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['invoices'] });
          toast({ title: "Invoice updated successfully" });
          if (preview) setLocation(`/billing/${id}/preview`);
          else setLocation("/history");
        },
        onError: () => toast({ title: "Failed to update invoice", variant: "destructive" })
      });
    } else {
      createInvoice.mutate({ data: payload as any }, {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ['invoices'] });
          toast({ title: "Invoice created successfully" });
          if (preview) setLocation(`/billing/${res.id}/preview`);
          else setLocation("/history");
        },
        onError: () => toast({ title: "Failed to create invoice", variant: "destructive" })
      });
    }
  };

  if (isEdit && loadingInvoice) {
    return <div className="p-8 space-y-4"><Skeleton className="h-12 w-64" /><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{isEdit ? `Edit Invoice: ${form.getValues('invoice_number')}` : 'New Invoice'}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation('/history')}>Cancel</Button>
          <Button 
            variant="secondary" 
            onClick={form.handleSubmit((d) => handleSave(d, false))}
            disabled={createInvoice.isPending || updateInvoice.isPending}
          >
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button 
            onClick={form.handleSubmit((d) => handleSave(d, true))}
            disabled={createInvoice.isPending || updateInvoice.isPending}
          >
            <Eye className="w-4 h-4 mr-2" /> Save & Preview
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4"><CardTitle className="text-lg">Invoice Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="invoice_number" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number *</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="invoice_date" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Date *</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="payment_mode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="is_inter_state" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
                    <div className="space-y-0.5">
                      <FormLabel>GST Mode</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value ? "Inter-state (IGST)" : "Intra-state (CGST + SGST)"}
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Billed To</CardTitle>
                  <Select onValueChange={handleCustomerSelect}>
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="buyer_name" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Customer Name *" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="buyer_address" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Address *" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="buyer_gstin" render={({ field }) => (
                    <FormItem>
                      <FormControl><Input placeholder="GSTIN" {...field} value={field.value || ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="buyer_phone" render={({ field }) => (
                    <FormItem>
                      <FormControl><Input placeholder="Phone" {...field} value={field.value || ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="buyer_state_code" render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={(v) => {
                        field.onChange(v);
                        const st = INDIAN_STATES.find(s => s.code === v);
                        if(st) form.setValue('buyer_state_name', st.name);
                      }} value={field.value || ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder="State" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state.code} value={state.code}>{state.code} - {state.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[30%]">Product / Description</TableHead>
                      <TableHead className="w-[10%]">HSN</TableHead>
                      <TableHead className="w-[10%] text-right">Qty</TableHead>
                      <TableHead className="w-[15%] text-right">Rate</TableHead>
                      <TableHead className="w-[10%] text-right">Disc %</TableHead>
                      <TableHead className="w-[10%] text-right">Tax %</TableHead>
                      <TableHead className="w-[10%] text-right">Amount</TableHead>
                      <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const item = watchItems[index];
                      const calc = calculateInvoiceItem(
                        item.rate || 0, item.quantity || 1, item.discountPercent || 0, item.taxPercent || 0, watchIsInterState
                      );
                      
                      return (
                        <TableRow key={field.id} className="group">
                          <TableCell className="p-2 align-top">
                            <div className="flex gap-2">
                              <Select onValueChange={(v) => handleProductSelect(index, v)}>
                                <SelectTrigger className="w-8 h-9 px-0 justify-center"><ChevronDown className="h-4 w-4" /></SelectTrigger>
                                <SelectContent>
                                  {products?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (
                                <FormItem className="flex-1 space-y-0"><FormControl><Input className="h-9" placeholder="Description" {...field} /></FormControl></FormItem>
                              )} />
                            </div>
                          </TableCell>
                          <TableCell className="p-2 align-top">
                            <FormField control={form.control} name={`items.${index}.hsnSac`} render={({ field }) => (
                              <FormItem className="space-y-0"><FormControl><Input className="h-9" placeholder="HSN" {...field} /></FormControl></FormItem>
                            )} />
                          </TableCell>
                          <TableCell className="p-2 align-top">
                            <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                              <FormItem className="space-y-0"><FormControl><Input className="h-9 text-right" type="number" step="0.01" {...field} /></FormControl></FormItem>
                            )} />
                          </TableCell>
                          <TableCell className="p-2 align-top">
                            <FormField control={form.control} name={`items.${index}.rate`} render={({ field }) => (
                              <FormItem className="space-y-0"><FormControl><Input className="h-9 text-right" type="number" step="0.01" {...field} /></FormControl></FormItem>
                            )} />
                          </TableCell>
                          <TableCell className="p-2 align-top">
                            <FormField control={form.control} name={`items.${index}.discountPercent`} render={({ field }) => (
                              <FormItem className="space-y-0"><FormControl><Input className="h-9 text-right" type="number" step="0.1" {...field} /></FormControl></FormItem>
                            )} />
                          </TableCell>
                          <TableCell className="p-2 align-top">
                            <FormField control={form.control} name={`items.${index}.taxPercent`} render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value.toString()}>
                                    <SelectTrigger className="h-9 text-right"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {["0", "5", "12", "18", "28"].map(t => <SelectItem key={t} value={t}>{t}%</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )} />
                          </TableCell>
                          <TableCell className="p-2 align-middle text-right font-medium">
                            {formatIndianCurrency(calc.total)}
                          </TableCell>
                          <TableCell className="p-2 align-middle">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1} className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", hsnSac: "", unit: "PCS", quantity: 1, rate: 0, discountPercent: 0, taxPercent: 18 })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <Collapsible open={showAdditional} onOpenChange={setShowAdditional} className="border rounded-lg p-4 bg-card">
                <CollapsibleTrigger className="flex justify-between items-center w-full font-medium">
                  Additional Details (Transport, e-Way bill...)
                  {showAdditional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="buyer_order_number" render={({ field }) => (
                      <FormItem><FormLabel>Order Number</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="order_date" render={({ field }) => (
                      <FormItem><FormLabel>Order Date</FormLabel><FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="e_way_bill_number" render={({ field }) => (
                      <FormItem><FormLabel>e-Way Bill No.</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="dispatch_doc_number" render={({ field }) => (
                      <FormItem><FormLabel>Dispatch Doc No.</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="dispatched_through" render={({ field }) => (
                      <FormItem><FormLabel>Dispatched Through</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="destination" render={({ field }) => (
                      <FormItem><FormLabel>Destination</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl></FormItem>
                    )} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="md:w-80 space-y-4">
              <Card className="shadow-sm">
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatIndianCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span>-{formatIndianCurrency(totals.discount_amount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-medium">Taxable Value:</span>
                    <span className="font-medium">{formatIndianCurrency(totals.taxable_value)}</span>
                  </div>
                  {!watchIsInterState ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CGST:</span>
                        <span>{formatIndianCurrency(totals.cgst_total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SGST:</span>
                        <span>{formatIndianCurrency(totals.sgst_total)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IGST:</span>
                      <span>{formatIndianCurrency(totals.igst_total)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 mt-2 text-lg font-bold text-primary">
                    <span>Total:</span>
                    <span>{formatIndianCurrency(totals.grand_total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}