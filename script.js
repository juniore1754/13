const titreInput = document.getElementById("titre");
const texteArea = document.getElementById("texte");
const status = document.getElementById("status");
const dateEl = document.getElementById("date");
const wordCountEl = document.getElementById("wordCount");
const charCountEl = document.getElementById("charCount");
const textesList = document.getElementById("textesList");
const searchInput = document.getElementById("search");
const themeBtn = document.getElementById("themeBtn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const exportBtn = document.getElementById("exportBtn");

let textes = JSON.parse(localStorage.getItem("textes")) || [];

// Afficher date
function afficherDate(){
    const now = new Date();
    dateEl.textContent = now.toLocaleString("fr-FR",{dateStyle:"long",timeStyle:"short"});
}
setInterval(afficherDate,1000);
afficherDate();

// Compteur mots/caractères
texteArea.addEventListener("input",()=>{
    wordCountEl.textContent = texteArea.value.trim() ? texteArea.value.trim().split(/\s+/).length : 0;
    charCountEl.textContent = texteArea.value.length;
});

// Afficher la liste des textes
function afficherListe(){
    textesList.innerHTML="";
    textes.forEach((t,index)=>{
        const li = document.createElement("li");
        li.textContent = `${t.titre} (${t.date})`;
        li.addEventListener("click", ()=>chargerTexte(index));
        textesList.appendChild(li);
    });
}
afficherListe();

// Enregistrer texte
function enregistrer(){
    const titre = titreInput.value.trim() || "Sans titre";
    const contenu = texteArea.value.trim();
    if(!contenu){ status.textContent="❌ Texte vide"; return; }
    const date = new Date().toLocaleString("fr-FR");

    const index = textes.findIndex(t=>t.titre===titre);
    if(index>=0){
        textes[index].contenu = contenu;
        textes[index].date = date;
    } else {
        textes.push({titre, contenu, date});
    }
    localStorage.setItem("textes", JSON.stringify(textes));
    afficherListe();
    status.textContent="✅ Texte enregistré";
}

// Charger texte
function chargerTexte(index){
    const t = textes[index];
    if(t){
        titreInput.value = t.titre;
        texteArea.value = t.contenu;
        wordCountEl.textContent = t.contenu.trim() ? t.contenu.trim().split(/\s+/).length : 0;
        charCountEl.textContent = t.contenu.length;
        status.textContent="📂 Texte chargé";
    }
}

// Supprimer texte
function supprimerTexte(){
    const titre = titreInput.value.trim();
    if(!titre) return;
    textes = textes.filter(t=>t.titre!==titre);
    localStorage.setItem("textes", JSON.stringify(textes));
    afficherListe();
    titreInput.value=""; texteArea.value="";
    wordCountEl.textContent=0; charCountEl.textContent=0;
    status.textContent="🗑 Texte supprimé";
}

// Filtrer textes
searchInput.addEventListener("input", ()=>{
    const search = searchInput.value.toLowerCase();
    textesList.innerHTML="";
    textes.filter(t=>t.titre.toLowerCase().includes(search) || t.contenu.toLowerCase().includes(search))
        .forEach((t,index)=>{
            const li = document.createElement("li");
            li.textContent = `${t.titre} (${t.date})`;
            li.addEventListener("click", ()=>chargerTexte(index));
            textesList.appendChild(li);
        });
});

// Export TXT
function exportTXT(){
    const titre = titreInput.value.trim() || "Sans_titre";
    const contenu = texteArea.value;
    if(!contenu){ status.textContent="❌ Rien à exporter"; return; }
    const blob = new Blob([contenu], {type:"text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${titre}.txt`;
    link.click();
}

// Mode clair/sombre
themeBtn.addEventListener("click", ()=>document.body.classList.toggle("dark"));

// Boutons avec addEventListener
saveBtn.addEventListener("click", enregistrer);
deleteBtn.addEventListener("click", supprimerTexte);
exportBtn.addEventListener("click", exportTXT);
