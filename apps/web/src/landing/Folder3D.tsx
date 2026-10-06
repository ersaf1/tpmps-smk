import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Folder3DProps {
  theme: "dark" | "light";
}

export const Folder3D: React.FC<Folder3DProps> = ({ theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Check WebGL availability
    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl2") ||
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");
    if (!gl) {
      setWebGLFailed(true);
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    // Elevated studio camera looking down slightly onto the pedestal
    camera.position.set(0, 0.45, 5.2);
    camera.lookAt(0, -0.15, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebGLFailed(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === "dark" ? 1.25 : 1.1;
    container.replaceChildren(renderer.domElement);

    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const textures: THREE.Texture[] = [];

    // Lighting setup for luxury studio finish
    const ambientLight = new THREE.AmbientLight(
      theme === "dark" ? 0xd0e4ff : 0xffffff,
      theme === "dark" ? 0.95 : 1.15,
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5.5, 4.5);
    scene.add(keyLight);

    // Warm orange/gold rim light (matching #fca601 accent)
    const orangeRimLight = new THREE.DirectionalLight(0xfca601, 3.8);
    orangeRimLight.position.set(-4.5, 3.5, -2.5);
    scene.add(orangeRimLight);

    // Cool school-blue fill light (matching #016ec4)
    const blueFillLight = new THREE.PointLight(0x016ec4, 2.0, 12);
    blueFillLight.position.set(2.8, -1.5, 2.8);
    scene.add(blueFillLight);

    // Main 3D root group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Helper: generate rounded rectangle shape with smooth corners
    const createRoundedRect = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      return shape;
    };

    // Studio pedestal base (solid stage where the folder rests)
    const pedestalGeo = new THREE.CylinderGeometry(1.9, 2.0, 0.22, 64);
    geometries.push(pedestalGeo);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: theme === "dark" ? 0x141c27 : 0xe4ebf3,
      roughness: 0.38,
      metalness: 0.15,
    });
    materials.push(pedestalMat);
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -1.02, 0);
    rootGroup.add(pedestal);

    // Pedestal metallic trim rim (accent gold/orange #fca601)
    const rimGeo = new THREE.TorusGeometry(1.93, 0.032, 20, 64);
    geometries.push(rimGeo);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xfca601,
      roughness: 0.2,
      metalness: 0.9,
    });
    materials.push(rimMat);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, -0.91, 0);
    rootGroup.add(rim);

    // Top inset stage disc
    const insetDiscGeo = new THREE.CircleGeometry(1.85, 48);
    geometries.push(insetDiscGeo);
    const insetDiscMat = new THREE.MeshStandardMaterial({
      color: theme === "dark" ? 0x0f151e : 0xdbe4ef,
      roughness: 0.45,
      metalness: 0.1,
    });
    materials.push(insetDiscMat);
    const insetDisc = new THREE.Mesh(insetDiscGeo, insetDiscMat);
    insetDisc.rotation.x = -Math.PI / 2;
    insetDisc.position.set(0, -0.905, 0);
    rootGroup.add(insetDisc);

    // Ground contact shadow disc
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 30, 128, 128, 128);
      grad.addColorStop(0, "rgba(0,0,0,0.7)");
      grad.addColorStop(0.5, "rgba(0,0,0,0.3)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    textures.push(shadowTex);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    geometries.push(shadowGeo);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: theme === "dark" ? 0.75 : 0.35,
    });
    materials.push(shadowMat);
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -1.03, 0);
    rootGroup.add(shadow);

    // Folder and Documents Group
    const folderGroup = new THREE.Group();
    folderGroup.position.set(0, -0.12, 0);
    folderGroup.rotation.y = 0.28;
    rootGroup.add(folderGroup);

    // Blue Folio Material (#016ec4)
    const folioBlueMat = new THREE.MeshStandardMaterial({
      color: 0x016ec4,
      roughness: 0.3,
      metalness: 0.18,
    });
    materials.push(folioBlueMat);

    const folioInnerMat = new THREE.MeshStandardMaterial({
      color: 0x015ba3,
      roughness: 0.35,
      metalness: 0.14,
    });
    materials.push(folioInnerMat);

    // 1. Folder Back Flap (smooth beveled rounded rectangular casing)
    const backShape = createRoundedRect(2.35, 1.55, 0.14);
    const backExtrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    };
    const backFlapGeo = new THREE.ExtrudeGeometry(backShape, backExtrudeSettings);
    geometries.push(backFlapGeo);
    const backFlap = new THREE.Mesh(backFlapGeo, folioBlueMat);
    backFlap.position.set(0, 0, -0.18);
    folderGroup.add(backFlap);

    // Top Index Tab on folder back
    const tabShape = createRoundedRect(0.8, 0.28, 0.08);
    const tabGeo = new THREE.ExtrudeGeometry(tabShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    geometries.push(tabGeo);
    const tabMat = new THREE.MeshStandardMaterial({
      color: 0xfca601,
      roughness: 0.22,
      metalness: 0.55,
    });
    materials.push(tabMat);
    const tab = new THREE.Mesh(tabGeo, tabMat);
    tab.position.set(-0.62, 0.88, -0.18);
    folderGroup.add(tab);

    // Folder Spine / Bottom Base
    const spineShape = createRoundedRect(2.35, 0.38, 0.08);
    const spineGeo = new THREE.ExtrudeGeometry(spineShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    geometries.push(spineGeo);
    const spine = new THREE.Mesh(spineGeo, folioInnerMat);
    spine.rotation.x = Math.PI / 2;
    spine.position.set(0, -0.78, 0);
    folderGroup.add(spine);

    // 2. Folder Front Flap (smooth beveled rounded casing, angled forward open)
    const frontShape = createRoundedRect(2.35, 1.4, 0.14);
    const frontExtrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.045,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    };
    const frontFlapGeo = new THREE.ExtrudeGeometry(frontShape, frontExtrudeSettings);
    geometries.push(frontFlapGeo);
    const frontFlap = new THREE.Mesh(frontFlapGeo, folioBlueMat);
    frontFlap.position.set(0, -0.08, 0.26);
    frontFlap.rotation.x = 0.28;
    folderGroup.add(frontFlap);

    // Luxury Golden Clasp Trim along top edge of front flap
    const trimShape = createRoundedRect(1.2, 0.06, 0.03);
    const trimGeo = new THREE.ExtrudeGeometry(trimShape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
    geometries.push(trimGeo);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfca601,
      roughness: 0.18,
      metalness: 0.92,
    });
    materials.push(goldMat);
    const trimMesh = new THREE.Mesh(trimGeo, goldMat);
    trimMesh.position.set(0, 0.68, 0.05);
    frontFlap.add(trimMesh);

    // Embossed Golden Medallion Seal in center of front flap
    const sealGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 32);
    geometries.push(sealGeo);
    const seal = new THREE.Mesh(sealGeo, goldMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, 0.35, 0.055);
    frontFlap.add(seal);

    // 3. Crisp High-Resolution Quality Documents Inside (MM, PM, CM, PK)
    const createDocTexture = (
      code: string,
      title: string,
      accentHex: string,
      docId: string,
    ) => {
      const docCanvas = document.createElement("canvas");
      docCanvas.width = 1024;
      docCanvas.height = 1360;
      const ctx = docCanvas.getContext("2d");
      if (ctx) {
        // Crisp ivory paper background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1024, 1360);

        // Subtle document border
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 4;
        ctx.strokeRect(32, 32, 960, 1296);

        // Bold header banner
        ctx.fillStyle = accentHex;
        ctx.fillRect(48, 48, 928, 90);

        // Code Badge MM / PM / CM / PK
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText(code, 76, 110);

        // Full Title
        ctx.font = "bold 34px sans-serif";
        ctx.fillText(title, 190, 110);

        // Header right metadata
        ctx.font = "500 20px monospace";
        ctx.fillText(docId, 760, 108);

        // Document Ref Line
        ctx.fillStyle = "#64748b";
        ctx.font = "600 20px monospace";
        ctx.fillText("STANDAR PENJAMINAN MUTU PENDIDIKAN KEJURUAN", 64, 185);
        ctx.fillText("SINTESA · TPMPS SMK", 700, 185);

        // Divider
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(64, 205);
        ctx.lineTo(960, 205);
        ctx.stroke();

        // Simulated text lines with varied width & opacity
        const drawDocLine = (y: number, w: number, alpha = 0.5) => {
          ctx.fillStyle = `rgba(71, 85, 105, ${alpha})`;
          ctx.fillRect(64, y, w, 14);
        };

        drawDocLine(240, 800, 0.75);
        drawDocLine(275, 740, 0.5);
        drawDocLine(310, 830, 0.5);
        drawDocLine(345, 620, 0.4);

        // Structured rubric/matrix table block
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(64, 390, 896, 320);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.strokeRect(64, 390, 896, 320);

        // Table header row
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(64, 390, 896, 60);
        ctx.strokeStyle = "#cbd5e1";
        ctx.strokeRect(64, 390, 896, 60);

        ctx.fillStyle = accentHex;
        ctx.fillRect(84, 410, 20, 20);

        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("INSTRUMEN VERIFIKASI & AUDIT INTERNAL", 120, 426);

        // Internal table lines
        drawDocLine(480, 780, 0.65);
        drawDocLine(520, 720, 0.5);
        drawDocLine(560, 800, 0.5);
        drawDocLine(600, 680, 0.5);
        drawDocLine(640, 740, 0.45);

        // Lower paragraph block
        drawDocLine(750, 850, 0.65);
        drawDocLine(785, 800, 0.5);
        drawDocLine(820, 820, 0.5);
        drawDocLine(855, 600, 0.4);
        drawDocLine(890, 780, 0.5);
        drawDocLine(925, 690, 0.4);

        // Authentic stamp at bottom
        ctx.strokeStyle = accentHex;
        ctx.lineWidth = 4;
        ctx.strokeRect(700, 1070, 240, 120);

        ctx.fillStyle = accentHex;
        ctx.font = "bold 22px monospace";
        ctx.fillText("TERVERIFIKASI", 725, 1120);
        ctx.font = "500 16px monospace";
        ctx.fillText("TPMPS SMK 2026", 735, 1155);

        // Bottom footer meta
        ctx.fillStyle = "#94a3b8";
        ctx.font = "500 20px monospace";
        ctx.fillText("SISTEM INFORMASI TERPADU SEKOLAH", 64, 1280);
        ctx.fillText("REV. 2026 / HAL 1", 750, 1280);
      }

      const tex = new THREE.CanvasTexture(docCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      textures.push(tex);
      return tex;
    };

    // Document mesh generator: rounded rectangle geometry with thickness
    const createDocMesh = (
      code: string,
      title: string,
      color: string,
      docId: string,
    ) => {
      const tex = createDocTexture(code, title, color, docId);
      const dShape = createRoundedRect(1.72, 2.24, 0.04);
      const dGeo = new THREE.ExtrudeGeometry(dShape, {
        depth: 0.015,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.01,
        bevelThickness: 0.01,
      });
      geometries.push(dGeo);

      const faceMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.42,
        metalness: 0.06,
      });
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.05,
      });
      materials.push(faceMat, bodyMat);

      return new THREE.Mesh(dGeo, [faceMat, bodyMat]);
    };

    // Sheet 1: MM - Manual Mutu (Primary Blue)
    const doc1 = createDocMesh("MM", "Manual Mutu", "#016ec4", "MM-TPMPS-01");
    doc1.position.set(-0.25, 0.38, -0.1);
    doc1.rotation.set(-0.06, -0.05, -0.07);
    folderGroup.add(doc1);

    // Sheet 2: PM - Prosedur Mutu (Secondary Orange)
    const doc2 = createDocMesh("PM", "Prosedur Mutu", "#fca601", "PM-TPMPS-02");
    doc2.position.set(-0.04, 0.48, -0.03);
    doc2.rotation.set(-0.02, 0.02, 0.01);
    folderGroup.add(doc2);

    // Sheet 3: CM - Catatan Mutu (Cyan-Blue)
    const doc3 = createDocMesh("CM", "Catatan Mutu", "#0284c7", "CM-TPMPS-03");
    doc3.position.set(0.18, 0.36, 0.05);
    doc3.rotation.set(0.04, 0.06, 0.06);
    folderGroup.add(doc3);

    // Sheet 4: PK - Petunjuk Kerja (Amber-Gold)
    const doc4 = createDocMesh("PK", "Petunjuk Kerja", "#e08400", "PK-TPMPS-04");
    doc4.position.set(0.32, 0.25, 0.12);
    doc4.rotation.set(0.08, 0.09, 0.09);
    folderGroup.add(doc4);

    // Floating metallic amber bead (accent sphere like Otto)
    const beadGeo = new THREE.SphereGeometry(0.16, 32, 32);
    geometries.push(beadGeo);
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xfca601,
      roughness: 0.16,
      metalness: 0.92,
    });
    materials.push(beadMat);
    const bead = new THREE.Mesh(beadGeo, beadMat);
    bead.position.set(-1.6, 0.4, 0.6);
    rootGroup.add(bead);

    // Floating translucent crystal prism
    const prismGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    geometries.push(prismGeo);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.15,
      transparent: true,
      opacity: 0.75,
    });
    materials.push(prismMat);
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(1.5, 0.7, -0.2);
    prism.rotation.set(0.5, 0.7, 0.2);
    rootGroup.add(prism);

    // Parallax & Interactive Mouse tracking
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 0.4;
      targetRotX = -y * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let clock = 0;
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        clock += 0.015;
        // Gentle breathing hovering oscillation
        rootGroup.position.y = 0.04 + Math.sin(clock * 1.1) * 0.035;

        // Subtle folder internal breathing
        folderGroup.rotation.y = 0.28 + Math.sin(clock * 0.75) * 0.03;
        bead.position.y = 0.4 + Math.sin(clock * 1.4 + 1) * 0.06;
        prism.rotation.x += 0.004;
        prism.rotation.y += 0.005;
      }

      // Smooth mouse parallax lerp
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.045;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.045;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Clean up WebGL resources
      materials.forEach((m) => m.dispose());
      geometries.forEach((g) => g.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (container && renderer.domElement) {
        renderer.domElement.remove();
      }
    };
  }, [theme]);

  return (
    <div
      className="otto-visual-wrapper"
      aria-label="Visual 3D folder dokumen mutu SINTESA"
    >
      {/* Otto-style concentric radar / orbit rings backdrop */}
      <div className="otto-radar-rings" aria-hidden="true">
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-ring ring-3" />
        <div className="radar-crosshair-h" />
        <div className="radar-crosshair-v" />
      </div>

      {/* Floating editorial annotations matching Otto style */}
      <div className="otto-annotation top-tag" aria-hidden="true">
        <span className="coord-dot" />
        <span className="tag-text">01 / ARSIP MUTU TERSTRUKTUR</span>
        <div className="tag-line" />
      </div>

      <div className="otto-pill pill-top" aria-hidden="true">
        <span className="pill-dot blue-dot" />
        <span className="pill-text">MM · PM · CM · PK Siap Telusur</span>
      </div>

      <div className="otto-pill pill-bottom" aria-hidden="true">
        <span className="pill-icon">✓</span>
        <span className="pill-text">Hak Akses Peran & Arsip Periode</span>
      </div>

      {/* Three.js 3D Canvas Mount Point */}
      {!webGLFailed ? (
        <div ref={containerRef} className="threejs-canvas-host" />
      ) : (
        /* WebGL Fallback: Crisp Vector Isometric 3D Folio */
        <div className="webgl-fallback-folder" aria-hidden="true">
          <svg viewBox="0 0 400 360" className="fallback-svg">
            <ellipse cx="200" cy="300" rx="140" ry="24" fill="rgba(0,0,0,0.2)" />
            {/* Pedestal */}
            <path
              d="M80,280 C80,260 320,260 320,280 L310,295 C310,310 90,310 90,295 Z"
              fill={theme === "dark" ? "#1e293b" : "#e2e8f0"}
              stroke="#fca601"
              strokeWidth="2"
            />
            {/* Folder back flap */}
            <path
              d="M120,110 L190,110 L210,130 L300,130 C310,130 315,135 315,145 L315,250 C315,255 310,260 300,260 L100,260 C90,260 85,255 85,250 L85,125 C85,115 90,110 100,110 Z"
              fill="#016ec4"
            />
            {/* Documents protruding */}
            <rect
              x="120"
              y="75"
              width="150"
              height="160"
              rx="6"
              fill="#ffffff"
              transform="rotate(-5 195 155)"
            />
            <rect
              x="145"
              y="60"
              width="145"
              height="165"
              rx="6"
              fill="#f8fafc"
              stroke="#e2e8f0"
              transform="rotate(6 217 142)"
            />
            {/* Document labels */}
            <text x="160" y="85" fill="#fca601" fontWeight="bold" fontSize="14">
              PM · Prosedur
            </text>
            <text x="135" y="105" fill="#016ec4" fontWeight="bold" fontSize="14">
              MM · Manual Mutu
            </text>
            {/* Folder front flap */}
            <path
              d="M85,160 L315,160 L295,260 L105,260 Z"
              fill="#0284c7"
              opacity="0.95"
            />
          </svg>
        </div>
      )}

      {/* Otto-style bottom indicator control pill */}
      <div className="otto-hero-controls" aria-hidden="true">
        <span className="control-item">Arahkan kursor untuk rotasi ↔</span>
        <span className="control-divider">|</span>
        <span className="control-item">Dokumen TPMPS Terpadu</span>
      </div>
    </div>
  );
};
