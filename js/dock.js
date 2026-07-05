function updateClock(){
    const now = new Date();
    const giorni = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
    const giorno = giorni[now.getDay()];
    const ora = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${giorno} ${ora}:${min}`;
}

updateClock();

setInterval(updateClock, 1000 * 10); //aggiorna ogni 10s

// -- Dock -- //

const dock = document.getElementById('dock');
const icons = document.querySelectorAll('.dock-icon');
const activeAppName = document.getElementById('activeAppName');

const Max_Scale = 1.6;
const Distance_Range = 100; 

dock.addEventListener('mousemove', (e)=> {
    const mouseX = e.clientX;

    icons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - iconCenterX);

        let scale = 1;
        if(distance < Distance_Range){
            const promixity = 1 - distance / Distance_Range;
            scale = 1 + promixity * (Max_Scale - 1);
        }
        icon.style.transform = `scale(${scale})`;
    });
});

dock.addEventListener('mouseleave', () =>{
   icons.forEach(icon => {
    icon.style.transform = 'scale(1)';
   });
});

//-- Click Folder -- //

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const name = icon.dataset.name;
        activeAppName.textContent = name;

        icon.classList.add('open');
        console.log(`Apri Finestra: ${name}`)
    });
});