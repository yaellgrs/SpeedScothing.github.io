


const cateButtons = document.querySelectorAll('.cateBtn');
const recordTable = document.getElementById('recordTable');
const Box_showOfficiel = document.getElementById('showOfficiel');

let currentCate = null;

Box_showOfficiel.addEventListener('change', ()=>{
    if(currentCate) loadRecords(currentCate);
})

for(let btn of cateButtons){
    btn.addEventListener('click', ()=>{
        currentCate = btn.dataset.cate;
        loadRecords(btn.dataset.cate);
    })
}

async function loadRecords(category){
    let showOfficiel = Box_showOfficiel.checked;
    let query = supabaseClient
    .from('SpeedScothing')
    .select('*')
    .eq('category', category)
    .order('time', {ascending: true});

    if(showOfficiel){
        query = query.eq('officiel', true);
    }

    const {data, error} = await query;

    if (error) {
        console.error('Erreur Supabase:', error);
        recordTable.innerHTML = "Erreur lors du chargement des records.";
        return;
    }

    displayRecords(data, category);
}

function displayRecords(records, category){


    let html = `<h1>Classment ${category}</h2>`;
    html+=`<table>
        <thead>
            <tr>
                <th>#</th>
                <th>Author</th>
                <th>Temps</th>
                <th>Dont Penalités</th>
                <th>Officiel</th>
                <th>Date</th>
            </tr>
        </thead>
    <tbody>`;

    records.forEach((record, index) => {
        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${record.author}</td>
            <td>${formatTime(record.time)}</td>
            <td>${record.penalty}s</td>
            <td>${record.officiel}</td>
            <td>${GetDate(record.date)}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    recordTable.innerHTML = html;
}




function GetDate(isoString){
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}