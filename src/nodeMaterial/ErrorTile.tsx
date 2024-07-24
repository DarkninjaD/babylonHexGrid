import { NodeMaterial, Scene } from "@babylonjs/core";

export const ErrorTile = (scene: Scene): NodeMaterial => {
  return NodeMaterial.CreateDefault("ErrorTile", scene);
};
