const SUPABASE_URL = "https://sdmzsatfgyftmptmchvp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbXpzYXRmZ3lmdG1wdG1jaHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDg0NTcsImV4cCI6MjA5ODY4NDQ1N30.8D1GyO2peUyyKiuEMQYbfhrfsaAMbQ1CY9wvdDa05Aw";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const holdTimer = 100;


const Div_display = document.getElementById('timer');
const Btn_timerPressable = document.getElementById('container');
const recordOverlay = document.getElementById('recordOverlay');
const recordForm = document.getElementById('recordForm');
const recordCancal = document.getElementById('recordCancel');
const Txt_timerBrut= document.getElementById('timerBrut');
const Txt_timerFinal= document.getElementById('timerFinal');

let timerActive = false;
let ms = 0;
let startMs = 0;
let interval = null;
let intervalToStart = null;

recordOverlay.addEventListener('pointerdown', (e) => e.stopPropagation());
recordOverlay.addEventListener('pointerup', (e) => e.stopPropagation());


const Btns_penality = document.getElementsByClassName("penalityButtonToAdd");
const Div_penalityAdded = document.getElementById("penalityAdded");
const Div_penalityToAdd = document.getElementById("penalityToAdd");
const Txt_penality = document.getElementById("penalityCounter");

let penality = 0;

for(let btn of Btns_penality){
    btn.addEventListener('click', ()=>{
        const penalityButton = document.createElement('button');
        penalityButton.type = 'button';
        penalityButton.classList.add('penalityButtonAdded');
        penalityButton.textContent = btn.textContent.replace("+", "-");
        penalityButton.value = btn.value
        penalityButton.addEventListener('click', () => {
            penality -= Number(btn.value);
            penalityButton.remove();
            updatePenality();
        });
        Div_penalityAdded.appendChild(penalityButton);
        penality += Number(btn.value);
        updatePenality();
        console.log("penality : " + penality);
    })


}


recordCancal.addEventListener('click', () => { 
    recordOverlay.classList.remove('active');
     ms = 0; 
        Div_display.textContent = formatTime(ms);
    });

recordForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const category = document.getElementById('category').value;
    const officiel = document.getElementById('officiel').checked;
    const finalScore= GetFinalScore();
    const author = document.getElementById('author').value;


    const { data, error } = await supabaseClient.from('SpeedScothing').insert([{
        time:finalScore, 
        penalty:penality,
        category: category,
        officiel: officiel,
        author: author,
    }]);
    if (error) {
        console.error('Erreur Supabase:', error);
        alert("Erreur lors de l'enregistrement, réessaie.");
        return;
    }

    console.log('Record enregistré:', data);
    recordOverlay.classList.remove('active');

    recordOverlay.classList.remove('active');
})

Btn_timerPressable.addEventListener('pointerdown', ()=>{

    if(timerActive) return;
    startMs = 0;
    ms = 0;
    Div_display.classList.add('timerStart');
    
    if(intervalToStart) return;
    intervalToStart = setInterval(()=>{
        startMs++;
        if(startMs > holdTimer){
            Div_display.classList.add('timerHolded');
        }
    }, 10);

});

Btn_timerPressable.addEventListener('pointerup', ()=>{
    if(timerActive){

        console.log("click");
        timerActive = false;
        clearInterval(interval);
        interval = null;
        OpenRecordForm();
        return;
    }
    Div_display.classList.remove('timerStart');
    Div_display.classList.remove('timerHolded');
    clearInterval(intervalToStart);
    intervalToStart = null;

    if(startMs > holdTimer){
        timerActive = true;
        interval = setInterval(()=>{
            ms++;
            Div_display.textContent = formatTime(ms);
        }, 10)
    }
    startMs = 0;

    
});




function formatTime(seconds){
  const totalSeconds = Math.floor(seconds / 100);
  const cs = seconds % 100; // centièmes restants

  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  const c = String(cs).padStart(2, '0');

  return `${h}:${m}:${s}.${c}`;
}


function OpenRecordForm(){

    recordOverlay.classList.add('active');
    Txt_timerBrut.textContent ="timer brute : " +formatTime(ms);
    updatePenality();
}

function updatePenality(){
    Txt_penality.textContent= "Pénalités: +"+ penality +"s"
    Txt_timerFinal.textContent ="timer final : " +formatTime(GetFinalScore());

}

function GetFinalScore(){
    return ms + (penality * 100);
}
