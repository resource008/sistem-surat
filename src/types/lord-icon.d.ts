import React from "react";

type LordIconTrigger = "hover" | "click" | "loop" | "loop-on-hover" | "morph" | "in" | "morph-two-way";

interface LordIconProps {
  src?: string;
  trigger?: LordIconTrigger;
  delay?: string | number;
  state?: string;
  colors?: string;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & LordIconProps;
    }
  }
}