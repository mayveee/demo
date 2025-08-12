// src/pages/FireworksPage.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import bgMapleUrl from "@/assets/pano/bgmaple.png";

export default function FireworksPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    while (container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.domElement.style.display = "block";
    renderer.domElement.style.margin = "auto";
    renderer.setClearColor(0x000000, 0.1);
    containerRef.current.appendChild(renderer.domElement);

    // ===== 폭죽 파티클 =====
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 2);
    const startTimes = new Float32Array(particleCount);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 2));
    geometry.setAttribute("aStartTime", new THREE.BufferAttribute(startTimes, 1));

    // 랜덤 색 
    const palette = [
        0xff0000, // 선명한 빨강
        0xffa500, // 오렌지
        0xffff00, // 노랑
        0xffe4b5, // 금빛 아이보리
        0xffffff, // 흰색 (매우 밝은 폭죽)
        0xff69b4, // 핑크
        0xff1493, // 진한 핑크
        0x00bfff, // 밝은 하늘색
        0x1e90ff, // 도돈한 파랑
        0x9400d3, // 보라
        0xadff2f, // 연두
        0x00ff7f, // 청록
    ];
    const sharedColor = new THREE.Color(0xffa500);

    const uniforms = {
        uTime: { value: 0 },
        uCenterColor: { value: new THREE.Color(0xfffae5) }, // 거의 흰 노랑
        uColor: { value: sharedColor },       // 오렌지
        uCore: { value: 0.3 },          // 흰 코어 반경 (0~1, 커질수록 중심 커짐)
        uGlow: { value: 0.7 },          // 글로우 반경  (0~1, 커질수록 더 멀리 퍼짐)
        uGlowStrength: { value: 2.0},   // 글로우 강도
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute vec2 aVelocity;
        attribute float aStartTime;
        uniform float uTime;
        varying float vLife;
        void main() {
          float age = uTime - aStartTime;
          vLife = 1.0 - (age / 1.5);
          vLife = max(vLife, 0.0);
          // NDC(클립) 좌표로 직접 렌더링
          vec3 newPos = position + vec3(aVelocity * age, 0.0);
          gl_Position = vec4(newPos, 1.0);
          gl_PointSize = 17.0 * vLife;
        }
      `,
      fragmentShader: `
      precision highp float;
        uniform vec3 uColor;
        uniform vec3 uCenterColor;
        uniform float uCore;         // 0~1 (대개 0.12~0.2)
        uniform float uGlow;         // 0~1 (대개 0.45~0.65)
        uniform float uGlowStrength; // 1.0~2.5
        varying float vLife;

        void main() {
        // gl_PointCoord: [0,1] 정사각 — 화면 비율 영향 없음
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);          // 0 = 중심

        // 코어(흰색) — 가장자리로 갈수록 부드럽게 감소
        float core = smoothstep(uCore, 0.0, d);

        // 글로우 — 네온 느낌, 중심 폭주 방지(클램프) + 거듭제곱 falloff
        float inv = clamp((uGlow - d) / max(uGlow, 1e-4), 0.0, 1.0);
        float glow = pow(inv, 2.0) * uGlowStrength;

        // 색 합성: 흰 코어 + 오렌지 글로우
        vec3 col = core * vec3(1.0) + glow * uColor;

        // 알파: 코어/글로우 중 더 강한 쪽 * 수명
        float alpha = max(core, glow) * vLife;

        gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ===== 발사체(흰점 + 오렌지 glow) =====
    // 발사체는 NDC(-1~1) 좌표로 한 점을 계속 위치 업데이트
    // 생성 시 (지오메트리는 0,0,0 한 점이면 됨)
    const projectileGeom = new THREE.BufferGeometry();
    projectileGeom.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3));

    // projectileMat 교체
    const projectileMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
        uColor: {value:  new THREE.Color(0xffffff)}, // ★ 폭죽과 동일 객체 공유
    },
    depthTest: false,         // ← 다른 포인트 뒤에 가려지지 않게
    vertexShader: `
        void main() {
        gl_PointSize = 13.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        precision highp float;
        uniform vec3 uColor;
        void main() {            
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv) * 2.0;
            float alpha = smoothstep(0.8, 0.0, d);
            gl_FragColor = vec4(uColor.rgb, alpha);
        }
    `,
    });

    const projectile = new THREE.Points(projectileGeom, projectileMat);
    projectile.visible = false;
    projectile.renderOrder = 999;
    scene.add(projectile);

    // ===== 상태 =====
    let mouseX = 0;
    let mouseY = 0;

    // 발사체 상태
    let projectileActive = false;
    let px = 0, py = -1.05; // 시작은 화면 아래(NDC 기준)
    let tx = 0, ty = 0;
    const projectileSpeed = 0.035;

    // 폭죽 생성 (기존 그대로)
    function spawnFirework(x: number, y: number) {
        // 랜덤 폭죽
        uniforms.uGlow.value = 0.3 + Math.random() * 0.4;
        uniforms.uGlowStrength.value = 2 + Math.random() * 18;
        const hex = palette[Math.floor(Math.random() * palette.length)];
        sharedColor.setHex(hex);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = 0;

            const angle = Math.random() * Math.PI * 2.0;
            const speed = 0.3 + Math.random() * 0.5;
            velocities[i * 2 + 0] = Math.cos(angle) * speed;
            velocities[i * 2 + 1] = Math.sin(angle) * speed;

            startTimes[i] = uniforms.uTime.value;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aVelocity.needsUpdate = true;
        geometry.attributes.aStartTime.needsUpdate = true;
    }

    // 발사 준비
    function launchFromBottom(nx: number, ny: number) {
        px = nx; py = -1.05;
        tx = nx; ty = ny;
        projectile.position.set(px, py, 0);
        projectile.visible = true;
        projectileActive = true;
    }

    // 마우스 좌표(NDC, 정사각 캔버스 기준)
    window.addEventListener("pointermove", (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        const nx = (e.clientX - rect.left) / size; // 0~1
        const ny = (e.clientY - rect.top) / size;  // 0~1
        mouseX = nx * 2 - 1;
        mouseY = -(ny * 2 - 1);
    });

    // 클릭: 발사체 → 도달 시 폭죽
    window.addEventListener("click", () => {
        launchFromBottom(mouseX, mouseY);
    });

    // 정사각형 캔버스 유지
    function resize() {
        const size = Math.min(window.innerWidth, window.innerHeight);
        renderer.setSize(size, size);
    }
    window.addEventListener("resize", resize);
    resize();

    // 루프
    const clock = new THREE.Clock();
    function animate() {
      uniforms.uTime.value = clock.getElapsedTime();

      // 발사체 이동/도달 체크
      if (projectileActive) {
        py += projectileSpeed;
        if (py >= ty) {
            projectileActive = false;
            projectile.visible = false;
            spawnFirework(tx, ty);
        } else {
            projectile.position.set(px, py, 0); // ← 위치만 업데이트
        }
        }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", () => {});
      window.removeEventListener("pointermove", () => {});
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
        style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        }}
    >
        {/* 배경 이미지 */}
        <div
        style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgMapleUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
        }}
        />

        {/* 어두운 반투명 오버레이 */}
        <div
        style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)", // 0.5 = 50% 어둡게
            zIndex: 1,
        }}
        />

        {/* 캔버스 */}
        <div ref={containerRef} style={{ zIndex: 2 }} />
    </div>
    );

}
