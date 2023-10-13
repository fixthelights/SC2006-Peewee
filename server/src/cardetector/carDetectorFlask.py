import onnxruntime as ort
from flask import request, Flask, jsonify
from waitress import serve
from PIL import Image, ImageDraw
import numpy as np
import os
import io
import requests as new_request

app = Flask(__name__)


def main():
    # Use insecure HTTP flask server for development
    app.run(debug=True, use_debugger=False, use_reloader=True, port=8080)
    #serve(app, host='0.0.0.0', port=8080)


@app.route("/detect", methods=["POST"])
def detect():
    """
        Handler of /detect POST endpoint
        Receives uploaded file with a name "image_file", passes it
        through YOLOv8 object detection network and returns and array
        of bounding boxes.
        :return: a JSON array of objects bounding boxes in format [[x1,y1,x2,y2,object_type,probability],..]
    """
    #buf = request.files["image_file"]
    file_path = request.args.get("file_path")

    if not file_path:
        return jsonify({"error": "Missing 'file_path' parameter in query"}), 400

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    #buf = open("1711.jpg","rb")
    boxes = detect_objects_on_image(file_path)
    draw_boxes_on_image(file_path, boxes)
    return(count_object_types(boxes))


@app.route("/detect-url", methods=["POST"])
def detect_url():
    """
        Handler of /detect POST endpoint
        Receives uploaded file with a name "image_file", passes it
        through YOLOv8 object detection network and returns and array
        of bounding boxes.
        :return: a JSON array of objects bounding boxes in format [[x1,y1,x2,y2,object_type,probability],..]
    """
    #buf = request.files["image_file"]

    url = request.args.get("url")
    response = new_request.get(url)
    buf = io.BytesIO(response.content)

    if not url:
        return jsonify({"error": "Missing 'url' parameter in query"}), 400

    #buf = open("1711.jpg","rb")
    boxes = detect_objects_on_image(buf)
    draw_boxes_on_image(buf, boxes)
    return(count_object_types(boxes))


def detect_objects_on_image(buf):
    """
    Function receives an image,
    passes it through YOLOv8 neural network
    and returns an array of detected objects
    and their bounding boxes
    :param buf: Input image file stream
    :return: Array of bounding boxes in format [[x1,y1,x2,y2,object_type,probability],..]
    """
    input, img_width, img_height = prepare_input(buf)
    output = run_model(input)
    return process_output(output, img_width, img_height)


def prepare_input(buf):
    """
    Function used to convert input image to tensor,
    required as an input to YOLOv8 object detection
    network.
    :param buf: Uploaded file input stream
    :return: Numpy array in a shape (3,width,height) where 3 is number of color channels
    """
    img = Image.open(buf)
    img_width, img_height = img.size
    img = img.resize((640, 640))
    img = img.convert("RGB")
    input = np.array(img) / 255.0
    input = input.transpose(2, 0, 1)
    input = input.reshape(1, 3, 640, 640)
    return input.astype(np.float32), img_width, img_height


def run_model(input):
    """
    Function used to pass provided input tensor to
    YOLOv8 neural network and return result
    :param input: Numpy array in a shape (3,width,height)
    :return: Raw output of YOLOv8 network as an array of shape (1,84,8400)
    """
    model = ort.InferenceSession("best.onnx",providers=['AzureExecutionProvider', 'CPUExecutionProvider'])
    outputs = model.run(["output0"], {"images":input})
    return outputs[0]


