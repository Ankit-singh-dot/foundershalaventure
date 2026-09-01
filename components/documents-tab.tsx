'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, Clock, FileText, Ban, Loader2, Download } from 'lucide-react';
import { toast } from '@/components/ui/toast'; // or sonner if we had it. We'll just rely on alerts/UI state for now to avoid shadcn toast setup issues.

type DealDocument = {
  id: string;
  category: string;
  documentName: string;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'NA';
  fileUrl: string | null;
  uploadedAt: string | null;
};

export function DocumentsTab({ dealId, role }: { dealId: string; role: 'ADMIN' | 'MEMBER' | null }) {
  const [documents, setDocuments] = useState<DealDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/deals/${dealId}/documents`)
      .then(res => res.json())
      .then(data => {
        if (data.documents) setDocuments(data.documents);
      })
      .finally(() => setIsLoading(false));
  }, [dealId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDocId) return;

    setUploadingDocId(selectedDocId);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docId', selectedDocId);

    try {
      const res = await fetch(`/api/admin/deals/${dealId}/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.document) {
        setDocuments(prev => prev.map(d => d.id === selectedDocId ? data.document : d));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed due to an error');
    } finally {
      setUploadingDocId(null);
      setSelectedDocId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleStatusChange = async (docId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/documents/${docId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.document) {
        setDocuments(prev => prev.map(d => d.id === docId ? data.document : d));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const triggerFileInput = (docId: string) => {
    setSelectedDocId(docId);
    fileInputRef.current?.click();
  };

  // Group by category
  const categories = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DealDocument[]>);

  const totalDocs = documents.length;
  const uploadedDocs = documents.filter(d => d.status === 'UPLOADED' || d.status === 'VERIFIED').length;
  const progressPercent = totalDocs === 0 ? 0 : Math.round((uploadedDocs / totalDocs) * 100);

  if (isLoading) return <div className="py-12 text-center text-slate-500">Loading document matrix...</div>;

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg" 
      />

      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Document Centre</CardTitle>
            <CardDescription className="mt-1">
              Upload, track and manage all fundraise documents.
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">Overall progress</p>
            <p className="text-sm text-slate-500">{uploadedDocs} of {totalDocs} uploaded</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Progress value={progressPercent} className="h-2 mb-8" />
          
          <div className="space-y-8">
            {Object.keys(categories).sort().map(category => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories[category].map(doc => (
                    <div key={doc.id} className="border border-slate-200 rounded-xl p-4 flex flex-col hover:border-slate-300 transition-colors bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium leading-tight pr-2">{doc.documentName}</h4>
                        <DocumentBadge status={doc.status} />
                      </div>
                      
                      <div className="mt-auto pt-4 flex gap-2">
                        {/* Member/Admin Action: Upload */}
                        {doc.status !== 'VERIFIED' && (
                          <Button 
                            variant={doc.status === 'PENDING' ? "default" : "outline"} 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => triggerFileInput(doc.id)}
                            disabled={uploadingDocId === doc.id}
                          >
                            {uploadingDocId === doc.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            ) : (
                              <Upload className="w-3.5 h-3.5 mr-1" />
                            )}
                            {doc.status === 'UPLOADED' ? 'Re-upload' : 'Upload'}
                          </Button>
                        )}

                        {/* File Download Link */}
                        {doc.fileUrl && (
                          <Button variant="secondary" size="sm" asChild className="px-2">
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" title="Download">
                              <Download className="w-4 h-4 text-slate-600" />
                            </a>
                          </Button>
                        )}
                        
                        {/* Admin Actions: Verify & NA */}
                        {role === 'ADMIN' && (
                          <div className="flex gap-1 ml-auto shrink-0">
                            {doc.status === 'UPLOADED' && (
                              <Button variant="outline" size="sm" onClick={() => handleStatusChange(doc.id, 'VERIFIED')} className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2" title="Verify">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {doc.status !== 'VERIFIED' && doc.status !== 'NA' && (
                              <Button variant="ghost" size="sm" onClick={() => handleStatusChange(doc.id, 'NA')} className="text-slate-400 hover:text-slate-600 px-2" title="Mark N/A">
                                <Ban className="w-4 h-4" />
                              </Button>
                            )}
                            {(doc.status === 'VERIFIED' || doc.status === 'NA') && (
                              <Button variant="ghost" size="sm" onClick={() => handleStatusChange(doc.id, 'PENDING')} className="text-slate-400 hover:text-slate-600 px-2" title="Undo">
                                Undo
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentBadge({ status }: { status: string }) {
  switch (status) {
    case 'VERIFIED':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shrink-0"><CheckCircle className="w-3 h-3 mr-1"/> Verified</Badge>;
    case 'UPLOADED':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none shrink-0"><FileText className="w-3 h-3 mr-1"/> Uploaded</Badge>;
    case 'NA':
      return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none shrink-0"><Ban className="w-3 h-3 mr-1"/> N/A</Badge>;
    default:
      return <Badge variant="outline" className="text-slate-400 border-slate-200 shrink-0"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
  }
}
