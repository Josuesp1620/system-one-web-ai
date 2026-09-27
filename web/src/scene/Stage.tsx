/** Fondo común de la app: estrellas con un brillo suave, detrás de todas las vistas. */
import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

export function Stage() {
  return (
    <Canvas camera={{ position: [0, 0, 11], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={['#0b0d12']} />
      <Stars radius={60} depth={30} count={1400} factor={2.4} saturation={0} fade speed={0.3} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.65} luminanceSmoothing={0.2} />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
