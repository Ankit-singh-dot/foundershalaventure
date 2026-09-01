'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Clock, MessageSquare, Briefcase } from 'lucide-react';

type User = {
  id: string;
  name: string;
};

type Deal = {
  id: string;
  companyName: string;
  founderName: string;
  status: string;
  createdAt: string;
  assignedTo?: User | null;
  _count: {
    updates: number;
  };
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<'ADMIN' | 'MEMBER' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/deals').then(res => res.json()),
      fetch('/api/admin/users').then(res => res.json()).catch(() => ({ users: [] })),
      fetch('/api/auth/me').then(res => res.json())
    ]).then(([dealsData, usersData, meData]) => {
      if (dealsData.deals) setDeals(dealsData.deals);
      if (usersData.users) setUsers(usersData.users);
      if (meData.user) setRole(meData.user.role);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleAssign = async (dealId: string, userId: string) => {
    try {
      await fetch(`/api/admin/deals/${dealId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      // Update local state
      const user = users.find(u => u.id === userId);
      if (user) {
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, assignedTo: user } : d));
      }
    } catch (error) {
      console.error('Failed to assign', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toUpperCase()) {
      case 'NEW': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'REVIEWING': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'DUE_DILIGENCE': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'CLOSED': return 'bg-green-100 text-green-700 hover:bg-green-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals Tracker</h1>
          <p className="text-slate-500 mt-1">Manage and assign incoming startup deals.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-500" />
            Active Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Assignment</TableHead>
                <TableHead className="font-semibold">Updates</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    Loading deals...
                  </TableCell>
                </TableRow>
              ) : deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    No deals found in the pipeline.
                  </TableCell>
                </TableRow>
              ) : deals.map((deal) => (
                <TableRow key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-medium text-slate-900">{deal.companyName}</div>
                    <div className="text-sm text-slate-500">{deal.founderName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getStatusColor(deal.status)} border-none`}>
                      {deal.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {role === 'ADMIN' ? (
                      <Select 
                        value={deal.assignedTo?.id || "unassigned"}
                        onValueChange={(val) => val !== "unassigned" && handleAssign(deal.id, val)}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-sm">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned" disabled>Unassigned</SelectItem>
                          {users.map(u => (
                            <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm font-medium text-slate-700">
                        {deal.assignedTo?.name || 'Unassigned'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">{deal._count.updates}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm" className="h-8 hover:bg-slate-100">
                      <Link href={`/admin/deals/${deal.id}`}>
                        <Eye className="w-4 h-4 mr-1.5" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
