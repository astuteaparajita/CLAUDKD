import { Suspense, useLayoutEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MonumentModel from './MonumentModel';
import POIMarkers from './POIMarkers';
import CameraRig from './CameraRig';
import FreeCameraControls from './FreeCameraControls';
import ResponsiveFraming from './ResponsiveFraming';
import useViewerTheme from './useViewerTheme';

// Scene colours per site theme (mirrors the museum hall's dark / light lighting).
const PALETTES = {
  dark: {
    bg: '#0a080d', sky: '#fff0db', ground: '#1b1f26', hemi: 1.5, sun: 3, sunColor: '#ffe2b0',
    fill: 1.2, fillColor: '#7fa8ff', point: 60, floor: '#15141a', grid: ['#2a2530', '#1b1820'], ring: '#c9a86a', ringOpacity: 0.35,
  },
  light: {
    bg: '#cfc9bc', sky: '#fff2d6', ground: '#8b806d', hemi: 2.1, sun: 3.4, sunColor: '#fff1d5',
    fill: 1.0, fillColor: '#fff0d5', point: 38, floor: '#c9c0ae', grid: ['#8e7e62', '#b3a78f'], ring: '#8b6b3c', ringOpacity: 0.5,
  },
};

function ResetCameraForStandardMode({ cameraMode, cameraResetKey, position, target }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls);
  const previousMode = useRef(cameraMode);
  useLayoutEffect(() => {
    const enteredStandardMode = cameraMode !== 'free' && previousMode.current !== cameraMode;
    if (!enteredStandardMode) {
      previousMode.current = cameraMode;
      return;
    }
    if (!controls) return;
    camera.position.set(...position);
    controls.target.set(...target);
    controls.update();
    previousMode.current = cameraMode;
  }, [cameraMode, cameraResetKey, camera, controls, position, target]);
  return null;
}

export default function MonumentCanvas({
  monument, store, explode, cameraMode, cameraGoal, cameraResetKey = 0, shared, activePoiId,
  onSelectPoi, onBackgroundClick, pois, insets = { top: 0, bottom: 0 }, compact = false,
}) {
  const cam = monument.camera;
  const palette = PALETTES[useViewerTheme()];
  const shadowSize = compact ? 1024 : 2048;
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, compact ? 1.5 : 2]}
      camera={{ fov: 42, near: 0.4, far: 220, position: cam.position }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={onBackgroundClick}
    >
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 50, 120]} />

      <hemisphereLight args={[palette.sky, palette.ground, palette.hemi]} />
      <directionalLight position={[10, 18, 10]} intensity={palette.sun} color={palette.sunColor} castShadow shadow-mapSize={[shadowSize, shadowSize]} shadow-bias={-0.0004} shadow-normalBias={0.04}>
        <orthographicCamera attach="shadow-camera" args={[-24, 24, 24, -24, 0.5, 70]} />
      </directionalLight>
      <directionalLight position={[-12, 8, -8]} intensity={palette.fill} color={palette.fillColor} />
      <pointLight position={[0, 9, 0]} intensity={palette.point} distance={40} color="#f0b44c" />

      <Suspense fallback={null}>
        <MonumentModel monument={monument} store={store} explode={explode} shared={shared} />
      </Suspense>
      <POIMarkers pois={pois || monument.pois} explodeCfg={monument.explode} shared={shared} activeId={activePoiId} onSelect={onSelectPoi} />

      {/* Museum floor: dark disc, faint grid, gold ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <circleGeometry args={[34, 64]} />
        <meshStandardMaterial color={palette.floor} roughness={0.85} metalness={0.2} />
      </mesh>
      <gridHelper args={[60, 60, palette.grid[0], palette.grid[1]]} position={[0, -0.02, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[19.8, 20, 96]} />
        <meshBasicMaterial color={palette.ring} transparent opacity={palette.ringOpacity} />
      </mesh>

      <OrbitControls
        makeDefault
        enabled={cameraMode !== 'free'}
        enableDamping
        dampingFactor={0.07}
        target={cam.target}
        autoRotate={cameraMode === 'turntable'}
        autoRotateSpeed={1.2}
        enablePan={false}
        minDistance={cam.minDistance}
        maxDistance={cam.maxDistance}
        maxPolarAngle={Math.PI * 0.495}
      />
      <ResetCameraForStandardMode cameraMode={cameraMode} cameraResetKey={cameraResetKey} position={cam.position} target={cam.target} />
      {cameraMode === 'free'
        ? <FreeCameraControls goal={cameraGoal} />
        : <CameraRig key={cameraResetKey} goal={cameraGoal} />}
      <ResponsiveFraming top={insets.top} bottom={insets.bottom} />
    </Canvas>
  );
}