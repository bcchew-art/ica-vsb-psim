import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden justify-center bg-background">
      <div className="h-full flex w-full max-w-[1920px]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto p-space-5 bg-background">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
