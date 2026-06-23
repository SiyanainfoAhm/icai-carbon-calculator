"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { HelpdeskQuery } from "@/lib/types";

export function HelpdeskPage({ adminMode = false }: { adminMode?: boolean }) {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const replyQuery = useAppStore((s) => s.replyQuery);
  const updateQuery = useAppStore((s) => s.updateQuery);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [viewQuery, setViewQuery] = useState<HelpdeskQuery | null>(null);
  const [replyText, setReplyText] = useState("");

  const queries = adminMode
    ? data.queries
    : data.queries.filter((q) => q.userId === session?.userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !subject || !message) { toast.error("Fill required fields"); return; }
    submitQuery({
      userId: session.userId, userName: session.name, entityId: session.entityId,
      entityName: session.entityName, subject, category, message, status: "Open",
    });
    setSubmitted(true);
    setSubject(""); setMessage("");
    toast.success("Your query has been submitted successfully.");
  };

  const handleReply = () => {
    if (!viewQuery || !replyText || !session) return;
    replyQuery(viewQuery.id, { queryId: viewQuery.id, repliedBy: session.name, message: replyText, isInternal: false }, "Resolved");
    toast.success("Reply sent. Email acknowledgement simulated.");
    setReplyText("");
    setViewQuery(null);
  };

  if (!adminMode) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Helpdesk</h1>
          <p className="text-muted-foreground">Submit queries and track responses</p>
        </div>
        {submitted && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">
            Your query has been submitted successfully.
          </div>
        )}
        <Card>
          <CardHeader><CardTitle>Submit Query</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Subject *</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} required /></div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Technical", "Guidance", "Support", "General"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Message *</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} /></div>
              <Button type="button" variant="outline" onClick={() => toast.info("Attachment upload placeholder")}>Add Attachment</Button>
              <Button type="submit" className="bg-teal-600 w-full">Submit Query</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Query History</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={queries as unknown as Record<string, unknown>[]}
              columns={[
                { key: "queryNumber", header: "Query #" },
                { key: "subject", header: "Subject" },
                { key: "category", header: "Category" },
                { key: "status", header: "Status", render: (q) => <StatusBadge status={(q as { status: string }).status} /> },
                { key: "submittedDate", header: "Submitted", render: (q) => new Date((q as { submittedDate: string }).submittedDate).toLocaleDateString() },
                { key: "action", header: "Action", render: (q) => <Button variant="ghost" size="sm" onClick={() => setViewQuery(q as unknown as HelpdeskQuery)}>View</Button> },
              ]}
              searchKeys={["subject", "queryNumber"]}
            />
          </CardContent>
        </Card>
        <QueryDetailDialog query={viewQuery} replies={data.queryReplies} onClose={() => setViewQuery(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div><h1 className="text-2xl font-bold">Query Management</h1></div>
        <Button variant="outline" onClick={() => toast.success("CSV export (demo)")}>Export CSV</Button>
      </div>
      <DataTable
        data={queries as unknown as Record<string, unknown>[]}
        columns={[
          { key: "queryNumber", header: "Query #" },
          { key: "userName", header: "User" },
          { key: "entityName", header: "Entity" },
          { key: "subject", header: "Subject" },
          { key: "status", header: "Status", render: (q) => <StatusBadge status={(q as { status: string }).status} /> },
          { key: "submittedDate", header: "Submitted", render: (q) => new Date((q as { submittedDate: string }).submittedDate).toLocaleDateString() },
          { key: "assignedTo", header: "Assigned To", render: (q) => (q as { assignedTo?: string }).assignedTo ?? "—" },
          { key: "action", header: "Actions", render: (q) => <Button variant="ghost" size="sm" onClick={() => setViewQuery(q as unknown as HelpdeskQuery)}>Reply</Button> },
        ]}
        searchKeys={["subject", "queryNumber", "userName"]}
      />
      <Dialog open={!!viewQuery} onOpenChange={() => setViewQuery(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reply to {viewQuery?.queryNumber}</DialogTitle></DialogHeader>
          {viewQuery && (
            <div className="space-y-4">
              <p className="text-sm">{viewQuery.message}</p>
              <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Your reply..." rows={4} />
              <Select defaultValue="Resolved" onValueChange={(v) => updateQuery(viewQuery.id, { status: v as HelpdeskQuery["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Open", "In Progress", "Resolved", "Closed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button className="bg-teal-600 w-full" onClick={handleReply}>Send Reply</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QueryDetailDialog({ query, replies, onClose }: { query: HelpdeskQuery | null; replies: { queryId: string; message: string; repliedBy: string; createdAt: string; isInternal: boolean }[]; onClose: () => void }) {
  if (!query) return null;
  const queryReplies = replies.filter((r) => r.queryId === query.id && !r.isInternal);
  return (
    <Dialog open={!!query} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{query.subject}</DialogTitle></DialogHeader>
        <p className="text-sm">{query.message}</p>
        {queryReplies.map((r) => (
          <div key={r.createdAt} className="rounded-lg bg-slate-50 p-3 text-sm">
            <p className="font-medium">{r.repliedBy}</p>
            <p>{r.message}</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
