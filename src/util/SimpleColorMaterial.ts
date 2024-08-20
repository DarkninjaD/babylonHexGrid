import { Color3, FragmentOutputBlock, InputBlock, int, NodeMaterial, NodeMaterialModes, NodeMaterialSystemValues, TransformBlock, VertexOutputBlock } from "@babylonjs/core";

export const SimpleColorMaterial = (red : int, green: int, blue: int) : NodeMaterial => {
  var nodeMaterial = new NodeMaterial("node");
  var test = Color3.FromInts(red, green, blue)

  nodeMaterial.mode = NodeMaterialModes.Material;

  // InputBlock
  var position = new InputBlock("position");
  position.visibleInInspector = false;
  position.visibleOnFrame = false;
  position.target = 1;
  position.setAsAttribute("position");

  // TransformBlock
  var WorldPos = new TransformBlock("WorldPos");
  WorldPos.visibleInInspector = false;
  WorldPos.visibleOnFrame = false;
  WorldPos.target = 1;
  WorldPos.complementZ = 0;
  WorldPos.complementW = 1;

  // InputBlock
  var World = new InputBlock("World");
  World.visibleInInspector = false;
  World.visibleOnFrame = false;
  World.target = 1;
  World.setAsSystemValue(NodeMaterialSystemValues.World);

  // TransformBlock
  var WorldPosViewProjectionTransform = new TransformBlock("WorldPos * ViewProjectionTransform");
  WorldPosViewProjectionTransform.visibleInInspector = false;
  WorldPosViewProjectionTransform.visibleOnFrame = false;
  WorldPosViewProjectionTransform.target = 1;
  WorldPosViewProjectionTransform.complementZ = 0;
  WorldPosViewProjectionTransform.complementW = 1;

  // InputBlock
  var ViewProjection = new InputBlock("ViewProjection");
  ViewProjection.visibleInInspector = false;
  ViewProjection.visibleOnFrame = false;
  ViewProjection.target = 1;
  ViewProjection.setAsSystemValue(NodeMaterialSystemValues.ViewProjection);

  // VertexOutputBlock
  var VertexOutput = new VertexOutputBlock("VertexOutput");
  VertexOutput.visibleInInspector = false;
  VertexOutput.visibleOnFrame = false;
  VertexOutput.target = 1;

  // InputBlock
  var Color = new InputBlock("Color3");
  Color.visibleInInspector = false;
  Color.visibleOnFrame = false;
  Color.target = 1;
  Color.value = test
  Color.isConstant = false;

  // FragmentOutputBlock
  var FragmentOutput = new FragmentOutputBlock("FragmentOutput");
  FragmentOutput.visibleInInspector = false;
  FragmentOutput.visibleOnFrame = false;
  FragmentOutput.target = 2;
  FragmentOutput.convertToGammaSpace = false;
  FragmentOutput.convertToLinearSpace = false;
  FragmentOutput.useLogarithmicDepth = false;

  // Connections
  position.output.connectTo(WorldPos.vector);
  World.output.connectTo(WorldPos.transform);
  WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector);
  ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform);
  WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector);
  Color.output.connectTo(FragmentOutput.rgb);

  // Output nodes
  nodeMaterial.addOutputNode(VertexOutput);
  nodeMaterial.addOutputNode(FragmentOutput);
  nodeMaterial.build(true);
  return nodeMaterial
}