import { NodeMaterial,  Scene, } from "@babylonjs/core";
import { SimpleColorMaterial } from "../../util/SimpleColorMaterial";

export const GrassTile = () : NodeMaterial => {
  return SimpleColorMaterial(63,158,67)
}