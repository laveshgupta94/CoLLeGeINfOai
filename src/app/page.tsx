import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, User, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Welcome to CampusConnect AI</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your intelligent college assistant. Please select your portal.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
        <Card className="shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-primary/10 border border-primary/20 p-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="w-full">
                <CardTitle className="font-headline text-2xl">Student Portal</CardTitle>
                <CardDescription className="mt-1">Access your dashboard, chat with the AI, and more.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/student/login">
                Student Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-primary/10 border border-primary/20 p-4">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Admin Portal</CardTitle>
                <CardDescription className="mt-1">Manage campus data, users, and system settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/login">
                Admin Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
