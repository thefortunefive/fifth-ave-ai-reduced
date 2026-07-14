import Hero from '@/components/Hero';
import WebDesignMenu from '@/components/sections/WebDesignMenu';
import Proof from '@/components/sections/Proof';
import Process from '@/components/sections/Process';
import About from '@/components/sections/About';
import Industries from '@/components/sections/Industries';
import Cta from '@/components/sections/Cta';

export default function Home() {
  return (
    <main>
      <Hero />
      <WebDesignMenu />
      <Proof />
      <Process />
      <About />
      <Industries />
      <Cta />
      <footer className="border-t border-white/5 bg-dark px-6 py-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          © {new Date().getFullYear()} Fifth Ave AI
        </p>
      </footer>
    </main>
  );
}
