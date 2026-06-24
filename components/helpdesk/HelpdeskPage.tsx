"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { HelpdeskQuery, QueryStatus } from "@/lib/types";
import { MessageSquare } from "lucide-react";
import { ROLE_LABELS } from "@/lib/types";

const QUERY_STATUSES: QueryStatus[] = ["Open", "In Progress", "Resolved", "Closed"];

export function HelpdeskPage({ adminMode = false }: { adminMode?: boolean }) {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const replyQuery = useAppStore((s) => s.replyQuery);
  const updateQuery = useAppStore((s) => s.updateQuery);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");
  const [viewQuery, setViewQuery] = useState<HelpdeskQuery | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<QueryStatus>("In Progress");

  const allQueries = data.queries ?? [];
  const queries = adminMode
    ? allQueries
    : allQueries.filter((q) => q.userId === session?.userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !subject.trim() || !message.trim()) {
      toast.error("Fill required fields");
      return;
    }
    submitQuery({
      userId: session.userId,
      userName: session.name,
      userEmail: session.email,
      userRole: session.role,
      entityId: session.entityId,
      entityName: session.entityName,
      entityType: session.role === "ca_firm" ? "CA Firm" : session.role === "branch_office" ? "Branch Office" : ROLE_LABELS[session.role],
      regionId: session.regionId,
      regionName: session.regionName,
      subject: subject.trim(),
      category,
      message: message.trim(),
      status: "Open",
      priority: "Medium",
    });
    setSubject("");
    setMessage("");
    toast.success("Query submitted successfully. System Admin can review it from Admin Queries.");
  };

  const openAdminQuery = (query: HelpdeskQuery) => {
    setViewQuery(query);
    setReplyText("");
    setReplyStatus(query.status === "Open" ? "In Progress" : query.status);
  };

  const handleAdminSave = () => {
    if (!viewQuery || !session) return;
    if (replyText.trim()) {
      replyQuery(
        viewQuery.id,
        {
          queryId: viewQuery.id,
          repliedBy: session.name,
          repliedByUserId: session.userId,
          repliedByEmail: session.email,
          message: replyText.trim(),
          isInternal: false,
        },
        replyStatus
      );
      toast.success("Reply saved and query updated.");
    } else if (replyStatus !== viewQuery.status) {
      updateQuery(viewQuery.id, { status: replyStatus }, true);
      toast.success("Query status updated.");
    } else {
      toast.error("Enter a reply or change the status.");
      return;
    }
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
        <Card>
          <CardHeader><CardTitle>Submit Query</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Brief subject of your query" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Technical", "Guidance", "Support", "General"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message *</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} placeholder="Describe your question in detail" />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                Submit Query
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>My Queries</CardTitle></CardHeader>
          <CardContent>
            {queries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No queries submitted yet.</p>
            ) : (
              <DataTable
                data={queries as unknown as Record<string, unknown>[]}
                columns={[
                  { key: "queryNumber", header: "Query #" },
                  { key: "subject", header: "Subject" },
                  { key: "status", header: "Status", render: (q) => <StatusBadge status={(q as { status: string }).status} /> },
                  { key: "submittedDate", header: "Submitted", render: (q) => new Date((q as { submittedDate: string }).submittedDate).toLocaleDateString() },
                  {
                    key: "action",
                    header: "Action",
                    render: (q) => (
                      <Button variant="ghost" size="sm" onClick={() => setViewQuery(q as unknown as HelpdeskQuery)}>
                        View
                      </Button>
                    ),
                  },
                ]}
                searchKeys={["subject", "queryNumber"]}
              />
            )}
          </CardContent>
        </Card>
        <UserQueryDialog
          query={viewQuery}
          replies={(data.queryReplies ?? []).filter((r) => r.queryId === viewQuery?.id && !r.isInternal)}
          onClose={() => setViewQuery(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Query Management</h1>
          <p className="text-muted-foreground">All helpdesk queries across roles and entities</p>
        </div>
      </div>

      {queries.length === 0 ? (
        <EmptyState
          title="No helpdesk queries submitted yet"
          description="Queries submitted from Helpdesk will appear here for review and reply."
          icon={<MessageSquare className="h-8 w-8 text-primary" />}
        />
      ) : (
        <DataTable
          data={queries as unknown as Record<string, unknown>[]}
          columns={[
            { key: "subject", header: "Subject" },
            { key: "userName", header: "Submitted By" },
            { key: "userEmail", header: "Email", render: (q) => (q as { userEmail?: string }).userEmail ?? "—" },
            {
              key: "userRole",
              header: "Role",
              render: (q) => {
                const role = (q as { userRole?: string }).userRole;
                return role ? (ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role) : "—";
              },
            },
            { key: "entityName", header: "Entity" },
            { key: "regionName", header: "Region", render: (q) => (q as { regionName?: string }).regionName ?? "—" },
            { key: "status", header: "Status", render: (q) => <StatusBadge status={(q as { status: string }).status} /> },
            { key: "submittedDate", header: "Created", render: (q) => new Date((q as { submittedDate: string }).submittedDate).toLocaleDateString() },
            { key: "lastUpdated", header: "Updated", render: (q) => new Date((q as { lastUpdated: string }).lastUpdated).toLocaleDateString() },
            {
              key: "action",
              header: "Actions",
              render: (q) => (
                <Button variant="outline" size="sm" onClick={() => openAdminQuery(q as unknown as HelpdeskQuery)}>
                  View / Reply
                </Button>
              ),
            },
          ]}
          searchKeys={["subject", "queryNumber", "userName", "entityName", "userEmail"]}
        />
      )}

      <Dialog open={!!viewQuery} onOpenChange={(open) => !open && setViewQuery(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewQuery?.queryNumber} — {viewQuery?.subject}</DialogTitle>
          </DialogHeader>
          {viewQuery && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div><span className="font-medium text-foreground">From:</span> {viewQuery.userName}</div>
                <div><span className="font-medium text-foreground">Email:</span> {viewQuery.userEmail ?? "—"}</div>
                <div><span className="font-medium text-foreground">Role:</span> {viewQuery.userRole ? ROLE_LABELS[viewQuery.userRole] : "—"}</div>
                <div><span className="font-medium text-foreground">Entity:</span> {viewQuery.entityName}</div>
                <div><span className="font-medium text-foreground">Region:</span> {viewQuery.regionName ?? "—"}</div>
                <div><span className="font-medium text-foreground">Status:</span> <StatusBadge status={viewQuery.status} /></div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium mb-1">Message</p>
                <p className="whitespace-pre-wrap">{viewQuery.message}</p>
              </div>
              {(data.queryReplies ?? [])
                .filter((r) => r.queryId === viewQuery.id && !r.isInternal)
                .map((r) => (
                  <div key={r.id} className="rounded-lg border border-teal-100 bg-primary/10/50 p-3">
                    <p className="font-medium">{r.repliedBy}</p>
                    <p className="mt-1 whitespace-pre-wrap">{r.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              <div className="space-y-2">
                <Label>Admin Reply</Label>
                <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply to the user..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={replyStatus} onValueChange={(v) => setReplyStatus(v as QueryStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {QUERY_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary hover:bg-primary/90 w-full" onClick={handleAdminSave}>
                Save Reply &amp; Update Status
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserQueryDialog({
  query,
  replies,
  onClose,
}: {
  query: HelpdeskQuery | null;
  replies: { message: string; repliedBy: string; createdAt: string }[];
  onClose: () => void;
}) {
  return (
    <Dialog open={!!query} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{query?.subject}</DialogTitle></DialogHeader>
        {query && (
          <div className="space-y-3 text-sm">
            <p className="whitespace-pre-wrap">{query.message}</p>
            <p className="text-muted-foreground">Status: <StatusBadge status={query.status} /></p>
            {replies.map((r) => (
              <div key={r.createdAt} className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium">{r.repliedBy}</p>
                <p>{r.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {replies.length === 0 && query.status === "Open" && (
              <p className="text-muted-foreground italic">Awaiting admin response.</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
