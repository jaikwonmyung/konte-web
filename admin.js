document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('adminMode') === 'true';
    if (isAdmin) {
        enableAdminMode();
    }
});

function enableAdminMode() {
    document.body.classList.add('admin-active');
    
    // Create Admin Bar
    const bar = document.createElement('div');
    bar.className = 'admin-bar';
    bar.innerHTML = `
        <span style="font-weight:bold; font-size:12px;">ADMIN MODE</span>
        <button onclick="addItem()">+ Add Item</button>
        <button onclick="saveChanges()">Save & Sync</button>
        <button onclick="logoutAdmin()">Logout</button>
    `;
    document.body.appendChild(bar);

    // Make text editable
    makeEditable();
}

function makeEditable() {
    // Editable info text
    const infoText = document.querySelector('.info-text');
    if (infoText) infoText.setAttribute('contenteditable', 'true');

    // Editable gallery headers
    document.querySelectorAll('.gallery-header span').forEach(span => {
        span.setAttribute('contenteditable', 'true');
    });

    // Editable list items
    document.querySelectorAll('.list-item div').forEach(div => {
        div.setAttribute('contenteditable', 'true');
    });

    // Add Image Change Buttons
    document.querySelectorAll('.gallery-image-container').forEach(container => {
        if (!container.querySelector('.img-edit-btn')) {
            const btn = document.createElement('button');
            btn.innerText = 'Change Image URL';
            btn.className = 'admin-only img-edit-btn';
            btn.style.cssText = 'position:absolute; top:10px; right:10px; padding:5px; background:rgba(0,0,0,0.5); color:#fff; border:none; cursor:pointer;';
            btn.onclick = () => {
                const newUrl = prompt('Enter New Image URL:', container.querySelector('img').src);
                if (newUrl) container.querySelector('img').src = newUrl;
            };
            container.style.position = 'relative';
            container.appendChild(btn);
        }
    });
}

function addItem() {
    const gallery = document.querySelector('.gallery');
    const listContainer = document.querySelector('.list-container');

    const newItemId = Date.now();
    
    // Add to Gallery
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <div class="gallery-header">
            <span contenteditable="true">NEW CLIENT</span>
            <span contenteditable="true">NEW PROJECT</span>
            <span contenteditable="true">2026</span>
        </div>
        <div class="gallery-image-container" style="position:relative;">
            <img src="https://via.placeholder.com/1200x800?text=New+Work" alt="New Work">
            <button class="admin-only img-edit-btn" style="position:absolute; top:10px; right:10px; padding:5px; background:rgba(0,0,0,0.5); color:#fff; border:none; cursor:pointer;" onclick="this.parentElement.querySelector('img').src = prompt('URL:', '') || this.parentElement.querySelector('img').src">Change Image URL</button>
        </div>
    `;
    gallery.prepend(galleryItem);

    // Add to List
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.innerHTML = `
        <div class="col-client" contenteditable="true">NEW CLIENT</div>
        <div class="col-project" contenteditable="true">NEW PROJECT</div>
        <div class="col-year" contenteditable="true" style="text-align:right;">2026</div>
    `;
    listContainer.prepend(listItem);
}

function saveChanges() {
    // Remove Admin Bar and temporary UI before saving
    const bar = document.querySelector('.admin-bar');
    if (bar) bar.remove();
    document.body.classList.remove('admin-active');
    document.querySelectorAll('.img-edit-btn').forEach(b => b.remove());
    document.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

    const html = document.documentElement.outerHTML;
    console.log("--- UPDATED HTML START ---");
    console.log(html);
    console.log("--- UPDATED HTML END ---");
    
    alert("Changes saved to console! Please copy the HTML from the browser console and send it to Clyde, or just tell Clyde 'I have finished editing'.");
    
    // Restore Admin UI
    enableAdminMode();
}

function logoutAdmin() {
    localStorage.removeItem('adminMode');
    location.reload();
}
