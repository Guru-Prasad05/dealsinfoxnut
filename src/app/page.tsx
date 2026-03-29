import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrandStory from "./components/BrandStory";
import Products from "./components/Products";
import HealthBenefits from "./components/HealthBenefits";
import CorporateGifting from "./components/CorporateGifting";
import Recipes from "./components/Recipes";
import Testimonials from "./components/Testimonials";
import EnquiryForm from "./components/EnquiryForm";
import Footer from "./components/Footer";
import ScrollProvider from "./components/ScrollProvider";
import ScrollPhysicsFoxnutsWrapper from "./components/ScrollPhysicsFoxnutsWrapper";

export default function Home() {
  return (
    <ScrollProvider>
      <Navbar />
      <main>
        <Hero />
        <BrandStory />
        {/* BrandStory (primary-green #1E3A34) → Products (cream #F5F3EA) */}
        <ScrollPhysicsFoxnutsWrapper fromColor="#1E3A34" toColor="#F5F3EA" />
        <Products />
        {/* Products (cream #F5F3EA) → HealthBenefits (off-white #FAFAF5) */}
        <ScrollPhysicsFoxnutsWrapper fromColor="#F5F3EA" toColor="#FAFAF5" />
        <HealthBenefits />
        <CorporateGifting />
        <Recipes />
        <Testimonials />
        <EnquiryForm />
      </main>
      <Footer />
    </ScrollProvider>
  );
}
