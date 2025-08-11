// src/types/threejs-toys.d.ts
declare module "threejs-toys" {
  export function neonCursor(options: {
    el: HTMLElement;
    shaderPoints?: number;
    curvePoints?: number;
    curveLerp?: number;
    radius1?: number;
    radius2?: number;
    velocityTreshold?: number; // 라이브러리 철자 그대로 (sic)
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeCoefX?: number;
    sleepTimeCoefY?: number;
  }): unknown;
}
