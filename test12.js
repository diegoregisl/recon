const videoId = "3ACwaoXbKVc";
const proxyUrl = `https://corsproxy.io/?${encodeURIComponent('https://www.youtube.com/watch?v=' + videoId)}`;

async function test() {
  try {
    const res = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      }
    });
    const html = await res.text();
    const captionsMatch = html.match(/"captions":({.*?})}/);
    if (captionsMatch) {
      console.log("Found captions!");
    } else {
      console.log("Could not find captions in HTML. Length:", html.length);
    }
  } catch (e) {
    console.error(e);
  }
}
test();
