import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import Consultant from "../data/consultant.json";

async function createPDF() {
  const htmlContent = document.getElementById("print-content").innerHTML;
  const apiKey =
    "fahimfaisal1998@gmail.com_11301841ce4bc05ccea96fff26791c94e7ec723bbfa4971b6c67f990904964def68ff38b";
  const endpoint = "https://api.pdf.co/v1/pdf/convert/from/html";

  try {
    const response = await axios.post(
      endpoint,
      {
        html: "<b>Helloo</b> how are",
        name: "document.pdf",
        async: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );
    console.log(response.data);
    // const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    // const pdfUrl = URL.createObjectURL(pdfBlob);
    // window.open(pdfUrl);
  } catch (error) {
    console.error(error);
  }
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [selected, setSelected] = useState(Consultant[3]);

  return (
    <div>
      <Head>
        <title>Générateur d&rsquo;Offres</title>
        <meta name="description" content="Générateur d'Offres" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id="print-content" className="max-w-7xl mx-auto">
          <Link href={`/`}>
            <Image
              className="w-full"
              src="/img/gaz-banner.webp"
              width={1300}
              height={200}
              priority
              alt="Banner"
            />
          </Link>
          <div className="max-w-6xl mx-auto px-2 mt-8">
            <div className="flex justify-between">
              <div className="text-xs flex flex-col space-y-1">
                <div className="flex space-x-1 group">
                  <label htmlFor="companyName" className="font-semibold">
                    Votre Enterprise:
                  </label>
                  <input
                    className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300"
                    type="text"
                    name="companyName"
                    id="companyName"
                  />
                </div>
                <div className="flex space-x-2 group">
                  <label htmlFor="socialReason" className="font-semibold">
                    Raison Sociale:
                  </label>
                  <input
                    className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300"
                    type="text"
                    name="socialReason"
                    id="socialReason"
                  />
                </div>
                <div className="flex space-x-2 group">
                  <label htmlFor="siren" className="font-semibold">
                    SIREN:
                  </label>
                  <input
                    className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300"
                    type="text"
                    name="siren"
                    id="siren"
                  />
                </div>
                <div className="flex space-x-2 group">
                  <label htmlFor="contactPerson" className="font-semibold">
                    Interlocuteur:
                  </label>
                  <input
                    className="group-hover:outline group-hover:outline-1 px-1 transition-all duration-300"
                    type="text"
                    name="contactPerson"
                    id="contactPerson"
                  />
                </div>
              </div>
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-md py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="">
                            <Image
                              src={`/img/consultant/${selected.image}`}
                              alt="profile"
                              height={90}
                              width={90}
                            />
                          </div>
                          <div className="flex flex-col space-y-1 text-xs">
                            <div className="font-semibold">Votre Consultant </div>
                            <div>{selected.name}</div>
                            <div>{selected.email}</div>
                            <div>{selected.cid}</div>
                          </div>
                        </div>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {Consultant.map((person) => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                classNames(
                                  active ? "text-white bg-tgbrown-300" : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={person}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <img
                                      src={`/img/consultant/${person.image}`}
                                      alt="person"
                                      className="h-6 w-6 flex-shrink-0 rounded-full"
                                    />
                                    <span
                                      className={classNames(
                                        selected ? "font-semibold" : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {person.name}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? "text-white" : "text-tgbrown-400",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>

            {/* <table className="w-full rounded-md">
              <thead className="bg-tgbrown-400 text-white">
                <th className="text-sm font-bold py-1">Site</th>
                <th className="text-sm font-bold py-1">PCE</th>
                <th className="text-sm font-bold py-1">Tarif</th>
                <th className="text-sm font-bold py-1">Profil</th>
                <th className="text-sm font-bold py-1">CAR(MWH)</th>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-tgbrown-400">
                    <input className="w-full py-3 text-center" type="text" name="" id="" />
                  </td>
                  <td className="border border-tgbrown-400">
                    <input className="w-full py-3 text-center" type="text" name="" id="" />
                  </td>
                  <td className="border border-tgbrown-400">
                    <input className="w-full py-3 text-center" type="text" name="" id="" />
                  </td>
                  <td className="border border-tgbrown-400">
                    <input className="w-full py-3 text-center" type="text" name="" id="" />
                  </td>
                  <td className="border border-tgbrown-400">
                    <input className="w-full py-3 text-center" type="text" name="" id="" />
                  </td>
                </tr>
              </tbody>
            </table> */}

            <button
              onClick={createPDF}
              className="bg-black mt-36 w-36 md:w-48 h-14 md:h-20 rounded-b-lg hover:bg-tgbrown-600 hover:-translate-y-1 transition-all duration-300 text-white font-bold text-xl md:text-2xl flex justify-center items-center"
            >
              Générer PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
