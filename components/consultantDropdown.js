import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  

const ConsultantDropdown = (props) => {
    const { selectedConsultant, setSelectedConsultant,Consultant } = props.consultantState;

  return (
    <Listbox value={selectedConsultant} onChange={setSelectedConsultant}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded-md pl-3 text-left focus:outline-none sm:text-sm">
              <div className="flex space-x-2">
                <div className="">
                  <img
                    src={`https://offergen.vercel.app/img/consultant/${selectedConsultant?.image}`}
                    alt="profile"
                    height={90}
                    width={90}
                  />
                </div>
                <div className="flex flex-col space-y-1 text-xs">
                  <div className="font-semibold">Votre Consultant{selectedConsultant.email==="sofia.rhetas@terra-groupe.fr" && "e"}</div>
                  <div>{selectedConsultant.name}</div>
                  <div>{selectedConsultant.email}</div>
                  <div>{selectedConsultant.cid}</div>
                </div>
              </div>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {Consultant.map((person,index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-tgbrown-300" : "text-gray-900",
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
  );
};
export default ConsultantDropdown;
