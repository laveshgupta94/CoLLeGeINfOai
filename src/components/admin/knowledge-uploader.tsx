'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KnowledgeItem, mockKnowledgeBase } from '@/lib/mock-data';
import { KnowledgeFormValues, knowledgeSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { analyzeDocumentAction } from '@/app/admin/knowledge/actions';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

export function KnowledgeUploader() {
  const [items, setItems] = useState<KnowledgeItem[]>(mockKnowledgeBase);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const form = useForm<KnowledgeFormValues>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: { category: '', title: '', description: '' },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a .txt file.',
      });
      return;
    }

    const content = await file.text();
    setIsAnalyzing(true);

    const result = await analyzeDocumentAction(content);

    setIsAnalyzing(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
    } else {
      form.setValue('title', result.title);
      form.setValue('category', result.category);
      form.setValue('description', result.description);
      toast({
        title: 'Analysis Complete',
        description: 'The form has been pre-filled with the analysis results.',
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const openForm = (item?: KnowledgeItem) => {
    if (item) {
      setEditingItem(item);
      form.reset(item);
    } else {
      setEditingItem(null);
      form.reset({ category: '', title: '', description: '' });
    }
    setIsFormOpen(true);
  };

  const onSubmit = (data: KnowledgeFormValues) => {
    // Here you would call the `uploadKnowledgeBase` AI flow/server action
    if (editingItem) {
      const updatedItems = items.map(i => i.id === editingItem.id ? { ...i, ...data, updated_at: new Date().toISOString() } : i);
      setItems(updatedItems);
      toast({ title: "Success", description: "Knowledge item updated." });
    } else {
      const newItem: KnowledgeItem = { id: `kb${Date.now()}`, ...data, updated_at: new Date().toISOString() };
      setItems([newItem, ...items]);
      toast({ title: "Success", description: "New knowledge item added." });
    }
    setIsFormOpen(false);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast({ title: "Success", description: "Knowledge item deleted.", variant: "destructive" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">AI Knowledge Base</CardTitle>
          <CardDescription>Manage content used by the AI chatbot to answer questions.</CardDescription>
        </div>
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                    <TableCell>{formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => openForm(item)}>
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
                                  This will permanently delete the knowledge item "{item.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteItem(item.id)}>Continue</AlertDialogAction>
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
                    No knowledge items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingItem ? 'Edit Item' : 'Add Knowledge Item'}</DialogTitle>
             <DialogDescription>
              Add content manually or upload a .txt file to have the AI analyze it for you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-4">
              <Label htmlFor="file-upload">Analyze from file (optional)</Label>
              <Input id="file-upload" type="file" accept=".txt" onChange={handleFileChange} ref={fileInputRef} disabled={isAnalyzing} />
              {isAnalyzing && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Analyzing document...</p>}
          </div>
          <Separator className="my-4" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="title" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Library Rules" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="category" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., FAQs, Rules" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Content / Description</FormLabel><FormControl><Textarea placeholder="The full content for the AI to use." rows={8} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
