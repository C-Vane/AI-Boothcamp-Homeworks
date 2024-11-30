from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Initialize the CLIP model
checkpoint = "openai/clip-vit-large-patch14"
detector = pipeline(model=checkpoint, task="zero-shot-image-classification")

# Predefined animal labels
ANIMAL_LABELS = [
    "lion", "tiger", "bear", "wolf", "snake",
    "shark", "crocodile", "elephant", "rhinoceros", "hippopotamus"
]

@app.route('/classify', methods=['POST'])
def classify_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image part'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Read and process the image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Get predictions
        predictions = detector(
            image,
            candidate_labels=ANIMAL_LABELS,
        )

        # Format results
        results = []
        for i, prediction in enumerate(predictions, 1):
            label = prediction["label"]
            score = prediction["score"] * 100
            
            # Generate appropriate suffix
            if 11 <= (i % 100) <= 13:
                suffix = "th"
            else:
                suffix = ["th", "st", "nd", "rd", "th"][min(i % 10, 4)]
                
            results.append({
                "label": label,
                "confidence": f"{score:.2f}",
                "rank": f"{i}{suffix}"
            })

        return jsonify({
            'message': 'Image classified successfully',
            'predictions': results
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)