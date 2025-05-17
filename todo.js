const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const filterButtons = document.querySelectorAll('.filters button');
const clearBtn = document.getElementById('clear-completed');

let todos = [];
let currentFilter = 'all';

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  body.classList.toggle('light');
});

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    todoInput.value = '';
    renderTodos();
  }
});

function renderTodos() {
  todoList.innerHTML = '';
  let filtered = todos;

  if (currentFilter === 'active') filtered = todos.filter(t => !t.completed);
  else if (currentFilter === 'completed') filtered = todos.filter(t => t.completed);

  filtered.forEach((todo, i) => {
    const li = document.createElement('li');
    li.draggable = true;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todo.completed = !todo.completed;
      renderTodos();
    });

    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.completed) li.classList.add('completed');

    span.contentEditable = true;
    span.addEventListener('blur', () => {
      todo.text = span.textContent.trim();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = '✕'; 
    deleteBtn.addEventListener('click', () => {
      todos.splice(i, 1);
      renderTodos();
    });

    li.append(checkbox, span, deleteBtn);
    todoList.appendChild(li);
  });

  itemsLeft.textContent = `${todos.filter(t => !t.completed).length} items left`;
  initDragDrop();
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  renderTodos();
});

function initDragDrop() {
  let dragged;
  todoList.querySelectorAll('li').forEach((item, index) => {
    item.addEventListener('dragstart', () => {
      dragged = index;
    });

    item.addEventListener('dragover', e => e.preventDefault());

    item.addEventListener('drop', () => {
      const targetIndex = [...todoList.children].indexOf(item);
      const draggedItem = todos.splice(dragged, 1)[0];
      todos.splice(targetIndex, 0, draggedItem);
      renderTodos();
    });
  });
}

renderTodos();
