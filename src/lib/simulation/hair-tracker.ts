export type Point = { x: number; y: number };
export type HairPose = { x: number; y: number; width: number; height: number; angle: number };
type Detection = { faceLandmarks: Point[][] };
type Mode = "VIDEO" | "IMAGE";

export type HairTracker = {
  detect(image: HTMLCanvasElement): Detection;
  detectForVideo(image: HTMLVideoElement, time: number): Detection;
  close(): void;
};

const assets = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21";
const model = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
type VisionModule = {
  FilesetResolver: { forVisionTasks(path: string): Promise<unknown> };
  FaceLandmarker: {
    createFromOptions(files: unknown, options: {
      baseOptions: { modelAssetPath: string };
      runningMode: Mode;
      numFaces: number;
    }): Promise<HairTracker>;
  };
};

export async function createHairTracker(mode: Mode) {
  const moduleUrl = assets + "/vision_bundle.mjs";
  const { FilesetResolver, FaceLandmarker } = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ moduleUrl) as VisionModule;
  const files = await FilesetResolver.forVisionTasks(assets + "/wasm");
  return FaceLandmarker.createFromOptions(files, {
    baseOptions: { modelAssetPath: model },
    runningMode: mode,
    numFaces: 1,
  });
}

export function locateHairline(result: Detection, width: number, height: number, mirror: boolean): HairPose | null {
  const face = result.faceLandmarks[0];
  if (!face) return null;
  const pixel = (index: number) => ({
    x: (mirror ? 1 - face[index].x : face[index].x) * width,
    y: face[index].y * height,
  });
  const eyes = [pixel(33), pixel(263)].sort((a, b) => a.x - b.x);
  const [left, right] = eyes;
  const forehead = pixel(10);
  const cheekA = pixel(234);
  const cheekB = pixel(454);
  const eyeWidth = Math.hypot(right.x - left.x, right.y - left.y);
  const headWidth = Math.hypot(cheekB.x - cheekA.x, cheekB.y - cheekA.y);
  if (eyeWidth < width * 0.06 || headWidth < width * 0.09 || forehead.y <= 0) return null;
  const angle = Math.atan2(right.y - left.y, right.x - left.x);
  return {
    x: (forehead.x * 0.76 + (left.x + right.x) * 0.12) / width,
    y: forehead.y / height,
    width: Math.max(eyeWidth * 1.15, headWidth * 0.99) / width,
    height: eyeWidth * 0.65 / height,
    angle,
  };
}
