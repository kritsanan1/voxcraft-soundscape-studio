import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import VoiceStudio from "@/components/VoiceStudio";
import VoiceHarmonization from "@/components/VoiceHarmonization";
import AudioSceneBuilder from "@/components/AudioSceneBuilder";
import SmartContentGenerator from "@/components/SmartContentGenerator";
import SpatialAudio from "@/components/SpatialAudio";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <VoiceStudio />
      <VoiceHarmonization />
      <AudioSceneBuilder />
      <SmartContentGenerator />
      <SpatialAudio />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
