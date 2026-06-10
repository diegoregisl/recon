const { YoutubeTranscript } = require('youtube-transcript');
YoutubeTranscript.fetchTranscript('3ACwaoXbKVc').then(t => console.log('Length:', t.length)).catch(e => console.error('Error:', e.message));
