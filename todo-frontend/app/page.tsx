/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="max-w-xl mx-auto mt-10 text-black">
      <h1 className="text-3xl font-bold text-center mb-6">Todo Tracker</h1>
      <TodoForm onAdd={fetchTodos} />
      <TodoList todos={todos} onRefresh={fetchTodos} />
    </main>
  );
}
