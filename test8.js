async function test() {
  try {
    const res = await fetch("https://pipedapi.kavin.rocks/streams/3ACwaoXbKVc");
    const data = await res.json();
    if (data.subtitles && data.subtitles.length > 0) {
      console.log("Found subtitles:", data.subtitles);
      // Fetch the actual subtitle
      const subRes = await fetch(data.subtitles[0].url);
      const subText = await subRes.text();
      console.log("Subtitle text length:", subText.length);
    } else {
      console.log("No subtitles found.");
    }
  } catch(e) {
    console.error(e.message);
  }
}
test();
