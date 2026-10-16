import { useMemo, useRef, useSyncExternalStore } from 'react';
import './viewer.css';
import { getMonument } from './monumentsData';
import { createTimelineStore } from './timelineStore';
import MonumentCanvas from './MonumentCanvas';

export default function StaticMonumentView({ monumentId, initial, hotspots, activeHotspot, onHotspot, resetCount = 0 }) {
  const monument = getMonument(monumentId);
  const startT = initial?.t ?? 1;
  const store = useMemo(
    () => createTimelineStore({ playSeconds: monument.construction.playSeconds, initialT: startT }),
    [monument, startT],
  );
  const { t } = useSyncExternalStore(store.subscribe, store.getState);
  const shared = useRef({ t: startT, explode: 0 });
  // The notes panel's hotspots become markers on the same canvas.
  const pois = useMemo(
    () => hotspots.map((h) => {
      const poi = monument.pois.find((p) => p.id === h.id);
      return {
        id: h.id, title: h.title, position: poi?.position || h.position,
        anchor: poi?.anchor, part: poi?.part || h.id,
        appearsAt: poi?.appearsAt ?? 0,
      };
    }),
    [hotspots, monument],
  );
  const goal = useMemo(
    () => (resetCount ? { position: monument.camera.position, target: monument.camera.target } : null),
    [resetCount, monument],
  );
  return (
    <>
      <MonumentCanvas
        monument={monument}
        store={store}
        explode={!!initial?.explode}
        cameraMode="orbit"
        cameraGoal={goal}
        cameraResetKey={resetCount}
        shared={shared}
        activePoiId={activeHotspot}
        pois={pois}
        onSelectPoi={(poi) => onHotspot(poi.id)}
      />
      {t < 0.999 && (
        <button type="button" className="secondary" style={{ position: 'absolute', left: 12, bottom: 12, zIndex: 5 }} onClick={() => store.setT(1)}>
          SHOW FINISHED MONUMENT
        </button>
      )}
    </>
  );
}