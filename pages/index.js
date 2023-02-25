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
          <Image className="w-full" src="/img/first-page-banner.webp" width={1300} height={200} alt="Banner" />
          <div className="max-w-lg mx-auto flex flex-col md:flex-row items-center space-y-6 md:justify-between mt-12 md:mt-32">
            <Link href="/" className="bg-tgbrown-400 w-36 md:w-48 h-14 md:h-20 rounded-md hover:bg-tgbrown-600 hover:-translate-y-1 transition-all duration-300 text-white font-bold text-xl md:text-2xl flex justify-center items-center">Gaz</Link>
            <Link href="/" className="bg-tgbrown-400 w-36 md:w-48 h-14 md:h-20 rounded-md hover:bg-tgbrown-600 hover:-translate-y-1 transition-all duration-300 text-white font-bold text-xl md:text-2xl flex justify-center items-center">Electricité</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
