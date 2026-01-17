'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockAttendanceRule } from '@/lib/mock-data';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const attendanceSchema = z.object({
  attended: z.coerce.number().int().min(0, "Cannot be negative"),
  total: z.coerce.number().int().min(1, "Must be at least 1"),
}).refine(data => data.attended <= data.total, {
  message: "Attended classes cannot be more than total classes.",
  path: ["attended"],
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export function AttendancePredictor() {
  const [result, setResult] = useState<{ message: string; isWarning: boolean } | null>(null);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attended: undefined,
      total: undefined,
    }
  });

  const handleCalculate: SubmitHandler<AttendanceFormValues> = (data) => {
    const { attended, total } = data;
    const requiredPercentage = mockAttendanceRule.required_percentage;

    const currentPercentage = (attended / total) * 100;
    
    // Case 1: Already meeting or exceeding the requirement
    if (currentPercentage >= requiredPercentage) {
      const requiredTotalClassesForBunk = (attended * 100) / requiredPercentage;
      const classesToBunk = Math.floor(total - requiredTotalClassesForBunk);
      if (classesToBunk > 0) {
        setResult({
          message: `You're safe! Your current attendance is ${currentPercentage.toFixed(2)}%. You can miss ${classesToBunk} more classes and still maintain attendance.`,
          isWarning: false,
        });
      } else {
        setResult({
          message: `You're safe! Your current attendance is ${currentPercentage.toFixed(2)}%. Keep it up!`,
          isWarning: false,
        });
      }
      return;
    }

    // Case 2: Below requirement, calculate classes needed
    // Formula: x >= (requiredPercentage * total - 100 * attended) / (100 - requiredPercentage)
    const numerator = requiredPercentage * total - 100 * attended;
    const denominator = 100 - requiredPercentage;
    const classesNeeded = Math.ceil(numerator / denominator);

    if (classesNeeded > 0) {
      setResult({
        message: `You need to attend the next ${classesNeeded} consecutive classes to reach ${requiredPercentage}% attendance.`,
        isWarning: true,
      });
    } else {
      // This case should theoretically not be hit if current percentage is below required, but as a fallback:
      setResult({
        message: `Your current attendance is ${currentPercentage.toFixed(2)}%. You are currently below the required ${requiredPercentage}%.`,
        isWarning: true,
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Attendance Predictor</CardTitle>
        <CardDescription>See how many classes you need to meet the requirement.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCalculate)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="attended"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classes You Attended</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Classes Conducted So Far</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 80" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-muted-foreground pt-2">
              Required attendance is set to {mockAttendanceRule.required_percentage}%.
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" className="w-full">Calculate</Button>
            {result && (
              <div className={`w-full p-4 rounded-md flex items-start gap-3 ${result.isWarning ? 'bg-destructive/10 text-destructive' : 'bg-green-600/10 text-green-700 dark:text-green-400'}`}>
                {result.isWarning ? <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> : <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                <p className="flex-1 text-sm">{result.message}</p>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
