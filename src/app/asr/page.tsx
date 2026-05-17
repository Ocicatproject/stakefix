import AsrHero from '@/components/AsrHero';
import AsrPool from '@/components/AsrPool';
import FAQSection from '@/components/FAQSection';
import React from 'react'

const page = () => {
  return (
    <>
      <div>
        <AsrHero />      
        <AsrPool />
        <FAQSection/>
      </div>
    </>
  );
}

export default page