import React from "react";
import { useGetDashboardSummary, useGetMonthlyRevenue, useGetRecentInvoices } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIndianCurrency } from "@/lib/indian-utils";
import { FileText, IndianRupee, PieChart, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statCards = [
  {
    label: "Total Invoices",
    icon: FileText,
    key: "total_invoices" as const,
    format: (v: number) => String(v),
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-white/20",
    textColor: "text-white",
  },
  {
    label: "Monthly Revenue",
    icon: IndianRupee,
    key: "monthly_revenue" as const,
    format: formatIndianCurrency,
    gradient: "from-amber-400 to-orange-500",
    iconBg: "bg-white/20",
    textColor: "text-white",
  },
  {
    label: "Tax Collected",
    icon: PieChart,
    key: "tax_collected" as const,
    format: formatIndianCurrency,
    gradient: "from-emerald-400 to-teal-500",
    iconBg: "bg-white/20",
    textColor: "text-white",
  },
  {
    label: "Avg Invoice Value",
    icon: TrendingUp,
    key: "avg_invoice_value" as const,
    format: formatIndianCurrency,
    gradient: "from-sky-400 to-blue-600",
    iconBg: "bg-white/20",
    textColor: "text-white",
  },
];

const BAR_COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#818cf8",
  "#7c3aed", "#4f46e5", "#6d28d9", "#5b21b6",
  "#4338ca", "#3730a3", "#312e81", "#1e1b4b",
];

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: monthlyRevenue, isLoading: loadingRevenue } = useGetMonthlyRevenue();
  const { data: recentInvoices, isLoading: loadingInvoices } = useGetRecentInvoices();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your business metrics.</p>
        </div>
        <Link href="/billing/new">
          <Button
            className="font-semibold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            data-testid="btn-new-invoice"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-5 shadow-lg relative overflow-hidden`}
          >
            {/* Decorative circle */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">{card.label}</p>
                <div className="mt-2">
                  {loadingSummary ? (
                    <div className="h-8 w-24 bg-white/30 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-white">
                      {card.format((summary as any)?.[card.key] || 0)}
                    </p>
                  )}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="md:col-span-4 lg:col-span-4 shadow-sm border-0 overflow-hidden">
          <CardHeader className="pb-2" style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)" }}>
            <CardTitle className="text-white">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            {loadingRevenue ? (
              <Skeleton className="w-full h-[300px]" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue || []}>
                    <XAxis
                      dataKey="month"
                      stroke="#a0aec0"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#a0aec0"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatIndianCurrency(value), "Revenue"]}
                      cursor={{ fill: "rgba(99,102,241,0.08)" }}
                      contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {(monthlyRevenue || []).map((_: unknown, index: number) => (
                        <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="md:col-span-3 lg:col-span-3 shadow-sm border-0 overflow-hidden">
          <CardHeader
            className="flex flex-row items-center justify-between pb-3"
            style={{ background: "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)" }}
          >
            <CardTitle className="text-white">Recent Invoices</CardTitle>
            <Link href="/history">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-white hover:bg-white/20"
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loadingInvoices ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Invoice No</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="text-right font-semibold">Amount</TableHead>
                      <TableHead className="text-center font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvoices?.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-violet-50/50 transition-colors">
                        <TableCell className="font-medium">
                          <Link
                            href={`/billing/${invoice.id}/preview`}
                            className="text-violet-600 hover:text-violet-800 hover:underline font-semibold"
                          >
                            {invoice.invoice_number}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[120px] truncate" title={invoice.buyer_name}>
                          {invoice.buyer_name}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatIndianCurrency(invoice.grand_total)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              invoice.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                                : invoice.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200 font-semibold"
                                : invoice.status === "cancelled"
                                ? "bg-red-50 text-red-700 border-red-200 font-semibold"
                                : "bg-slate-50 text-slate-600 border-slate-200 font-semibold"
                            }
                          >
                            {invoice.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!recentInvoices || recentInvoices.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          No recent invoices found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
