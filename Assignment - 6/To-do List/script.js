// Simple To-Do List with localStorage
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

const STORAGE_KEY = 'todo.tasks.v1';

let tasks = [];

function saveTasks() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		tasks = raw ? JSON.parse(raw) : [];
	} catch (e) {
		tasks = [];
	}
}

function render() {
	taskList.innerHTML = '';
	if (tasks.length === 0) {
		emptyMessage.style.display = 'block';
		return;
	}
	emptyMessage.style.display = 'none';

	tasks.forEach(task => {
		const li = document.createElement('li');
		li.className = 'task-item';
		li.dataset.id = task.id;

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = !!task.completed;
		checkbox.addEventListener('change', () => toggleComplete(task.id));

		const text = document.createElement('div');
		text.className = 'text' + (task.completed ? ' completed' : '');
		text.textContent = task.text;

		const controls = document.createElement('div');
		controls.className = 'controls';

		const editBtn = document.createElement('button');
		editBtn.className = 'btn edit';
		editBtn.textContent = 'Edit';
		editBtn.addEventListener('click', () => startEdit(task.id, text));

		const deleteBtn = document.createElement('button');
		deleteBtn.className = 'btn delete';
		deleteBtn.textContent = 'Delete';
		deleteBtn.addEventListener('click', () => deleteTask(task.id));

		controls.appendChild(editBtn);
		controls.appendChild(deleteBtn);

		li.appendChild(checkbox);
		li.appendChild(text);
		li.appendChild(controls);

		taskList.appendChild(li);
	});
}

function addTask(text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	const newTask = { id: Date.now().toString(), text: trimmed, completed: false };
	tasks.unshift(newTask);
	saveTasks();
	render();
}

function deleteTask(id) {
	tasks = tasks.filter(t => t.id !== id);
	saveTasks();
	render();
}

function toggleComplete(id) {
	const t = tasks.find(x => x.id === id);
	if (!t) return;
	t.completed = !t.completed;
	saveTasks();
	render();
}

function startEdit(id, textNode) {
	const task = tasks.find(t => t.id === id);
	if (!task) return;

	const input = document.createElement('input');
	input.type = 'text';
	input.className = 'edit-input';
	input.value = task.text;

	const save = () => {
		const v = input.value.trim();
		if (v) {
			task.text = v;
			saveTasks();
		}
		render();
	};

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') save();
		if (e.key === 'Escape') render();
	});
	input.addEventListener('blur', save);

	// replace text node with input
	textNode.replaceWith(input);
	input.focus();
	// move caret to end
	input.setSelectionRange(input.value.length, input.value.length);
}

// Form handling
taskForm.addEventListener('submit', (e) => {
	e.preventDefault();
	addTask(taskInput.value);
	taskInput.value = '';
	taskInput.focus();
});

// init
loadTasks();
render();
