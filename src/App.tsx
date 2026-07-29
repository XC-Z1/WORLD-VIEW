import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Mountain, Compass, Wind, ThermometerSnowflake, Users, Map, MoreVertical, ExternalLink, TreePine, Waves, CloudRain, Volume2, VolumeX, Search, ArrowDown } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { destinations as defaultDestinations } from './destinations';

const fadeIn = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const Particles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-text-main rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -300 - Math.random() * 150],
            x: [0, Math.random() * 150 - 75],
            opacity: [0, Math.random() * 0.5 + 0.2, 0],
            scale: [0, Math.random() * 2 + 1, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};


export default function App() {
  const [destinations, setDestinations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('custom_destinations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Ignore storage errors
    }
    return defaultDestinations;
  });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
          try {
            localStorage.setItem('custom_destinations', JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch(() => {
        // Fallback gracefully to defaultDestinations or localStorage
      });
  }, []);

  const audioSources: Record<string, string> = {
    mountain: "https://actions.google.com/sounds/v1/weather/strong_wind.ogg",
    forest: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
    beach: "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg"
  };

  useEffect(() => {
    if (audioRef.current && isLoaded) {
      if (!isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, isLoaded, activeIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoaded]);

  const activeDestinations = destinations.length > 0 ? destinations : defaultDestinations;
  const dest = activeDestinations[activeIndex] || activeDestinations[0] || defaultDestinations[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Map': return <Map className="w-6 h-6 text-accent mb-6" />;
      case 'ThermometerSnowflake': return <ThermometerSnowflake className="w-6 h-6 text-accent mb-6" />;
      case 'Wind': return <Wind className="w-6 h-6 text-accent mb-6" />;
      case 'Users': return <Users className="w-6 h-6 text-accent mb-6" />;
      default: return <Map className="w-6 h-6 text-accent mb-6" />;
    }
  };

  return (
    <>
      {/* Viewport Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-text-main/10 pointer-events-none">
        <motion.div
          className="h-full bg-accent origin-left shadow-[0_0_10px_rgba(242,125,38,0.8)]"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <DraggableCompass />
      <AnimatePresence>
        {!isLoaded && <LandingScreen />}
      </AnimatePresence>
      <div className="bg-bg-base text-text-main min-h-screen font-serif selection:bg-accent/30 border-8 border-bg-panel flex flex-col overflow-x-hidden relative">
      
      {/* Fixed Sidebar Navigation */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6 items-end">
        {destinations.map((m, index) => (
          <button 
            key={m.id} 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveIndex(index);
            }}
            className="group relative flex items-center justify-end h-8 w-48 focus:outline-none"
          >
            <span className={`absolute right-12 font-sans text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ${activeIndex === index ? 'opacity-100 text-accent translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-70 group-hover:translate-x-0 group-hover:text-text-main'}`}>
              {m.name}
            </span>
            <div className={`transition-all duration-700 ease-out absolute right-0 ${activeIndex === index ? 'h-[2px] w-12 bg-accent shadow-[0_0_10px_rgba(242,125,38,0.5)]' : 'h-[1px] w-4 bg-text-main/40 group-hover:w-8 group-hover:bg-text-main/80'}`} />
          </button>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-between px-4 pb-6 pt-12 bg-gradient-to-t from-bg-base via-bg-base/90 to-transparent pointer-events-none">
        <div className="flex justify-center gap-3 w-full pointer-events-auto">
          {destinations.map((m, index) => (
            <button 
              key={m.id} 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveIndex(index);
              }}
              className={`transition-all duration-500 ${activeIndex === index ? 'h-[2px] w-8 bg-accent shadow-[0_0_10px_rgba(242,125,38,0.5)]' : 'h-[1px] w-4 bg-text-main/40'}`}
              aria-label={m.name}
            />
          ))}
        </div>
      </div>

      {/* Top Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-8 left-8 right-8 md:top-12 md:left-12 md:right-12 z-50 flex justify-between items-start pointer-events-none"
      >
        <div className="text-xl md:text-2xl font-black tracking-widest uppercase text-text-main drop-shadow-lg mix-blend-difference transition-all">
          <AnimatePresence mode="wait">
            <motion.span 
              key={dest.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              {dest.name}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-4 relative pointer-events-auto">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0, x: 20 }}
                animate={{ opacity: 1, width: 240, x: 0 }}
                exit={{ opacity: 0, width: 0, x: 20 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-panel/80 backdrop-blur-md border border-text-main/20 text-text-main h-12 px-4 outline-none focus:border-accent transition-colors shadow-2xl"
                  autoFocus
                />
                {searchQuery && (
                  <div className="absolute top-full right-0 mt-2 w-64 max-h-64 overflow-y-auto bg-bg-panel/90 backdrop-blur-xl border border-text-main/10 shadow-2xl z-50">
                    {destinations
                      .map((d, idx) => ({ ...d, originalIndex: idx }))
                      .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(d => (
                        <button
                          key={d.id}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setActiveIndex(d.originalIndex);
                            setSearchQuery('');
                            setIsSearchOpen(false);
                          }}
                          className="w-full text-left p-4 hover:bg-bg-base/50 transition-colors border-b border-text-main/5 last:border-0"
                        >
                          <div className="text-sm font-sans tracking-widest text-text-main uppercase font-bold">{d.name}</div>
                          <div className="text-[10px] font-serif text-text-main/60 mt-1">{d.location}</div>
                        </button>
                      ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="w-12 h-12 bg-bg-panel/80 backdrop-blur-md border border-text-main/20 flex items-center justify-center text-text-main shadow-2xl relative" title="Scroll Progress">
            <motion.svg className="absolute w-10 h-10 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-text-main/10" strokeWidth="6" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-accent"
                strokeWidth="6"
                fill="none"
                style={{ pathLength: scrollYProgress }}
                strokeLinecap="round"
              />
            </motion.svg>
            <ArrowDown className="w-4 h-4 text-accent/80" />
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery('');
            }}
            className="w-12 h-12 bg-bg-panel/80 backdrop-blur-md border border-text-main/20 flex items-center justify-center text-text-main hover:text-accent transition-colors shadow-2xl"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 bg-bg-panel/80 backdrop-blur-md border border-text-main/20 flex items-center justify-center text-text-main hover:text-accent transition-colors shadow-2xl"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 bg-bg-panel/80 backdrop-blur-md border border-text-main/20 flex items-center justify-center text-text-main hover:text-accent transition-colors shadow-2xl"
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-4 top-full w-64 bg-bg-panel/90 backdrop-blur-xl border border-text-main/10 shadow-2xl overflow-hidden p-2 z-50"
              >
                <a 
                  href="https://techmster.site/xcz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 group hover:bg-bg-base/50 transition-colors cursor-pointer"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-text-main group-hover:text-accent transition-colors">See Developer</span>
                  <ExternalLink className="w-4 h-4 text-text-main/50 group-hover:text-accent transition-colors" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={dest.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="contents"
        >
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-text-main/10 bg-bg-base">
            <Particles />
            <motion.div 
              style={{ y, opacity: opacityHero }}
              className="absolute inset-0 z-0 opacity-40"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-bg-base/20 via-transparent to-bg-base z-10" />
              {dest.heroImage?.match(/\.(mp4|webm)$/i) ? (
                <motion.video 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                  src={dest.heroImage}
                  autoPlay muted loop playsInline
                  className="w-full h-[120%] -top-[10%] relative object-cover opacity-80"
                />
              ) : (
                <motion.img 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                  src={dest.heroImage} 
                  alt={dest.name} 
                  className="w-full h-[120%] -top-[10%] relative object-cover opacity-80"
                />
              )}
            </motion.div>

            <div className="relative z-20 w-full px-8 md:px-16 max-w-7xl mx-auto flex flex-col justify-end h-full pb-32">
              <motion.div
                style={{ y: textY }}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-accent font-sans font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-4 md:mb-6"
                >
                  {dest.zoneTitle}
                </motion.p>
                <h1 className="text-6xl md:text-[9rem] font-black uppercase leading-[0.85] tracking-tighter mb-4 text-text-main drop-shadow-2xl">
                  {dest.name}<br/>
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 0.8 }} 
                    transition={{ delay: 1, duration: 2 }}
                    className="text-5xl md:text-8xl font-light italic text-text-main/60 inline-block"
                  >
                    {dest.subtitle}
                  </motion.span>
                </h1>
                <div className="max-w-xl mt-12 border-l border-accent pl-8">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1.5 }}
                    className="text-base md:text-xl leading-relaxed text-text-main/80 font-serif drop-shadow-lg"
                  >
                    {dest.desc}
                  </motion.p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-12 right-8 md:right-32 flex items-center gap-4 hidden sm:flex mix-blend-screen"
              >
                <span className="text-xs font-sans uppercase tracking-[0.4em] text-text-main/60 font-bold">Discover</span>
                <motion.div 
                  animate={{ scaleX: [1, 2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-[1px] bg-text-main/40 origin-left" 
                />
              </motion.div>
            </div>
          </section>

          {/* Intro Section */}
          <section className="relative z-20 border-b border-text-main/10 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/12 border-b md:border-b-0 md:border-r border-text-main/10 flex flex-col items-center justify-between py-8 md:py-24 hidden md:flex opacity-60">
                 <span className="text-[10px] font-sans uppercase tracking-[0.4em] [writing-mode:vertical-rl] rotate-180 mb-8 font-bold">{dest.introTitle}</span>
                 <span className="text-[10px] font-sans uppercase tracking-[0.4em] [writing-mode:vertical-rl] rotate-180 mb-8 font-bold">{dest.elevationMeters}</span>
                 <span className="text-[10px] font-sans uppercase tracking-[0.4em] [writing-mode:vertical-rl] rotate-180 font-bold">{dest.location}</span>
            </div>
            <div className="flex-1 p-8 md:p-24 bg-bg-panel relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bg-base/20 to-transparent pointer-events-none" />
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-3xl relative z-10"
              >
                <motion.div variants={fadeIn} animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
                  {dest.type === 'mountain' && <Mountain className="w-12 h-12 mb-8 text-accent drop-shadow-[0_0_15px_rgba(242,125,38,0.5)]" />}
                  {dest.type === 'forest' && <TreePine className="w-12 h-12 mb-8 text-accent drop-shadow-[0_0_15px_rgba(242,125,38,0.5)]" />}
                  {dest.type === 'beach' && <Waves className="w-12 h-12 mb-8 text-accent drop-shadow-[0_0_15px_rgba(242,125,38,0.5)]" />}
                </motion.div>
                <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic drop-shadow-md">{dest.introTitle}</motion.h2>
                <motion.p variants={fadeIn} className="text-lg md:text-xl text-text-main/80 leading-relaxed font-serif">
                  {dest.introText}
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Facts Grid */}
          <section className="border-b border-text-main/10 relative z-20 flex bg-bg-base overflow-hidden">
            <div className="w-full flex flex-wrap lg:flex-nowrap">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full"
              >
                <FactCard 
                  icon={getIcon(dest.facts[0].icon)}
                  title={dest.facts[0].title}
                  value={dest.facts[0].value}
                  desc={dest.facts[0].desc}
                  className="border-r border-b lg:border-b-0 border-text-main/10"
                />
                <LiveWeatherWidget lat={dest.lat} lng={dest.lng} type={dest.type} />
                <FactCard 
                  icon={getIcon(dest.facts[3].icon)}
                  title={dest.facts[3].title}
                  value={dest.facts[3].value}
                  desc={dest.facts[3].desc}
                  className="border-b md:border-b-0 lg:border-b-0 border-text-main/10 bg-bg-panel"
                />
              </motion.div>
            </div>
          </section>

          {/* History/Timeline Section */}
          <section className="relative z-20 overflow-hidden flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-8 md:p-24 border-b lg:border-b-0 lg:border-r border-text-main/10 flex flex-col justify-center bg-bg-panel relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 to-transparent pointer-events-none" />
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="relative z-10"
              >
                <motion.span variants={fadeIn} className="font-sans text-[10px] uppercase tracking-widest text-accent mb-4 font-bold block">{dest.historySub}</motion.span>
                <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase drop-shadow-lg">{dest.historyTitle}</motion.h2>
                <motion.p variants={fadeIn} className="text-lg text-text-main/80 mb-6 font-serif leading-relaxed">
                  {dest.historyText1}
                </motion.p>
                <motion.p variants={fadeIn} className="text-lg text-text-main/80 font-serif leading-relaxed">
                  {dest.historyText2}
                </motion.p>
              </motion.div>
            </div>
            
            <div className="w-full lg:w-1/2 relative bg-bg-base p-8 md:p-12 flex items-center justify-center overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full relative group overflow-hidden"
              >
                 <div className="absolute inset-0 bg-accent/10 mix-blend-overlay z-10 border border-text-main/10 transition-opacity duration-700 group-hover:opacity-50"></div>
                 <ParallaxHistoryImage src={dest.historyImage} alt={dest.historyTitle} />
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5, duration: 1 }}
                   className="absolute bottom-4 right-4 bg-bg-panel/80 backdrop-blur-md p-6 border border-text-main/10 z-20 flex flex-col"
                 >
                   <span className="font-sans text-[10px] uppercase tracking-widest text-text-main block mb-2 font-bold opacity-60">{dest.historyCalloutLabel}</span>
                   <span className="font-serif italic text-accent font-bold text-xl drop-shadow-md">{dest.historyCalloutValue}</span>
                 </motion.div>
              </motion.div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="p-8 md:p-12 bg-accent text-bg-base flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-20 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-center gap-6 mb-8 sm:mb-0 relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Compass className="w-10 h-10" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] font-sans block mb-1 opacity-80">Current Expedition Status</span>
            <span className="text-3xl font-black italic tracking-tighter uppercase leading-none drop-shadow-md">Active Season</span>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 relative z-10"
        >
          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-3 h-3 bg-bg-base shadow-[0_0_10px_rgba(255,255,255,0.8)]"></motion.div>
          <div className="w-3 h-3 border border-bg-base/30"></div>
          <div className="w-3 h-3 border border-bg-base/30"></div>
        </motion.div>
      </footer>
      
      {/* Background Audio */}
      <audio ref={audioRef} src={audioSources[dest.type]} loop />
    </div>
    </>
  );
}

function LandingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-base text-text-main"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-text-main rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Compass className="w-16 h-16 mb-8 text-accent drop-shadow-[0_0_15px_rgba(242,125,38,0.5)]" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl md:text-3xl tracking-[0.5em] uppercase font-bold text-center px-4"
        >
          Earth's Wonders
        </motion.h1>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
          className="w-full max-w-[200px] h-px bg-accent mt-6 origin-center"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-6 text-sm tracking-widest text-text-main/60 uppercase"
        >
          Discover The Extraordinary
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function FactCard({ icon, title, value, desc, tooltip, className = "" }: { icon: React.ReactNode, title: string, value: string, desc: string, tooltip?: string, className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const displayTooltip = tooltip || `Did you know? The ${title.toLowerCase()} is ${value}.`;

  return (
    <motion.div 
      variants={fadeIn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-10 flex flex-col justify-center relative group hover:bg-bg-panel transition-colors duration-500 ${className}`}
    >
      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        {icon}
      </motion.div>
      <h3 className="font-sans text-[10px] uppercase tracking-widest text-accent mb-2 font-bold relative z-10 drop-shadow-sm">{title}</h3>
      <div className="text-4xl md:text-5xl font-black text-text-main mb-4 tracking-tighter relative z-10 drop-shadow-md">{value}</div>
      <p className="text-sm font-sans uppercase tracking-widest opacity-60 leading-relaxed font-bold relative z-10">{desc}</p>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-4 bg-bg-panel/95 backdrop-blur-xl border border-text-main/10 shadow-2xl z-[100] text-center pointer-events-none"
          >
            <div className="text-[10px] font-sans tracking-widest uppercase text-text-main/80 font-bold leading-relaxed">{displayTooltip}</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-bg-panel/95 border-b border-r border-text-main/10 rotate-45 backdrop-blur-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ParallaxHistoryImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  
  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden">
      {src?.match(/\.(mp4|webm)$/i) ? (
        <motion.video 
          style={{ y }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          src={src} 
          autoPlay muted loop playsInline
          className="w-full h-[140%] -mt-[20%] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
        />
      ) : (
        <motion.img 
          style={{ y }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          src={src} 
          alt={alt}
          className="w-full h-[140%] -mt-[20%] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
        />
      )}
    </div>
  );
}

function LiveWeatherWidget({ lat, lng, type }: { lat: number; lng: number, type: string }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,precipitation`);
        if (!res.ok) return;
        const data = await res.json();
        setWeather(data.current);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      }
    }
    fetchWeather();
  }, [lat, lng]);

  return (
    <>
      <FactCard 
        icon={<ThermometerSnowflake className="w-6 h-6 text-accent mb-6" />}
        title="Live Temp"
        value={weather ? `${Math.round(weather.temperature_2m)}°C` : '...'}
        desc={weather ? `Precipitation: ${weather.precipitation}mm` : 'Fetching realtime...'}
        tooltip={weather ? `Real-time temperature and precipitation from Open-Meteo.` : 'Fetching current weather data...'}
        className="border-r border-b lg:border-b-0 border-text-main/10 bg-bg-panel"
      />
      <FactCard 
        icon={<Wind className="w-6 h-6 text-accent mb-6" />}
        title="Live Wind"
        value={weather ? `${Math.round(weather.wind_speed_10m)} km/h` : '...'}
        desc="Current Wind Speed"
        tooltip={weather ? `Real-time wind speed currently at ${weather.wind_speed_10m} km/h.` : 'Fetching current wind data...'}
        className="border-r border-b md:border-b-0 lg:border-b-0 border-text-main/10"
      />
    </>
  );
}

function DraggableCompass() {
  const [rotation, setRotation] = useState(0);
  const compassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!compassRef.current) return;
      const rect = compassRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setRotation(angle * (180 / Math.PI) + 90);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={compassRef}
      drag
      dragMomentum={false}
      className="fixed z-[60] cursor-grab active:cursor-grabbing w-16 h-16 bg-bg-panel/90 backdrop-blur-md border border-text-main/20 rounded-full flex items-center justify-center shadow-2xl"
      style={{ left: 32, bottom: 32 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Compass className="w-8 h-8 text-accent drop-shadow-[0_0_8px_rgba(242,125,38,0.5)]" />
      </motion.div>
    </motion.div>
  );
}

