"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Stepper } from "@/components/common/Stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Calculation, CalculationLineItem, EmissionCategoryId } from "@/lib/types";
import {
  CATEGORY_FIELD_CONFIG, getActivityQuantity, getFactorSubType,
  getActiveFactorForCategory, buildLineItem, sumByScope,
} from "@/lib/calculationEngine";
import { toast } from "sonner";
import { Upload, Save } from "lucide-react";

const WIZARD_STEPS = [
  { id: "basic", title: "Basic Info" },
  { id: "categories", title: "Categories" },
  { id: "activity", title: "Activity Data" },
  { id: "documents", title: "Documents" },
  { id: "review", title: "Review" },
  { id: "results", title: "Results" },
];

export function CalculatorWizard({ existingId }: { existingId?: string }) {
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const saveCalculation = useAppStore((s) => s.saveCalculation);
  const addDocument = useAppStore((s) => s.addDocument);

  const existing = existingId ? data.calculations.find((c) => c.id === existingId) : undefined;

  const [step, setStep] = useState(existing?.status === "completed" ? 5 : 0);
  const [reportingPeriod, setReportingPeriod] = useState(existing?.reportingPeriod ?? "FY 2024-25");
  const [selectedCategories, setSelectedCategories] = useState<EmissionCategoryId[]>(
    existing?.lineItems.map((l) => l.categoryId) ?? []
  );
  const [lineItems, setLineItems] = useState<CalculationLineItem[]>(existing?.lineItems ?? []);
  const [categoryForms, setCategoryForms] = useState<Record<string, Record<string, string | number>>>({});
  const [calcId] = useState(existing?.id ?? `calc-${Date.now()}`);

  const toggleCategory = (id: EmissionCategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const updateForm = (catId: string, key: string, value: string | number) => {
    setCategoryForms((prev) => ({
      ...prev,
      [catId]: { ...prev[catId], [key]: value },
    }));
  };

  const buildItemsFromForms = useCallback(() => {
    const items: CalculationLineItem[] = [];
    for (const catId of selectedCategories) {
      const meta = categoryForms[catId] ?? {};
      const qty = getActivityQuantity(catId, meta);
      if (qty <= 0) continue;
      const factor = getActiveFactorForCategory(data.emissionFactors, catId, getFactorSubType(catId, meta));
      if (!factor) continue;
      const config = CATEGORY_FIELD_CONFIG[catId];
      items.push(buildLineItem(catId, config.label, factor, qty, meta, String(meta.notes ?? "")));
    }
    return items;
  }, [selectedCategories, categoryForms, data.emissionFactors]);

  const handleSaveDraft = () => {
    if (!session) return;
    const items = lineItems.length ? lineItems : buildItemsFromForms();
    const totals = sumByScope(items);
    const calc: Calculation = {
      id: calcId,
      userId: session.userId,
      userName: session.name,
      entityId: session.entityId,
      entityName: session.entityName,
      entityType: session.role === "ca_firm" ? "CA Firm" : "Branch Office",
      regionId: session.regionId,
      regionName: session.regionName,
      reportingPeriod,
      status: "draft",
      lineItems: items,
      totalCo2e: totals.total,
      scope1Total: totals.scope1,
      scope2Total: totals.scope2,
      scope3Total: totals.scope3,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documentIds: [],
    };
    saveCalculation(calc);
    toast.success("Draft saved");
  };

  const handleComplete = () => {
    const items = buildItemsFromForms();
    if (!items.length) { toast.error("Enter activity data for at least one category"); return; }
    setLineItems(items);
    if (!session) return;
    const totals = sumByScope(items);
    const calc: Calculation = {
      id: calcId,
      userId: session.userId,
      userName: session.name,
      entityId: session.entityId,
      entityName: session.entityName,
      entityType: session.role === "ca_firm" ? "CA Firm" : "Branch Office",
      regionId: session.regionId,
      regionName: session.regionName,
      reportingPeriod,
      status: "completed",
      lineItems: items,
      totalCo2e: totals.total,
      scope1Total: totals.scope1,
      scope2Total: totals.scope2,
      scope3Total: totals.scope3,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      documentIds: [],
    };
    saveCalculation(calc);
    setStep(5);
    toast.success("Calculation completed");
  };

  const handleUpload = (category: string) => {
    if (!session) return;
    addDocument({
      id: `doc-${Date.now()}`,
      fileName: `${category.replace(/\s/g, "_")}_bill.pdf`,
      fileType: "application/pdf",
      fileSize: Math.round(50000 + Math.random() * 200000),
      uploadedBy: session.name,
      relatedCategory: category,
      relatedCalculationId: calcId,
      uploadDate: new Date().toISOString(),
      status: "uploaded",
    });
    toast.success("Document metadata saved");
  };

  const displayItems = step >= 4 ? (lineItems.length ? lineItems : buildItemsFromForms()) : lineItems;
  const totals = sumByScope(displayItems);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Carbon Calculator</h1>
        <p className="text-muted-foreground">Multi-step GHG emission calculation wizard</p>
      </div>

      <Stepper steps={WIZARD_STEPS} currentStep={step} />

      {step === 0 && (
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><Label>Entity</Label><p className="font-medium mt-1">{session?.entityName}</p></div>
              <div><Label>Region</Label><p className="font-medium mt-1">{session?.regionName}</p></div>
            </div>
            <div className="space-y-2">
              <Label>Reporting Period</Label>
              <Input value={reportingPeriod} onChange={(e) => setReportingPeriod(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Select Emission Categories</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.emissionCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-teal-50/50">
                <Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.defaultScope} · {cat.unit}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {selectedCategories.map((catId) => {
            const config = CATEGORY_FIELD_CONFIG[catId];
            const factor = getActiveFactorForCategory(data.emissionFactors, catId, getFactorSubType(catId, categoryForms[catId] ?? {}));
            const meta = categoryForms[catId] ?? {};
            const qty = getActivityQuantity(catId, meta);
            const co2e = factor ? qty * factor.emissionFactor : 0;
            return (
              <Card key={catId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between">
                    {config.label}
                    <span className="text-teal-600 text-sm">{co2e.toFixed(2)} kg CO2e</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {config.fields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <Label>{field.label}</Label>
                      {field.type === "select" ? (
                        <Select value={String(meta[field.key] ?? "")} onValueChange={(v) => updateForm(catId, field.key, v)}>
                          <SelectTrigger><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
                          <SelectContent>{field.options?.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      ) : (
                        <Input type={field.type} value={meta[field.key] ?? ""} onChange={(e) => updateForm(catId, field.key, field.type === "number" ? Number(e.target.value) : e.target.value)} />
                      )}
                    </div>
                  ))}
                  {factor && (
                    <p className="text-xs text-muted-foreground">
                      Factor: {factor.emissionFactor} kg CO2e/{factor.unit} · {factor.scope} · {factor.source}
                    </p>
                  )}
                  <Textarea placeholder="Notes/remarks" value={String(meta.notes ?? "")} onChange={(e) => updateForm(catId, "notes", e.target.value)} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Upload Supporting Documents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {selectedCategories.map((catId) => (
              <div key={catId} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{CATEGORY_FIELD_CONFIG[catId].label}</span>
                <Button variant="outline" size="sm" onClick={() => handleUpload(CATEGORY_FIELD_CONFIG[catId].label)}>
                  <Upload className="h-4 w-4 mr-1" /> Upload Placeholder
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader><CardTitle>Review Calculation</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {buildItemsFromForms().map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b py-2">
                  <span>{item.categoryName}</span>
                  <span className="font-medium">{item.co2e.toFixed(2)} kg · {item.scope}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span className="text-teal-600">{sumByScope(buildItemsFromForms()).total.toFixed(2)} kg CO2e</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <ResultsPanel calcId={calcId} items={displayItems} totals={totals} reportingPeriod={reportingPeriod} />
      )}

      <div className="flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Previous</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}><Save className="h-4 w-4 mr-1" /> Save Draft</Button>
          {step < 4 && <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setStep(step + 1)}>Next</Button>}
          {step === 4 && <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleComplete}>Calculate</Button>}
          {step === 5 && <Button variant="outline" onClick={() => router.push("/history")}>View History</Button>}
        </div>
      </div>
    </div>
  );
}

function ResultsPanel({ calcId, items, totals, reportingPeriod }: {
  calcId: string; items: CalculationLineItem[];
  totals: { scope1: number; scope2: number; scope3: number; total: number };
  reportingPeriod: string;
}) {
  const generateReport = useAppStore((s) => s.generateReport);
  const data = useAppStore((s) => s.data);
  const router = useRouter();
  const [generating, setGenerating] = useState<"PDF" | "Excel" | null>(null);

  const calculation = data.calculations.find((c) => c.id === calcId);

  const handleReport = async (format: "PDF" | "Excel") => {
    if (generating) return;
    setGenerating(format);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const report = generateReport(calcId, format);
      if (report) {
        toast.success(`${format} report generated successfully`, {
          description: `Report ${report.id} saved. View it in Reports.`,
          action: { label: "Open Reports", onClick: () => router.push("/reports") },
        });
      } else if (!calculation) {
        toast.error("Calculation not found. Please click Calculate again.");
      } else if (!calculation.lineItems?.length) {
        toast.error("No activity data in calculation. Complete the wizard first.");
      } else {
        toast.error("Failed to generate report. Please try again.");
      }
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white border-0">
        <CardContent className="pt-6 text-center">
          <p className="text-teal-100">Total Carbon Footprint</p>
          <p className="text-4xl font-bold mt-1">{totals.total.toLocaleString()} kg CO₂e</p>
          <p className="text-teal-200 text-sm mt-1">{reportingPeriod}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center"><p className="text-xs text-muted-foreground">Scope 1</p><p className="text-xl font-bold">{totals.scope1.toFixed(0)} kg</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-xs text-muted-foreground">Scope 2</p><p className="text-xl font-bold">{totals.scope2.toFixed(0)} kg</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-xs text-muted-foreground">Scope 3</p><p className="text-xl font-bold">{totals.scope3.toFixed(0)} kg</p></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          disabled={!!generating}
          onClick={() => handleReport("PDF")}
        >
          {generating === "PDF" ? "Generating PDF…" : "Generate PDF Report"}
        </Button>
        <Button
          variant="outline"
          className="border-teal-600 text-teal-700 hover:bg-teal-50"
          disabled={!!generating}
          onClick={() => handleReport("Excel")}
        >
          {generating === "Excel" ? "Generating Excel…" : "Generate Excel Report"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/recommendations")}>View Recommendations</Button>
        <Button variant="outline" onClick={() => router.push("/reports")}>View Reports</Button>
      </div>
    </div>
  );
}
