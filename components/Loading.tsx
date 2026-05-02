"use client";
import Image from "next/image";

interface LoadingProps {
  fullScreen?: boolean;
}

export default function Loading({ fullScreen = true }: LoadingProps) {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-9999 bg-[#002d29]"
          : "relative w-full h-full min-h-[200px]"
      } flex flex-col items-center justify-center`}
    >
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full animate-pulse-glow"></div>
        </div>
      )}

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-secondary/20 border-b-secondary animate-spin-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/image/icon_monivo.png"
              alt="Monivo Icon"
              width={40}
              height={40}
              className="animate-pulse"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold tracking-widest text-primary animate-pulse">
            MONIVO
          </h2>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
