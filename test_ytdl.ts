import ytdl from '@distube/ytdl-core';
import fs from 'fs';

async function test() {
  console.log("Starting download...");
  const videoId = "3ACwaoXbKVc"; // short test video
  const stream = ytdl(videoId, { filter: 'audioonly', quality: 'lowestaudio' });
  const writeStream = fs.createWriteStream('test_audio.mp4');
  stream.pipe(writeStream);
  
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
  console.log("Download finished!");
}

test().catch(console.error);
