// ================== COSTANTI E STATO ==================
const STORAGE_KEY = 'todoListData';
let todosData = { todos: [], nextId: 1 };
let currentFilter = 'all';

// ================== LOCALSTORAGE ==================
function loadTodos() {
    try {
        const jsonString = localStorage.getItem(STORAGE_KEY);
        if (jsonString) {
            todosData = JSON.parse(jsonString);
            console.log('✅ Dati caricati:', todosData.todos.length + ' task');
        } else {
            console.log('ℹ️ Nessun dato salvato, uso dati vuoti');
        }
    } catch (error) {
        console.error('❌ Errore caricamento:', error);
        alert('⚠️ Errore nel caricamento dei dati. Verrà creata una nuova lista.');
        todosData = { todos: [], nextId: 1 };
    }
}

function saveTodos() {
    try {
        const jsonString = JSON.stringify(todosData);
        localStorage.setItem(STORAGE_KEY, jsonString);
        console.log('💾 Dati salvati (' + jsonString.length + ' caratteri)');
    } catch (error) {
        console.error('❌ Errore salvataggio:', error);
        alert('⚠️ Errore nel salvataggio dei dati!');
    }
}

// ================== CRUD ==================
function addTodo(title, description = '') {
    if (!title || title.trim() === '') {
        alert('⚠️ Il titolo è obbligatorio!');
        return false;
    }

    const newTodo = {
        id: todosData.nextId,
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };

    todosData.todos.push(newTodo);
    todosData.nextId++;
    saveTodos();
    renderTodos();
    return true;
}

function deleteTodo(id) {
    if (!confirm('🗑️ Sei sicuro di voler eliminare questa task?')) return;
    todosData.todos = todosData.todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todosData.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// ================== RENDERING ==================
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<p class="empty-message">📝 Nessuna task da visualizzare</p>';
        updateCounter();
        return;
    }

    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });

    updateCounter();
}

function createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    div.dataset.id = todo.id;

    div.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <div class="todo-content">
            <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
            ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
            <small class="todo-date">${formatDate(todo.createdAt)}</small>
        </div>
        <div class="todo-actions">
            <button class="btn-delete">🗑️ Elimina</button>
        </div>
    `;

    div.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
    div.querySelector('.btn-delete').addEventListener('click', () => deleteTodo(todo.id));

    return div;
}

// ================== FILTRI E UTILI ==================
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active': return todosData.todos.filter(t => !t.completed);
        case 'completed': return todosData.todos.filter(t => t.completed);
        default: return todosData.todos;
    }
}

function updateCounter() {
    const activeCount = todosData.todos.filter(t => !t.completed).length;
    const countElement = document.getElementById('activeCount');
    countElement.textContent = `${activeCount} task ${activeCount === 1 ? 'attiva' : 'attive'}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('it-IT');
    const timeStr = date.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${dateStr}, ${timeStr}`;
}

// ================== EVENT LISTENERS ==================
function setupEventListeners() {
    console.log('🎮 Configurazione event listeners');

    document.getElementById('addBtn').addEventListener('click', handleAddTodo);

    document.getElementById('todoTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

function handleAddTodo() {
    const titleInput = document.getElementById('todoTitle');
    const descInput = document.getElementById('todoDescription');

    const title = titleInput.value;
    const description = descInput.value;

    const success = addTodo(title, description);
    if (success) {
        titleInput.value = '';
        descInput.value = '';
        titleInput.focus();
    } else {
        titleInput.focus();
    }
}

function handleFilterChange(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderTodos();
}

// ================== INIZIALIZZAZIONE ==================
function init() {
    loadTodos();
    setupEventListeners();
    renderTodos();
}

document.addEventListener('DOMContentLoaded', init);
