import React, { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle2, Loader2 } from "lucide-react";
import { useGetCompany, useUpdateCompany, getGetCompanyQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const FORMATS = [
  {
    id: "format1",
    name: "Classic Format",
    description: "Traditional Tally-style layout. Seller & buyer on left/right, full tax summary table.",
    preview: (
      <div style={{ fontFamily: 'serif', fontSize: '7px', border: '1px solid #555', padding: '4px', background: '#fff', color: '#000', height: '120px', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', fontWeight: 700, borderBottom: '1px solid #555', marginBottom: '3px', fontSize: '8px' }}>TAX INVOICE</div>
        <div style={{ display: 'flex', borderBottom: '1px solid #555', marginBottom: '2px' }}>
          <div style={{ flex: 1, borderRight: '1px solid #555', paddingRight: '3px' }}>
            <div style={{ fontWeight: 700 }}>Seller Name</div>
            <div>Address line</div>
            <div>GSTIN: 27XXXXX</div>
          </div>
          <div style={{ flex: 1, paddingLeft: '3px', fontSize: '6px' }}>
            <div>Invoice No. | INV-0001</div>
            <div>Date | 26-Jun-2026</div>
            <div>Payment | Cash</div>
          </div>
        </div>
        <div style={{ borderBottom: '1px solid #555', marginBottom: '2px', fontSize: '6px' }}>
          <div style={{ fontWeight: 600 }}>Billed to: Customer Name</div>
          <div>Gujarat | GSTIN: -</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '5.5px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ border: '1px solid #555', padding: '1px 2px' }}>S.No</th>
              <th style={{ border: '1px solid #555', padding: '1px 2px' }}>Description</th>
              <th style={{ border: '1px solid #555', padding: '1px 2px' }}>HSN</th>
              <th style={{ border: '1px solid #555', padding: '1px 2px' }}>Qty</th>
              <th style={{ border: '1px solid #555', padding: '1px 2px' }}>Rate</th>
              <th style={{ border: '1px solid #555', padding: '1px 2px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid #555', padding: '1px 2px' }}>Product A</td>
              <td style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'center' }}>8517</td>
              <td style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'right' }}>1</td>
              <td style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'right' }}>8,000</td>
              <td style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'right' }}>8,000</td>
            </tr>
            <tr style={{ fontWeight: 700 }}>
              <td colSpan={5} style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'right' }}>CGST</td>
              <td style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'right' }}>720</td>
            </tr>
            <tr style={{ fontWeight: 700 }}>
              <td colSpan={5} style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'right' }}>Total</td>
              <td style={{ border: '1px solid #555', padding: '1px 2px', textAlign: 'right' }}>₹9,440</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "format2",
    name: "Modern Format",
    description: "Clean modern layout with blue header, customer detail table, tax summary at bottom-right.",
    preview: (
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '7px', border: '1px solid #1a56db', padding: '4px', background: '#fff', color: '#000', height: '120px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #1a56db', paddingBottom: '3px', marginBottom: '3px' }}>
          <div style={{ width: '18px', height: '18px', background: '#1a56db', borderRadius: '3px', marginRight: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '9px' }}>B</div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#1a56db' }}>Business Name</div>
            <div style={{ fontSize: '5.5px', color: '#555' }}>Address, City - 400001</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #1a56db', padding: '1px 3px', fontSize: '5.5px', width: '33%' }}>GSTIN: 27XXXXX</td>
              <td style={{ border: '1px solid #1a56db', padding: '1px 3px', textAlign: 'center', fontWeight: 800, fontSize: '7px', color: '#1a56db', width: '34%' }}>TAX INVOICE</td>
              <td style={{ border: '1px solid #1a56db', padding: '1px 3px', textAlign: 'right', fontSize: '5px', width: '33%' }}>ORIGINAL FOR RECIPIENT</td>
            </tr>
          </tbody>
        </table>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #1a56db', padding: '2px', width: '60%', fontSize: '5.5px' }}>
                <div style={{ background: '#e8f0fe', fontWeight: 700, marginBottom: '1px', padding: '1px 2px' }}>Customer Detail</div>
                <div>Name: Customer Name</div>
                <div>Place: Gujarat (24)</div>
              </td>
              <td style={{ border: '1px solid #1a56db', padding: '2px', width: '40%', fontSize: '5.5px' }}>
                <div>Invoice No: INV-0001</div>
                <div>Date: 26-Jun-2026</div>
              </td>
            </tr>
          </tbody>
        </table>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '5px' }}>
          <thead>
            <tr style={{ background: '#e8f0fe' }}>
              <th style={{ border: '1px solid #1a56db', padding: '1px' }}>Sr</th>
              <th style={{ border: '1px solid #1a56db', padding: '1px' }}>Product</th>
              <th style={{ border: '1px solid #1a56db', padding: '1px' }}>Qty</th>
              <th style={{ border: '1px solid #1a56db', padding: '1px' }}>Rate</th>
              <th style={{ border: '1px solid #1a56db', padding: '1px' }}>Tax</th>
              <th style={{ border: '1px solid #1a56db', padding: '1px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #1a56db', padding: '1px', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid #1a56db', padding: '1px' }}>Product A</td>
              <td style={{ border: '1px solid #1a56db', padding: '1px', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid #1a56db', padding: '1px', textAlign: 'right' }}>8,000</td>
              <td style={{ border: '1px solid #1a56db', padding: '1px', textAlign: 'right' }}>720</td>
              <td style={{ border: '1px solid #1a56db', padding: '1px', textAlign: 'right', fontWeight: 700 }}>₹9,440</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: company } = useGetCompany();
  const updateCompany = useUpdateCompany();
  const [saving, setSaving] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const currentFormat = selectedFormat ?? (company?.invoice_format || 'format1');

  const handleSaveFormat = async (formatId: string) => {
    if (!company) return;
    setSaving(true);
    try {
      await updateCompany.mutateAsync({
        data: { ...company, invoice_format: formatId } as any,
      });
      await queryClient.invalidateQueries({ queryKey: getGetCompanyQueryKey() });
      setSelectedFormat(null);
      toast({ title: "Invoice format saved", description: `${FORMATS.find(f => f.id === formatId)?.name} is now active.` });
    } catch {
      toast({ title: "Failed to save format", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>

      {/* Invoice Format */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Invoice Format</CardTitle>
          <CardDescription>Choose the layout style for your printed invoices. Click a format to select it, then save.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMATS.map((fmt) => {
              const isActive = currentFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`relative rounded-lg border-2 p-3 text-left transition-all hover:shadow-md focus:outline-none ${isActive ? 'border-primary shadow-md' : 'border-muted hover:border-primary/40'}`}
                >
                  {isActive && (
                    <span className="absolute top-2 right-2 text-primary">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  )}
                  <div className="mb-2 rounded overflow-hidden border border-muted">
                    {fmt.preview}
                  </div>
                  <div className="font-semibold text-sm">{fmt.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{fmt.description}</div>
                </button>
              );
            })}
          </div>
          {selectedFormat && selectedFormat !== company?.invoice_format && (
            <div className="mt-4 flex gap-3 items-center">
              <Button onClick={() => handleSaveFormat(selectedFormat)} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Format
              </Button>
              <Button variant="ghost" onClick={() => setSelectedFormat(null)}>Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of BillEase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              data-testid="switch-dark-mode"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>About BillEase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold">Professional GST Invoice Generator</h4>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                BillEase is designed specifically for Indian small businesses. It provides full GST compliance, precise calculations, and professional invoice templates that you can print directly in A4 format.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Version: 1.0.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
