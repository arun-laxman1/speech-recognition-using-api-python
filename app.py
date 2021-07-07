from flask import Flask, request, render_template, redirect
import speech_recognition as sr

app = Flask(__name__)

@app.route("/", methods=['POST', 'GET'])
def index():
    translation = ""
    if request.method == "POST":
        f = request.files['audio_data']
        lang = request.form.get('lang')

        if "audio_data" not in request.files:
            return redirect(request.url)
        
        if f.filename == "":
            return redirect(request.url)
        
        if f:
            r = sr.Recognizer()
            audioFile = sr.AudioFile(f)
            with audioFile as source:
                data = r.record(source)
            translation = r.recognize_google(data, key=None, language=lang)
            
        return translation
    else:
        return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
