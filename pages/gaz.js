import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect } from "react";

import { jsPDF } from "jspdf";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import Consultant from "../data/consultant.json";
import Partner from "../data/partner.json";

const createPDF = async () => {
  const printContent = document.getElementById("print-content").innerHTML;
  // Formating for PDF.CO With tailwind CSS
  // Tailwind Intellisense Bug ->
  const htmlContent = `
      <html>
          <head>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
            input[type="date"]::-webkit-calendar-picker-indicator {
              display: none;
          }
          .bg-tgbrown-400{
            background-color:#A6845B;
          }
          .text-tgbrown-400{
            color:#A6845B;
          }
          .border-tgbrown-400 {
            border-color: #A6845B;
        }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  tgbrown-400: '#da373d',
                }
              }
            }
          }
        </script>
          </script>
          </head>
          <body>
              ${printContent}
          </body>
      </html>
  `;

  const apiKey =
    "fahimfaisal1998@gmail.com_11301841ce4bc05ccea96fff26791c94e7ec723bbfa4971b6c67f990904964def68ff38b";
  const endpoint = "https://api.pdf.co/v1/pdf/convert/from/html";

  const response = await axios.post(
    endpoint,
    {
      html: htmlContent,
      name: "document.pdf",
      margins: "8px 8px 8px 8px",
      paperSize: "A4",
      orientation: "Portrait",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    }
  );
  console.log(response.data);
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [selectedConsultant, setSelectedConsultant] = useState(Consultant[3]);
  const [selectedPartner, setSelectedPartner] = useState(Partner[1]);
  const [debutDate, setDebutDate] = useState(new Date());
  const [formData, setFormData] = useState({htva:0});

  useEffect(()=>{
console.log(formData);
  },[formData])

  const calulateHTVA = ()=>{
    // Total HTVA: (Mois*car)+(Abonnement*12)+CTA+(TICGN*car)
    // a8 = (a4*car + a5*12 + a6 + a7*car)
    var totalHTVA = (formData.molecule*formData.car)+(formData.mois*12)+formData.cta+(formData.ticgn*formData.car)
    console.log("Total HTVA: " + totalHTVA);
    setFormData({...formData, "htva":totalHTVA})
  }

  const handleInputChange = (event) => {
    calulateHTVA()
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

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
            <img
              className="w-full"
              src="https://offergen.vercel.app/_next/image?url=%2Fimg%2Ffirst-page-banner.webp&w=1920&q=75"
              width={1300}
              height={200}
              alt="Banner"
            />
          </Link>
          <div className="max-w-6xl mx-auto px-10 mt-8">
            <div className="flex justify-between">
              <div className="text-xs flex flex-col space-y-1">
                <div className="flex space-x-1 group">
                  <label htmlFor="companyName" className="font-semibold">
                    Votre Enterprise:
                  </label>
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
                    value={formData.socialReason || ""}
                    onChange={(e) => handleInputChange(e)}
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
                    value={formData.siren || ""}
                    onChange={(e) => handleInputChange(e)}
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
                    value={formData.contactPerson || ""}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              </div>
              <Listbox
                value={selectedConsultant}
                onChange={setSelectedConsultant}
              >
                {({ open }) => (
                  <>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-md pl-3 text-left focus:outline-none sm:text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="">
                            <img
                              src={`https://offergen.vercel.app/img/consultant/${selectedConsultant.image}`}
                              alt="profile"
                              height={90}
                              width={90}
                            />
                          </div>
                          <div className="flex flex-col space-y-1 text-xs">
                            <div className="font-semibold">
                              Votre Consultant{" "}
                            </div>
                            <div>{selectedConsultant.name}</div>
                            <div>{selectedConsultant.email}</div>
                            <div>{selectedConsultant.cid}</div>
                          </div>
                        </div>
                        {/* <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span> */}
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
                                  active
                                    ? "text-white bg-tgbrown-300"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={person}
                            >
                              {({ selectedConsultant, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <img
                                      src={`/img/consultant/${person.image}`}
                                      alt="person"
                                      className="h-6 w-6 flex-shrink-0 rounded-full"
                                    />
                                    <span
                                      className={classNames(
                                        selectedConsultant
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {person.name}
                                    </span>
                                  </div>

                                  {selectedConsultant ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-tgbrown-400",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
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
            <div className="grid grid-cols-5 text-white bg-tgbrown-400 rounded-t-md mt-6">
              <div className="text-center text-sm font-bold border-r py-1">
                Site
              </div>
              <div className="text-center text-sm font-bold border-r py-1">
                PCE
              </div>
              <div className="text-center text-sm font-bold border-r py-1">
                Tarif
              </div>
              <div className="text-center text-sm font-bold border-r py-1">
                Profil
              </div>
              <div className="text-center text-sm font-bold py-1">CAR(MWH)</div>
            </div>
            <div className="grid grid-cols-5 border overflow-hidden border-tgbrown-400 rounded-b-md">
              <textarea
                className="resize-none border-r border-tgbrown-400"
                name=""
                id=""
                maxLength={70}
                cols="35"
                rows="2"
              ></textarea>
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="number"
                maxLength={8}
                min={1}
                name=""
                id=""
              />
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="number"
                min={1}
                name=""
                id=""
              />
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="text"
                maxLength={20}
                name=""
                id=""
              />
              <input
                className="w-full py-3 text-center"
                type="number"
                min={1}
                name="car"
                id="car"
                value={formData.car || ""}
                onChange={(e) => handleInputChange(e)}
              />
            </div>

            <div className="mt-6">
              <h1 className="text-tgbrown-400 font-extrabold text-base">
                LES OFFRES RETENUES
              </h1>
              <div className="text-tgbrown-400 font-semibold text-xs">
                {/* {debutDate.toLocaleDateString('en-UK',{ day: '2-digit', month: '2-digit', year: 'numeric' })} */}
                Début de fourniture au
                <input
                  type="date"
                  className="ml-1"
                  value={debutDate.toISOString().substring(0, 10)}
                  onChange={(e) => setDebutDate(new Date(e.target.value))}
                  name=""
                  id=""
                />
              </div>
            </div>

            <div className="grid grid-cols-7 text-white bg-tgbrown-400 rounded-t-md mt-6">
              <div className="text-center text-[11px] font-bold border-r py-1">
                Fournisseurs
              </div>
              <div className="grid grid-rows-2">
                <div className="text-center text-[11px] font-bold border-r py-1">
                  Engagement
                </div>
                <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                  Fin de Fourniture
                </div>
              </div>
              <div className="text-center text-[11px] font-bold border-r py-1">
                Type d’Offre
              </div>
              <div className="text-center text-[11px] font-bold border-r py-1">
                Prix Molécule MWh
              </div>
              <div className="text-center text-[11px] font-bold border-r py-1">
                Abonnement/
                <br />
                Mois
              </div>
              <div className="grid grid-rows-2">
                <div className="text-center text-[11px] font-bold border-r py-1">
                  Taxes
                </div>
                <div className="grid grid-cols-2">
                  <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                    CTA/An
                  </div>
                  <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                    TICGN
                  </div>
                </div>
              </div>
              <div className="text-center text-[11px] font-bold py-1">
                Total HTVA
              </div>
            </div>
            <div className="text-center text-tgbrown-400 text-xl font-extrabold border-l border-r border-tgbrown-400 py-3">
              NOS OFFRES
            </div>
            <div className="grid grid-cols-7 border text-[11px] font-semibold border-tgbrown-400 rounded-b-md">
              <div className="py-1 text-center border-r border-tgbrown-400">
                <Listbox value={selectedPartner} onChange={setSelectedPartner}>
                  {({ open }) => (
                    <>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-pointer focus:outline-none sm:text-sm">
                          <img
                            src={`https://offergen.vercel.app/img/partner/${selectedPartner.logo}`}
                            className="w-full"
                            alt=""
                          />
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-24 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {Partner.map((person) => (
                              <Listbox.Option
                                key={person.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-tgbrown-300"
                                      : "text-gray-900",
                                    "relative cursor-default select-none"
                                  )
                                }
                                value={person}
                              >
                                {({ selectedPartner, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <img
                                        src={`/img/partner/${person.logo}`}
                                        alt="person"
                                        className=""
                                      />
                                    </div>
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
              <div className="flex items-center justify-center text-center border-r border-tgbrown-400">
                <div className="text-center">
                  Fin au
                  <input
                    type="date"
                    className="text-center"
                    value={debutDate.toISOString().substring(0, 10)}
                    onChange={(e) => setDebutDate(new Date(e.target.value))}
                    name=""
                    id=""
                  />
                  <br />
                  {(debutDate.getFullYear() - new Date().getFullYear()) * 12 +
                    (debutDate.getMonth() - new Date().getMonth())}{" "}
                  mois
                </div>
              </div>
              <select
                id="countries"
                className="w-full appearance-none text-center border-r border-tgbrown-400"
              >
                <option className="text-base" selected value="fix">
                  Prix Fixe
                </option>
                <option className="text-base" value="var">
                  Prix Variable
                </option>
              </select>

              <input
                className="w-full text-center border-r border-tgbrown-400"
                type="number"
                min={1}
                name="molecule"
                id="molecule"
                value={formData.molecule || ""}
                onChange={(e) => handleInputChange(e)}
              />
              <input
                className="w-full text-center border-r border-tgbrown-400"
                type="number"
                min={1}
                name="mois"
                id="mois"
                value={formData.mois || ""}
                onChange={(e) => handleInputChange(e)}
              />

              <div className="grid grid-cols-2">
                <input
                  className="w-full text-center border-r border-tgbrown-400"
                  type="number"
                  min={1}
                  name="cta"
                  id="cta"
                  value={formData.cta || ""}
                  onChange={(e) => handleInputChange(e)}
                />
                <input
                  className="w-full text-center border-r border-tgbrown-400"
                  type="number"
                  min={1}
                  name="ticgn"
                  id="ticgn"
                  value={formData.ticgn || ""}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="flex justify-center items-center">
                {formData.htva}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <div className="text-xs font-bold">
                Date:{" "}
                <input
                  type="date"
                  className="ml-1"
                  value={debutDate.toISOString().substring(0, 10)}
                  onChange={(e) => setDebutDate(new Date(e.target.value))}
                  name=""
                  id=""
                />
              </div>
              <div className="text-xs font-bold">CONFIDENTIEL</div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-10 mt-8">
          <button
            onClick={createPDF}
            className="bg-black w-36 mx-auto mb-10 md:w-48 h-14 md:h-20 rounded-b-lg hover:bg-tgbrown-600 hover:-translate-y-1 transition-all duration-300 text-white font-bold text-xl md:text-2xl flex justify-center items-center"
          >
            Générer PDF
          </button>
        </div>
      </main>
    </div>
  );
}
