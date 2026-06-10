import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('3ACwaoXbKVc');
    const transcriptData = await info.getTranscript();
    const text = transcriptData.transcript.content.choices.map(c => c.text).join(' ');
    console.log("Success! Length:", text.length);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
