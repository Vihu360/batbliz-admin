import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Shield } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to BatBliz Admin Panel - Manage your cricket data
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Matches</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Players</p>
                <p className="text-2xl font-bold">456</p>
              </div>
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teams</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg border bg-muted/50">
              <h3 className="font-medium">Match Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Manage competitions, seasons, and matches
              </p>
              <Button variant="outline" size="sm">
                Manage Matches
              </Button>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <h3 className="font-medium">Player Management</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Handle player data and contracts
              </p>
              <Button variant="outline" size="sm">
                Manage Players
              </Button>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <h3 className="font-medium">Team Statistics</h3>
              <p className="text-sm text-muted-foreground mb-2">
                View and edit team performance data
              </p>
              <Button variant="outline" size="sm">
                Manage Teams
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
