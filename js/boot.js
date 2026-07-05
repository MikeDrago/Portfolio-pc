(function (){
    const bootScreen = document.getElementById('boot-screen');
    const progressFill = document.getElementById('progressFill');

    let progress = 0;
    const duration = 1800; //ms totali del boot
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = 100 / steps;

    const interval = setInterval (() => {
        progress += increment;
        if(progress >= 100){
            progress = 100;
            clearInterval(interval);
            finishBoot();
        }
        progressFill.style.width = progress + '%'
    }, stepTime);

    function finishBoot(){
        setTimeout(() =>{
            bootScreen.classList.add('hidden');

            setTimeout(() =>{
                bootScreen.remove();
            }, 800);
        }, 200); //serve per la pausa quando la barra finisce
    }
}) ();