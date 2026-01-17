import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockEvents, mockExams, mockAttendanceRule } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight, Calendar, BookOpen, BarChart3, GraduationCap } from "lucide-react";

export default function StudentDashboard() {
  const upcomingEvent = mockEvents[0];
  const nextExam = mockExams[0];

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Event</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{upcomingEvent.title}</div>
            <p className="text-xs text-muted-foreground">{new Date(upcomingEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {upcomingEvent.time}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Exam</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{nextExam.exam_name}</div>
            <p className="text-xs text-muted-foreground">Starts on {new Date(nextExam.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Requirement</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{mockAttendanceRule.required_percentage}%</div>
            <p className="text-xs text-muted-foreground">Minimum attendance required</p>
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-col md:flex-row items-center justify-between p-6 bg-primary/10 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block bg-primary text-primary-foreground p-3 rounded-full">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-headline mb-1">Have a question?</CardTitle>
            <CardDescription>Our AI assistant is here to help you 24/7 with your queries.</CardDescription>
          </div>
        </div>
        <Button asChild className="mt-4 md:mt-0 w-full md:w-auto" variant="outline">
          <Link href="/chat">
            Ask CampusAI <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
