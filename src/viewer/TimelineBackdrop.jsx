import { MandalaRing, JaaliTexture, Chakra } from '../Ornaments.jsx';

/** Translucent heritage motifs that sit between the 3D scene and the timeline panels. Colours come from viewer.css. */
export default function TimelineBackdrop() {
  return (
    <div className="kd-backdrop" aria-hidden="true">
      <JaaliTexture className="kd-backdrop-jaali" />
      <MandalaRing className="kd-backdrop-mandala" />
      <Chakra className="kd-backdrop-chakra kd-backdrop-chakra-a" />
      <Chakra className="kd-backdrop-chakra kd-backdrop-chakra-b" />
    </div>
  );
}
