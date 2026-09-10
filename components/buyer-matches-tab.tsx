'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Sparkles, Building2, Briefcase, Mail, Loader2, CheckCircle2 } from 'lucide-react';

type Investor = {
  id: string;
  name: string;
  email: string | null;
  domain: string | null;
  inferredSectors: any;
  investmentStages: any;
  notablePortfolio: any;
  score?: number;
  matchedSectors?: string[];
  aiJustification?: string;
};

export function BuyerMatchesTab({ dealId }: { dealId: string }) {
  const [sectors, setSectors] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [matches, setMatches] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatingMemoFor, setGeneratingMemoFor] = useState<string | null>(null);
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const sectorArray = sectors.split(',').map(s => s.trim()).filter(Boolean);
      
      const res = await fetch(`/api/admin/deals/${dealId}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectors: sectorArray, stage })
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepAnalysis = async () => {
    if (matches.length === 0) return;
    setIsAnalyzing(true);
    try {
      const top20Ids = matches.slice(0, 20).map(m => m.id);
      const res = await fetch(`/api/admin/deals/${dealId}/matches/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorIds: top20Ids })
      });
      const data = await res.json();
      
      if (data.topPicks && Array.isArray(data.topPicks)) {
        let newMatches = [...matches];
        
        // Add justifications and boost score so they sort to the top
        data.topPicks.forEach((pick: any) => {
          const idx = newMatches.findIndex(m => m.id === pick.id);
          if (idx !== -1) {
            newMatches[idx] = { ...newMatches[idx], aiJustification: pick.justification, score: (newMatches[idx].score || 0) + 1000 };
          }
        });
        
        // Re-sort
        newMatches.sort((a, b) => (b.score || 0) - (a.score || 0));
        setMatches(newMatches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateMemo = async (investorId: string) => {
    setGeneratingMemoFor(investorId);
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/matches/memo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId })
      });
      const data = await res.json();
      if (data.memo) {
        setMemos(prev => ({ ...prev, [investorId]: data.memo }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingMemoFor(null);
    }
  };

  const formatArray = (data: any) => {
    if (Array.isArray(data)) return data.join(', ');
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch (e) {}
      return data;
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-lg">Synergy Engine</CardTitle>
          </div>
          <CardDescription>
            Input the startup's key sectors and stage to instantly find perfectly matched buyers from our AIF database.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sectors (comma separated)</label>
              <Input 
                placeholder="e.g. Fintech, SaaS, Deeptech" 
                value={sectors}
                onChange={(e) => setSectors(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Stage</label>
              <Input 
                placeholder="e.g. Seed, Series A" 
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={isLoading} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            Find Matches
          </Button>
        </CardContent>
      </Card>

      {hasSearched && !isLoading && matches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No Perfect Matches Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-1">Try broadening your sector keywords or adjusting the stage to find more buyers.</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {matches.length} Match{matches.length !== 1 && 'es'} Found
            </h3>
            <Button 
              onClick={handleDeepAnalysis} 
              disabled={isAnalyzing}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-3"
            >
              {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-300" />}
              {isAnalyzing ? 'Analyzing Portfolios...' : 'Run Deep AI Analysis'}
            </Button>
          </div>
          
          {matches.map((investor) => (
            <Card key={investor.id} className="shadow-sm border-slate-200 hover:border-indigo-200 transition-colors overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        {investor.name}
                        {investor.score && investor.score >= 10 && (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none shadow-none">
                            High Match
                          </Badge>
                        )}
                      </h3>
                      {investor.domain && investor.domain !== 'N/A' && (
                        <a href={`https://${investor.domain}`} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mt-1">
                          {investor.domain}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <p className="text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Investment Thesis</p>
                      <p className="text-slate-900">{formatArray(investor.inferredSectors)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Notable Portfolio</p>
                      <p className="text-slate-900">{formatArray(investor.notablePortfolio)}</p>
                    </div>
                  </div>

                  {investor.aiJustification && (
                    <div className="mt-5 p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-indigo-900 mb-1">AI Analyst Justification</p>
                        <p className="text-sm text-indigo-800 leading-relaxed">{investor.aiJustification}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col justify-center items-start md:w-[350px]">
                  {memos[investor.id] ? (
                    <div className="w-full">
                      <div className="flex items-center text-emerald-600 font-medium text-sm mb-3">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Pitch Generated
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap shadow-sm h-[140px] overflow-y-auto">
                        {memos[investor.id]}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-center">
                      <Sparkles className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-4">Let our AI write a highly personalized outreach pitch to this specific fund.</p>
                      <Button 
                        onClick={() => handleGenerateMemo(investor.id)}
                        disabled={generatingMemoFor === investor.id}
                        className="w-full bg-slate-900 hover:bg-slate-800"
                      >
                        {generatingMemoFor === investor.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2" />
                        )}
                        Generate Pitch
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
