document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('adminMode') === 'true';
    if (isAdmin) {
        enableAdminMode();
    }
});

function enableAdminMode() {
    document.body.classList.add('admin-active');
    
    // Create Admin Bar
    if (!document.querySelector('.admin-bar')) {
        const bar = document.createElement('div');
        bar.className = 'admin-bar';
        bar.innerHTML = `
            <span style="font-weight:bold; font-size:12px;">ADMIN MODE</span>
            <button onclick="addItem()">+ Add Project</button>
            <button onclick="saveChanges()">Save & Sync</button>
            <button onclick="logoutAdmin()">Logout</button>
        `;
        document.body.appendChild(bar);
    }

    // Add Bottom "+" Button for easy adding
    addPlusButton();

    // Make text editable and setup drop zones
    makeEditable();
}

function addPlusButton() {
    if (!document.querySelector('.gallery-plus-btn')) {
        const plusBtn = document.createElement('div');
        plusBtn.className = 'admin-only gallery-plus-btn';
        plusBtn.innerHTML = '+';
        plusBtn.style.cssText = 'width:100%; height:200px; border:2px dashed #ccc; display:flex; justify-content:center; align-items:center; font-size:4rem; color:#ccc; cursor:pointer; margin-bottom:100px;';
        plusBtn.onclick = addItem;
        document.querySelector('.gallery').appendChild(plusBtn);
    }
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

    // Setup Drag and Drop for all images
    setupImageDropZones();
}

function setupImageDropZones() {
    document.querySelectorAll('.gallery-image-container').forEach(container => {
        container.style.position = 'relative';
        
        // Visual cue for drop zone
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.style.backgroundColor = '#eee';
        });
        
        container.addEventListener('dragleave', () => {
            container.style.backgroundColor = '#f9f9f9';
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.style.backgroundColor = '#f9f9f9';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    container.querySelector('img').src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Keep URL button as fallback
        if (!container.querySelector('.img-edit-btn')) {
            const btn = document.createElement('button');
            btn.innerText = 'Paste URL';
            btn.className = 'admin-only img-edit-btn';
            btn.style.cssText = 'position:absolute; top:10px; right:10px; padding:5px; background:rgba(0,0,0,0.5); color:#fff; border:none; cursor:pointer; font-size:10px; z-index:10;';
            btn.onclick = (e) => {
                e.stopPropagation();
                const newUrl = prompt('Enter New Image URL:');
                if (newUrl) container.querySelector('img').src = newUrl;
            };
            container.appendChild(btn);
        }
    });
}

function addItem() {
    const gallery = document.querySelector('.gallery');
    const listContainer = document.querySelector('.list-container');
    const plusBtn = document.querySelector('.gallery-plus-btn');

    // Add to Gallery
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <div class="gallery-header">
            <span contenteditable="true">NEW CLIENT</span>
            <span contenteditable="true">NEW PROJECT</span>
            <span contenteditable="true">2026</span>
        </div>
        <div class="gallery-image-container">
            <img src="https://via.placeholder.com/1200x800?text=Drag+and+Drop+Image+Here" alt="New Work">
        </div>
    `;
    
    if (plusBtn) {
        gallery.insertBefore(galleryItem, plusBtn);
    } else {
        gallery.appendChild(galleryItem);
    }

    // Add to List
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.innerHTML = `
        <div class="col-client" contenteditable="true">NEW CLIENT</div>
        <div class="col-project" contenteditable="true">NEW PROJECT</div>
        <div class="col-year" contenteditable="true" style="text-align:right;">2026</div>
    `;
    listContainer.appendChild(listItem);

    // Re-initialize for new items
    makeEditable();
    window.scrollTo(0, document.body.scrollHeight);
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
