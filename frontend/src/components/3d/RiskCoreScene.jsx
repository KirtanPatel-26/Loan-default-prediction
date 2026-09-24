import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RiskCoreScene = ({ riskLevel = 0, isActive = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = 380;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error('WebGL init error:', e);
      return;
    }

    // Colors
    const getTargetColor = (risk, active) => {
      if (!active) return new THREE.Color('#38bdf8');
      const c = new THREE.Color();
      if (risk <= 0.3) {
        c.lerpColors(new THREE.Color('#00ff88'), new THREE.Color('#38bdf8'), risk / 0.3);
      } else if (risk <= 0.6) {
        c.lerpColors(new THREE.Color('#38bdf8'), new THREE.Color('#ffaa00'), (risk - 0.3) / 0.3);
      } else {
        c.lerpColors(new THREE.Color('#ffaa00'), new THREE.Color('#ff3355'), (risk - 0.6) / 0.4);
      }
      return c;
    };

    const targetColor = getTargetColor(riskLevel, isActive);

    // Group for all rotating objects
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Outer Wireframe Polyhedron (Shield / Risk Core)
    const outerGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const outerMat = new THREE.MeshStandardMaterial({
      color: targetColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2,
      metalness: 0.8,
      emissive: targetColor,
      emissiveIntensity: isActive ? 0.6 : 0.25,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // 2. Inner Glowing Core Sphere
    const innerGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: targetColor,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.9,
      emissive: targetColor,
      emissiveIntensity: isActive ? 0.9 : 0.3,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3. Floating Orbital Rings
    const ringGeo = new THREE.TorusGeometry(1.85, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: targetColor,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 4;
    coreGroup.add(ring2);

    // 4. Sparkling Particle Field
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: targetColor,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(targetColor, 2, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 20);
    pointLight2.position.set(-5, -5, -2);
    scene.add(pointLight2);

    // Mouse interactivity
    const mousePos = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mousePos.x = (x - 0.5) * 2;
      mousePos.y = (y - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize
    const onResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || width;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Rotation & physics
      const rotSpeed = isActive ? 0.7 + riskLevel * 0.8 : 0.4;
      coreGroup.rotation.y += 0.008 * rotSpeed;
      coreGroup.rotation.x += 0.004 * rotSpeed;

      ring1.rotation.z += 0.01;
      ring2.rotation.z -= 0.012;

      // Mouse parallax tilt
      coreGroup.rotation.y += (mousePos.x * 0.6 - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (-mousePos.y * 0.6 - coreGroup.rotation.x) * 0.05;

      // Floating sine wave
      coreGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Pulse inner sphere
      const pulseSpeed = isActive ? 3 + riskLevel * 4 : 1.5;
      const pulseScale = 1 + Math.sin(elapsedTime * pulseSpeed) * (isActive ? 0.12 : 0.04);
      innerMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Rotate particle field slowly
      particleField.rotation.y += 0.001;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer && renderer.domElement) {
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [riskLevel, isActive]);

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      style={{ height: '380px', minHeight: '380px' }}
    />
  );
};

export default RiskCoreScene;
