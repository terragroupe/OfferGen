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
          <div className="max-w-sm mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:justify-between md:items-center mt-12 md:mt-36">
            <Link href="/gaz" className="w-32 hover:scale-110 hover:-translate-y-1 transition-all duration-500"><img className="w-32" src="./img/gas.webp" alt="" /></Link>
            <Link href="/" className="w-32 hover:scale-110 hover:-translate-y-1 transition-all duration-500"><img className="w-32" src="./img/electricity.webp" alt="" /></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
