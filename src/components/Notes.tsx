import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  StickyNote,
  Edit,
  Trash2,
  Calendar,
  Tag
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Supplier Meeting Notes",
      content: "Discussed new fertilizer varieties and pricing. Need to follow up on bulk discount options for organic products.",
      tags: ["supplier", "meeting", "fertilizers"],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      priority: "high"
    },
    {
      id: "2",
      title: "Customer Feedback",
      content: "Several customers asking for more variety in pesticides. Consider adding eco-friendly options.",
      tags: ["customer", "feedback", "pesticides"],
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
      priority: "medium"
    },
    {
      id: "3",
      title: "Inventory Checklist",
      content: "Weekly inventory check completed. Low stock on wheat seeds and micronutrients. Order placed for next week delivery.",
      tags: ["inventory", "checklist", "orders"],
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-13"),
      priority: "low"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
    priority: "medium" as const
  });

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: newNote.priority
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", tags: "", priority: "medium" });
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600">Keep track of important information and reminders</p>
        </div>
        <Button 
          onClick={() => setIsAddingNote(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search notes by title, content, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={4}
            />
            <Input
              placeholder="Tags (comma separated)..."
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
            />
            <div className="flex items-center justify-between">
              <select
                value={newNote.priority}
                onChange={(e) => setNewNote({ ...newNote, priority: e.target.value as any })}
                className="px-3 py-2 border rounded-md"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote} className="bg-green-600 hover:bg-green-700">
                  Save Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                <Badge className={getPriorityColor(note.priority)}>
                  {note.priority}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {note.createdAt.toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 line-clamp-3">{note.content}</p>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              {searchTerm ? "No notes found matching your search." : "No notes yet. Add your first note to get started!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}