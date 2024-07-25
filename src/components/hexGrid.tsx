import {
  Vector3,
  HemisphericLight,
  Scene,
  SceneLoader,
  ArcRotateCamera,
  Tools,
  NodeMaterial,
  KeyboardEventTypes,
} from "@babylonjs/core";
import SceneComponent from "babylonjs-hook";
import "@babylonjs/loaders";
import "./gameScreen.css";
import { WaterTile } from "./gameTiles/WaterTile";
import { createHexGrid } from "../util/createHexGrid";
import screenBind from "../util/screenBind";

export let camera: ArcRotateCamera | undefined;

const onSceneReady = async (scene: Scene) => {
  // Start Setup camera
  camera = new ArcRotateCamera(
    "main",
    Tools.ToRadians(90),
    Tools.ToRadians(45),
    10,
    Vector3.Zero(),
    scene
  );
  // This targets the camera to scene origin
  camera.lowerRadiusLimit = 5;

  // End Setup camera

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  scene.onKeyboardObservable.add((keyboardInput) =>
    screenBind(keyboardInput, camera!)
  );

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.8;

  // Loads Mesh Assets
  // This Loads the Hex Container as an instance. you still need to call ".instantiateModelsToScene()" to add it to the scene
  // We might need to think about how we load assets. maybe we think of scenes, objects, texture, actions? idk
  // for now this is fine.
  const hexLoad = await SceneLoader.LoadAssetContainerAsync(
    "./",
    "hexTile.glb",
    scene
  );
  // Loads Mesh Assets

  // values that can be edited to change to scene.
  // TODO: I hate this 🤮
  let gridSize = 2;
  let hexLength = 1;
  let hexWidthDistance = Math.sqrt(3) * hexLength;
  let hexHeightDistance = 2 * hexLength;
  let rowLengthAddition = 0;

  let waterMaterialTop: NodeMaterial;
  let waterMaterialBottom: NodeMaterial;

  //TODO: change up the Material so it looks more like... felids? or just clouds
  NodeMaterial.ParseFromSnippetAsync("TD23TV#21", scene).then((meshSnippet) => {
    waterMaterialTop = meshSnippet;
    waterMaterialTop.name = "waterMaterialTop";
    WaterTile(scene).then((meshSnippet) => {
      waterMaterialBottom = meshSnippet;
      waterMaterialBottom.name = "waterMaterialBottom";
    });
    createHexGrid(
      gridSize,
      hexLength,
      hexWidthDistance,
      hexHeightDistance,
      rowLengthAddition,
      scene,
      hexLoad,
      waterMaterialTop
    );
  });

  // NOTE: The only way I can see about abstracting this functions definitions is to place the whole thing in a class.
  //  it's not a bad idea to have a class that setts up the Hex grid scene. and then go from there.
  scene.onPointerDown = (_, pickResult) => {
    if (pickResult.pickedMesh) {
      // This give access to all animation in a given scene
      let animGroups = scene.animationGroups;
      // this Lops through them and checks if the one you picked is the has a given animation then plays it.
      animGroups.forEach((animation) => {
        if (
          animation.targetedAnimations[0].target ===
          pickResult.pickedMesh?.parent
        ) {
          let siblingMeshes = pickResult.pickedMesh?.parent?.getChildMeshes();
          siblingMeshes?.forEach((sibMesh) => {
            if (sibMesh.name === "bottom") {
              sibMesh.material = waterMaterialBottom;
            }
          });
          animation.play();
        }
      });

      // this gives access to all sibling Meshes in the picked parent ?Meshes/Container
      let siblingMeshes = pickResult.pickedMesh.parent?.getChildMeshes();
      // this loops through the children then make then unflappable
      siblingMeshes?.forEach((sibMesh) => {
        sibMesh.isPickable = false;
      });
    }
  };
};

//
// const handleClickOn = (_: IPointerEvent, pickResult: PickingInfo) => {
//   if (pickResult.pickedMesh) {
//     // This give access to all animation in a given scene
//     let animGroups = this.scene.animationGroups;
//     // this Lops through them and checks if the one you picked is the has a given animation then plays it.
//     animGroups.forEach((animation) => {
//       if (
//         animation.targetedAnimations[0].target === pickResult.pickedMesh?.parent
//       ) {
//         let siblingMeshes = pickResult.pickedMesh?.parent?.getChildMeshes();
//         siblingMeshes?.forEach((sibMesh) => {
//           if (sibMesh.name === "bottom") {
//             sibMesh.material = waterMaterialBottom;
//           }
//         });
//         animation.play();
//       }
//     });

//     // this gives access to all sibling Meshes in the picked parent ?Meshes/Container
//     let siblingMeshes = pickResult.pickedMesh.parent?.getChildMeshes();
//     // this loops through the children then make then unflappable
//     siblingMeshes?.forEach((sibMesh) => {
//       sibMesh.isPickable = false;
//     });
//   }
// };

const HexGrid = () => {
  return (
    <div className="gameScreen">
      <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas" />
    </div>
  );
};
export default HexGrid;
