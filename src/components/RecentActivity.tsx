'use client';

import { Clock, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: 'pv_visite' | 'pv_constat' | 'problem' | 'update';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'resolved' | 'in_progress';
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  pv_visite: FileText,
  pv_constat: FileText,
  problem: AlertTriangle,
  update: CheckCircle,
};

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  resolved: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
};

// Helper function to format date consistently
function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use consistent dates to avoid hydration mismatch
  const displayActivities = activities.map(activity => ({
    ...activity,
    formattedDate: formatDate(activity.timestamp),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            displayActivities.map((activity) => {
              const Icon = activityIcons[activity.type];

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {activity.title}
                      </p>
                      {activity.status && (
                        <Badge
                          variant="secondary"
                          className={statusColors[activity.status]}
                        >
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {activity.formattedDate}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
