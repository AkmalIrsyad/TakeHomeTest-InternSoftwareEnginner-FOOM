const { Todo } = require('../models');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getAll = asyncHandler(async (req, res) => {
  const todos = await Todo.findAll({ order: [['createdAt', 'DESC']] });
  res.json(todos);
});

exports.create = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const todo = await Todo.create({ title, description });
  res.status(201).json(todo);
});

exports.update = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, description, completed } = req.body;

  const todo = await Todo.findByPk(id);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;

  await todo.save();
  res.json(todo);
});

exports.remove = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findByPk(id);
  if (!todo) return res.status(404).json({ message: 'Todo not found'});
  await todo.destroy();
  res.status(200).json({
     message: 'Todo deleted successfully',
     deleted: todo
    });
});
