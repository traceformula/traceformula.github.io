# pip install google-cloud-vision
import argparse
from google.cloud import vision

def detect_landmarks(path):
    client = vision.ImageAnnotatorClient()
    with open(path, 'rb') as f:
        content = f.read()
    image = vision.Image(content=content)
    response = client.landmark_detection(image=image)
    lands = response.landmark_annotations
    results = []
    for lm in lands:
        name = lm.description
        score = lm.score
        # each location may contain latLng field(s)
        locations = []
        for loc in lm.locations:
            ll = loc.lat_lng
            locations.append((ll.latitude, ll.longitude))
        results.append({"name": name, "score": score, "locations": locations})
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Google Cloud Vision Options")
    parser.add_argument("image", help="Path to the image file")
    args = parser.parse_args()

    print(detect_landmarks(args.image))
