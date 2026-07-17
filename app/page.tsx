import Hero from '@/components/Hero';
import WebDesignMenu from '@/components/sections/WebDesignMenu';
import TwoServices from '@/components/sections/TwoServices';
import Process from '@/components/sections/Process';
import Cta from '@/components/sections/Cta';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <WebDesignMenu />
      <TwoServices />
      <Process />
      <Cta />
      <Footer />
    </main>
  );
}
