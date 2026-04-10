import { AppShell } from "@/components/layout/app-shell";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-space-5">
        <h1 className="text-h1 text-text-primary">Dashboard</h1>
        <p className="text-body text-text-secondary">
          Woodlands Checkpoint — VSB PSIM Controller
        </p>

        {/* Placeholder cards to verify design tokens */}
        <div className="grid grid-cols-3 gap-space-4">
          {[
            { label: "Rising Steps", count: 12, status: "All Operational", color: "bg-status-open" },
            { label: "Auto Bollards", count: 24, status: "2 In Transit", color: "bg-status-transit" },
            { label: "Drop Arm Barriers", count: 8, status: "1 Fault", color: "bg-status-fault" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface-elevated rounded-md border border-border p-space-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-space-3">
                <h3 className="text-h3 text-text-primary">{item.label}</h3>
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
              </div>
              <p className="text-h2 text-text-primary">{item.count}</p>
              <p className="text-body-sm text-text-secondary">{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
