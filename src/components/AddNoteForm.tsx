
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Note } from '@/lib/models/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  createdBy: z.string().min(1, 'Creator name is required'),
  isPrivate: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AddNoteFormProps {
  petId: string;
  onSubmit: (note: Note) => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ petId, onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      createdBy: 'Dr. Wilson', // Default value, could be dynamic based on logged in user
      isPrivate: false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    const note: Note = {
      id: `n${Date.now().toString()}`,
      date: new Date().toISOString().split('T')[0],
      ...values,
    };

    onSubmit(note);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter note content..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createdBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Created By</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Private Note</FormLabel>
                <p className="text-sm text-muted-foreground">
                  If checked, this note will only be visible to veterinary staff.
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit">Add Note</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNoteForm;
