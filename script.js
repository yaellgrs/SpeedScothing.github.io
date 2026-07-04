const Div_display = document.getElementById('timer');
const Btn_start = document.getElementById('start');
const Btn_stop = document.getElementById('stop');
const Btn_reset = document.getElementById('reset');

const Btn_timerPressable = document.getElementById('container');

let ms = 0;
let interval = null;

let timerActive = false;

let startMs = 0;
let intervalToStart = null;

console.log(document.getElementById("timerPressable"));

Btn_timerPressable.addEventListener('pointerdown', ()=>{

    if(timerActive) return;
    startMs = 0;
    ms = 0;
    Div_display.classList.add('timerStart');
    
    if(intervalToStart) return;
    intervalToStart = setInterval(()=>{
        startMs++;
    }, 10);

});

Btn_timerPressable.addEventListener('pointerup', ()=>{
    if(timerActive){

        console.log("click");
        timerActive = false;
        clearInterval(interval);
        interval = null;
        return
    }

    console.log("up");
    Div_display.classList.remove('timerStart');

    clearInterval(intervalToStart);
    intervalToStart = null;

    if(startMs > 100){
        console.log("start timer");
        timerActive = true;
        interval = setInterval(()=>{
            ms++;
            Div_display.textContent = formatTime(ms);
        }, 10)
    }
    startMs = 0;

    
});





// Btn_start.addEventListener('click', () =>{
//     if(interval) return;

// });

// Btn_stop.addEventListener('click', ()=>{
//     clearInterval(interval);
//     interval = null;
// });

// Btn_reset.addEventListener('click', ()=>{
//     clearInterval(interval);
//     interval = null;
//     ms = 0;
//     Div_display.textContent  = formatTime(ms);
// });





function formatTime(seconds){
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}