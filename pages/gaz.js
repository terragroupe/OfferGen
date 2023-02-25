import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Consultant from "../data/consultant.json"

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
          <Link href={`/`}><Image className="w-full" src="/img/gaz-banner.webp" width={1300} height={200} alt="Banner" /></Link>
          <div className="max-w-6xl mx-auto mt-8">
            <div className="flex justify-between">
              <div className="text-xs flex flex-col space-y-1">
                <div className="flex space-x-1 group">
                  <label htmlFor="companyName" className="font-semibold">Votre Enterprise:</label>
                  <input className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300" type="text" name="companyName" id="companyName" />
                </div>
                <div className="flex space-x-2 group">
                  <label htmlFor="socialReason" className="font-semibold">Raison Sociale:</label>
                  <input className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300" type="text" name="socialReason" id="socialReason" />
                </div>
                <div className="flex space-x-2 group">
                  <label htmlFor="siren" className="font-semibold">SIREN:</label>
                  <input className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300" type="text" name="siren" id="siren" />
                </div>
                <div className="flex space-x-2 group">
                  <label htmlFor="contactPerson" className="font-semibold">Interlocuteur:</label>
                  <input className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300" type="text" name="contactPerson" id="contactPerson" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className=""><Image src="/img/consultant/oulabbassi.webp" alt="profile" height={90} width={90} /></div>
                <div className="flex flex-col space-y-1 text-xs">
                  <div className="font-semibold">Votre Consultant </div>
                  <div>Barlow  name</div>
                  <div>Email@sdfsdf.fgdf</div>
                  <div>02.056.54.5615</div>
                </div>
                {/* {
                  Consultant.map((item,index)=>{
                    return (<>{item.name}</>)
                  })
                } */}
              </div>
            </div>
            <Link href="/" className="bg-black mt-36 w-36 md:w-48 h-14 md:h-20 rounded-b-lg hover:bg-tgbrown-600 hover:-translate-y-1 transition-all duration-300 text-white font-bold text-xl md:text-2xl flex justify-center items-center">Générer PDF</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
