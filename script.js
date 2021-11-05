var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
  var recorder = new MediaRecorder(stream);
  console.log('Recording started');
  // recorder.setAudioSource(MediaRecorder.AudioSource.VOICE_COMMUNICATION);
  // console.log('2');
  // recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
  // console.log('3');
  // recorder.setOutputFile("/dev/null");
  // console.log('4');
  // recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

  // recorder.prepare();
  recorder.start();
}

var canvas = document.createElement('canvas');
var stream = canvas.captureStream(25);

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var color = event.results[0][0].transcript.toLowerCase().replace(/\.+$/, "");
  diagnostic.textContent = 'Result received: ' + color + '.';
  bg.style.backgroundColor = color;
  bg.style.backgroundColor = 'green.';
  console.log('Confidence: ' + event.results[0][0].confidence);
}

let chunks = [];
let blob;

recorder.ondataavailable = function(e) {
  chunks.push(e.data);
}

recognition.onspeechend = function() {
  recognition.stop();
  recorder.stop();

  const clipName = prompt('Enter a name for your sound clip');

  const clipContainer = document.createElement('article');
  const clipLabel = document.createElement('p');
  const audio = document.createElement('audio');
  const deleteButton = document.createElement('button');

  clipContainer.classList.add('clip');
  audio.setAttribute('controls', '');
  deleteButton.innerHTML = "Delete";
  clipLabel.innerHTML = clipName;

  clipContainer.appendChild(audio);
  clipContainer.appendChild(clipLabel);
  clipContainer.appendChild(deleteButton);
  soundClips.appendChild(clipContainer);

  blob = new Blob(chunks, { 'type' : 'audio/mp3' });
  // chunks = [];
  const audioURL = window.URL.createObjectURL(blob);
  audio.src = audioURL;
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
