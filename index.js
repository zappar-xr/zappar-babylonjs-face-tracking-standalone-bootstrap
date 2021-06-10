// Setup BabylonJS in the usual way
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

const scene = new BABYLON.Scene(engine);
const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

// Setup a Zappar camera instead of one of Babylon's cameras
const camera = new ZapparBabylon.Camera('camera', scene);

// Request the necessary permission from the user
ZapparBabylon.permissionRequestUI().then((granted) => {
  if (granted) camera.start(true);
  else ZapparBabylon.permissionDeniedUI();
});

// Set up our image tracker transform node
const faceTracker = new ZapparBabylon.FaceTrackerLoader().load();
const trackerTransformNode = new ZapparBabylon.FaceTrackerTransformNode('tracker', camera, faceTracker, scene);

const material = new BABYLON.StandardMaterial('mat', scene);
material.diffuseTexture = new BABYLON.Texture("./faceMeshTemplate.png", scene);

// Face mesh
const faceMesh = new ZapparBabylon.FaceMeshGeometry(scene);
faceMesh.parent = trackerTransformNode;
faceMesh.material = material;



window.addEventListener('resize', () => {
  engine.resize();
});

// Set up our render loop
engine.runRenderLoop(() => {
  faceMesh.updateFromFaceTracker(faceTracker);
  camera.updateFrame();
  scene.render();
});
