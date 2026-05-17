import React from 'react';

const AsrHero = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black bg-cover bg-no-repeat w-full overflow-hidden transition-all relative py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute -bottom-36 md:-bottom-[55%] left-1/2 transform -translate-x-1/2 w-[320px] sm:w-[500px] md:w-[840px] lg:w-[950px] h-full">
          <div
            className="bg-[url('/cat_bg.png')] bg-top bg-contain bg-no-repeat w-full h-full opacity-90"
            aria-hidden="true"
          ></div>
        </div>

        <div className="relative text-center mt-9 md:mt-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mx-auto text-white">
            Active Staking Rewards (ASR)
          </h1>
          <p className="mt-5 max-w-[320px] sm:max-w-[420px] md:max-w-[547px] mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-400">
            Active Staking Rewards is an innovative way to reward active
            participants with OCICAT, allowing them to accrue more voting power
            over time, in the simplest way possible
          </p>
          <a
            className="mt-6 inline-flex items-center justify-center mb-20 px-6 py-3 border border-red-300 rounded-lg bg-red-100 text-red-700 hover:bg-red-600 hover:border-red-600 hover:text-white active:bg-red-700 active:border-red-700 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.jupresear.ch/t/asr-active-staking-rewards-notes/12032"
          >
            <p className="text-sm sm:text-base font-semibold whitespace-nowrap">
              Read more
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AsrHero;
