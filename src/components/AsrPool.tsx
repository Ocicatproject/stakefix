import React from "react";
import Logo from "../../public/v1.png";
import Logo_1 from "../../public/ocicat1.png";
import Image from "next/image";
import { FaGift, FaPlus } from "react-icons/fa6";

const AsrPool = () => {
  return (
    <section className="py-12 w-full flex flex-col lg:flex-row gap-16 bg-black px-4 lg:px-20">
      <div className="flex-1 flex flex-col space-y-12">
        <div className="flex flex-col space-y-5">
          <h2 className="text-4xl font-bold text-white">
            What is in ASR Pool?
          </h2>
          <p className="text-lg font-normal text-white/70">
            These are the tokens distributed for this ASR period. 0.75% of
            projects launched on the LFG Launchpad + 50M OCICAT from the OCICAT
            usage of the LFG Launchpad.
            <br />
            <br />
            When claiming your OCICAT, it will be added to your stake. The rest of
            the tokens are distributed spot.
          </p>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-4">
          {[
            { name: "Staked OCICAT", amount: "50M", image: "/v1.png" },
            { name: "CLOUD", amount: "7.5M", image: "/ocicat1.png" },
          ].map((token, index) => (
            <div
              key={index}
              className="w-[180px] md:w-[200px] flex flex-col items-center space-y-5 p-6 bg-[#0c0c0c] border border-gray-800 rounded-2xl hover:border-red-600 transition-all duration-300"
            >
              <Image
                src={token.image}
                alt={token.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div className="flex flex-col items-center">
                <p className="text-center text-sm lg:text-base font-semibold text-white">
                  {token.name}
                </p>
                <p className="text-center text-xl font-bold text-white">
                  {token.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-8">
        <div className="flex flex-col justify-center items-center p-8 bg-[#0c0c0c] rounded-2xl border border-gray-800 hover:border-red-600 transition-all duration-300">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-fit h-fit bg-red-600 p-6 rounded-full">
              <FaGift className="text-white text-3xl" />
            </div>
            <div className="max-w-[352px] flex flex-col items-center space-y-2">
              <h3 className="text-xl font-semibold text-white text-center">
                Check Your Rewards
              </h3>
              <p className="text-sm font-normal text-white/70 text-center">
                Connect your wallet to check your eligibility for rewards and
                claim them.
              </p>
            </div>
          </div>
          <button className="mt-6 flex justify-center items-center space-x-2 px-6 py-3 bg-red-600 rounded-lg text-base font-semibold text-white hover:bg-red-700 transition-all duration-300">
            <FaPlus className="text-white text-xl" />
            <p>Connect Wallet</p>
          </button>
        </div>

        <div className="flex flex-col space-y-6 p-6 bg-[#0c0c0c] rounded-2xl border border-gray-800 hover:border-red-600 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white">
            ASR Recap & Explainer
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {[
              {
                title: "Meow: Juply & ASR",
                thumbnail:
                  "https://img.youtube.com/vi/joywhnFpFfM/hqdefault.jpg",
              },
              {
                title: "Soju: ASR & You",
                thumbnail:
                  "https://img.youtube.com/vi/fRH9ItVfA4Y/hqdefault.jpg",
              },
            ].map((video, index) => (
              <button
                key={index}
                className="w-full md:w-[206px] flex flex-col space-y-3"
              >
                <div className="w-full h-[130px] rounded-lg border border-gray-800 overflow-hidden relative hover:border-red-600 transition-all duration-300">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={206}
                    height={130}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium text-white text-center">
                  {video.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AsrPool;
