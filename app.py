from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from googletrans import Translator
import os

app = Flask(__name__)
CORS(app)

translator = Translator()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text', '')
    
    try:
        translation = translator.translate(text, src='en', dest='es')
        return jsonify({'translation': translation.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
