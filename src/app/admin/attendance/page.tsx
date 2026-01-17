import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function AdminAttendancePage() {
    return (
        <Card className="flex flex-col items-center justify-center text-center min-h-[400px] border-dashed">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold font-headline">Under Construction</h2>
            <p className="text-muted-foreground mt-1">The Attendance Rules Editor would be built here.</p>
        </Card>
    );
}
