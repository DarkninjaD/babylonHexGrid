import {
  Vector3,
  HemisphericLight,
  Scene,
  AssetContainer,
  SceneLoader,
  ArcRotateCamera,
  Tools,
  NodeMaterial,
  KeyboardEventTypes,
} from "@babylonjs/core";
import SceneComponent from "babylonjs-hook";
import "@babylonjs/loaders";
import "./gameScreen.css";

let camera: ArcRotateCamera | undefined;

const onSceneReady = async (scene: Scene) => {
  camera = new ArcRotateCamera(
    "camera",
    Tools.ToRadians(90),
    Tools.ToRadians(45),
    10,
    Vector3.Zero(),
    scene
  );

  // This targets the camera to scene origin
  camera.lowerRadiusLimit = 5;
  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  scene.onKeyboardObservable.add((kbInf) => {
    switch (kbInf.type) {
      case KeyboardEventTypes.KEYDOWN:
        handleWASD(kbInf.event.key, camera!);
        break;
      case KeyboardEventTypes.KEYUP:
        // console.log("KEY UP: ", kbInf.event.code);
        break;
    }
  });

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.8;

  // this Loads the Hex Container as an instance. you still need to call ".instantiateModelsToScene()" to add it to the scene
  const hexLoad = await SceneLoader.LoadAssetContainerAsync(
    "./",
    "hexTile.glb",
    scene
  );

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
    // Water
    NodeMaterial.ParseFromSnippetAsync("BS6C1U#1", scene).then(
      (meshSnippet) => {
        waterMaterialBottom = meshSnippet;
        waterMaterialBottom.name = "waterMaterialBottom";
      }
    );
    //
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

const createHexGrid = (
  gridSize: number,
  hexLength: number,
  hexWidthDistance: number,
  hexHeightDistance: number,
  rowLengthAddition: number,
  scene: Scene,
  hexLoad: AssetContainer,
  waterMaterialTop: NodeMaterial
) => {
  let gridStart = new Vector3(
    (hexWidthDistance / 2) * (gridSize - 1),
    0,
    -hexHeightDistance * 0.75 * (gridSize - 1)
  );

  for (let i = 0; i < gridSize * 2 - 1; i++) {
    for (let y = 0; y < gridSize + rowLengthAddition; y++) {
      let hexTile = hexLoad.instantiateModelsToScene();
      let hexTileRoot = hexTile.rootNodes[0];

      hexTileRoot.name = "hexTile" + i + y;
      hexTileRoot.position.copyFrom(gridStart);
      hexTileRoot.position.x -= hexWidthDistance * y;

      let hexChildren = hexTileRoot.getDescendants();
      for (let k = 0; k < hexChildren.length; k++) {
        hexChildren[k].name = hexChildren[k].name.slice(9);
        if (hexChildren[k].name === "terrain") {
          hexChildren[k].setEnabled(false);
        }
      }

      let hexTileChildMeshes = hexTileRoot.getChildMeshes();
      for (let j = 0; j < hexTileChildMeshes.length; j++) {
        if (hexTileChildMeshes[j].name === "top") {
          hexTileChildMeshes[j].material = waterMaterialTop;
          hexTileChildMeshes[j].hasVertexAlpha = false;
        }
      }

      let hexTileAnimGroup = hexTile.animationGroups[0];
      hexTileAnimGroup.name = "AnimGroup" + hexTileRoot.name;
    }

    if (i >= gridSize - 1) {
      rowLengthAddition -= 1;
      gridStart.x -= hexWidthDistance / 2;
      gridStart.z += hexHeightDistance * 0.75;
    } else {
      rowLengthAddition += 1;
      gridStart.x += hexWidthDistance / 2;
      gridStart.z += hexHeightDistance * 0.75;
    }
  }
  camera!.radius = gridSize * 5;
  camera!.upperRadiusLimit = camera!.radius + 5;

  let allAnimGroups = scene.animationGroups;
  for (let i = 0; i < allAnimGroups.length; i++) {
    allAnimGroups[i].reset();
  }
};

const handleWASD = (key: string, camera: ArcRotateCamera) => {
  if (key === "s") {
    if (camera.beta! < 1.4) camera.beta += 0.05;
  }
  if (key === "w") {
    camera.beta -= 0.05;
  }
  if (key === "a") {
    camera.alpha += 0.05;
  }
  if (key === "d") {
    camera.alpha -= 0.05;
  }
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
