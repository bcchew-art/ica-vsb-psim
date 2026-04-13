"use client";

import { FileText, Download, Calendar, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportType {
  id: string;
  title: string;
  description: string;
  frequency: string;
  lastGenerated: string;
  format: string;
  badge?: string;
  badgeColor?: string;
}

const reportTypes: ReportType[] = [
  {
    id: "daily-ops",
    title: "Daily Operations Summary",
    description:
      "Comprehensive overview of all VSB equipment status, lane throughput, and operational events for the previous 24-hour period.",
    frequency: "Daily — auto-generated at 00:05 SGT",
    lastGenerated: "2024-04-13 00:05",
    format: "PDF / XLSX",
    badge: "Scheduled",
    badgeColor: "bg-ica-blue/15 text-ica-blue border-ica-blue/30",
  },
  {
    id: "equipment-health",
    title: "Equipment Health Report",
    description:
      "Detailed health metrics for all barrier types including fault rates, MTTR, and predictive maintenance indicators.",
    frequency: "Weekly — every Monday 06:00 SGT",
    lastGenerated: "2024-04-08 06:00",
    format: "PDF",
    badge: "Scheduled",
    badgeColor: "bg-ica-blue/15 text-ica-blue border-ica-blue/30",
  },
  {
    id: "incident-log",
    title: "Incident Log",
    description:
      "Full audit trail of all Critical and Warning events including response times, acknowledged-by, and resolution actions.",
    frequency: "On-demand / Daily export available",
    lastGenerated: "2024-04-13 09:00",
    format: "PDF / CSV",
    badge: "On Demand",
    badgeColor: "bg-status-transit/15 text-status-transit border-status-transit/30",
  },
  {
    id: "maintenance-schedule",
    title: "Maintenance Schedule",
    description:
      "Planned and overdue preventive maintenance tasks across all checkpoint equipment, ordered by priority.",
    frequency: "Monthly — first day of month",
    lastGenerated: "2024-04-01 07:00",
    format: "PDF / XLSX",
    badge: "Scheduled",
    badgeColor: "bg-ica-blue/15 text-ica-blue border-ica-blue/30",
  },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-space-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-text-primary font-semibold">Reports</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Generate and export operational reports for Woodlands and Tuas checkpoints
          </p>
        </div>
      </div>

      {/* Date range selector placeholder */}
      <div className="flex items-center gap-space-3 p-space-4 rounded-lg border border-border bg-surface-elevated">
        <Calendar size={16} className="text-text-secondary shrink-0" />
        <span className="text-body-sm text-text-secondary">Date range:</span>
        <div className="flex items-center gap-space-2">
          <div className="px-space-3 py-1.5 rounded-md border border-border bg-surface text-body-sm text-text-primary cursor-not-allowed opacity-60 select-none">
            2024-04-01
          </div>
          <ChevronRight size={14} className="text-text-secondary" />
          <div className="px-space-3 py-1.5 rounded-md border border-border bg-surface text-body-sm text-text-primary cursor-not-allowed opacity-60 select-none">
            2024-04-13
          </div>
        </div>
        <span className="text-label text-text-secondary ml-space-2">
          Date range selection available in full release
        </span>
      </div>

      {/* Report list */}
      <div className="flex flex-col gap-space-3">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="rounded-lg border border-border bg-surface-elevated p-space-5 flex items-start gap-space-4"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-md bg-ica-blue/10 flex items-center justify-center text-ica-blue shrink-0 mt-0.5">
              <FileText size={20} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-space-2 flex-wrap">
                <h3 className="text-h3 text-text-primary">{report.title}</h3>
                {report.badge && (
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-label border",
                      report.badgeColor,
                    )}
                  >
                    {report.badge}
                  </span>
                )}
              </div>
              <p className="text-body-sm text-text-secondary mt-1 leading-relaxed">
                {report.description}
              </p>
              <div className="flex items-center gap-space-4 mt-space-2">
                <span className="flex items-center gap-1 text-label text-text-secondary">
                  <Clock size={12} />
                  {report.frequency}
                </span>
                <span className="text-label text-text-secondary">
                  Format: {report.format}
                </span>
                <span className="text-label text-text-secondary">
                  Last generated: {report.lastGenerated}
                </span>
              </div>
            </div>

            {/* Generate button */}
            <button
              disabled
              className="shrink-0 flex items-center gap-space-2 px-space-4 py-space-2 rounded-md border border-border bg-surface text-label text-text-secondary cursor-not-allowed opacity-50 select-none"
              title="Report generation available in full release"
            >
              <Download size={14} />
              Generate
            </button>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-label text-text-secondary text-center pb-space-2">
        Report generation and scheduling will be fully enabled in the production release.
      </p>
    </div>
  );
}
