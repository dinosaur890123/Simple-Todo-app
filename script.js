document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(listItem => {
            const taskSpan = listItem.querySelector('span');
            tasks.push({
                text: taskSpan.textContent,
                completed: taskSpan.classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(tasks));
    }

    function createTaskElement(text, completed) {
        const listItem = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.textContent = text;
        taskSpan.setAttribute('role', 'checkbox');
        taskSpan.setAttribute('aria-checked', completed);
        if (completed) {
            taskSpan.classList.add('completed');
        }
        taskSpan.addEventListener('click', () => {
            taskSpan.classList.toggle('completed');
            taskSpan.setAttribute('aria-checked', isCompleted);
            saveTasks();
        });
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.setAttribute('aria-label', `Delete task: ${text}`);
        deleteButton.addEventListener('click', () => {
            if (listItem.parentNode === todoList) {
                todoList.removeChild(listItem);
                ariaLiveRegion.textContent = `Task "${text}" deleted.`;
                saveTasks();
            }
        });

        listItem.appendChild(taskSpan);
        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);
    }
    
    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === "") {
            return;
        }
        createTaskElement(taskText, false);
        saveTasks();
        todoInput.value = '';
        todoInput.focus();
    }
    
    function loadTasks() {
        const savedTasksRaw = localStorage.getItem('todos');
        if (!savedTasksRaw) return;
        try {
            const savedTasks = JSON.parse(savedTasksRaw);
            if (Array.isArray(savedTasks)) {
                savedTasks.forEach(task => {
                    if (task && typeof task.text === 'string' && typeof task.completed === 'boolean') {
                        createTaskElement(task.text, task.completed);
                    }
                });
            }
        } catch (error) {
            console.error("Error getting to dos from localstorage", error);
        }
    }
    addButton.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    loadTasks();
});

