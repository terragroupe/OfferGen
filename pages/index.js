import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Générateur d&rsquo;Offres</title>
        <meta name="description" content="Générateur d'Offres" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="max-w-7xl mx-auto">
          <Link href={`/`}><Image className="w-full" src="/img/first-page-banner.webp" width={1300} height={200} alt="Banner" /></Link>
          <div className="max-w-4xl px-8 mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:justify-between md:items-center mt-12 md:mt-20">
            <Link href="/gaz" className="hover:scale-105 hover:-translate-y-1 transition-all duration-500 border-2 border-tgbrown-400 rounded-lg shadow-md"><img className="w-80" src="./img/gas3d.webp" alt="" /></Link>
            <Link href="/electricite" className="hover:scale-105 hover:-translate-y-1 transition-all duration-500 border-2 border-tgbrown-400 rounded-lg shadow-md"><img className="w-80" src="./img/electricity3d.webp" alt="" /></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
