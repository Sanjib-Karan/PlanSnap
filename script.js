// =====================
// Utility: qs shortcuts
// =====================
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// =====================
// Responsive Nav Toggle
// =====================
(function () {
    const toggle = $('#navToggle');
    const nav = $('#mainNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
})();

// =====================
// Form Validation (from Step 2)
// =====================
(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const nameInput = form.elements['name'];
    const emailInput = form.elements['email'];
    const messageInput = form.elements['message'];
    const agreeInput = form.elements['agree'];

    function showError(input, msg) {
        clearError(input);
        input.classList.add('error');
        const err = document.createElement('div');
        err.className = 'form-error';
        err.textContent = msg;
        input.insertAdjacentElement('afterend', err);
    }
    function clearError(input) {
        input.classList.remove('error');
        const next = input.nextElementSibling;
        if (next && next.classList.contains('form-error')) next.remove();
    }
    function validateName() {
        const v = nameInput.value.trim();
        if (v.length < 2) { showError(nameInput, 'Please enter at least 2 characters.'); return false; }
        clearError(nameInput); return true;
    }
    function validateEmail() {
        const v = emailInput.value.trim();
        const re = /^\S+@\S+\.\S+$/;
        if (!re.test(v)) { showError(emailInput, 'Please enter a valid email.'); return false; }
        clearError(emailInput); return true;
    }
    function validateMessage() {
        const v = messageInput.value.trim();
        if (v.length < 10) { showError(messageInput, 'Message must be at least 10 chars.'); return false; }
        clearError(messageInput); return true;
    }
    function validateAgree() {
        const label = agreeInput.parentElement;
        const next = label.nextElementSibling;
        if (!agreeInput.checked) {
            if (!(next && next.classList.contains('form-error'))) {
                const err = document.createElement('div');
                err.className = 'form-error'; err.textContent = 'You must agree before submitting.';
                label.insertAdjacentElement('afterend', err);
            }
            agreeInput.classList.add('error');
            return false;
        }
        if (next && next.classList.contains('form-error')) next.remove();
        agreeInput.classList.remove('error');
        return true;
    }
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);
    agreeInput.addEventListener('change', validateAgree);

    form.addEventListener('submit', e => {
        e.preventDefault();
        const valid = [validateName(), validateEmail(), validateMessage(), validateAgree()].every(Boolean);
        if (valid) {
            showSuccess('Form submitted successfully!');
            form.reset();
        }
    });
    function showSuccess(msg) {
        const old = form.querySelector('.success-message');
        if (old) old.remove();
        const div = document.createElement('div');
        div.className = 'success-message';
        div.textContent = msg;
        form.appendChild(div);
    }
})();

// =====================
// To‑Do App
// =====================
(function () {
    const form = $('#todoForm');
    const input = $('#todoInput');
    const list = $('#todoList');
    if (!form || !input || !list) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addTodo(text);
        input.value = '';
    });

    function addTodo(text) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = text;

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const doneBtn = document.createElement('button');
        doneBtn.type = 'button';
        doneBtn.textContent = 'Done';
        doneBtn.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTodos();
        });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            li.remove();
            saveTodos();
        });

        actions.append(doneBtn, delBtn);
        li.append(span, actions);
        list.appendChild(li);
        saveTodos();
    }

    // Storage helpers (Step 5 ready)
    function saveTodos() {
        const data = Array.from(list.children).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        }));
        localStorage.setItem('todos', JSON.stringify(data));
    }
    function loadTodos() {
        const raw = localStorage.getItem('todos');
        if (!raw) return;
        try {
            const data = JSON.parse(raw);
            data.forEach(t => {
                addTodo(t.text);
                const li = list.lastElementChild;
                if (t.completed) li.classList.add('completed');
            });
        } catch (err) { console.error('Bad todo data', err); }
    }
    loadTodos();
})();

// =====================
// Image Gallery App
// =====================
(function () {
    const form = $('#imgForm');
    const urlInput = $('#imgUrl');
    const grid = $('#imgGrid');
    if (!form || !urlInput || !grid) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const url = urlInput.value.trim();
        if (!url) return;
        addImage(url);
        urlInput.value = '';
    });

    function addImage(url) {
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'User added image';

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'delete-img';
        del.textContent = '×';
        del.addEventListener('click', () => {
            fig.remove();
            saveImages();
        });

        fig.append(img, del);
        grid.appendChild(fig);
        saveImages();
    }

    // Storage helpers (Step 5 ready)
    function saveImages() {
        const urls = Array.from(grid.querySelectorAll('img')).map(i => i.src);
        localStorage.setItem('gallery', JSON.stringify(urls));
    }
    function loadImages() {
        const raw = localStorage.getItem('gallery');
        if (!raw) return;
        try {
            const urls = JSON.parse(raw);
            urls.forEach(addImage);
        } catch (err) { console.error('Bad gallery data', err); }
    }
    loadImages();
})();