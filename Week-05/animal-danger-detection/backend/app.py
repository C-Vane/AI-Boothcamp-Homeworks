from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import torch
from transformers import CLIPProcessor, CLIPModel
import traceback  # Add this import

app = Flask(__name__)
CORS(app)

# Initialize the CLIP model and processor
try:
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    traceback.print_exc()
    raise

# Predefined animal labels
ANIMAL_LABELS = [
    # Dangerous wild cats
    "African lion", "Bengal tiger", "leopard", "cheetah", "jaguar",
    
    # Dangerous canids
    "gray wolf", "African wild dog", "coyote",
    
    # Dangerous reptiles
    "king cobra", "black mamba", "komodo dragon", "saltwater crocodile", "alligator",
    
    # Large dangerous mammals
    "African elephant", "hippopotamus", "white rhinoceros", "grizzly bear", "polar bear",
    
    # Marine predators
    "great white shark", "tiger shark", "killer whale",
    
    # Venomous spiders
    "black widow spider", "brown recluse spider", "tarantula",
    
    # Common pets
    "domestic cat", "golden retriever", "budgie parakeet", "hamster", "guinea pig",
    
    # Small mammals
    "house mouse", "brown rat", "eastern gray squirrel", "european rabbit"
]

@app.route('/classify', methods=['POST'])
def classify_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image part'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Check file type
        allowed_types = {'image/jpeg', 'image/png', 'image/jpg', 'image/gif'}
        if file.content_type not in allowed_types:
            return jsonify({
                'error': f'Unsupported image format: {file.content_type}. Please use JPEG, PNG, or GIF formats.'
            }), 400

        # Read and process the image
        try:
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
            
            # Print image information for debugging
            print(f"Image format: {image.format}")
            print(f"Image size: {image.size}")
            print(f"Image mode: {image.mode}")
            
            # Convert image to RGB if it's not
            if image.mode != 'RGB':
                image = image.convert('RGB')
                
        except Exception as e:
            print(f"Error details: {str(e)}")
            print(f"File info: {file.filename}, {file.content_type}")
            return jsonify({'error': 'Please upload a valid JPEG, PNG, or GIF image.'}), 400

        # Prepare inputs
        try:
            inputs = processor(
                images=image,
                text=ANIMAL_LABELS,
                return_tensors="pt",
                padding=True
            )
        except Exception as e:
            return jsonify({'error': f'Error processing with CLIP: {str(e)}'}), 500

        # Get model predictions
        try:
            outputs = model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = torch.softmax(logits_per_image, dim=1)[0]
            sorted_indices = torch.argsort(probs, descending=True)
            animal = ANIMAL_LABELS[sorted_indices[0]]
            score = probs[sorted_indices[0]].item()  # Convert to Python float
        except Exception as e:
            return jsonify({'error': f'Error in model prediction: {str(e)}'}), 500
        
        return jsonify({
            "animal": animal,
            "score": score,
        }), 200

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)