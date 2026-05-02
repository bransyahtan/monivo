"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Loading from "@/components/Loading";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading selama 2 detik
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <main>
        <Image
          src="/image/icon_monivo.png"
          alt="Monivo icon"
          width={50}
          height={50}
          style={{ height: "auto" }}
          priority
        />
        <Image
          src="/image/logo_monivo.png"
          alt="Monivo logo"
          width={400}
          height={50}
          style={{ height: "auto" }}
          priority
        />
      </main>
    </div>
  );
}
