import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS, W, H, TOTAL_SEC } from "./config";

export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={Math.ceil(TOTAL_SEC * FPS)} fps={FPS} width={W} height={H} />
);
