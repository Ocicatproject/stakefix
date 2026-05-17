import Connect from "@/components/Connect";
import Voting from "@/components/Voting";
import FAQSection from "@/components/FAQSection";
import Proposals from "@/components/Proposals";

export default function Home() {
  return (
    <>
      <Connect />
      <div className="bg-black text-white pt-20 px-4">
        <Voting />
      </div>
      <div className="pl-4 sm:px-8 md:px-16 my-6 sm:my-8 bg-black">
        <Proposals />
      </div>
      <div className="bg-[#0c0c0c]">
        <FAQSection />
      </div>
    </>
  );
}
