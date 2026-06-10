async function test() {
  const instances = [
    "https://invidious.nerdvpn.de",
    "https://invidious.privacydev.net",
    "https://vid.puffyan.us"
  ];
  for (let inst of instances) {
    try {
      console.log("Trying", inst);
      const res = await fetch(`${inst}/api/v1/videos/3ACwaoXbKVc`);
      const data = await res.json();
      if (data.captions && data.captions.length > 0) {
        console.log("Found captions on", inst);
        return;
      }
    } catch(e) {
      console.error(e.message);
    }
  }
}
test();
