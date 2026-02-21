import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Categories from "./components/Categories";
import Footer from "./components/Footer";

import useScrollReveal from "./hooks/useScrollReveal";

function App() {
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

export default App;