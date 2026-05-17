"use client";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqExpanded, setFaqExpanded] = useState(false); // 🚀 toggle container

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleContainer = () => {
    setFaqExpanded(!faqExpanded);
  };

  const faqData: FAQItem[] = [
    {
      question: "What is Dao Staking?",
      answer:
        "Dao Staking is a program that rewards Ocicat stakers with DAO POWER. Your strength in the ecosystem is dependent on your DAO POWER",
    },
    {
      question: "How does the DAO reward voters?",
      answer:
        "The DAO rewards voters who are on the winning side of the proposal. The weight of winning lies on each total DAO POWER.",
    },
    {
      question: "How do I claim my rewards?",
      answer:
        "To claim your rewards, connect your wallet to app and navigate to the reward section. Follow the prompt to claim your tokens. Your reward is based on your stake.",
    },

    {
      question: "What benefit is included in my stake?",
      answer:
        "You receive reward from daily emissions and reward for DAO participation. The more points the more advantage. Your points qualify you for future airdrops from partner projects and the ecosystem.",
    },
    {
      question: "Can I stake multiple tokens?",
      answer:
        "Yes, you can stake multiple times. However, the rewards must be claimed before you stake again to avoid reward reset to zero. Secondly, staking more increases your DAO POWER.",
    },
    {
      question: "What happens if I unstake my tokens?",
      answer:
        "If you unstake your tokens, you will stop earning rewards and lose your points collected. Your voting power will reset to zero.",
    },
    {
      question: "Is there a penalty for UNSTAKING and EMERGENCY WITHDRAW?",
      answer:
        "UNSTAKING has a cool-down period of 14 days. After the period you can withdraw without penalty, but all your points are lost. EMERGENCY WITHDRAW has a 30% penalty and is instant. Note: There is a reflection on the token.",
    },
  ];

  return (
    <section className="py-16 bg-black px-4 lg:px-20">
      {/*  Wrapper with animated height */}
      <div
        className={`max-w-4xl px-2 sm:px-4 mx-auto border border-gray-600 rounded-2xl overflow-hidden transition-class ${
          faqExpanded ? "max-h-[2000px] py-6" : "max-h-16 py-4"
        }`}
      >
        {/*  Title with toggle icon */}
        <div
          className="flex justify-center gap-2 items-center px-4 cursor-pointer"
          onClick={toggleContainer}
        >
          <h2 className="sm:text-3xl text-2xl md:text-4xl font-bold text-white">
            FAQs
          </h2>
          <span
            className={` transition-transform duration-300 ${
              faqExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            <FaChevronDown className="w-6 h-6" />
          </span>
        </div>

        {/*  FAQ list */}
        <div className={`space-y-4 mt-8 px-2 ${!faqExpanded && "hidden"}`}>
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-[#0c0c0c] border border-gray-800 rounded-lg hover:border-red-600 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <p className="sm:text-lg text-base font-semibold text-white">
                  {faq.question}
                </p>
                <span className="text-red-600">
                  {activeIndex === index ? (
                    <FaMinus className="w-6 h-6" />
                  ) : (
                    <FaPlus className="w-6 h-6" />
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "max-h-44" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-white/70">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
