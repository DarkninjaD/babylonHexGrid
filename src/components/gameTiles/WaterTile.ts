import { NodeMaterial } from "@babylonjs/core";
import { ErrorTile } from "./ErrorTile";

export const WaterTile = async (): Promise<NodeMaterial> => {
  let material: NodeMaterial = await NodeMaterial.ParseFromSnippetAsync(
    "BS6C1U#1"
  )
    .then((meshSnippet) => {
      return meshSnippet
    })
    .catch(() => {
      return ErrorTile();
    });
  return material;
};
