// @ts-ignore
import * as ort from "onnxruntime-node";
import sharp from "sharp";
import axios from "axios";
   
async function detectObjectsOnImageUrl(imageUrl: string){
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);
    
            const [input, imgWidth, imgHeight] = await prepareInput(imageBuffer);
            const output = await runModel(input);
            const boxes = processOutput(output, imgWidth, imgHeight);
    
            // What to return
            const classCounts = countObjectTypes(boxes);
            //console.log(classCounts); for dev
            return classCounts;
        } catch (error) {
            console.error('Error fetching or processing image:', error);
            throw new Error('Internal Server Error');
        }
    }



/**
 * Function receives an image, passes it through YOLOv8 neural network
 * and returns an array of detected objects and their bounding boxes
 * @param buf Input image body
 * @returns Array of bounding boxes in format [[x1,y1,x2,y2,object_type,probability],..]
 */
async function detectObjectsOnImage(buf: Buffer | undefined) {
    if (!buf) {
        return []; // or handle accordingly based on your requirements
    }

    const [input, imgWidth, imgHeight] = await prepareInput(buf);
    const output = await runModel(input);
    return processOutput(output, imgWidth, imgHeight);
}

/**
 * Function used to convert input image to tensor,
 * required as an input to YOLOv8 object detection
 * network.
 * @param buf Content of uploaded file
 * @returns Array of pixels
 */
async function prepareInput(buf: Buffer): Promise<[number[], number, number]> {
    const img = sharp(buf);
    const md = await img.metadata();
    const [imgWidth = 0, imgHeight = 0] = [md.width, md.height];
    const pixels = await img.removeAlpha()
        .resize({ width: 640, height: 640, fit: 'fill' })
        .raw()
        .toBuffer();
    const red: number[] = [];
    const green: number[] = [];
    const blue: number[] = [];
    for (let index = 0; index < pixels.length; index += 3) {
        red.push(pixels[index] / 255.0);
        green.push(pixels[index + 1] / 255.0);
        blue.push(pixels[index + 2] / 255.0);
    }
    const input = [...red, ...green, ...blue];
    return [input, imgWidth, imgHeight];
}

/**
 * Function used to pass provided input tensor to YOLOv8 neural network and return result
 * @param input Input pixels array
 * @returns Raw output of neural network as a flat array of numbers
 */
async function runModel(input: number[]) {
    const model = await ort.InferenceSession.create("./src/cardetector/best.onnx");
    input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
    const outputs = await model.run({ images: input });
    return outputs["output0"].data;
}

/**
 * Function used to convert RAW output from YOLOv8 to an array of detected objects.
 * Each object contains the bounding box of this object, the type of object, and the probability
 * @param output Raw output of YOLOv8 network
 * @param imgWidth Width of the original image
 * @param imgHeight Height of the original image
 * @returns Array of detected objects in a format [[x1,y1,x2,y2,object_type,probability],..]
 */
function processOutput(output: number[], imgWidth: number, imgHeight: number) {
    let boxes: number[][] = [];
    for (let index = 0; index < 8400; index++) {
        const [classId, prob] = [...Array(4).keys()]
            .map(col => [col, output[8400 * (col + 4) + index]])
            .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);
        if (prob < 0.25) {
            continue;
        }

        const label = yoloClasses[classId];
        const xc = output[index];
        const yc = output[8400 + index];
        const w = output[2 * 8400 + index];
        const h = output[3 * 8400 + index];
        const x1 = (xc - w / 2) / 640 * imgWidth;
        const y1 = (yc - h / 2) / 640 * imgHeight;
        const x2 = (xc + w / 2) / 640 * imgWidth;
        const y2 = (yc + h / 2) / 640 * imgHeight;
        boxes.push([x1, y1, x2, y2, label, prob] as any);
    }

    boxes = boxes.sort((box1, box2) => box2[5] - box1[5]);
    const result: number[][] = [];
    while (boxes.length > 0) {
        result.push(boxes[0]);
        boxes = boxes.filter(box => iou(boxes[0], box) < 0.7);
    }
    return result;
}

function countObjectTypes(result: number[][]) {
    const classCounts: { [key: string]: number } = {};

    for (const [, , , , object_type] of result) {
        classCounts[object_type] = (classCounts[object_type] || 0) + 1;
    }

    return classCounts;
}




/**
 * Function calculates "Intersection-over-union" coefficient for specified two boxes
 * https://pyimagesearch.com/2016/11/07/intersection-over-union-iou-for-object-detection/.
 * @param box1 First box in format: [x1,y1,x2,y2,object_class,probability]
 * @param box2 Second box in format: [x1,y1,x2,y2,object_class,probability]
 * @returns Intersection over union ratio as a float number
 */
function iou(box1: number[], box2: number[]): number {
    return intersection(box1, box2) / union(box1, box2);
}

/**
 * Function calculates union area of two boxes.
 * @param box1 First box in format [x1,y1,x2,y2,object_class,probability]
 * @param box2 Second box in format [x1,y1,x2,y2,object_class,probability]
 * @returns Area of the boxes union as a float number
 */
function union(box1: number[], box2: number[]): number {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const box1Area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
    const box2Area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);
    return box1Area + box2Area - intersection(box1, box2);
}

/**
 * Function calculates intersection area of two boxes
 * @param box1 First box in format [x1,y1,x2,y2,object_class,probability]
 * @param box2 Second box in format [x1,y1,x2,y2,object_class,probability]
 * @returns Area of intersection of the boxes as a float number
 */
function intersection(box1: number[], box2: number[]): number {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const x1 = Math.max(box1_x1, box2_x1);
    const y1 = Math.max(box1_y1, box2_y1);
    const x2 = Math.min(box1_x2, box2_x2);
    const y2 = Math.min(box1_y2, box2_y2);
    return (x2 - x1) * (y2 - y1);
}

/**
 * Array of YOLOv8 class labels
 */
 const yoloClasses: string[] = [
    'Bus', 'Car', 'Motorcycle', 'Truck'
];

export default detectObjectsOnImageUrl;
