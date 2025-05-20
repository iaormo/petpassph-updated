
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, FileText, Eye, EyeOff } from 'lucide-react';
import { Pet, Note } from '@/lib/models/types';
import { toast } from '@/hooks/use-toast';
import { addNote } from '@/lib/utils/petUtils';
import AddNoteForm from '@/components/AddNoteForm';

interface NotesTabProps {
  pet: Pet;
  setPet?: React.Dispatch<React.SetStateAction<Pet | null>>;
  userRole: "veterinary" | "owner";
}

const NotesTab: React.FC<NotesTabProps> = ({ pet, setPet, userRole }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddNote = (note: Note) => {
    // Add the note to the pet
    const success = addNote(pet.id, note);
    
    if (success && setPet) {
      // Force a re-render by updating the pet state with a new reference
      setPet({...pet});
    }
    
    setIsDialogOpen(false);
    toast({
      title: "Note Added",
      description: "Note has been added to the pet's file.",
    });
  };

  // Filter notes based on user role - owners shouldn't see private notes
  const visibleNotes = userRole === "veterinary" 
    ? pet.notes 
    : pet.notes.filter(note => !note.isPrivate);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Clinical Notes</CardTitle>
          <CardDescription>Notes and observations for {pet.name}</CardDescription>
        </div>
        {userRole === "veterinary" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Clinical Note</DialogTitle>
                <DialogDescription>
                  Add a new clinical note for {pet.name}.
                </DialogDescription>
              </DialogHeader>
              <AddNoteForm petId={pet.id} onSubmit={handleAddNote} />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleNotes.length > 0 ? (
            visibleNotes.map(note => (
              <NoteCard key={note.id} note={note} userRole={userRole} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No notes found. {userRole === "veterinary" ? "Add a note to get started." : ""}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface NoteCardProps {
  note: Note;
  userRole: "veterinary" | "owner";
}

const NoteCard: React.FC<NoteCardProps> = ({ note, userRole }) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          {note.title}
          {userRole === "veterinary" && (
            <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-muted flex items-center">
              {note.isPrivate ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" /> Private
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" /> Visible to owner
                </>
              )}
            </span>
          )}
        </h4>
        <span className="text-sm text-muted-foreground">
          {new Date(note.date).toLocaleDateString()}
        </span>
      </div>
      <div className="text-sm mt-2 whitespace-pre-wrap">{note.content}</div>
      <div className="text-xs text-muted-foreground mt-4">Added by: {note.createdBy}</div>
    </div>
  );
};

export default NotesTab;
