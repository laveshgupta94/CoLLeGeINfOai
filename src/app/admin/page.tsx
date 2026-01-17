import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, BookOpen, Wrench, UploadCloud, ArrowRight } from 'lucide-react';
import Link from "next/link";

const adminFeatures = [
    { title: "Manage Events", href: "/admin/events", icon: Calendar, description: "Add, update, and delete college events." },
    { title: "Manage Exams", href: "/admin/exams", icon: BookOpen, description: "Upload and edit exam timetables." },
    { title: "Attendance Rules", href: "/admin/attendance", icon: Wrench, description: "Set minimum attendance percentages." },
    { title: "Uploading Information", href: "/admin/knowledge", icon: UploadCloud, description: "Manage content for the AI chatbot." },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all aspects of the CampusConnect AI platform from here.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {adminFeatures.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group block">
            <Card className="hover:border-primary hover:shadow-md transition-all h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <feature.icon className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <CardTitle className="font-headline">{feature.title}</CardTitle>
                            <CardDescription className="mt-1">{feature.description}</CardDescription>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
