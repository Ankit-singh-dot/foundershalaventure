'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Download, Calendar, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { DocumentsTab } from '@/components/documents-tab';

type Deal = {
  id: string;
  companyName: string;
  founderName: string;
  email: string;
  phone: string;
  website: string;
  status: string;
  pitchDeckUrl?: string;
  financialModelUrl?: string;
  createdAt: string;
  assignedTo?: { id: string, name: string };
};

type Update = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string };
};

export default function DealDetailPage() {
  const params = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'MEMBER' | null>(null);

  useEffect(() => {
    fetch(`/api/admin/deals/${params.id}`).then(res => res.json()).then(data => setDeal(data.deal));
    fetch(`/api/admin/deals/${params.id}/updates`).then(res => res.json()).then(data => setUpdates(data.updates));
    fetch('/api/auth/me').then(res => res.json()).then(data => setRole(data.user?.role));
  }, [params.id]);

  const handleStatusChange = async (status: string) => {
    await fetch(`/api/admin/deals/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setDeal(prev => prev ? { ...prev, status } : null);
  };

  const handlePostUpdate = async () => {
    if (!newUpdate.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/deals/${params.id}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newUpdate })
      });
      const data = await res.json();
      if (data.update) {
        setUpdates([data.update, ...updates]);
        setNewUpdate('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!deal) return <div className="p-8 text-center text-slate-500">Loading deal details...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-full">
          <Link href="/admin/deals"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{deal.companyName}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Founder: {deal.founderName} • <a href={deal.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{deal.website}</a>
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-white shadow-sm">
            {deal.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="mb-6 bg-slate-100 border border-slate-200">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Timeline & Info</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Document Centre</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Deal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                <p className="text-slate-900">{deal.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                <p className="text-slate-900">{deal.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Assigned To</p>
                <p className="text-slate-900">{deal.assignedTo?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Submitted On</p>
                <p className="text-slate-900">{new Date(deal.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Update Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-3">
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950" 
                  placeholder="Leave a note or update about this deal..."
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handlePostUpdate} disabled={isSubmitting || !newUpdate.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Post Update
                </Button>
              </div>

              <Separator />

              <div className="space-y-6 mt-6">
                {updates.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No updates yet.</p>
                ) : updates.map(update => (
                  <div key={update.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                      <span className="font-semibold text-slate-600 text-sm">
                        {update.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{update.user.name}</span>
                        <span className="text-xs text-slate-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(update.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">{update.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
              <Button variant={deal.status === 'NEW' ? 'default' : 'outline'} onClick={() => handleStatusChange('NEW')} className="w-full justify-start">New Deal</Button>
              <Button variant={deal.status === 'REVIEWING' ? 'default' : 'outline'} onClick={() => handleStatusChange('REVIEWING')} className="w-full justify-start">Reviewing</Button>
              <Button variant={deal.status === 'DUE_DILIGENCE' ? 'default' : 'outline'} onClick={() => handleStatusChange('DUE_DILIGENCE')} className="w-full justify-start">Due Diligence</Button>
              <Button variant={deal.status === 'CLOSED' ? 'default' : 'outline'} onClick={() => handleStatusChange('CLOSED')} className="w-full justify-start">Closed</Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Vault Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {deal.pitchDeckUrl ? (
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href={deal.pitchDeckUrl} target="_blank" rel="noreferrer">
                    Pitch Deck <Download className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              ) : <p className="text-sm text-slate-500">No Pitch Deck uploaded.</p>}
              
              {deal.financialModelUrl ? (
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href={deal.financialModelUrl} target="_blank" rel="noreferrer">
                    Financial Model <Download className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              ) : <p className="text-sm text-slate-500">No Financial Model uploaded.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab dealId={params.id as string} role={role} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
