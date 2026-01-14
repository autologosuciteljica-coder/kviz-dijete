function calculate() {
  const email = document.getElementById("email").value;
  const consent = document.getElementById("consent").checked;

  if (!email || !consent) {
    alert("Molimo unesite e-mail i prihvatite privolu.");
    return;
  }

  const answer = document.querySelector('input[name="q1"]:checked');
  if (!answer) {
    alert("Molimo odgovorite na pitanje.");
    return;
  }

  const visual = Number(answer.value);
  const auditory = 0;
  const motor = 0;
  const dominant = "Vizualni";

  // SPREMANJE U GOOGLE SHEET
  fetch("/.netlify/functions/saveEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      visual,
      auditory,
      motor,
      dominant
    })
  });

  document.getElementById("test").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("resultText").innerText =
    "Dominantan stil učenja: " + dominant;
}

function restart() {
  location.reload();
}
