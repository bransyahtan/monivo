import Image from "next/image";

export default function Home() {
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
