from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open('perfumes.json') as f:
    perfumes = json.load(f)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    best_match = None
    best_score = -1

    for p in perfumes:
        score = 0
        if p['cinsiyet'] == data['cinsiyet']:
            score += 1
        if data['yas'] in p['yas']:
            score += 1
        if data['koku'] in p['notalar']:
            score += 1
        if data['stil'] in p['stil']:
            score += 1
        if data['mevsim'] in p['mevsim']:
            score += 1

        if score > best_score:
            best_score = score
            best_match = p

    return jsonify(best_match)

if __name__ == '__main__':
    app.run(debug=True)
