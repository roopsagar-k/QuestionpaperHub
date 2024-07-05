"use client";
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../public/loading-animation.json";

interface AnimationItem {
  destroy: () => void;
}

const LoadingAnimation: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (container.current && !animationInstance.current) {
      animationInstance.current = lottie.loadAnimation({
        container: container.current,
        animationData: animationData,
        renderer: "svg",
        loop: true,
        autoplay: true,
      }) as AnimationItem; 
    }

    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, []);

  return <div ref={container} style={{ width: 400, height: 400 }} />;
};

export default LoadingAnimation;
