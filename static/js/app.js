URL = window.URL || window.webkitURL;

var gumStream;                      
var rec;                            
var input;                          
 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext 

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");


recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

function startRecording() {
    var constraints = { audio: true, video:false }

    recordButton.disabled = true;
    stopButton.disabled = false;

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

        audioContext = new AudioContext();

        gumStream = stream;

        input = audioContext.createMediaStreamSource(stream);

        rec = new Recorder(input,{numChannels:1})

        rec.record()
    }).catch(function(err) {
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}


function stopRecording() {
    stopButton.disabled = true;
    recordButton.disabled = false;

    rec.stop();

    gumStream.getAudioTracks()[0].stop();

    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
    
    document.getElementById("recording").innerHTML = "";
    document.getElementById("up").innerHTML = "";
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');

    var filename = new Date().toISOString();

    au.controls = true;
    au.src = url;

    recording.appendChild(au);

    var upload = document.createElement('button');
    upload.innerHTML = "Convert";
    upload.className = "button";
    upload.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          var lang = document.getElementById("language").value;
          xhr.onreadystatechange = function() {
              if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                document.getElementById("result").innerHTML = "You said:    "+ xhr.responseText;
              }
          }
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          fd.append("lang",lang);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    up.appendChild(upload);
}