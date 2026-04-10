import { MousePointerClick } from "lucide-react";

export function EmptySelection() {
  return (
    <div className="flex flex-col items-center justify-center py-space-8 px-space-4 text-center">
      <MousePointerClick size={32} className="text-text-secondary mb-space-3" />
      <p className="text-body-sm text-text-secondary">
        Click equipment on the map or in the list to view details
      </p>
    </div>
  );
}
