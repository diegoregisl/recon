async function test() {
  const res = await fetch("https://recon-digital.onrender.com/api/analyze-sermon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId: "3ACwaoXbKVc", vibe: "Edificante e Prático" })
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Mocked?", !!data.devocional.titulo.includes("Sermão Analisado: Caminhando"));
}
test();
