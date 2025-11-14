'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from './ui/textarea';

export default function TodoForm({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    setTitle('');
    setDescription('');
    onAdd();
  };

  return (
    <Card className="flex flex-col gap-3 mb-4">
  <CardHeader>
    <CardTitle>Todo Tracker</CardTitle>
    <CardDescription>
      Enter your Title and Description
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="text"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="description">Description</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
            </a>
          </div>
          <Textarea
             placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    <Button type="submit" className="flex-col gap-2 mt-5 w-full">
      Submit
    </Button>
    </form>
  </CardContent>
  <CardFooter>
   
  </CardFooter>
</Card>
  );
}
