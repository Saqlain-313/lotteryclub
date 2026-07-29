import React from "react";
import Herosection from "../components/Herosection";
import StatsSection from "../components/StatsSection";
import PopularGames from "../components/PopularGames";
import FeatureBar from "../components/FeatureBar";
import TopWinners from "../components/TopWinners";
import StatsSection2 from "../components/StatsSection2";
import CountriesSection from "../components/CountriesSection";
import Footer from "../Pages/Footer";

const Homme = () => {
  return (
    <main className="pb-24 md:pb-0">
      <Herosection />
      <StatsSection />
      <PopularGames />
      <FeatureBar />
      <TopWinners />
      <StatsSection2/>
      <CountriesSection/>
      <Footer/>
    </main>
  );
};

export default Homme;