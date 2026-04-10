"use client";

import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  equipmentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EfoConfirmDialog({ open, equipmentName, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="border-l-4 border-l-ica-red">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-space-2 text-ica-red">
            <ShieldAlert size={20} />
            Activate Emergency Fast Operation?
          </DialogTitle>
          <DialogDescription>
            This will immediately secure <span className="font-mono text-text-primary">{equipmentName}</span>{" "}
            in under 2 seconds. Safety sensors will be bypassed. This action cannot be undone without manually
            resetting EFO.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm EFO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
