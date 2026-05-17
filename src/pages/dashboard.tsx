// DashboardPage.tsx
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { useAlert } from "@/services/alert";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit2,
  Trash2,
  BarChart2,
  ChevronDown,
  RefreshCw,
  Receipt,
  TrendingUp,
  Calculator,
  Trophy,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { spending_categories } from "@/lib/currency";

interface Receipt {
  id: number;
  store_name: string;
  total_amount: number;
  currency: string;
  category: string;
  receipt_date: string;
  payment_method: string;
  invoice_no: string;
}

interface AnalyticsData {
  summary: { total_receipts: number; total_spent: number; total_tax: number };
  categoryBreakdown: { category: string; count: number; amount: number }[];
}

const CAT_COLORS = [
  "#1D9E75",
  "#7F77DD",
  "#D85A30",
  "#378ADD",
  "#BA7517",
  "#D4537E",
  "#639922",
];

export default function DashboardPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isEmpty, setEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [isAnalyticsLoading, setAnalyticsLoading] = useState(false);
  const [rangeType, setRangeType] = useState<"month" | "custom">("month");
  const [monthPicker, setMonthPicker] = useState("2026-05");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const periodLabel =
    rangeType === "month"
      ? new Date(monthPicker + "-01").toLocaleString("en", {
          month: "long",
          year: "numeric",
        })
      : startDate && endDate
        ? `${startDate} → ${endDate}`
        : "Custom range";

  const onRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAuth("api/receipts/getReceipts");
      const results = (response as any)?.data || response;
      if (Array.isArray(results) && results.length > 0) {
        setReceipts(results);
        setEmpty(false);
      } else {
        setReceipts([]);
        setEmpty(true);
      }
    } catch (e) {
      console.error(e);
      setEmpty(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const params = new URLSearchParams();
      if (rangeType === "month") {
        const [year, month] = monthPicker.split("-");
        params.set("rangeType", "month");
        params.set("year", year);
        params.set("month", month);
      } else {
        params.set("rangeType", "custom");
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
      }
      if (categoryFilter) params.set("category", categoryFilter);
      const res = await api.getAuth(
        `/api/receipts/analytics/receipts-summary?${params}`,
      );
      setAnalytics((res as any)?.data || res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this receipt?"))
      return;
    try {
      await api.deleteAuth(`/api/receipts/delete/${id}`);
      showAlert("Receipt deleted successfully", "success");
      setReceipts((prev) => prev.filter((item) => item.id !== id));
      if (receipts.length - 1 === 0) setEmpty(true);
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete receipt", "error");
    }
  };

  useEffect(() => {
    onRefresh();
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">
          Loading records...
        </p>
      </div>
    );
  }

  const metrics = analytics
    ? [
        {
          icon: <Receipt className="size-4 text-muted-foreground mb-2" />,
          label: "Total spent",
          value: `MYR ${Number(analytics.summary.total_spent).toFixed(2)}`,
          sub: `${analytics.summary.total_receipts} receipt${analytics.summary.total_receipts !== 1 ? "s" : ""}`,
        },
        {
          icon: <TrendingUp className="size-4 text-muted-foreground mb-2" />,
          label: "Tax paid",
          value: `MYR ${Number(analytics.summary.total_tax).toFixed(2)}`,
          sub: `${((analytics.summary.total_tax / analytics.summary.total_spent) * 100).toFixed(1)}% of total`,
        },
        {
          icon: <Calculator className="size-4 text-muted-foreground mb-2" />,
          label: "Avg per receipt",
          value: `MYR ${(analytics.summary.total_spent / analytics.summary.total_receipts).toFixed(2)}`,
          sub: "this period",
        },
        {
          icon: <Trophy className="size-4 text-muted-foreground mb-2" />,
          label: "Top category",
          value: analytics.categoryBreakdown[0]?.category.toLowerCase() ?? "—",
          sub: `MYR ${Number(analytics.categoryBreakdown[0]?.amount ?? 0).toFixed(2)}`,
          capitalize: true,
        },
      ]
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {isEmpty ? (
        <div className="flex items-center justify-center p-4 min-h-[400px]">
          <Empty>{/* existing empty state */}</Empty>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Transactions
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your spending entries.
              </p>
            </div>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/add-receipt">
                <Plus className="size-3.5" /> Add record
              </Link>
            </Button>
          </div>

          {/* Analytics collapsible */}
          <div
            className={`border rounded-lg overflow-hidden transition-all ${analyticsOpen ? "border-border" : "border-border/60"}`}
          >
            <button
              className={`flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors ${analyticsOpen ? "border-b" : ""}`}
              onClick={() => {
                const next = !analyticsOpen;
                setAnalyticsOpen(next);
                if (next && !analytics) fetchAnalytics();
              }}
            >
              <BarChart2 className="size-4 text-muted-foreground" />
              <span className="flex-1 text-left">Analytics overview</span>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40 mr-1">
                {periodLabel}
              </span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${analyticsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {analyticsOpen && (
              <div className="p-4 space-y-4">
                {/* Filter bar */}
                <div className="flex flex-wrap items-end gap-2.5 bg-muted/40 rounded-md p-3 border border-border/40">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      Range
                    </label>
                    <select
                      className="h-8 rounded-md border border-border bg-background text-sm px-2.5 text-foreground"
                      value={rangeType}
                      onChange={(e) =>
                        setRangeType(e.target.value as "month" | "custom")
                      }
                    >
                      <option value="month">Month</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {rangeType === "month" ? (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        Month
                      </label>
                      <input
                        type="month"
                        className="h-8 rounded-md border border-border bg-background text-sm px-2.5 text-foreground"
                        value={monthPicker}
                        onChange={(e) => setMonthPicker(e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                          From
                        </label>
                        <input
                          type="date"
                          className="h-8 rounded-md border border-border bg-background text-sm px-2.5 text-foreground"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                          To
                        </label>
                        <input
                          type="date"
                          className="h-8 rounded-md border border-border bg-background text-sm px-2.5 text-foreground"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      Category
                    </label>
                    <select
                      className="h-8 rounded-md border border-border bg-background text-sm px-2.5 text-foreground"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All categories</option>
                      {spending_categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={fetchAnalytics}
                    disabled={isAnalyticsLoading}
                    className="ml-auto h-8 gap-1.5 text-xs"
                  >
                    <RefreshCw
                      className={`size-3 ${isAnalyticsLoading ? "animate-spin" : ""}`}
                    />
                    Apply
                  </Button>
                </div>

                {/* Metric cards */}
                {isAnalyticsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Loading analytics...
                    </p>
                  </div>
                ) : analytics ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      {metrics.map(
                        ({ icon, label, value, sub, capitalize }) => (
                          <div
                            key={label}
                            className="bg-muted/50 rounded-md p-3 space-y-0.5"
                          >
                            {icon}
                            <p className="text-[11px] text-muted-foreground">
                              {label}
                            </p>
                            <p
                              className={`text-base font-medium truncate ${capitalize ? "capitalize" : ""}`}
                            >
                              {value}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {sub}
                            </p>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Category breakdown */}
                    <div className="space-y-2.5">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        Spending by category
                      </p>
                      {analytics.categoryBreakdown.map((c, i) => {
                        const pct =
                          (c.amount / analytics.summary.total_spent) * 100;
                        return (
                          <div key={c.category} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm capitalize">
                                {c.category.toLowerCase()}
                              </span>
                              <span className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>
                                  {c.count} receipt{c.count !== 1 ? "s" : ""}
                                </span>
                                <span className="font-mono font-medium text-foreground">
                                  MYR {c.amount.toFixed(2)}
                                </span>
                                <span className="w-10 text-right tabular-nums">
                                  {pct.toFixed(1)}%
                                </span>
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  background: CAT_COLORS[i % CAT_COLORS.length],
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Transactions table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-[11px] uppercase tracking-widest font-medium">
                    Date
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest font-medium">
                    Store
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest font-medium">
                    Category
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest font-medium">
                    Method
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest font-medium text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest font-medium text-center w-[90px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id} className="group">
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(receipt.receipt_date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "2-digit" },
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {receipt.store_name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-muted border border-border/50 text-muted-foreground capitalize">
                        {receipt.category.toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {receipt.payment_method}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium">
                      {receipt.currency}{" "}
                      {Number(receipt.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          onClick={() =>
                            navigate(`/edit-receipt/${receipt.id}`)
                          }
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(receipt.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
