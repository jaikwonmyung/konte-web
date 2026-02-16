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
    // 1. Clean up Admin UI before grabbing HTML
    const bar = document.querySelector('.admin-bar');
    const plusBtn = document.querySelector('.gallery-plus-btn');
    const imgBtns = document.querySelectorAll('.img-edit-btn');
    
    if (bar) bar.style.display = 'none';
    if (plusBtn) plusBtn.style.display = 'none';
    imgBtns.forEach(b => b.style.display = 'none');
    
    // Remove contenteditable attributes
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => el.removeAttribute('contenteditable'));
    document.body.classList.remove('admin-active');

    // 2. Get the cleaned HTML
    const htmlContent = document.documentElement.outerHTML;

    // 3. Copy to clipboard
    const el = document.createElement('textarea');
    el.value = htmlContent;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // 4. Restore Admin UI
    if (bar) bar.style.display = 'flex';
    if (plusBtn) plusBtn.style.display = 'flex';
    imgBtns.forEach(b => b.style.display = 'block');
    editableElements.forEach(el => el.setAttribute('contenteditable', 'true'));
    document.body.classList.add('admin-active');

    alert("현재 페이지의 모든 수정사항이 클립보드에 복사되었습니다!\n\n텔레그램(Clyde) 채팅창에 붙여넣기(Ctrl+V) 한 뒤 전송해 주세요.\n제가 바로 확인하여 깃허브와 버셀에 반영하겠습니다.");
}

function logoutAdmin() {
    localStorage.removeItem('adminMode');
    location.reload();
}
