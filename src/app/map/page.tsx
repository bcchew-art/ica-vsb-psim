"use client";

import { AppShell } from "@/components/layout/app-shell";
import { DigitalTwinMap } from "@/components/psim/digital-twin-map/digital-twin-map";

export default function MapPage() {
  return (
    <AppShell>
      <DigitalTwinMap />
    </AppShell>
  );
}
