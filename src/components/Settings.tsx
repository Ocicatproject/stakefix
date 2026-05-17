"use client";

import { FC, MouseEvent } from "react";
import { useState } from "react";

interface SettingsProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Settings: FC<SettingsProps> = ({ isOpen, closeModal }) => {
  const [showPriorityLevel, setShowPriorityLevel] = useState<boolean>(true);

  const handleExactFeeClick = () => {
    setShowPriorityLevel(false);
  };

  const handleMaxCapClick = () => {
    setShowPriorityLevel(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center backdrop-blur-xl z-50"
      onClick={closeModal}
    >
      <div
        className="bg-[#222B33] text-white p-6 rounded-xl shadow-lg w-[340px] max-h-[90vh] overflow-y-auto"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Global Priority Fee</h2>
        <p className="text-sm text-white/80 mt-2">
          These fees apply across OCICAT entire product suite, such as Swap,
          Perps, DCA, Limit Order
        </p>

        {showPriorityLevel && (
          <div className="mt-4">
            <p className="font-bold text-md">Priority Level</p>
            <div className="mt-3 flex">
              <button
                className="text-xs font-semibold px-3 py-2 bg-[#19232D] text-white hover:bg-red-100"
                onClick={handleExactFeeClick}
              >
                Fast
              </button>
              <button
                className="text-xs font-semibold px-3 py-2 bg-[#19232D] text-white hover:bg-red-100"
                onClick={handleMaxCapClick}
              >
                Turbo
              </button>
              <button className="text-xs font-semibold px-3 py-2 bg-[#19232D] text-white hover:bg-red-100">
                Ultra
              </button>
            </div>
            <hr className="my-4 border-jupiter-input-light" />
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="font-bold text-md">Priority Mode</p>
          <div className="flex items-center">
            <button
              className="w-[75px] h-7 lg:w-20 flex items-center justify-center font-semibold text-white/80 bg-[#19232D] rounded-lg hover:bg-red-100"
              onClick={handleMaxCapClick}
            >
              Max
            </button>
            <button
              className="w-[75px] h-7 lg:w-20 flex items-center justify-center font-semibold text-white/80 bg-[#19232D] rounded-lg hover:bg-red-100"
              onClick={handleExactFeeClick}
            >
              Exact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
