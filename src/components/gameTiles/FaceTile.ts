import { NodeMaterial } from "@babylonjs/core";
import { ErrorTile } from "./ErrorTile";


export const FaceTile = async(): Promise<NodeMaterial> => {
  let material : NodeMaterial = await NodeMaterial.ParseFromSnippetAsync(
    "TD23TV#21"
  )
    .then((meshSnippet) => {
      return meshSnippet
    })
    .catch(() => {
      return ErrorTile()
    });
  return material
}