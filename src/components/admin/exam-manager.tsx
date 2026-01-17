'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exam, mockExams } from '@/lib/mock-data';
import { ExamFormValues, examSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';

export function ExamManager() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const { toast } = useToast();

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      exam_name: '',
      start_date: '',
      end_date: '',
      subjects: [{ subject: '', date: '', time: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subjects',
  });

  const openForm = (exam?: Exam) => {
    if (exam) {
      setEditingExam(exam);
      form.reset(exam);
    } else {
      setEditingExam(null);
      form.reset({
        exam_name: '',
        start_date: '',
        end_date: '',
        subjects: [{ subject: '', date: '', time: '' }],
      });
    }
    setIsFormOpen(true);
  };

  const onSubmit = (data: ExamFormValues) => {
    if (editingExam) {
      const updatedExams = exams.map(e => e.id === editingExam.id ? { ...e, ...data } : e);
      setExams(updatedExams);
      toast({ title: "Success", description: "Exam schedule updated successfully." });
    } else {
      const newExam: Exam = { id: `exam${Date.now()}`, ...data };
      setExams([newExam, ...exams]);
      toast({ title: "Success", description: "Exam schedule created successfully." });
    }
    setIsFormOpen(false);
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
    toast({ title: "Success", description: "Exam schedule deleted.", variant: "destructive" });
  };
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Manage Exam Schedules</CardTitle>
          <CardDescription>Add, edit, or delete exam timetables.</CardDescription>
        </div>
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.length > 0 ? (
                exams.map(exam => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.exam_name}</TableCell>
                    <TableCell>{formatDate(exam.start_date)}</TableCell>
                    <TableCell>{formatDate(exam.end_date)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openForm(exam)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                <span className="text-destructive">Delete</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the "{exam.exam_name}" schedule.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteExam(exam.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No exam schedules found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingExam ? 'Edit Exam Schedule' : 'Add New Exam Schedule'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField name="exam_name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Exam Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField name="start_date" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="end_date" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Subjects</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-5">
                        <FormField name={`subjects.${index}.subject`} control={form.control} render={({ field }) => (
                          <FormItem><FormLabel className={index !== 0 ? 'sr-only' : ''}>Subject</FormLabel><FormControl><Input placeholder="e.g. Mathematics" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="col-span-3">
                         <FormField name={`subjects.${index}.date`} control={form.control} render={({ field }) => (
                          <FormItem><FormLabel className={index !== 0 ? 'sr-only' : ''}>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                       <div className="col-span-3">
                        <FormField name={`subjects.${index}.time`} control={form.control} render={({ field }) => (
                          <FormItem><FormLabel className={index !== 0 ? 'sr-only' : ''}>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="col-span-1 flex justify-end">
                         <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className={index !== 0 ? 'mt-8' : ''}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ subject: '', date: '', time: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
                </Button>
                {form.formState.errors.subjects?.root && <p className='text-sm font-medium text-destructive mt-2'>{form.formState.errors.subjects.root.message}</p>}
              </div>

              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
