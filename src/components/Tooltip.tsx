import React, { useState, FC } from "react";

const Tooltip: FC = () => {
  // State to store the selected priority level
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  // Function to handle priority button clicks
  const handlePriorityClick = (priority: string) => {
    setSelectedPriority(priority);
  };

  return (
    <>
      <div
        id="tooltip"
        data-popper-reference-hidden="false"
        data-popper-escaped="false"
        data-popper-placement="left"
        className="fixed z-50 top-10 right-10 rounded-lg w-auto bg-none transform translate-x-0 translate-y-0 shadow-xl dark:bg-black backdrop-blur-xl !-ml-4 !bg-transparent mt-3"
      >
        <div className="px-5 w-[340px] max-h-[90vh] overflow-y-auto lg:w-[420px] pt-6 pb-3 bg-black shadow-header-settings rounded-xl border border-red-600">
          <span className="text-xl font-semibold text-white dark:text-white">
            Global Priority Fee
          </span>
          <p className="text-xs text-white mt-2">
            These fees apply across Jupiter’s entire product suite, such as
            Swap, Perps, DCA, Limit Order
          </p>

          {/* Priority Level Section */}
          <div className="transition-height duration-300 ease-in-out animate-fade-in h-auto opacity-100 overflow-visible">
            <p className="mt-4 font-semibold text-sm text-white">
              Priority Level
            </p>
            <div className="w-full flex mt-3 rounded-lg overflow-hidden">
              <button
                type="button"
                className={`!h-[42px] ${
                  selectedPriority === "Fast" ? "!bg-black" : "bg-black"
                } flex flex-row items-center justify-center text-xs font-semibold space-x-2 fill-current border border-red-600 rounded-l-lg flex-1`}
                onClick={() => handlePriorityClick("Fast")}
              >
                <span
                  className={`font-semibold whitespace-nowrap ${
                    selectedPriority === "Fast" ? "text-white" : "text-red-400"
                  }`}
                >
                  Fast
                </span>
              </button>
              <button
                type="button"
                className={`!h-[42px] ${
                  selectedPriority === "Turbo" ? "text-white" : "text-red-400"
                } flex flex-row items-center justify-center text-xs font-semibold space-x-2 fill-current border flex-1 border-red-600 border-r-red-600`}
                onClick={() => handlePriorityClick("Turbo")}
              >
                <span
                  className={`font-semibold whitespace-nowrap ${
                    selectedPriority === "Turbo" ? "text-white" : ""
                  }`}
                >
                  Turbo
                </span>
              </button>
              <button
                type="button"
                className={`!h-[42px] ${
                  selectedPriority === "Ultra" ? "text-white" : "text-red-400"
                } flex flex-row items-center justify-center text-xs font-semibold space-x-2 fill-current border border-red-600 rounded-r-lg flex-1`}
                onClick={() => handlePriorityClick("Ultra")}
              >
                <span
                  className={`font-semibold whitespace-nowrap ${
                    selectedPriority === "Ultra" ? "text-white" : ""
                  }`}
                >
                  Ultra
                </span>
              </button>
            </div>
          </div>

          {/* Exact Fee Section */}
          <div className="text-xs mt-5">
            <div className="mt-5 flex justify-between items-center">
              <p className="font-semibold text-sm text-white">Priority Mode</p>
              <div className="flex items-center rounded-lg bg-black h-10 p-1">
                <button
                  type="button"
                  className="w-[75px] h-7 lg:h-full lg:w-20 flex flex-row items-center justify-center font-semibold space-x-2 text-white fill-current border border-red-600 rounded-lg px-0.5 py-0.5"
                >
                  <span className="!text-xxs md:!text-xs text-white font-semibold whitespace-nowrap">
                    Max Cap
                  </span>
                </button>
                <button
                  type="button"
                  className="w-[75px] h-7 lg:h-full lg:w-20 flex flex-row items-center justify-center font-semibold space-x-2 text-white fill-current border border-transparent rounded-lg px-0.5 py-0.5 !border-red-600 !bg-black"
                >
                  <span className="!text-xxs md:!text-xs font-semibold whitespace-nowrap text-white">
                    Exact Fee
                  </span>
                </button>
              </div>
            </div>
            <div className="text-xs text-white mt-2">
              OCICAT will use the exact fee you set.
            </div>
          </div>

          {/* Exact Fee Input */}
          <div className="flex justify-between mt-4">
            <p className="font-semibold text-white text-sm">Exact Fee</p>
            <span className="text-xxs mt-1 text-white self-end">~$0.0252</span>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="w-full border rounded-lg focus-within:border-v2-primary bg-black p-2 border-red-600 text-white">
              <input
                type="text"
                inputMode="decimal"
                maxLength={12}
                placeholder="Enter custom value"
                className="outline-none text-left w-full py-2 px-3 text-xs placeholder:text-white rounded-lg bg-black"
              />
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-xl mt-2 bg-red-600 flex items-center justify-center px-3 py-2 text-[10px] font-semibold text-white">
            <svg
              width="16"
              height="16"
              fill="none"
              className="shrink-0 w-4 h-4 md:w-6 md:h-6 mr-2"
            >
              <path
                d="M8 6v2.667M8 11.333h.007M7.077 2.595L1.594 12.066c-.304.526-.456.789-.433 1.005.02.188.119.359.272.47.175.127.478.127 1.085.127h10.967c.607 0 .91 0 1.086-.127.152-.111.25-.282.27-.47.023-.216-.129-.479-.433-1.005L8.923 2.595C8.62 2.071 8.468 1.81 8.27 1.722 8.098 1.645 7.902 1.645 7.73 1.722 7.532 1.81 7.38 2.071 7.077 2.595z"
                stroke="#5D3500"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Your current maximum fee is below the market rate. Please raise it
            to ensure your transactions are processed.
          </div>

          {/* Close Button */}
          <button
            type="button"
            className="h-full p-3 w-full rounded-xl text-white bg-black hover:bg-gradient-to-r from-red-600 to-red-400 mt-4 border border-red-600"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Priority Button */}
      <div className="mt-5">
        <button className="bg-black text-white rounded-lg px-4 py-2">
          {selectedPriority}
        </button>
      </div>
    </>
  );
};

export default Tooltip;
