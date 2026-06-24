"use client";

import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReportPreview } from "./ReportPreview";
import { useState } from "react";
import type { GeneratedReport } from "@/lib/types";
import { Eye, Download, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export function ReportsPage() {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const deleteReport = useAppStore((s) => s.deleteReport);
  const downloadReport = useAppStore((s) => s.downloadReport);
  const [preview, setPreview] = useState<GeneratedReport | null>(null);
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const isAdmin = session?.role === "system_admin" || session?.role === "head_office";
  let reports = isAdmin
    ? data.reports
    : data.reports.filter((r) => r.entityId === session?.entityId || r.regionId === session?.regionId);
  if (formatFilter !== "all") reports = reports.filter((r) => r.format === formatFilter);
  if (statusFilter !== "all") reports = reports.filter((r) => r.status === statusFilter);

  const handleDownload = (report: GeneratedReport) => {
    const ok = downloadReport(report.id);
    if (ok) {
      toast.success(
        report.format === "Excel"
          ? "Excel-compatible CSV downloaded successfully"
          : "Print dialog opened — choose Save as PDF to download"
      );
    } else {
      toast.error("Failed to export report. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generated emission reports</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={formatFilter} onValueChange={setFormatFilter}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Format" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="Excel">Excel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Generated">Generated</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          title="No reports generated yet"
          description="Complete a calculation to generate PDF/Excel reports."
          icon={<FileText className="h-8 w-8 text-teal-500" />}
          action={
            ["ca_firm", "branch_office"].includes(session?.role ?? "") ? (
              <Button className="bg-teal-600" asChild>
                <Link href="/calculator">New Calculation</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <DataTable
          data={reports as unknown as Record<string, unknown>[]}
          columns={[
            { key: "id", header: "Report ID" },
            { key: "reportName", header: "Name" },
            { key: "entityName", header: "Entity" },
            { key: "reportingPeriod", header: "Period" },
            { key: "format", header: "Format", render: (r) => <StatusBadge status={(r as { format: string }).format} /> },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={(r as { status: string }).status} /> },
            { key: "generatedDate", header: "Date", render: (r) => new Date((r as { generatedDate: string }).generatedDate).toLocaleDateString() },
            {
              key: "actions", header: "Actions",
              render: (r) => {
                const report = r as unknown as GeneratedReport;
                return (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Preview report" onClick={() => setPreview(report)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Download report" onClick={() => handleDownload(report)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" title="Delete report" onClick={() => { deleteReport(report.id); toast.success("Report deleted"); }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                );
              },
            },
          ]}
          searchKeys={["reportName", "entityName", "id"]}
        />
      )}

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Report Preview</DialogTitle></DialogHeader>
          {preview && <ReportPreview report={preview} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
