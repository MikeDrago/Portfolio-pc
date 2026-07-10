const desktop = document.getElementById('desktop');

const projects = [
    {
        id: 'progetto1',
        name: 'Lime',
        top: 60,  left: 60,
        thumb: 'https://placehold.co/150x150/6c8ebf/ffffff?text=P1',
        link: '#'
    },
    {
        id: 'progetto2',
        name: 'Progetto 2',
        top: 180, left: 260,
        thumb: 'https://placehold.co/150x150/b56576/ffffff?text=P2',
        link: '#'
      },
      {
        id: 'progetto3',
        name: 'Progetto 3 con nome un po lungo',
        top: 320, left: 90,
        thumb: 'https://placehold.co/150x150/588157/ffffff?text=P3',
        link: '#'
      }
];

projects.forEach(project =>{
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.style.top = project.top + 'px';
    icon.style.left = project.left + 'px';
    icon.dataset.id = project.id;

    icon.innerHTML = `
        <div class = "thumb">
            <img src="${project.thumb}" alt= "${project.name}>
        </div>
        <div class = "label"${project.name}></div>
    `;

    desktop.appendChild(icon);

    icon.addEventListener('click', (e) =>{
        e.stopPropagation();
        document.querySelectorAll('.desktop-icon.selected').forEach(e1 =>{
            if(e1 !== icon) e1.className.remove('selected');
        });
        icon.classList.toggle('selected');
    });

    icon.addEventListener('dblclick', ()=>{
        icon.classList.add('opening');
        setTimeout(()=>icon.classList.remove('opening'), 200);
        openProjectWindow(project.link, '_blank');
    });
});

desktop.addEventListener('click', () =>{
    document.querySelectorAll('desktop-icon.selected').forEach(e1=> e1.classList.remove('selected'));
});

// -- Gestione Delle Finestre --

 
function openProjectWindow(project, iconEl) {
    if (openWindows[project.id]) {
        focusWindow(openWindows[project.id]);
        return;
    }
 
    const rect = iconEl.getBoundingClientRect();
    const win = document.createElement('div');
    win.className = 'window';
    win.style.setProperty('--origin-x', (rect.left + rect.width / 2) + 'px');
    win.style.setProperty('--origin-y', (rect.top + rect.height / 2) + 'px');
 
    const offset = Object.keys(openWindows).length * 24;
    win.style.left = (200 + offset) + 'px';
    win.style.top = (100 + offset) + 'px';
    win.style.zIndex = ++zIndexCounter;
 
    win.innerHTML = `
    <div class="window-titlebar">
        <div class="traffic-lights">
            <button class="traffic-light tl-close">×</button>
            <button class="traffic-light tl-min">–</button>
            <button class="traffic-light tl-max">+</button>
        </div>
        <div class="window-title">${project.name}</div>
    </div>
    <div class="window-content">
        <img class="project-preview-img" src="${project.preview}" alt="${project.name}">
        <div class="project-info">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">Vai al progetto →</a>
        </div>
    </div>
      `;
 
    document.body.appendChild(win);
    openWindows[project.id] = win;
 
    win.addEventListener('mousedown', () => focusWindow(win));
 
    // drag
    const titlebar = win.querySelector('.window-titlebar');
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    titlebar.addEventListener('mousedown', (e) => {
        isDragging = true;
    const r = win.getBoundingClientRect();
        dragOffsetX = e.clientX - r.left;
        dragOffsetY = e.clientY - r.top;
        focusWindow(win);
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = (e.clientX - dragOffsetX) + 'px';
        win.style.top = Math.max(26, e.clientY - dragOffsetY) + 'px';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
 
    win.querySelector('.tl-close').addEventListener('click', () => closeWindow(project.id, win));
    win.querySelector('.tl-min').addEventListener('click', () => { win.style.display = 'none'; });
    win.querySelector('.tl-max').addEventListener('click', () => win.classList.toggle('maximized'));
 
        activeAppName.textContent = project.name;
    }
    function focusWindow(win) {
      win.style.zIndex = ++zIndexCounter;
      activeAppName.textContent = win.querySelector('.window-title').textContent;
    }
 
    function closeWindow(id, win) {
      win.classList.add('closing');
        win.addEventListener('animationend', () => {
            win.remove();
            delete openWindows[id];
        }, { once: true });
    }
