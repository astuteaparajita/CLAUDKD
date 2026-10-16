import { Box, Boxes, Move3d, RotateCw, Rotate3d } from 'lucide-react';

const glass = 'rounded-xl border kd-line kd-panel-soft backdrop-blur-md';

function Seg({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs tracking-wide transition ' +
        (active ? 'kd-accent-bg' : 'kd-text-3 kd-hover kd-hover-text')}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

export default function ViewerToolbar({ explode, onToggleExplode, cameraMode, onCameraMode, onPreset, className = '' }) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggleExplode}
        aria-pressed={explode}
        className={'flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition ' +
          (explode
            ? 'kd-gold-line kd-accent-bg shadow-[0_0_24px_rgba(240,200,120,0.55)]'
            : 'kd-accent-line kd-panel-soft kd-gold kd-accent-hover')}
      >
        {explode ? <Box size={15} /> : <Boxes size={15} />}
        {explode ? 'Assemble' : 'Explode View'}
      </button>

      <div className={glass + ' flex shrink-0 gap-1 p-1'} role="group" aria-label="Camera mode">
        <Seg active={cameraMode === 'orbit'} onClick={() => onCameraMode('orbit')} icon={Rotate3d}>Orbit</Seg>
        <Seg active={cameraMode === 'turntable'} onClick={() => onCameraMode('turntable')} icon={RotateCw}>Turntable</Seg>
        <Seg active={cameraMode === 'free'} onClick={() => onCameraMode('free')} icon={Move3d}>Free fly</Seg>
      </div>

      <div className={glass + ' flex shrink-0 gap-1 p-1'} role="group" aria-label="Camera presets">
        {[['front', 'Front'], ['top', 'Top'], ['iso', 'Isometric'], ['details', 'Details']].map(([key, label]) => (
          <Seg key={key} onClick={() => onPreset(key)}>{label}</Seg>
        ))}
      </div>
      {cameraMode === 'free' && (
        <p className="basis-full text-xs kd-text-3">Drag to look · W/A/S/D to fly · Q/E up/down · Shift to move faster</p>
      )}
    </div>
  );
}
