import React, { useEffect, useRef } from "react";
import { INDIAN_STATES } from "@/lib/indian-utils";
import { useGetCompany, useUpdateCompany, getGetCompanyQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { StateCombobox } from "@/components/state-combobox";
import { Save } from "lucide-react";

const companySchema = z.object({
  name: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").or(z.literal("")).optional(),
  state_code: z.string().optional(),
  state_name: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  ifsc_code: z.string().optional(),
  branch_name: z.string().optional(),
  invoice_prefix: z.string().optional(),
  declaration_text: z.string().optional(),
  authorized_signatory: z.string().optional(),
  watermark_text: z.string().optional(),
  watermark_font: z.string().optional(),
  watermark_color: z.string().optional(),
  watermark_size: z.string().optional(),
  watermark_opacity: z.string().optional(),
  smtp_host: z.string().optional(),
  smtp_port: z.string().optional(),
  smtp_user: z.string().optional(),
  smtp_pass: z.string().optional(),
  smtp_from_name: z.string().optional(),
  smtp_secure: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function Company() {
  const { data: company, isLoading } = useGetCompany();
  const updateCompany = useUpdateCompany();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "",
      gstin: "",
      state_code: "",
      state_name: "",
      email: "",
      phone: "",
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      branch_name: "",
      invoice_prefix: "INV-",
      declaration_text: "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
      authorized_signatory: "",
      watermark_text: "",
      watermark_font: "sans-serif",
      watermark_color: "#e2e8f0",
      watermark_size: "large",
      watermark_opacity: "20",
      smtp_host: "",
      smtp_port: "",
      smtp_user: "",
      smtp_pass: "",
      smtp_from_name: "",
      smtp_secure: "false",
    },
  });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (company && !initializedRef.current) {
      initializedRef.current = true;
      form.reset({
        name: company.name || "",
        address: company.address || "",
        gstin: company.gstin || "",
        state_code: company.state_code || "",
        state_name: company.state_name || "",
        email: company.email || "",
        phone: company.phone || "",
        bank_name: company.bank_name || "",
        account_number: company.account_number || "",
        ifsc_code: company.ifsc_code || "",
        branch_name: company.branch_name || "",
        invoice_prefix: company.invoice_prefix || "INV-",
        declaration_text: company.declaration_text || "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
        authorized_signatory: company.authorized_signatory || "",
        watermark_text: company.watermark_text || "",
        watermark_font: company.watermark_font || "sans-serif",
        watermark_color: company.watermark_color || "#e2e8f0",
        watermark_size: company.watermark_size || "large",
        watermark_opacity: company.watermark_opacity || "20",
        smtp_host: company.smtp_host || "",
        smtp_port: company.smtp_port || "",
        smtp_user: company.smtp_user || "",
        smtp_pass: (company as any).smtp_pass || "",
        smtp_from_name: company.smtp_from_name || "",
        smtp_secure: company.smtp_secure || "false",
      });
    }
  }, [company, form]);

  const onSubmit = (data: CompanyFormValues) => {
    if (data.state_code) {
      const state = INDIAN_STATES.find(s => s.code === data.state_code);
      if (state) data.state_name = state.name;
    }

    updateCompany.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCompanyQueryKey() });
        toast({ title: "Company settings updated" });
      },
      onError: () => {
        toast({ title: "Failed to update settings", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Company Profile</h2>
        <p className="text-muted-foreground">Manage your business details and invoice settings.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="business" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger value="business">Business Details</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
              <TabsTrigger value="invoice">Invoice Settings</TabsTrigger>
              <TabsTrigger value="watermark">Watermark</TabsTrigger>
              <TabsTrigger value="email">Email / SMTP</TabsTrigger>
            </TabsList>

            <Card className="shadow-sm">
              <TabsContent value="business" className="m-0 border-0 p-0">
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                  <CardDescription>This information will appear on your invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gstin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>GSTIN</FormLabel>
                        <FormControl><Input placeholder="29ABCDE1234F1Z5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complete Address *</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="state_code" render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <StateCombobox
                          value={field.value || ""}
                          onSelect={(code, name) => {
                            field.onChange(code);
                            form.setValue("state_name", name);
                          }}
                          placeholder="Type state name..."
                        />
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="bank" className="m-0 border-0 p-0">
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Printed on invoices to facilitate direct bank transfers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="bank_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="account_number" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="ifsc_code" render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="branch_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="invoice" className="m-0 border-0 p-0">
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="invoice_prefix" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number Prefix</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormDescription>E.g. INV-2024-</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="authorized_signatory" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authorized Signatory Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="declaration_text" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Declaration Text</FormLabel>
                      <FormControl><Textarea rows={3} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </TabsContent>

              <TabsContent value="watermark" className="m-0 border-0 p-0">
                <CardHeader>
                  <CardTitle>Watermark Settings</CardTitle>
                  <CardDescription>Add a diagonal watermark to your printed invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="watermark_text" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Watermark Text</FormLabel>
                      <FormControl><Input placeholder="e.g. DRAFT or CONFIDENTIAL" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="watermark_color" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color (Hex)</FormLabel>
                        <FormControl><Input type="color" className="h-10 px-1" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="watermark_size" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="watermark_font" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Font</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="sans-serif">Sans Serif</SelectItem>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="monospace">Monospace</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="watermark_opacity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opacity (%) : {field.value}</FormLabel>
                      <FormControl>
                        <Slider 
                          min={5} max={100} step={5} 
                          value={[parseInt(field.value || "20")]} 
                          onValueChange={(vals) => field.onChange(vals[0].toString())} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </TabsContent>

              <TabsContent value="email" className="m-0 border-0 p-0">
                <CardHeader>
                  <CardTitle>Email Settings (SMTP)</CardTitle>
                  <CardDescription>Configure SMTP to send invoices directly to clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="smtp_host" render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl><Input placeholder="smtp.gmail.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="smtp_port" render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl><Input placeholder="587" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="smtp_user" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username / Email</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="smtp_pass" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password / App Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="smtp_from_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Name</FormLabel>
                        <FormControl><Input placeholder="Company Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="smtp_secure" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Use Secure Connection (TLS/SSL)</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value === "true"} onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")} />
                      </FormControl>
                    </FormItem>
                  )} />
                </CardContent>
              </TabsContent>
              
              <CardFooter className="bg-muted/30 pt-6 rounded-b-xl border-t">
                <div className="flex justify-end w-full">
                  <Button type="submit" disabled={updateCompany.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {updateCompany.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}