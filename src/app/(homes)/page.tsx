"use client";
import BgGlassmorphism from "@/components/BgGlassmorphism/BgGlassmorphism";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import SectionLargeSlider from "./SectionLargeSlider";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionHero2 from "@/components/SectionHero/SectionHero2";
import SectionSliderCollections2 from "@/components/SectionSliderCollections2";

function PageHome() {
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <BgGlassmorphism />

      <div className="container relative mt-5 mb-20 sm:mb-24 lg:mt-20 lg:mb-32">
        <SectionHero2 />

        <SectionHowItWork className="mt-24 lg:mt-40 xl:mt-48" />
      </div>

      <div className="bg-neutral-100/70 dark:bg-black/20 py-20 lg:py-32">
        <div className="container">
          <SectionLargeSlider />
        </div>
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections2 cardStyle="style1" />
        </div>
      </div>
    </div>
  );
}

export default PageHome;
