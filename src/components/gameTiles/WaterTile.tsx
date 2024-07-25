import { NodeMaterial, Scene } from "@babylonjs/core";
import { ErrorTile } from "./ErrorTile";

export const WaterTile = async (scene: Scene): Promise<NodeMaterial> => {
  let material: NodeMaterial = await NodeMaterial.ParseFromSnippetAsync(
    "BS6C1U#1",
    scene
  )
    .then((meshSnippet) => {
      material = meshSnippet;
      material.name = "waterMaterialBottom";
      return material;
    })
    .catch((tileError) => {
      return ErrorTile(scene);
    });
  return material;
};
