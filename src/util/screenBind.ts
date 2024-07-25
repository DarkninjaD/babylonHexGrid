import {
  ArcRotateCamera,
  Camera,
  KeyboardEventTypes,
  KeyboardInfo,
} from "@babylonjs/core";

const screenBind = (kbInf: KeyboardInfo, camera: ArcRotateCamera) => {
  switch (kbInf.type) {
    case KeyboardEventTypes.KEYDOWN:
      handleWASD(kbInf.event.key, camera!);
      break;
    case KeyboardEventTypes.KEYUP:
      break;
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
export default screenBind;
