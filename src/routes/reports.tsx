import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Sparkles, Plus, Trash2, Calendar, Target, Clock, RefreshCw } from "lucide-react";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { useReportsStore, ReportType } from "@/store/reports-store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { reports, isLoading, isGenerating, fetchReports, generateReport, deleteReport } = useReportsStore();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (reports.length > 0 && !selectedReportId) {
      setSelectedReportId(reports[0].id);
    } else if (reports.length === 0) {
      setSelectedReportId(null);
    }
  }, [reports, selectedReportId]);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <WorkspaceShell>
      <div className="flex min-w-0 flex-col gap-8">
        <section className="relative overflow-hidden paper-panel rounded-[24px] border border-border p-8 transition-colors duration-500">
          <div className="relative z-10 flex min-w-0 flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                AI Briefings
              </div>
              <h1 className="mt-6 text-4xl font-display font-bold leading-[1.1] tracking-tight sm:text-5xl text-foreground">
                Executive <span className="text-accent italic">Reports</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                Automated daily briefings, weekly reviews, and monthly intelligence reports powered by your workspace data.
              </p>
            </div>
          </div>
        </section>

        <div className="flex gap-6 min-h-[600px]">
          {/* Sidebar for report list */}
          <div className="w-[300px] shrink-0 flex flex-col gap-4">
            <div className="paper-panel rounded-[24px] border border-border p-4 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-foreground mb-2 px-2">Generate New</h3>
              <button
                onClick={() => generateReport('daily')}
                disabled={isGenerating}
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background hover:bg-secondary transition-colors text-left disabled:opacity-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Daily Briefing</div>
                </div>
              </button>
              <button
                onClick={() => generateReport('weekly')}
                disabled={isGenerating}
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background hover:bg-secondary transition-colors text-left disabled:opacity-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Weekly Review</div>
                </div>
              </button>
              <button
                onClick={() => generateReport('monthly')}
                disabled={isGenerating}
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background hover:bg-secondary transition-colors text-left disabled:opacity-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Monthly Intel</div>
                </div>
              </button>
            </div>

            <div className="paper-panel rounded-[24px] border border-border p-4 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-sm font-bold text-foreground mb-4 px-2">History</h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground px-2">Loading...</p>
                ) : reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-2">No reports yet.</p>
                ) : (
                  reports.map(report => (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        selectedReportId === report.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border bg-background hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{report.type}</span>
                        <span className="text-[10px] text-muted-foreground">{report.date}</span>
                      </div>
                      <p className={`mt-1 text-sm font-bold truncate ${selectedReportId === report.id ? 'text-accent' : 'text-foreground'}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main report content */}
          <div className="flex-1 paper-panel rounded-[24px] border border-border flex flex-col overflow-hidden relative">
            {isGenerating ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                <RefreshCw className="h-8 w-8 text-accent animate-spin mb-4" />
                <p className="text-foreground font-bold">Analyzing your workspace data...</p>
                <p className="text-sm text-muted-foreground mt-2">corTeX AI is generating your report</p>
              </div>
            ) : null}

            {selectedReport ? (
              <>
                <div className="border-b border-border p-6 flex justify-between items-center bg-secondary/50">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <FileText className="h-6 w-6 text-accent" />
                      {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)} Briefing
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Generated on {new Date(selectedReport.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteReport(selectedReport.id);
                      setSelectedReportId(null);
                    }}
                    className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="prose prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedReport.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No Report Selected</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Select a report from the history or generate a new one to see AI insights about your productivity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}

export default ReportsPage;
