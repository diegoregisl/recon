async function test() {
  try {
    const res = await fetch("https://kome.ai/api/tools/youtube-transcripts?video_id=3ACwaoXbKVc");
    const data = await res.json();
    console.log("Success?", !!data.transcript);
  } catch (e) {
    console.error(e.message);
  }
}
test();
