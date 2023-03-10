import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useRef } from "react";
import { Dna } from "react-loader-spinner";

import { Fragment, useState } from "react";

import Consultant from "../data/consultant.json";
import Partner from "../data/partner.json";
import SegmentList from "../data/segmentList.json";
import { CreateHtmltoPDF, MakeDownloadFromURL } from "../utils/helper";

import DateTimePicker from "../components/dateTimePicker";
import ConsultantDropdown from "../components/consultantDropdown";
import PartnerDropdown from "../components/partnerDropdown";

export default function Home() {
  const [selectedConsultant, setSelectedConsultant] = useState(Consultant[3]);
  const [selectedSegment, setSelectedSegment] = useState(SegmentList[0]);
  const [loadingAirtable, setLoadingAirtable] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  // const [pdfUrl, setPdfUrl] = useState(null)
  // const [airtabelOgId, setAirtabelOgId] = useState(null)
  const [showPTE, setShowPTE] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    socialReason: "",
    siren: "",
    contactPerson: "",
    consultantName: selectedConsultant.name,
    site: "",
    pce: "",
    tarif: "",
    profil: "",
    car: 0,
    carHp: 0,
    carHc: 0,
    carPte: 0,
    carHph: 0,
    carHch: 0,
    carHpe: 0,
    carHce: 0,
    startDate: new Date(),
    placedDate: new Date(),
    offers: [
      {
        molecule: 0,
        hp: 0,
        hc: 0,
        pte: 0,
        hph: 0,
        hch: 0,
        hpe: 0,
        hce: 0,
        moyem: 0,
        mois: 0,
        cta: 0,
        ticgn: 0,
        htva: 0,
        type: "fix",
        partnerName: "Alpiq",
        endDate: new Date(),
      },
    ],
  });

  // States For Consultant Dropdown
  const consultantState = {
    selectedConsultant,
    setSelectedConsultant,
    Consultant,
  };

  // States For Partner Dropdown
  const partnerState = {
    formData,
    setFormData,
    Partner,
  };

  // Keep Check Forms Data
  useEffect(() => {
    console.log("formData>>", formData);
  }, [formData]);

  const handleCreatePDF = async () => {
    const printContent = document.getElementById("print-content").innerHTML;
    // From Helper
    const pdfUrl = await CreateHtmltoPDF(printContent);
    // console.log("PDFURL: " + pdfUrl);

    // OPEN theGenerated PDF in new TAB
    window.open(pdfUrl, "_blank");
    MakeDownloadFromURL(pdfUrl);
    // addOfferGenAirtable(pdfUrl);
  };

  // Add Data to OfferGen Table - AIRTABLE
  const addNosOffresAirtable = async (offGenId) => {
    await axios
      .post(
        "https://api.airtable.com/v0/app9O3VyWFlvjeBfX/NosOffres",
        {
          records: formData.offers.map((item) => {
            return {
              fields: {
                ID: `OG${Date.now().toString().substring(4)}`,
                OGID: [offGenId],
                Fournisseurs: item.partnerName,
                DebutDeFourniture: formData.startDate
                  .toISOString()
                  .substring(0, 10),
                FinDeFourniture: item.endDate.toISOString().substring(0, 10),
                Type: item.type,
                CAR: formData.car.toString(),
                Molecule: item.molecule.toString(),
                Mois: item.mois.toString(),
                CTA: item.cta.toString(),
                TICGN: item.ticgn.toString(),
                TotalHTVA: item.htva.toString(),
              },
            };
          }),
        },
        {
          headers: {
            Authorization:
              "Bearer patq4GvFG3SogJRe7.3d611c4fddbe4b4139956d95b0357a40b120168821b3a5f698a5fc5db7e554d1",
          },
        }
      )
      .then((res) => {
        console.log("Nosres>>", res.data.id);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Err>>", err);
      });
  };

  // Add Data to OfferGen Table - AIRTABLE
  const addOfferGenAirtable = async (pdfUrl) => {
    await axios
      .post(
        "https://api.airtable.com/v0/app9O3VyWFlvjeBfX/OfferGen",
        {
          fields: {
            ID: `TG${Date.now().toString().substring(4)}`,
            Raison: formData.socialReason,
            Siren: formData.siren,
            Interlocuteur: formData.contactPerson,
            Consultant: selectedConsultant.name,
            Site: formData.site,
            PCE: formData.pce,
            Tarif: formData.tarif,
            Profil: formData.profil,
            CAR: formData.car.toString(),
            PlacedDate: formData.placedDate.toISOString().substring(0, 10),
            PDF: [{ url: pdfUrl }],
          },
        },
        {
          headers: {
            Authorization:
              "Bearer patq4GvFG3SogJRe7.3d611c4fddbe4b4139956d95b0357a40b120168821b3a5f698a5fc5db7e554d1",
          },
        }
      )
      .then((res) => {
        addNosOffresAirtable(res.data.id);
      })
      .catch((err) => {
        console.log("Err>>", err);
      });
  };

  const handleSubmitButton = () => {
    setIsLoading(true);
    handleCreatePDF();
  };

  // Shortified version of calculateHTVA
  const calculateHTVA = (upData) => {
    const {
      offers,
      car,
      carHp,
      carHc,
      carPte,
      carHph,
      segmentDecision,
      pteDecision,
      showPTE,
    } = upData;
    const updatedOffers = offers.map((offer) => {
      let htva, moyem;
      if (segmentDecision === 2) {
        htva =
          parseFloat(offer.molecule) * parseFloat(car) +
          parseFloat(offer.mois) * 12;
        moyem = 0;
      } else if (pteDecision) {
        const baseHTVA =
          parseFloat(offer.hph) * parseFloat(carHph) +
          parseFloat(offer.hch) * parseFloat(carHch) +
          parseFloat(offer.hpe) * parseFloat(carHpe) +
          parseFloat(offer.hce) * parseFloat(carHce) +
          parseFloat(offer.mois) * 12;
        htva = showPTE
          ? parseFloat(offer.pte) * parseFloat(carPte) + baseHTVA
          : baseHTVA;
        moyem = parseFloat(htva / parseFloat(car)).toFixed(2);
      } else {
        htva =
          parseFloat(offer.hp) * parseFloat(carHp) +
          parseFloat(offer.hc) * parseFloat(carHc) +
          parseFloat(offer.mois) * 12;
        moyem = parseFloat(htva / parseFloat(car)).toFixed(2);
      }
      return { ...offer, htva: htva.toFixed(2), moyem };
    });

    setFormData((old) => ({ ...old, offers: updatedOffers }));
  };

  // Check The Segment Value and Return number to indicate conditional render
  const segmentDecision = (() => {
    switch (selectedSegment) {
      case "C5 HP/HC":
        return 3;
      case "C5 BASE":
        return 2;
      default:
        return 1;
    }
  })();

  // Check The PTE Value and Return if PTE will render
  const pteDecision = (() => {
    if (
      selectedSegment === "C1" ||
      selectedSegment === "C2" ||
      selectedSegment === "C3" ||
      selectedSegment === "C4 BT+"
    )
      return true;
    return false;
  })();

  // Check if CAR value == All portions of CAR
  const carSumDecision = (() => {
    const { car, carPte, carHph, carHch, carHpe, carHce, carHp, carHc } =
      formData;
    if (pteDecision) {
      const carTotal =
        parseFloat(carPte || 0) +
        parseFloat(carHph) +
        parseFloat(carHch) +
        parseFloat(carHpe) +
        parseFloat(carHce);
      const carTotalWithoutPte =
        parseFloat(carHph) +
        parseFloat(carHch) +
        parseFloat(carHpe) +
        parseFloat(carHce);

      return showPTE
        ? carTotal === parseFloat(car)
        : carTotalWithoutPte === parseFloat(car);
    } else {
      const carTotal = parseFloat(carHp) + parseFloat(carHc);
      return carTotal === parseFloat(car);
    }
  })();

  // Handle Date Input
  const handleDateInput = (e, index) => {
    const value = e.target.value;
    setFormData((prevFormData) => {
      const updatedOffers = prevFormData.offers.map((offer, i) => {
        if (i !== index) return offer; // leave other offers unchanged
        return {
          ...offer,
          endDate: new Date(value),
        };
      });

      const updatedFormData = {
        ...prevFormData,
        offers: updatedOffers,
      };
      return updatedFormData;
    });
  };

  // handle Inputs on Nos Offres
  const handleOfferInput = (event, index) => {
    const value = event.target.value;
    const name = event.target.name;

    setFormData((prevFormData) => {
      const updatedOffers = prevFormData.offers.map((offer, i) => {
        if (i === index) {
          return {
            ...offer,
            [name]: value,
          };
        }
        return offer;
      });
      const updatedFormData = {
        ...prevFormData,
        offers: updatedOffers,
      };
      calculateHTVA(updatedFormData);
      return updatedFormData;
    });
  };

  // Handle Top input Fields
  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    if (name === "site") {
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    }
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };
      calculateHTVA(updatedFormData);
      return updatedFormData;
    });
  };

  return (
    <div>
      <Head>
        <title>Générateur d&rsquo;Offres - Électricité</title>
        <meta name="description" content="Générateur d'Offres" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id="print-content" className="max-w-7xl mx-auto">
          <Link href={`/`}>
            <img
              className="w-full px-4"
              src="./img/electricite-banner.webp"
              width={1300}
              height={200}
              alt="Banner"
            />
          </Link>
          <div className="w-full px-4 mx-auto mt-8">
            {/* First Section - Comapany & Consultant Information */}
            <div className="flex justify-between">
              <div className="text-xs flex flex-col space-y-1">
                <div className="flex space-x-1 group">
                  <label htmlFor="companyName" className="font-semibold">
                    Votre Enterprise
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
                    value={formData.socialReason}
                    onChange={handleInputChange}
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
                    value={formData.siren}
                    onChange={handleInputChange}
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
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <ConsultantDropdown consultantState={consultantState} />
            </div>

            {/* Second Section - Header */}
            <div className="grid grid-cols-6 text-white bg-tgbrown-400 rounded-t-md mt-6">
              <div className="text-center text-sm font-bold border-r py-1">
                Site
              </div>
              <div className="text-center text-sm font-bold border-r py-1">
                PDL
              </div>
              <div className="text-center text-sm font-bold border-r py-1">
                Segment
              </div>
              <div className="text-center text-sm font-bold border-r py-1">
                Puissance (en Kva)
              </div>
              <div className="text-center text-sm font-bold border-r py-1">
                CAR(MWH)
              </div>
              <div className="text-center text-sm font-bold py-1">TURPE</div>
            </div>
            {/* Second Section - ROW */}
            <div className="grid grid-cols-6 border overflow-hidden border-tgbrown-400 rounded-b-md">
              {/* Site */}
              <textarea
                className="resize-none focus-within:resize-y text-center border-r border-tgbrown-400 py-3"
                name="site"
                id="site"
                maxLength={70}
                cols="35"
                rows="1"
                value={formData.site}
                onChange={handleInputChange}
              ></textarea>
              {/* PDL */}
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="text"
                maxLength={8}
                name="pdl"
                id="pdl"
                value={formData.pdl}
                onChange={handleInputChange}
              />
              {/* Segment */}
              <select
                id="segment"
                name="segment"
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full appearance-none text-center border-r border-tgbrown-400"
              >
                {SegmentList.map((item, index) => {
                  return (
                    <option key={index} className="text-base" value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
              {/* Puissance (en Kva) */}
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="text"
                maxLength={20}
                name="puissance"
                id="puissance"
                value={formData.puissance}
                onChange={handleInputChange}
              />
              {/* CAR(MWH) */}
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="number"
                min={1}
                name="car"
                id="car"
                value={formData.car}
                onChange={handleInputChange}
              />
              {/* TURPE */}
              <input
                className="w-full py-3 text-center"
                type="text"
                name="turpe"
                id="turpe"
                value={formData.turpe}
                onChange={handleInputChange}
              />
            </div>

            {/* Consoitration Section - START */}
            {segmentDecision !== 2 && (
              <div className="mt-8">
                <h1 className="text-center mb-2 text-lg font-semibold">
                  Consommation
                </h1>
                {segmentDecision === 1 && (
                  <div className="max-w-3xl mx-auto rounded-md border border-tgbrown-400">
                    <div
                      className={`grid ${
                        pteDecision && showPTE ? "grid-cols-5" : "grid-cols-4"
                      }`}
                    >
                      {pteDecision && showPTE && (
                        <div className="text-center text-sm font-bold bg-tgbrown-400 border-r text-white py-1 relative group">
                          PTE
                          {showPTE && (
                            <div className="absolute hidden group-hover:block hover:scale-110 transition-all duration-300 -top-3 left-0 -translate-x-1/2">
                              <button
                                className="bg-red-700 text-white rounded-full w-8 h-8"
                                onClick={() => {
                                  setShowPTE(false);
                                }}
                              >
                                x
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-center text-sm font-bold bg-tgbrown-400 border-r text-white py-1 relative group">
                        HPH
                        {!showPTE && (
                          <div className="absolute hidden group-hover:block hover:scale-110 transition-all duration-300 -bottom-3 left-0 -translate-x-1/2">
                            <button
                              className="bg-tgbrown-500 text-white rounded-full w-8 h-8"
                              onClick={() => {
                                setShowPTE(true);
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-center text-sm font-bold bg-tgbrown-400 border-r text-white py-1">
                        HCH
                      </div>
                      <div className="text-center text-sm font-bold bg-tgbrown-400 border-r text-white py-1">
                        HPE
                      </div>
                      <div className="text-center text-sm font-bold bg-tgbrown-400 text-white py-1">
                        HCE
                      </div>
                    </div>
                    <div
                      className={`grid ${
                        pteDecision && showPTE ? "grid-cols-5" : "grid-cols-4"
                      }`}
                    >
                      {pteDecision && showPTE && (
                        <input
                          className="w-full pt-2 pb-1 text-center border-r border-tgbrown-400"
                          type="number"
                          min={1}
                          name="carPte"
                          id="carPte"
                          value={formData.carPte}
                          onChange={handleInputChange}
                        />
                      )}
                      <input
                        className="w-full pt-2 pb-1 text-center border-r border-tgbrown-400"
                        type="number"
                        min={1}
                        name="carHph"
                        id="carHph"
                        value={formData.carHph}
                        onChange={handleInputChange}
                      />
                      <input
                        className="w-full pt-2 pb-1 text-center border-r border-tgbrown-400"
                        type="number"
                        min={1}
                        name="carHch"
                        id="carHch"
                        value={formData.carHch}
                        onChange={handleInputChange}
                      />
                      <input
                        className="w-full pt-2 pb-1 text-center border-r border-tgbrown-400"
                        type="number"
                        min={1}
                        name="carHpe"
                        id="carHpe"
                        value={formData.carHpe}
                        onChange={handleInputChange}
                      />
                      <input
                        className="w-full pt-2 pb-1 text-center border-r"
                        type="number"
                        min={1}
                        name="carHce"
                        id="carHce"
                        value={formData.carHce}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div
                      className={`grid ${
                        pteDecision && showPTE ? "grid-cols-5" : "grid-cols-4"
                      }`}
                    >
                      {pteDecision && showPTE && (
                        <div className="text-center text-tgbrown-500 text-sm pb-1 border-r border-tgbrown-400">
                          {parseFloat(
                            (formData.carPte / formData.car) * 100
                          ).toFixed(2)}
                          %
                        </div>
                      )}
                      <div className="text-center text-tgbrown-500 text-sm pb-1 border-r border-tgbrown-400">
                        {parseFloat(
                          (formData.carHph / formData.car) * 100
                        ).toFixed(2)}
                        %
                      </div>
                      <div className="text-center text-tgbrown-500 text-sm pb-1 border-r border-tgbrown-400">
                        {parseFloat(
                          (formData.carHch / formData.car) * 100
                        ).toFixed(2)}
                        %
                      </div>
                      <div className="text-center text-tgbrown-500 text-sm pb-1 border-r border-tgbrown-400">
                        {parseFloat(
                          (formData.carHpe / formData.car) * 100
                        ).toFixed(2)}
                        %
                      </div>
                      <div className="text-center text-tgbrown-500 text-sm pb-1">
                        {parseFloat(
                          (formData.carHce / formData.car) * 100
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>
                )}

                {segmentDecision === 3 && (
                  <div className="max-w-md mx-auto rounded-md border border-tgbrown-400">
                    <div className="grid grid-cols-2">
                      <div className="text-center text-sm font-bold bg-tgbrown-400 border-r text-white py-1">
                        HP
                      </div>
                      <div className="text-center text-sm font-bold bg-tgbrown-400 text-white py-1">
                        HC
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <input
                        className="w-full pt-2 pb-1 text-center border-r border-tgbrown-400"
                        type="number"
                        min={1}
                        name="carHp"
                        id="carHp"
                        value={formData.carHp}
                        onChange={handleInputChange}
                      />
                      <input
                        className="w-full pt-2 pb-1 text-center border-r"
                        type="number"
                        min={1}
                        name="carHc"
                        id="carHc"
                        value={formData.carHc}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-center text-tgbrown-500 text-sm pb-1 border-r border-tgbrown-400">
                        {parseFloat(
                          (formData.carHp / formData.car) * 100
                        ).toFixed(2)}
                        %
                      </div>
                      <div className="text-center text-tgbrown-500 text-sm pb-1">
                        {parseFloat(
                          (formData.carHc / formData.car) * 100
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>
                )}
                {!carSumDecision && (
                  <h6 className="text-center text-xs text-red-600">
                    ** Veuillez vérifier la valeur CAR
                  </h6>
                )}
              </div>
            )}
            {/* Consoitration Section - END */}

            <div className="mt-8">
              <h1 className="text-tgbrown-400 font-extrabold text-base">
                LES OFFRES RETENUES
              </h1>
              <div className="text-tgbrown-400 font-semibold text-xs flex items-center">
                {/* {debutDate.toLocaleDateString('en-UK',{ day: '2-digit', month: '2-digit', year: 'numeric' })} */}
                <span className="mr-1">Début de fourniture au</span>
                <input
                  type="date"
                  className="ml-1"
                  value={formData.startDate.toISOString().substring(0, 10)}
                  onChange={(e) =>
                    setFormData((old) => ({
                      ...old,
                      startDate: new Date(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            {/* NOS OFFRES Table Section */}
            <div
              className={`grid ${
                segmentDecision !== 2 ? "grid-cols-8" : "grid-cols-7"
              } text-white bg-tgbrown-400 rounded-t-md mt-6`}
            >
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
              <div
                className={`grid col-span-2 ${
                  segmentDecision === 2 ? " grid-rows-1" : " grid-rows-2"
                }`}
              >
                <div className="text-center text-[11px] font-bold border-r py-1">
                  Prix Molécule MWh
                </div>
                {segmentDecision !== 2 && (
                  <div
                    className={`grid ${
                      segmentDecision === 3
                        ? "grid-cols-2"
                        : showPTE && pteDecision
                        ? "grid-cols-5"
                        : "grid-cols-4"
                    }`}
                  >
                    {segmentDecision === 3 && (
                      <>
                        <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                          HP
                        </div>
                        <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                          HC
                        </div>
                      </>
                    )}
                    {segmentDecision === 1 && (
                      <>
                        {showPTE && pteDecision && (
                          <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                            PTE
                          </div>
                        )}
                        <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                          HPH
                        </div>
                        <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                          HCH
                        </div>
                        <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                          HPE
                        </div>
                        <div className="text-center text-[11px] font-semibold border-t border-r py-1">
                          HCE
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              {segmentDecision !== 2 && (
                <div className="text-center text-[11px] font-bold border-r py-1">
                  Coût <br />
                  moyen pondéré
                </div>
              )}

              <div className="text-center text-[11px] font-bold border-r py-1">
                Abonnement/
                <br />
                Mois
              </div>

              <div className="text-center text-[11px] font-bold py-1">
                Budget HTVA
              </div>
            </div>
            <div className="text-center text-tgbrown-400 text-xl font-extrabold border-l border-r border-tgbrown-400 py-3">
              NOS OFFRES
            </div>
            {formData.offers.map((item, index) => {
              // Check if item is the last for CSS changes
              const isLast = formData.offers.length - 1 === index;
              const oglength = formData.offers.length;
              return (
                <div
                  key={index}
                  className={`grid ${
                    segmentDecision !== 2 ? "grid-cols-8" : "grid-cols-7"
                  } border text-[11px] font-semibold border-r-tgbrown-400 border-l-tgbrown-400 border-t-tgbrown-400 ${
                    isLast && "rounded-b-md border-b-tgbrown-400"
                  }`}
                >
                  {/* Partner/ Fournisseurs List */}
                  <div className="text-center border-r border-tgbrown-400">
                    <PartnerDropdown
                      partnerState={partnerState}
                      index={index}
                      item={item}
                    />
                  </div>
                  {/* Engagement/ Fin de Fourniture */}
                  <div className="flex items-center justify-center text-center border-r border-tgbrown-400">
                    <div className="text-center">
                      Fin au
                      <input
                        type="date"
                        className="text-center"
                        value={item.endDate.toISOString().substring(0, 10)}
                        onChange={(e) => handleDateInput(e, index)}
                      />
                      <br />
                      {(item.endDate.getFullYear() -
                        formData.startDate.getFullYear()) *
                        12 +
                        (item.endDate.getMonth() -
                          formData.startDate.getMonth()) +
                        1}{" "}
                      mois
                    </div>
                  </div>
                  {/* Offer Type */}
                  <select
                    id="type"
                    name="type"
                    defaultValue={"fix"}
                    onChange={(e) => handleOfferInput(e, index)}
                    className="w-full appearance-none text-center border-r border-tgbrown-400"
                  >
                    <option className="text-base" value="fix">
                      Prix Fixe
                    </option>
                    <option className="text-base" value="var">
                      Prix Variable
                    </option>
                  </select>

                  {/* Prix Molecule */}
                  {segmentDecision === 2 ? (
                    <>
                      <div className="grid col-span-2">
                        <input
                          className="w-full text-center border-r border-tgbrown-400"
                          type="number"
                          min={1}
                          name="molecule"
                          id="molecule"
                          value={item.molecule}
                          onChange={(e) => handleOfferInput(e, index)}
                        />
                      </div>
                    </>
                  ) : (
                    <div
                      className={`grid col-span-2 ${
                        segmentDecision === 3
                          ? "grid-cols-2"
                          : showPTE && pteDecision
                          ? "grid-cols-5"
                          : "grid-cols-4"
                      }`}
                    >
                      {segmentDecision === 3 && (
                        <>
                          <input
                            className="w-full text-center border-r border-tgbrown-400"
                            type="number"
                            min={1}
                            name="hp"
                            id="hp"
                            value={item.hp}
                            onChange={(e) => handleOfferInput(e, index)}
                          />
                          <input
                            className="w-full text-center border-r border-tgbrown-400"
                            type="number"
                            min={1}
                            name="hc"
                            id="hc"
                            value={item.hc}
                            onChange={(e) => handleOfferInput(e, index)}
                          />
                        </>
                      )}
                      {segmentDecision === 1 && (
                        <>
                          {showPTE && pteDecision && (
                            <input
                              className="w-full text-center border-r border-tgbrown-400"
                              type="number"
                              min={1}
                              name="pte"
                              id="pte"
                              value={item.pte}
                              onChange={(e) => handleOfferInput(e, index)}
                            />
                          )}
                          <input
                            className="w-full text-center border-r border-tgbrown-400"
                            type="number"
                            min={1}
                            name="hph"
                            id="hph"
                            value={item.hph}
                            onChange={(e) => handleOfferInput(e, index)}
                          />
                          <input
                            className="w-full text-center border-r border-tgbrown-400"
                            type="number"
                            min={1}
                            name="hch"
                            id="hch"
                            value={item.hch}
                            onChange={(e) => handleOfferInput(e, index)}
                          />
                          <input
                            className="w-full text-center border-r border-tgbrown-400"
                            type="number"
                            min={1}
                            name="hpe"
                            id="hpe"
                            value={item.hpe}
                            onChange={(e) => handleOfferInput(e, index)}
                          />
                          <input
                            className="w-full text-center border-r border-tgbrown-400"
                            type="number"
                            min={1}
                            name="hce"
                            id="hce"
                            value={item.hce}
                            onChange={(e) => handleOfferInput(e, index)}
                          />
                        </>
                      )}
                    </div>
                  )}

                  {segmentDecision !== 2 && (
                    // Moyem/ Average
                    <div className="flex items-center justify-center border-r border-tgbrown-400">
                      {item.moyem}
                    </div>
                  )}

                  <input
                    className="w-full text-center border-r border-tgbrown-400"
                    type="number"
                    min={1}
                    name="mois"
                    id="mois"
                    value={item.mois}
                    onChange={(e) => handleOfferInput(e, index)}
                  />

                  {/* Total HTVA */}
                  <div className="flex justify-center items-center relative group">
                    {parseFloat(item.htva)
                      .toLocaleString("en-US", { minimumFractionDigits: 2 })
                      .replaceAll(",", " ")}
                    €
                    {isLast && oglength < 3 && (
                      <div className="absolute hidden group-hover:block hover:scale-110 transition-all duration-300 -bottom-3 right-0 translate-x-1/2">
                        <button
                          className="bg-tgbrown-400 text-white rounded-full w-5 h-5"
                          onClick={() => {
                            setFormData((prevState) => ({
                              ...prevState,
                              offers: [
                                ...prevState.offers,
                                {
                                  molecule: 0,
                                  hp: 0,
                                  hc: 0,
                                  pte: 0,
                                  hph: 0,
                                  hch: 0,
                                  hpe: 0,
                                  hce: 0,
                                  moyem: 0,
                                  mois: 0,
                                  cta: 0,
                                  ticgn: 0,
                                  htva: 0,
                                  type: "fix",
                                  partnerName: "Alpiq",
                                  endDate: new Date(),
                                },
                              ],
                            }));
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                    {oglength > 1 && (
                      <div className="absolute hidden group-hover:block hover:scale-110 transition-all duration-300 top-1/2 -right-1 -translate-y-1/2 translate-x-1/2">
                        <button
                          className="bg-red-600 text-white rounded-full w-5 h-5"
                          onClick={() => {
                            setFormData((prevState) => {
                              const updatedOffers = [...prevState.offers];
                              updatedOffers.splice(index, 1);
                              return {
                                ...prevState,
                                offers: updatedOffers,
                              };
                            });
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Footer Portion */}
            <div className="flex justify-between mt-8">
              <div className="text-xs font-bold flex items-center">
                <span className="mr-1">Date de validité:</span>
                <DateTimePicker
                  className="font-normal"
                  value={formData.placedDate}
                  needTime={true}
                  onChange={(newDate) =>
                    setFormData((old) => ({ ...old, placedDate: newDate }))
                  }
                />
              </div>
              <div className="text-xs font-bold">CONFIDENTIEL</div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-10 mt-8">
          <button
            disabled={isLoading}
            onClick={handleSubmitButton}
            className="bg-tgbrown-400 w-36 mx-auto mb-10 md:w-52 h-14 md:h-16 rounded-3xl px-4 hover:bg-tgbrown-600 hover:-translate-y-1 transition-all duration-300 text-white font-bold text-xl md:text-2xl flex justify-center items-center"
          >
            {isLoading ? (
              <Dna
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            ) : (
              <div className="flex item-center">
                <span>Générer PDF</span>
                <img
                  className="ml-2 my-auto w-7 h-6"
                  src="./img/download.webp"
                  alt=""
                />
              </div>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
