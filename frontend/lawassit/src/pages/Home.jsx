import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Categories from "../components/home/Categories";
import Footer from "../components/home/Footer";

import useScrollReveal from "../hooks/useScrollReveal";

function Home() {
    useScrollReveal();
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Categories />
      <Footer />
    </>
  );
}

export default Home;