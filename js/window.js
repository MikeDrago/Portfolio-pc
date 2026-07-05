    let zIndexCounter = 100;
    const openWindows = {}; // nome -> elemento finestra
 
    // contenuto placeholder per ogni "app"
    const windowContents = {
      'Chi sono': '<p>Ciao! Sono uno sviluppatore che ama costruire cose interattive sul web. Qui andrà la tua bio.</p>',
      'Progetti': '<p>📁 Progetto 1<br>📁 Progetto 2<br>📁 Progetto 3</p><p>Qui mostrerai i tuoi lavori, magari come icone di cartelle cliccabili.</p>',
      'Terminal': '<p style="font-family: monospace; background:#1e1e1e; color:#0f0; padding:10px; border-radius:6px;">$ whoami<br>full-stack developer<br>$ skills --list<br>JS · CSS · HTML · Node</p>',
      'Mail': '<p>Form di contatto qui: nome, email, messaggio, bottone invia.</p>'
    };
 
    function createWindow(name, icon, originX, originY) {
      // se è già aperta, portala solo in primo piano
      if (openWindows[name]) {
        focusWindow(openWindows[name]);
        return;
      }
 
      const win = document.createElement('div');
      win.className = 'window';
      win.style.setProperty('--origin-x', originX + 'px');
      win.style.setProperty('--origin-y', originY + 'px');
 
      // posizione iniziale: leggero offset random per non sovrapporre esattamente
      const offset = Object.keys(openWindows).length * 24;
      win.style.left = (140 + offset) + 'px';
      win.style.top = (80 + offset) + 'px';
      win.style.zIndex = ++zIndexCounter;
 
      win.innerHTML = `
        <div class="window-titlebar">
          <div class="traffic-lights">
            <button class="traffic-light tl-close">×</button>
            <button class="traffic-light tl-min">–</button>
            <button class="traffic-light tl-max">+</button>
          </div>
          <div class="window-title">${name}</div>
        </div>
        <div class="window-content">${windowContents[name] || '<p>Contenuto in arrivo...</p>'}</div>
        <div class="resize-handle"></div>
      `;
 
      document.body.appendChild(win);
      openWindows[name] = win;
 
      // porta in primo piano al click ovunque nella finestra
      win.addEventListener('mousedown', () => focusWindow(win));
 
      // ---- DRAG ----
      const titlebar = win.querySelector('.window-titlebar');
      let isDragging = false;
      let dragOffsetX = 0, dragOffsetY = 0;
 
      titlebar.addEventListener('mousedown', (e) => {
        if (win.classList.contains('maximized')) return; // niente drag se massimizzata
        isDragging = true;
        const rect = win.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        focusWindow(win);
      });
 
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = (e.clientX - dragOffsetX) + 'px';
        win.style.top = Math.max(26, e.clientY - dragOffsetY) + 'px'; // non sopra la menu bar
      });
 
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
 
      // ---- RESIZE semplice ----
      const resizeHandle = win.querySelector('.resize-handle');
      let isResizing = false;
      resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        e.stopPropagation();
      });
      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const rect = win.getBoundingClientRect();
        win.style.width = Math.max(280, e.clientX - rect.left) + 'px';
        win.style.height = Math.max(180, e.clientY - rect.top) + 'px';
      });
      document.addEventListener('mouseup', () => { isResizing = false; });
 
      // ---- BOTTONI ----
      win.querySelector('.tl-close').addEventListener('click', () => closeWindow(name, win));
      win.querySelector('.tl-min').addEventListener('click', () => minimizeWindow(win));
      win.querySelector('.tl-max').addEventListener('click', () => toggleMaximize(win));
 
      activeAppName.textContent = name;
      document.querySelector(`.dock-icon[data-name="${name}"]`)?.classList.add('open');
    }
 
    function focusWindow(win) {
      win.style.zIndex = ++zIndexCounter;
      const title = win.querySelector('.window-title').textContent;
      activeAppName.textContent = title;
    }
 
    function closeWindow(name, win) {
      win.classList.add('closing');
      win.addEventListener('animationend', () => {
        win.remove();
        delete openWindows[name];
        document.querySelector(`.dock-icon[data-name="${name}"]`)?.classList.remove('open');
      }, { once: true });
    }
 
    function minimizeWindow(win) {
      // versione semplice: nasconde, un vero minimize animerebbe verso il dock
      win.style.display = 'none';
    }
 
    function toggleMaximize(win) {
      win.classList.toggle('maximized');
    }
 
    // ---------- CLICK SULLE ICONE DEL DOCK ----------
    icons.forEach(icon => {
      icon.addEventListener('click', () => {
        const name = icon.dataset.name;
        const rect = icon.getBoundingClientRect();
        const originX = rect.left + rect.width / 2 - 140; // relativo alla finestra
        const originY = rect.top;
        createWindow(name, icon.dataset.icon, originX, originY);
      });
    });