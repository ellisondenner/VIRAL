import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { config } from "./config";

export const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const angulo = interpolate(frame, [0, durationInFrames], [160, 200]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angulo}deg, ${config.cores.fundoDegrade} 0%, ${config.cores.fundo} 65%)`,
      }}
    />
  );
};
