'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  CheckCircle2,
  Undo2,
  Trash2,
  PencilLine
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Skeleton } from '@/app/components/ui/skeleton';
import { toast } from 'sonner';

type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export default function TodoList({
  todos,
  onRefresh
}: {
  todos: Todo[];
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');


  // Toggle completed
  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      if (!res.ok) throw new Error('Failed to update todo');
      toast.success(`Todo marked as ${completed ? 'incomplete' : 'complete'}`);
      onRefresh();
    } catch {
      toast.error('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setIsEditOpen(true);
  };

  // Save edit
  const handleUpdate = async () => {
    if (!selectedTodo) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${selectedTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDesc })
      });
      if (!res.ok) throw new Error('Failed to update todo');
      toast.success('Todo updated successfully');
      setIsEditOpen(false);
      onRefresh();
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  // Open confirm delete dialog
  const openDeleteDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!selectedTodo) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${selectedTodo.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      toast.success('Todo deleted successfully');
      setIsDeleteOpen(false);
      onRefresh();
    } catch {
      toast.error('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loading
  if (loading) {
    return (
    <div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 sm:w-[250px] w-[100px]" />
    <Skeleton className="h-4 sm:w-[200px] w-[100px]" />
  </div>
</div>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-8">
        No todos yet. Add something!
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {todos.map((todo) => (
          <Card
            key={todo.id}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`text-xl font-semibold ${
                  todo.completed ? 'line-through text-red-500' : 'text-black'
                }`}
              >
                {todo.title}
              </CardTitle>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  onClick={() => openEditDialog(todo)}
                  className="hover:bg-yellow-500 hover:text-white"
                >
                  <PencilLine className="h-4 w-4" />
                </Button>

                {todo.completed ? (
                  <Button
                    size="icon"
                    onClick={() => toggleComplete(todo.id, todo.completed)}
                    className="hover:bg-teal-600 hover:text-white"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    onClick={() => toggleComplete(todo.id, todo.completed)}
                    className="hover:bg-green-600 hover:text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}

                {/* ❌ Tombol delete membuka dialog */}
                <Button
                  size="icon"
                  onClick={() => openDeleteDialog(todo)}
                  className="hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {todo.description && (
              <CardContent>
                <p className="text-black-400 text-lg">{todo.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* ✏️ Dialog Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
            />
            <Textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description"
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Dialog Confirm Delete */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-red-600">
                {selectedTodo?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
