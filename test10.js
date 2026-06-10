async function test() {
  const res = await fetch("https://recon-digital.onrender.com/api/live-video");
  console.log("Status:", res.status);
  console.log("Headers:", Object.fromEntries(res.headers.entries()));
  const text = await res.text();
  console.log("Body snippet:", text.substring(0, 100));
}
test();
