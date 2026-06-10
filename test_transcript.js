const videoId = "3ACwaoXbKVc";
const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + videoId)}`;

async function test() {
  try {
    const res = await fetch(proxyUrl);
    const html = await res.text();
    const captionsMatch = html.match(/"captions":({.*?})}/);
    if (captionsMatch) {
      console.log("Found captions!");
      const captionsObj = JSON.parse(captionsMatch[1] + "}");
      const tracks = captionsObj.playerCaptionsTracklistRenderer?.captionTracks;
      if (tracks && tracks.length > 0) {
        console.log("Caption URL:", tracks[0].baseUrl);
      } else {
        console.log("No caption tracks found in object.");
      }
    } else {
      console.log("Could not find captions in HTML.");
    }
  } catch (e) {
    console.error(e);
  }
}
test();
