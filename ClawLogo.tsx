import React from "react";
import Svg, { Path } from "react-native-svg";

// Three slanted claw marks. `size` is the height; width scales with it.
export default function ClawLogo({ size = 30, color = "#2E9E57" }: { size?: number; color?: string }) {
  return (
    <Svg width={size * 1.2} height={size} viewBox="0 0 48 40">
      <Path d="M5 33C5 24 12 14 21 9C17 17 14 26 9 35C7 35.5 5 35 5 33Z" fill={color} />
      <Path d="M15 36C16 24 25 11 36 3C31 13 26 26 20 38C18 39 15.5 38 15 36Z" fill={color} />
      <Path d="M28 36C29 28 36 19 44 14C41 21 37 29 32 38C30 38.5 28 38 28 36Z" fill={color} />
    </Svg>
  );
}
