"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="bg-[#111111] py-2 px-5 mt-4 rounded-lg cursor-pointer transition-class hover:opacity-80"
    >Back</button>
  );
}