// ── STATE ──
let tasks = JSON.parse(localStorage.getItem('todo-tasks') || '[]');

// ── INIT ──
document.getElementById('dateStr').textContent =
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

render();

// ── ADD TASK ──
function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) { input.focus(); return; }

  tasks.unshift({ id: Date.now(), text, done: false });
  input.value = '';
  save();
  render();
}

// ── TOGGLE DONE ──
function toggle(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    save();
    render();
  }
}

// ── DELETE TASK ──
function remove(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

// ── CLEAR COMPLETED ──
function clearDone() {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
}

// ── RENDER ──
function render() {
  const list       = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const left       = tasks.filter(t => !t.done).length;
  const done       = tasks.filter(t => t.done).length;

  document.getElementById('countBadge').textContent = `${left} left`;
  document.getElementById('doneCount').textContent  = `${done} completed`;

  emptyState.style.display = tasks.length ? 'none' : 'block';

  list.innerHTML = tasks.map(task => `
    <li class="${task.done ? 'done' : ''}">
      <div class="cb ${task.done ? 'checked' : ''}" onclick="toggle(${task.id})">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.8 7L9 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="txt">${escapeHtml(task.text)}</span>
      <button class="del-btn" onclick="remove(${task.id})" title="Delete">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </li>
  `).join('');
}

// ── HELPERS ──
function save() {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}