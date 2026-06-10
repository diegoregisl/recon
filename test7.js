async function test() {
  try {
    const res = await fetch("https://yt.lemnoslife.com/noKey/captions?videoId=3ACwaoXbKVc");
    const data = await res.json();
    console.log(data);
  } catch(e) {
    console.error(e.message);
  }
}
test();
