import { Scene, AssetContainer, NodeMaterial, Vector3 } from "@babylonjs/core";
import { camera } from "../components/hexGrid";

export const createHexGrid = (
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
