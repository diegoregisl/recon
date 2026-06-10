const videoId = "3ACwaoXbKVc";
const proxyUrl = `https://corsproxy.io/?${encodeURIComponent('https://www.youtube.com/watch?v=' + videoId)}`;

async function test() {
  try {
    const res = await fetch(proxyUrl);
    const html = await res.text();
    const captionsMatch = html.match(/"captions":({.*?})}/);
    if (captionsMatch) {
      console.log("Found captions!");
    } else {
      console.log("Could not find captions in HTML.");
    }
  } catch (e) {
    console.error(e);
  }
}
test();
