import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppLayout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen text-foreground bg-background flex flex-col">
      <header className="flex justify-end gap-2 items-center p-4 ">
        <h2 className="font-semibold">X3RA</h2>
        <ModeToggle />
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </header>

      <main className="flex-1 p-6 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="flex justify-end gap-2 items-center p-4">
        <h2 className="font-semibold">X3RA</h2>
        <ModeToggle />
      </header>

      <Outlet />
    </div>
  );
}
