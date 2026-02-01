// Pitanja i tipovi
const data = [
  ["Moje dijete često ponovno zapisuje nastavno gradivo.", "V"],
  ["Moje dijete može s lakoćom pratiti usmena objašnjenja.", "A"],
  ["Moje dijete rado sudjeluje u vježbama u kojima se glumi po ulogama.", "M"],
  ["Moje dijete lako razumije tekstualne zadatke.", "V"],
  ["Moje dijete se dobro prisjeti priče odslušane na radiju.", "A"],
  ["Moje dijete rado jede ili pije dok uči.", "M"],
  ["Moje dijete se bolje sjeti priča s televizije nego s radija.", "V"],
  ["Moje dijete s lakoćom slijedi usmene upute.", "A"],
  ["Moje dijete lakše uči ako se može kretati.", "M"],
  ["Moje dijete lakše uči uz slike.", "V"],
  ["Moje dijete može učiti samo u mirnom okruženju.", "A"],
  ["Moje dijete puno gestikulira dok govori.", "M"],
  ["Moje dijete pamti ono što učitelj zapisuje na ploču.", "V"],
  ["Moje dijete se lako prisjeti melodija.", "A"],
  ["Moje dijete voli dodirivati i izrađivati predmete.", "M"],
  ["Moje dijete zapisuje važne stvari kako bi ih zapamtilo.", "V"],
  ["Moje dijete pomiče usne dok u sebi čita.", "A"],
  ["Moje dijete voli oponašati radnje.", "M"],
  ["Moje dijete može slikovito predočiti gradivo.", "V"],
  ["Moje dijete bolje pamti ako uči naglas.", "A"],
  ["Moje dijete ne može mirno sjediti dok čita.", "M"],
  ["Mojem djetetu pomažu crteži i dijagrami.", "V"],
  ["Moje dijete glasno izgovara sadržaj prilikom učenja.", "A"],
  ["Moje dijete se lako prisjeti stvari koje je dodirivalo.", "M"]
];

// Generiraj pitanja
const qDiv = document.getElementById("questions");
data.forEach((q, i) => {
  qDiv.innerHTML += `
    <div class="question">
      <p>${i + 1}. ${q[0]}</p>
      <div class="answers">
        <label><input type="radio" name="q${i}" value="2"><span>Uvijek</span></label>
        <label><input type="radio" name="q${i}" value="1"><span>Katkad</span></label>
        <label><input type="radio" name="q${i}" value="0"><span>Nikad</span></label>
      </div>
    </div>`;
});

function calculate() {
  const email = document.getElementById("email").value;
  const consent = document.getElementById("consent").checked;

  // Validacija
  if (!email || !consent) {
    alert("Molimo unesite e-mail i prihvatite privolu.");
    return;
  }

  // Provjeri jesu li odgovorena sva pitanja
  let allAnswered = true;
  data.forEach((q, i) => {
    const answer = document.querySelector(`input[name="q${i}"]:checked`);
    if (!answer) allAnswered = false;
  });

  if (!allAnswered) {
    alert("Molimo odgovorite na sva pitanja.");
    return;
  }

  // Izračunaj bodove
  let scores = { V: 0, A: 0, M: 0 };
  data.forEach((q, i) => {
    const answer = document.querySelector(`input[name="q${i}"]:checked`);
    if (answer) {
      scores[q[1]] += Number(answer.value);
    }
  });

  // Određi dominantan tip
  const max = Math.max(scores.V, scores.A, scores.M);
  let dominant = [];
  if (scores.V === max) dominant.push("Vizualni");
  if (scores.A === max) dominant.push("Auditivni");
  if (scores.M === max) dominant.push("Motorički");

  const dominantString = dominant.join(", ");

  // Spremi u Google Sheet
  fetch("/.netlify/functions/saveEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      visual: scores.V,
      auditory: scores.A,
      motor: scores.M,
      dominant: dominantString
    })
  });

  // Prikaži rezultat
  renderResult(scores, dominant);
}

function renderResult(scores, dominant) {
  document.getElementById("test").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  const title = dominant.length === 1
    ? `Dominantan stil učenja: ${dominant[0]}`
    : `Mješoviti stil učenja: ${dominant.join(" i ")}`;

  const html = `
    <div class="result-card">
      <h2>${title}</h2>

      <p><strong>Bodovi:</strong></p>
      <p>Vizualni (${scores.V})</p><div class="bar" style="width:${scores.V * 6}%"></div>
      <p>Auditivni (${scores.A})</p><div class="bar" style="width:${scores.A * 6}%"></div>
      <p>Motorički (${scores.M})</p><div class="bar" style="width:${scores.M * 6}%"></div>

      <div class="tip">
        <h3>Kako moje dijete uči?</h3>
        ${getDescriptions(dominant)}

        <h3>Savjeti za učenje</h3>
        ${getTips(dominant)}
      </div>
    </div>`;

  document.getElementById("resultContent").innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getDescriptions(types) {
  const descriptions = {
    Vizualni: `
      <h4>Vizualni tip učenika</h4>
      <p>
        Vizualni tip učenika najbolje uči gledanjem. Lakše pamti informacije koje su
        prikazane kroz slike, crteže, dijagrame, boje i pisani tekst.
        Takva djeca vole uredne bilješke i jasno strukturirano gradivo.
      </p>`,
    Auditivni: `
      <h4>Auditivni tip učenika</h4>
      <p>
        Auditivni tip učenika najbolje usvaja znanje slušanjem. Dobro pamti usmena
        objašnjenja, razgovore, melodije i ritam govora.
        Učenje naglas i rasprava o gradivu pomažu mu u razumijevanju.
      </p>`,
    Motorički: `
      <h4>Motorički tip učenika</h4>
      <p>
        Motorički tip učenika najbolje uči kroz pokret i praktične aktivnosti.
        Teško dugo miruje, voli dodirivati, isprobavati i učiti kroz iskustvo.
        Učenje u pokretu za njega je najučinkovitije.
      </p>`
  };

  return types.map(t => descriptions[t]).join("");
}

function getTips(types) {
  const tips = {
    Vizualni: `<ul>
      <li>Koristite slike, dijagrame i boje.</li>
      <li>Neka dijete zapisuje i podcrtava.</li>
      <li>Učite uz mentalne mape.</li>
    </ul>`,
    Auditivni: `<ul>
      <li>Učenje naglas i razgovor o gradivu.</li>
      <li>Slušanje objašnjenja i snimki.</li>
      <li>Ritmovi, rime i pjesmice.</li>
    </ul>`,
    Motorički: `<ul>
      <li>Učenje u pokretu i kroz igru.</li>
      <li>Korištenje modela i predmeta.</li>
      <li>Kratke pauze i aktivno ponavljanje.</li>
    </ul>`
  };

  return types.map(t => tips[t]).join("");
}

function restart() {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("test").classList.remove("hidden");
  
  // Obriši sve odgovore
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.getElementById("email").value = "";
  document.getElementById("consent").checked = false;
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}