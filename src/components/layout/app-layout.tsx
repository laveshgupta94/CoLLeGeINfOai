'use client';

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroupLabel } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageCircle, BarChart3, Users, Calendar, BookOpen, BrainCircuit, Wrench, Home } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import React from 'react';

const studentNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/attendance', label: 'Attendance', icon: BarChart3 },
];

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: Users },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/exams', label: 'Exams', icon: BookOpen },
  { href: '/admin/attendance', label: 'Attendance Rules', icon: Wrench },
  { href: '/admin/knowledge', label: 'Knowledge Base', icon: BrainCircuit },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noSidebarRoutes = ['/student/login', '/admin/login', '/'];

  if (noSidebarRoutes.includes(pathname)) {
    return <main className="flex-1">{children}</main>;
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 truncate">
            <Logo />
            <div className='flex flex-col'>
              <h1 className="font-headline text-lg font-bold">CampusConnect</h1>
              <span className="text-xs text-muted-foreground -mt-1">AI Assistant</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Home">
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            <SidebarGroupLabel>Student</SidebarGroupLabel>
            {studentNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            
            <SidebarGroupLabel className="mt-4">Admin</SidebarGroupLabel>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className={cn("flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-30 md:relative md:px-6", pathname !== '/chat' && "md:hidden")}>
            <SidebarTrigger className='md:hidden' />
            <div className="flex items-center gap-2 md:hidden">
              <Logo />
              <h1 className="font-headline text-lg font-semibold">CampusConnect</h1>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
