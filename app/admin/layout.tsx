'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, Briefcase } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<'ADMIN' | 'MEMBER' | null>(null);

  useEffect(() => {
    if (pathname !== '/admin/login') {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => setRole(data.user?.role))
        .catch(console.error);
    }
  }, [pathname]);

  // Do not show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarContent>
            <div className="p-4 flex items-center gap-2">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">Foundershala</span>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>CRM</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/deals')}>
                      <Link href="/admin/deals" className="flex items-center gap-2 w-full">
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        <span>Deals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {role === 'ADMIN' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/team')}>
                        <Link href="/admin/team" className="flex items-center gap-2 w-full">
                          <Users className="w-4 h-4 shrink-0" />
                          <span>Team Members</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="p-4 mt-auto border-t border-slate-100">
            <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Sidebar>
        
        <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
