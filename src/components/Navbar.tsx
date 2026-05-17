"use client";
import Link from "next/link";
import Image from "next/image";
// import { CustomBotton } from "./CustomButton";
import ConnectButton from "@/context/connectbutton";
const Navbar = () => {
  return (
    <div className="w-full flex justify-center px-4 py-3 bg-[#0D0D0D]">
      <div className="xl:max-w-6xl gap-3 w-full flex justify-between items-center">
        <Link
          href="https://www.ocicat.club/"
          className="flex items-center gap-1 relative sm:gap-2"
        >
          <div className="flex items-center justify-center h-8 w-8 sm:h-12 sm:w-12 relative">
            <Image
              alt="logo"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              src="/ocicat logo 2.png"
            />
          </div>
          <div className="sm:text-2xl text-lg font-semibold text-white">
            Ocicat
          </div>
        </Link>
        <div className="flex gap-3 sm:gap-4 font-extrabold justify-between items-center text-white w-fit dark h-14 sm:h-20">
          <Link
            href={"https://x.com/ocicattoken"}
            className="flex items-center gradient-gray dark"
          >
            <span className="hidden sm:inline-block">{" X (Twitter)"}</span>
            <span className="relative h-7 w-7 sm:hidden flex justify-center items-center">
              <Image
                alt=" "
                src="/X.png"
                objectFit="contain"
                layout="fill"
                objectPosition="center"
                quality={100}
              ></Image>
            </span>
          </Link>
          <Link
            href={"https://t.me/ocicatcoin"}
            className="flex flex-row items-center gradient-blue  dark"
          >
            <span className="hidden sm:inline-block">Telegram</span>
            <span className="relative h-7 w-7 sm:hidden flex justify-center items-center">
              <Image
                alt=" "
                src="/Telegram.png"
                objectFit="contain"
                layout="fill"
                objectPosition="center"
                quality={100}
              ></Image>
            </span>
          </Link>
          <div className="flex justify-center items-center font-normal border-2 rounded-full h-9 sm:h-10 font-ClashDisplay bg-[#FF2727] relative overflow-hidden connect">
            <div className="w-auto bg-[#FF2727]">
              {/* <CustomBotton  /> */}
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
