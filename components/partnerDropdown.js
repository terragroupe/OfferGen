import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  

const ConsultantDropdown = (props) => {
    const { selectedPartner, setSelectedPartner,Partner } = props.partnerState;

  return (
    <Listbox value={selectedPartner} onChange={setSelectedPartner}>
                  {({ open }) => (
                    <>
                      <div className="relative">
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
  );
};
export default ConsultantDropdown;
