"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  thumbnail: string;
  fullImage?: string;
};

export default function ImageModal({ thumbnail, fullImage }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <span
        className="relative flex justify-center items-center w-56 h-56 cursor-pointer"
        onClick={handleOpen}
      >
        <Image
          alt="Thumbnail"
          src={thumbnail}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          className="rounded-lg"
        />
      </span>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center px-4 py-8"
          onClick={handleClose}
        >
          <div className="relative w-full max-w-3xl h-[60vh] sm:h-[70vh]">
            <Image
              alt="Full image"
              src={fullImage || thumbnail}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
