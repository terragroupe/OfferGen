import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect,useRef } from "react";
import { Dna } from "react-loader-spinner";
import {jsPDF} from "jspdf";

import { Fragment, useState } from "react";

import Consultant from "../data/consultant.json";
import Partner from "../data/partner.json";

import ConsultantDropdown from "../components/consultantDropdown";
import PartnerDropdown from "../components/partnerDropdown";

export default function Home() {
  const pdfRef = useRef(null);

  const [selectedConsultant, setSelectedConsultant] = useState(Consultant[3]);
  const [loadingAirtable, setLoadingAirtable] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  // const [pdfUrl, setPdfUrl] = useState(null)
  // const [airtabelOgId, setAirtabelOgId] = useState(null)
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
    startDate: new Date(),
    placedDate: new Date(),
    offers: [
      {
        molecule: 0,
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
  

  // Call PDF.CO API and generate pdf
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
    </style>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              "tgbrown-400": "#a6845b",
            },
          },
        },
      };
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
    console.log(response.data.url);
    const kkkdk = downloadPdf(response.data.url).then(x=> console.log(URL.createObjectURL(x)))
   ;
    // addOfferGenAirtable(kkkdk);
  };
  const downloadPdf = async (uurrl) => {
    try {
      const response = await axios.get(uurrl, { responseType: 'blob' });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      return pdfBlob;
    } catch (error) {
      console.error(error);
    }
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
            PDF: pdfUrl,
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
        // console.log("res>>", res.data.id);
        addNosOffresAirtable(res.data.id);
      })
      .catch((err) => {
        console.log("Err>>", err);
      });
  };

  const handleSubmitButton = () => {
    setIsLoading(true);
    createPDF();
  };

  // Function For Calculating HTVA
  const calculateHTVA = (upData) => {
    const updatedOffers = upData.offers.map((offer) => {
      const offerHTVA =
        parseFloat(offer.molecule) * parseFloat(upData.car) +
        parseFloat(offer.mois) * 12 +
        parseFloat(offer.cta) +
        parseFloat(offer.ticgn) * parseFloat(upData.car);
      return {
        ...offer,
        htva: parseFloat(offerHTVA).toFixed(2),
      };
    });

    setFormData((old) => ({
      ...old,
      offers: updatedOffers,
    }));
  };

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

  const handleDownload = () => {
    const content = pdfRef.current;

    const doc = new jsPDF();
    doc.html(content, {
        callback: function (doc) {
            doc.save('sample.pdf');
        },
        html2canvas: { scale: 0.25 }
    });
};

  return (
    <div>
      <Head>
        <title>Générateur d&rsquo;Offres</title>
        <meta name="description" content="Générateur d'Offres" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id="print-content" ref={pdfRef} className="max-w-7xl mx-auto">
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
            {/* First Section - Comapany & Consultant Information */}
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

            {/* Second Section */}
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
                className="resize-none focus-within:resize-y text-center border-r border-tgbrown-400 py-3"
                name="site"
                id="site"
                maxLength={70}
                cols="35"
                rows="1"
                value={formData.site}
                onChange={handleInputChange}
              ></textarea>
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="number"
                maxLength={8}
                min={1}
                name="pce"
                id="pce"
                value={formData.pce}
                onChange={handleInputChange}
              />
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="number"
                min={1}
                name="tarif"
                id="tarif"
                value={formData.tarif}
                onChange={handleInputChange}
              />
              <input
                className="w-full py-3 text-center border-r border-tgbrown-400"
                type="text"
                maxLength={20}
                name="profil"
                id="profil"
                value={formData.profil}
                onChange={handleInputChange}
              />
              <input
                className="w-full py-3 text-center"
                type="number"
                min={1}
                name="car"
                id="car"
                value={formData.car}
                onChange={handleInputChange}
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
            {formData.offers.map((item, index) => {
              // Check if item is the last for CSS changes
              const isLast = formData.offers.length - 1 === index;
              const oglength = formData.offers.length;
              return (
                <>
                  <div
                    className={`grid grid-cols-7 border text-[11px] font-semibold border-r-tgbrown-400 border-l-tgbrown-400 border-t-tgbrown-400 ${
                      isLast && "rounded-b-md border-b-tgbrown-400"
                    }`}
                  >
                    <div className="text-center border-r border-tgbrown-400">
                      <PartnerDropdown
                        partnerState={partnerState}
                        index={index}
                        item={item}
                      />
                    </div>
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
                    <select
                      id="countries"
                      name="type"
                      defaultValue={"fix"}
                      onChange={(e) => handleOfferInput(e, index)}
                      className="w-full appearance-none text-center border-r border-tgbrown-400"
                    >
                      <option
                        className="text-base"
                        selected={item.type === "fix"}
                        value="fix"
                      >
                        Prix Fixe
                      </option>
                      <option
                        className="text-base"
                        selected={item.type === "var"}
                        value="var"
                      >
                        Prix Variable
                      </option>
                    </select>

                    <input
                      className="w-full text-center border-r border-tgbrown-400"
                      type="number"
                      min={1}
                      name="molecule"
                      id="molecule"
                      value={item.molecule}
                      onChange={(e) => handleOfferInput(e, index)}
                    />
                    <input
                      className="w-full text-center border-r border-tgbrown-400"
                      type="number"
                      min={1}
                      name="mois"
                      id="mois"
                      value={item.mois}
                      onChange={(e) => handleOfferInput(e, index)}
                    />

                    <div className="grid grid-cols-2">
                      <input
                        className="w-full text-center border-r border-tgbrown-400"
                        type="number"
                        min={1}
                        name="cta"
                        id="cta"
                        value={item.cta}
                        onChange={(e) => handleOfferInput(e, index)}
                      />
                      <input
                        className="w-full text-center border-r border-tgbrown-400"
                        type="number"
                        min={1}
                        name="ticgn"
                        id="ticgn"
                        value={item.ticgn}
                        onChange={(e) => handleOfferInput(e, index)}
                      />
                    </div>
                    <div className="flex justify-center items-center relative group">
                      {item.htva}€
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
                </>
              );
            })}

            {/* Footer Portion */}
            <div className="flex justify-between mt-8">
              <div className="text-xs font-bold">
                Date:{" "}
                <input
                  type="date"
                  className="ml-1"
                  value={formData.placedDate.toISOString().substring(0, 10)}
                  onChange={(e) =>
                    setFormData((old) => ({
                      ...old,
                      placedDate: new Date(e.target.value),
                    }))
                  }
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
            disabled={isLoading}
            onClick={handleSubmitButton}
            className="bg-black w-36 mx-auto mb-10 md:w-48 h-14 md:h-20 rounded-b-lg hover:bg-tgbrown-600 hover:-translate-y-1 transition-all duration-300 text-white font-bold text-xl md:text-2xl flex justify-center items-center"
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
              " Générer PDF"
            )}
          </button>
          <button onClick={handleDownload}>Download</button>
        </div>
      </main>
    </div>
  );
}
