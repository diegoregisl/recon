const ytdl = require('@distube/ytdl-core');

async function test() {
  try {
    const info = await ytdl.getInfo('3ACwaoXbKVc');
    console.log("Success! Title:", info.videoDetails.title);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    console.log("Audio URL:", audioFormats[0].url.substring(0, 50) + "...");
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