def process_output(output, img_width, img_height):
    """
    Function used to convert RAW output from YOLOv8 to an array
    of detected objects. Each object contain the bounding box of
    this object, the type of object and the probability
    :param output: Raw output of YOLOv8 network which is an array of shape (1,84,8400)
    :param img_width: The width of original image
    :param img_height: The height of original image
    :return: Array of detected objects in a format [[x1,y1,x2,y2,object_type,probability],..]
    """
    output = output[0].astype(float)
    output = output.transpose()

    boxes = []
    for row in output:
        prob = row[4:].max()
        if prob < 0.25:
            continue
        class_id = row[4:].argmax()
        label = yolo_classes[class_id]
        xc, yc, w, h = row[:4]
        x1 = (xc - w/2) / 640 * img_width
        y1 = (yc - h/2) / 640 * img_height
        x2 = (xc + w/2) / 640 * img_width
        y2 = (yc + h/2) / 640 * img_height
        boxes.append([x1, y1, x2, y2, label, prob])

    boxes.sort(key=lambda x: x[5], reverse=True)
    result = []
    while len(boxes) > 0:
        result.append(boxes[0])
        boxes = [box for box in boxes if iou(box, boxes[0]) < 0.5]

    return result


def iou(box1,box2):
    """
    Function calculates "Intersection-over-union" coefficient for specified two boxes
    https://pyimagesearch.com/2016/11/07/intersection-over-union-iou-for-object-detection/.
    :param box1: First box in format: [x1,y1,x2,y2,object_class,probability]
    :param box2: Second box in format: [x1,y1,x2,y2,object_class,probability]
    :return: Intersection over union ratio as a float number
    """
    return intersection(box1,box2)/union(box1,box2)


def union(box1,box2):
    """
    Function calculates union area of two boxes
    :param box1: First box in format [x1,y1,x2,y2,object_class,probability]
    :param box2: Second box in format [x1,y1,x2,y2,object_class,probability]
    :return: Area of the boxes union as a float number
    """
    box1_x1,box1_y1,box1_x2,box1_y2 = box1[:4]
    box2_x1,box2_y1,box2_x2,box2_y2 = box2[:4]
    box1_area = (box1_x2-box1_x1)*(box1_y2-box1_y1)
    box2_area = (box2_x2-box2_x1)*(box2_y2-box2_y1)
    return box1_area + box2_area - intersection(box1,box2)


def intersection(box1,box2):
    """
    Function calculates intersection area of two boxes
    :param box1: First box in format [x1,y1,x2,y2,object_class,probability]
    :param box2: Second box in format [x1,y1,x2,y2,object_class,probability]
    :return: Area of intersection of the boxes as a float number
    """
    box1_x1,box1_y1,box1_x2,box1_y2 = box1[:4]
    box2_x1,box2_y1,box2_x2,box2_y2 = box2[:4]
    x1 = max(box1_x1,box2_x1)
    y1 = max(box1_y1,box2_y1)
    x2 = min(box1_x2,box2_x2)
    y2 = min(box1_y2,box2_y2)
    return (x2-x1)*(y2-y1)

def count_object_types(json):
    class_counts = {}

    for _, _, _, _, object_type, _ in json:
        class_counts[object_type] = class_counts.get(object_type, 0) + 1

    return class_counts

def draw_boxes_on_image(image_path, detected_boxes):
    """
    Draws bounding boxes and labels on the original image based on the detected boxes.

    :param image_path: Path to the original image.
    :param detected_boxes: List of detected boxes in the format [[x1, y1, x2, y2, object_type, probability], ...].
    :param output_path: Path to save the output image with bounding boxes and labels.
    """
    # Open the original image
    image = Image.open(image_path)

    # Create a drawing object
    draw = ImageDraw.Draw(image)

    # Draw bounding boxes and labels
    for box in detected_boxes:
        x1, y1, x2, y2, object_type, probability = box

        # Draw the bounding box
        draw.rectangle([x1, y1, x2, y2], outline="red", width=4)

        # Draw the label
        label = f"{object_type}: {probability:.2f}"
        draw.text((x1, y1 - 10), label, fill="red")
    
    
    # Skip for development
    #output_path = image_path.replace(os.path.basename(image_path), f"{os.path.basename(image_path).replace('.', '_labelled.')}")

    # Save the output image 
    #image.save(output_path)

# Array of YOLOv8 class labels
yolo_classes = [
    "Bus","Car","Motorcycle","Truck"
]

main()
