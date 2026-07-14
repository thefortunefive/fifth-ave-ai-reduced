import Hero from '@/components/Hero';
import WebDesignMenu from '@/components/sections/WebDesignMenu';
import Proof from '@/components/sections/Proof';
import Process from '@/components/sections/Process';
import About from '@/components/sections/About';
import Industries from '@/components/sections/Industries';
import Consulting from '@/components/sections/Consulting';
import Cta from '@/components/sections/Cta';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <WebDesignMenu />
      <Proof />
      <Process />
      <About />
      <Industries />
      <Consulting />
      <Cta />
      <Footer />
    </main>
  );
}
