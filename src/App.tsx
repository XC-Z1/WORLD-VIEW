import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { Mountain, Compass, Wind, ThermometerSnowflake, Users, Map, MoreVertical, ExternalLink, TreePine, Waves, CloudRain, Volume2, VolumeX, Search, ArrowDown, ArrowUp, ArrowRight, Images, X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ShieldAlert, CheckSquare, Square, Layers, Navigation, Radio, Sparkles, Sliders, CheckCircle2, Circle, Shield, Flame, Calculator, Calendar, DollarSign, CloudSun, Send, Check, BarChart3, Scale, RefreshCw, Info, Clock, AlertTriangle, Star, MessageSquare, PhoneCall, Play, Pause, Headphones, TrendingUp, AlertCircle, Award, ThumbsUp, Plus, SlidersHorizontal, Printer, FileText, Backpack, Crosshair, Target, Download, HelpCircle, HeartPulse, FileCheck, Eye, Camera, Activity as ActivityIcon, Globe, Radar, BookOpen, LifeBuoy, CreditCard, PieChart, Sun, Moon, Sunrise, Sunset, Dumbbell, Mic, Utensils, Maximize, CloudLightning, Leaf, Video, UserCheck, BadgeCheck, FileDown, Share2, Siren, Apple, Languages, Share, Trash2, Edit3, Save, Database, Upload, Settings, Terminal } from 'lucide-react';
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
  const [heroMousePos, setHeroMousePos] = useState({ x: 50, y: 50 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHeroMousePos({ x, y });
  };

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
    const timer = setTimeout(() => setIsLoaded(true), 4500);
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
        {!isLoaded && <LandingScreen onEnter={() => setIsLoaded(true)} />}
      </AnimatePresence>
      <div className="bg-bg-base text-text-main min-h-screen font-serif selection:bg-accent/30 border-8 border-bg-panel flex flex-col overflow-x-hidden relative">
      
      {/* Global Admin Live Broadcast Emergency Banner */}
      {localStorage.getItem('global_admin_broadcast_active') === 'true' && (
        <div className="bg-red-600 text-white font-mono text-xs px-4 py-2.5 flex items-center justify-between z-[90] shrink-0 border-b border-red-400/30 animate-pulse">
          <div className="flex items-center gap-3 max-w-6xl mx-auto w-full">
            <Siren className="w-4 h-4 shrink-0 animate-bounce" />
            <span className="font-bold tracking-tight uppercase">
              [SYSTEM ALERT] {localStorage.getItem('global_admin_broadcast') || 'SEVERE BLIZZARD WARNING IN HIGH-ALTITUDE SECTOR'}
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('global_admin_broadcast_active', 'false');
              window.location.reload();
            }}
            className="p-1 hover:bg-white/20 rounded text-white cursor-pointer"
            title="Acknowledge Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
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
                <button 
                  onClick={() => {
                    setIsAdminOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-4 group hover:bg-bg-base/50 transition-colors cursor-pointer text-left border-b border-text-main/10"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-accent transition-colors">⚙️ Admin Command Panel</span>
                  <Settings className="w-4 h-4 text-accent" />
                </button>

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
          <section 
            onMouseMove={handleHeroMouseMove}
            className="relative h-screen flex items-center justify-center overflow-hidden border-b border-text-main/10 bg-bg-base"
          >
            <Particles />

            {/* Mouse Spotlight Glow */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
              style={{
                background: `radial-gradient(700px circle at ${heroMousePos.x}% ${heroMousePos.y}%, rgba(242, 125, 38, 0.14), transparent 75%)`
              }}
            />

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

            <div className="relative z-20 w-full px-8 md:px-16 max-w-7xl mx-auto flex flex-col justify-end h-full pb-24 md:pb-32">
              <motion.div
                style={{ y: textY }}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Floating Telemetry Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="inline-flex items-center gap-3 px-4 py-2 mb-6 bg-bg-panel/70 backdrop-blur-md border border-accent/30 rounded-full shadow-[0_0_20px_rgba(242,125,38,0.2)]"
                >
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="text-accent font-sans font-bold text-[11px] uppercase tracking-[0.25em]">
                    {dest.zoneTitle} • {dest.elevationMeters}
                  </span>
                </motion.div>

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
                <div className="max-w-xl mt-8 md:mt-12 border-l-2 border-accent pl-6 md:pl-8">
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
                transition={{ delay: 1.8, duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-12 right-8 md:right-16 flex items-center gap-4 hidden sm:flex mix-blend-screen"
              >
                <div className="flex flex-col items-end text-right font-sans text-[10px] tracking-[0.3em] uppercase text-text-main/60">
                  <span className="font-bold text-accent">EXPLORE ARCHIVE</span>
                  <span>{dest.location}</span>
                </div>
                <motion.div 
                  animate={{ scaleX: [1, 1.8, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-[2px] bg-accent origin-left shadow-[0_0_8px_rgba(242,125,38,0.8)]" 
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

          {/* Atmospheric Telemetry & Climate Simulator */}
          <ScrollRevealSection><LiveAtmosphericTelemetry destination={dest} /></ScrollRevealSection>

          {/* Interactive Synthesized Soundscape Player */}
          <ScrollRevealSection><SynthesizedAudioSoundscape destination={dest} /></ScrollRevealSection>

          {/* GPS Coordinates Grid & Topo Converter */}
          <ScrollRevealSection><GpsCoordinatesGrid destination={dest} /></ScrollRevealSection>

          {/* Real-time Doppler Satellite Radar Overlay */}
          <ScrollRevealSection><SatelliteRadarSimulation destination={dest} /></ScrollRevealSection>

          {/* Severe Atmospheric Weather Warning Alerts */}
          <ScrollRevealSection><SatelliteWeatherAlertSystem destination={dest} /></ScrollRevealSection>

          {/* High-Altitude AMS Risk Engine */}
          <ScrollRevealSection><AcclimatizationRiskSimulator destination={dest} /></ScrollRevealSection>

          {/* 3D Topographic Mesh & Flyover Viewer */}
          <ScrollRevealSection><Terrain3DFlyoverViewer destination={dest} /></ScrollRevealSection>

          {/* Live Trail Optical & Thermal Webcams */}
          <ScrollRevealSection><TrailWebcamStreamViewer destination={dest} /></ScrollRevealSection>

          {/* Interactive Trek Elevation & Contour Chart */}
          <ScrollRevealSection><TrekElevationChart destination={dest} /></ScrollRevealSection>

          {/* GPS Offline Navigation & GPX/KML Exporter */}
          <ScrollRevealSection><GpxKmlExporterMap destination={dest} /></ScrollRevealSection>

          {/* Wildlife & Indigenous Fauna Field Guide */}
          <ScrollRevealSection><WildlifeSpotterGuide destination={dest} /></ScrollRevealSection>

          {/* Interactive Route Explorer Section */}
          <ScrollRevealSection><ExpeditionRouteExplorer destination={dest} /></ScrollRevealSection>

          {/* Certified Guides & Porter Community Directory */}
          <ScrollRevealSection><PorterGuideDirectory destination={dest} /></ScrollRevealSection>

          {/* Mandatory Frontier Permits & Compliance Vault */}
          <ScrollRevealSection><PermitDocumentChecklist destination={dest} /></ScrollRevealSection>

          {/* Leave No Trace Eco-Footprint Certifier */}
          <ScrollRevealSection><LeaveNoTraceEcoScore /></ScrollRevealSection>

          {/* 406 MHz COSPAS-SARSAT Satellite Emergency SOS & VHF Radio */}
          <ScrollRevealSection><SatelliteSosBeacon destination={dest} /></ScrollRevealSection>

          {/* Wilderness Botanical Field Flora & Foraging Guide */}
          <ScrollRevealSection><WildernessForagingScanner destination={dest} /></ScrollRevealSection>

          {/* Pulse Oximeter & SpO2 Hypoxia Adaptation Simulator */}
          <ScrollRevealSection><SpO2AltitudeSimulator destination={dest} /></ScrollRevealSection>

          {/* Photo Journal & EXIF Watermark Card Generator */}
          <ScrollRevealSection><PhotoJournalExifStamper destination={dest} /></ScrollRevealSection>

          {/* Indigenous Phrasebook & Local Customs Guide */}
          <ScrollRevealSection><IndigenousDialectPhrasebook destination={dest} /></ScrollRevealSection>

          {/* Expedition Gear Checklist Section */}
          <ScrollRevealSection><ExpeditionGearChecklist destination={dest} /></ScrollRevealSection>

          {/* Backpack Payload & Mass Distribution Calculator */}
          <ScrollRevealSection><BackpackWeightCalculator destination={dest} /></ScrollRevealSection>

          {/* Offline Wilderness First-Aid & Survival Handbook */}
          <ScrollRevealSection><WildernessSurvivalHandbook /></ScrollRevealSection>

          {/* Solar, Lunar & Tidal Astronomy Clock */}
          <ScrollRevealSection><SolarLunarTideCalculator destination={dest} /></ScrollRevealSection>

          {/* 360 Campsite VR Panorama Viewer */}
          <ScrollRevealSection><CampVrPanoramaViewer destination={dest} /></ScrollRevealSection>

          {/* Metabolic & Caloric Ration Planner */}
          <ScrollRevealSection><MetabolicNutritionPlanner /></ScrollRevealSection>

          {/* Expedition Fitness Readiness Test */}
          <ScrollRevealSection><FitnessReadinessTest /></ScrollRevealSection>

          {/* Encrypted Trail Dispatch & Audio Journal */}
          <ScrollRevealSection><TrailAudioJournal /></ScrollRevealSection>

          {/* Multi-Currency Expedition Group Expense Splitter */}
          <ScrollRevealSection><ExpenseGroupSplitter /></ScrollRevealSection>

          {/* Expedition Budget Calculator & Booking Form */}
          <ScrollRevealSection><ExpeditionBudgetCalculator destination={dest} /></ScrollRevealSection>

          {/* Printable Expedition Dossier & Briefing Exporter */}
          <ScrollRevealSection><ExpeditionPdfExporter destination={dest} /></ScrollRevealSection>

          {/* Expedition Reviews & Traveler Logbook */}
          <ScrollRevealSection><ExpeditionReviewsLogbook destination={dest} /></ScrollRevealSection>

          {/* Emergency Ranger & SOS Hotline Station */}
          <ScrollRevealSection><EmergencyRangerHotline destination={dest} /></ScrollRevealSection>

          {/* Intelligent Expedition Matchmaker Quiz */}
          <ScrollRevealSection><ExpeditionMatchmaker destinations={destinations} onSelect={setActiveIndex} /></ScrollRevealSection>

          {/* Destination Comparison Tool */}
          <ScrollRevealSection><DestinationCompareTool destinations={destinations} currentDest={dest} onSelectTarget={setActiveIndex} /></ScrollRevealSection>

          {/* Expedition Catalog Matrix */}
          <ScrollRevealSection><ExpeditionMatrix destinations={destinations} activeIndex={activeIndex} onSelect={setActiveIndex} /></ScrollRevealSection>

          {/* Gallery Section */}
          <ScrollRevealSection><DestinationGallery destination={dest} /></ScrollRevealSection>
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

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-accent text-white border border-white/20 rounded-full shadow-[0_0_25px_rgba(242,125,38,0.6)] flex items-center justify-center transition-all group cursor-pointer"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Admin Control Command Center Modal */}
      <AdminControlPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        destinations={destinations}
        setDestinations={setDestinations}
      />

      {/* Floating Tactical Geolocation & Real-time Compass HUD */}
      <DraggableCompass />
    </div>
    </>
  );
}

function LandingScreen({ onEnter }: { onEnter?: () => void }) {
  const [phase, setPhase] = useState<1 | 2>(1);
  const [isSlashFlattened, setIsSlashFlattened] = useState(false);

  useEffect(() => {
    const tSlash = setTimeout(() => setIsSlashFlattened(true), 1400);
    const t2 = setTimeout(() => setPhase(2), 2800);

    return () => {
      clearTimeout(tSlash);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      onClick={onEnter}
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none cursor-pointer font-sans bg-[#f4f1ea] text-[#141414]"
    >
      {/* --- HIGH-FASHION EDITORIAL NAVBAR --- */}
      <div className="w-full px-6 sm:px-12 py-5 flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] z-40 border-b border-black/10 text-black">
        <div className="flex items-center gap-8">
          <span className="font-bold hover:opacity-70 transition-opacity">ABOUT</span>
          <span className="hidden sm:inline font-bold opacity-60">PILLARS</span>
        </div>

        {/* Center Brand Logo */}
        <div className="flex items-center gap-1">
          <span className="font-black tracking-[0.18em] text-xs sm:text-sm uppercase font-sans">
            APEX EXPEDITIONS
          </span>
          <span className="text-[8px] font-mono tracking-normal text-black/60 font-bold">26</span>
        </div>

        <div className="flex items-center gap-8">
          <span className="hidden sm:inline font-bold opacity-60">LINEAGE</span>
          <span className="font-bold tracking-[0.25em] text-black">EXPLORE</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* --- PHASE 1: CREAM EDITORIAL DEFINITION CANVAS WITH DYNAMIC SLASH LINE --- */}
        {phase === 1 && (
          <motion.div
            key="phase-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="relative w-full h-full flex flex-col justify-center px-6 sm:px-16 md:px-24 z-20 bg-[#f4f1ea] text-[#141414]"
          >
            {/* Dynamic Morphing Slash / Line */}
            <motion.div
              initial={{ scaleX: 0, rotate: -22, height: "16px", backgroundColor: "#000000" }}
              animate={
                isSlashFlattened
                  ? { scaleX: 1, rotate: 0, height: "2px", backgroundColor: "#141414" }
                  : { scaleX: 1.1, rotate: -18, height: "14px", backgroundColor: "#000000" }
              }
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[5%] right-[5%] top-1/2 origin-center pointer-events-none z-10 shadow-md"
            />

            {/* Dual Column Definitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 items-center relative z-20">
              {/* Left Column: Apex */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="flex flex-col gap-3"
              >
                <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] uppercase opacity-40 border-b border-black/10 pb-2">
                  <span>MEANING</span>
                  <span>VV</span>
                </div>
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif italic text-black tracking-tight leading-none">
                  Apex
                </h1>
                <p className="text-xs sm:text-sm font-sans tracking-widest leading-relaxed uppercase opacity-80 max-w-sm font-medium pt-2">
                  TO EVOKE A SENSE OF CURIOSITY, FASCINATION, OR DESIRE TO UNDERSTAND AND EXPLORE UNTOUCHED SUMMITS.
                </p>
              </motion.div>

              {/* Right Column: Expedition */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col gap-3 md:pt-20"
              >
                <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] uppercase opacity-40 border-b border-black/10 pb-2">
                  <span>CREATIVE</span>
                  <span>STUDIO</span>
                </div>
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif italic text-black tracking-tight leading-none">
                  Expedition
                </h1>
                <p className="text-xs sm:text-sm font-sans tracking-widest leading-relaxed uppercase opacity-80 max-w-sm font-medium pt-2">
                  TO PROVIDE AN UNFILTERED AND GENUINE PORTRAYAL OF NATURE, CONNECTING WITH RAW HUMAN ENDURANCE.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* --- PHASE 2: DUAL VERTICAL SPLIT SCREEN (VOYEUR VÉRITÉ STYLE 50/50 CARDS) --- */}
        {phase === 2 && (
          <motion.div
            key="phase-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pt-16 flex flex-col md:flex-row z-20 bg-[#f4f1ea]"
          >
            {/* Left Vertical Film Card */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                if (onEnter) onEnter();
              }}
              className="group relative flex-1 h-1/2 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-black/10 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                alt="Everest Film"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Card Meta */}
              <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-between text-white">
                <div className="flex justify-between items-start text-[10px] font-mono tracking-[0.3em] uppercase">
                  <span className="opacity-70">FILM :: 001</span>
                  <span className="opacity-70">08,848M</span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic mb-4 tracking-tight leading-tight text-white">
                    The Symphony of Summits
                  </h2>

                  {/* Festival Laurel Badge */}
                  <div className="flex items-center gap-3 my-4 opacity-90">
                    <div className="w-6 h-6 border border-amber-400/60 rounded-full flex items-center justify-center text-[10px]">
                      🏆
                    </div>
                    <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-amber-300">
                      OFFICIAL SELECTION 2026 TIBET FILM FESTIVAL
                    </span>
                  </div>

                  <button className="mt-4 px-8 py-2.5 bg-white text-black group-hover:bg-amber-400 font-mono text-[10px] font-bold uppercase tracking-[0.3em] rounded-full transition-all duration-300 shadow-xl flex items-center gap-3">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Vertical Film Card */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                if (onEnter) onEnter();
              }}
              className="group relative flex-1 h-1/2 md:h-full overflow-hidden cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1528892677828-8862216f3665?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                alt="K2 Film"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Card Meta */}
              <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-between text-white">
                <div className="flex justify-between items-start text-[10px] font-mono tracking-[0.3em] uppercase">
                  <span className="opacity-70">FILM :: 002</span>
                  <span className="opacity-70">08,611M</span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic mb-4 tracking-tight leading-tight text-white">
                    Stand Up To The Savage Peak
                  </h2>

                  <button className="mt-6 px-8 py-2.5 bg-white text-black group-hover:bg-amber-400 font-mono text-[10px] font-bold uppercase tracking-[0.3em] rounded-full transition-all duration-300 shadow-xl flex items-center gap-3">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM CONTROLS & PHASE DOT INDICATORS --- */}
      <div className="w-full px-6 sm:px-12 py-4 flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.25em] z-40 text-black/60">
        <div>PHASE :: 0{phase} / 02</div>

        {/* Interactive Phase Dots */}
        <div className="flex items-center gap-2">
          {[1, 2].map((p) => (
            <button
              key={p}
              onClick={(e) => {
                e.stopPropagation();
                setPhase(p as 1 | 2);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${phase === p ? 'bg-black scale-125' : 'bg-black/20 hover:bg-black/40'}`}
            />
          ))}
        </div>

        <div className="font-bold text-black animate-pulse">
          [ CLICK TO ENTER ]
        </div>
      </div>
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
  const isInView = useInView(ref, { once: false, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);
  
  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 80, scale: 1.15, filter: 'blur(12px)' }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: 80, scale: 1.15, filter: 'blur(12px)' }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        {src?.match(/\.(mp4|webm)$/i) ? (
          <motion.video 
            style={{ y: parallaxY }}
            src={src} 
            autoPlay muted loop playsInline
            className="w-full h-[140%] -mt-[20%] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
          />
        ) : (
          <motion.img 
            style={{ y: parallaxY }}
            src={src} 
            alt={alt}
            className="w-full h-[140%] -mt-[20%] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}
      </motion.div>
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

function getCardinalDirection(angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

function DraggableCompass() {
  const [rotation, setRotation] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [useMagneticNorth, setUseMagneticNorth] = useState<boolean>(true);
  const [sensorSource, setSensorSource] = useState<'device' | 'mouse' | 'simulated'>('simulated');
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false);

  // Geolocation state
  const [geoData, setGeoData] = useState<{
    lat: number | null;
    lng: number | null;
    alt: number | null;
    accuracy: number | null;
    speed: number | null;
    heading: number | null;
    status: 'locking' | 'locked' | 'fallback' | 'denied';
  }>({
    lat: 27.9881,
    lng: 86.9250,
    alt: 5364,
    accuracy: 8,
    speed: 0,
    heading: 0,
    status: 'fallback'
  });

  const compassRef = useRef<HTMLDivElement>(null);

  // 1. Device Orientation API Listener (Gyroscope / Compass sensor)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS WebKit Compass Heading
      if ((e as any).webkitCompassHeading !== undefined && (e as any).webkitCompassHeading !== null) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null && e.alpha !== undefined) {
        // Standard DeviceOrientation API: alpha is 0..360
        heading = 360 - e.alpha;
      }

      if (heading !== null && !isNaN(heading)) {
        setRotation(Math.round((heading + 360) % 360));
        setSensorSource('device');
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // 2. Fallback Mouse Heading calculation on Desktop when device orientation is inactive
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sensorSource === 'device') return;
      if (!compassRef.current) return;
      const rect = compassRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const deg = (angle * (180 / Math.PI) + 90 + 360) % 360;
      setRotation(Math.round(deg));
      setSensorSource('mouse');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sensorSource]);

  // 3. Real-time Geolocation Tracker
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoData(prev => ({ ...prev, status: 'fallback' }));
      return;
    }

    setGeoData(prev => ({ ...prev, status: 'locking' }));

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setGeoData({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          alt: pos.coords.altitude ? Math.round(pos.coords.altitude) : 3850,
          accuracy: pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 5,
          speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0,
          heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
          status: 'locked'
        });

        if (pos.coords.heading !== null && pos.coords.heading !== undefined) {
          setRotation(Math.round(pos.coords.heading));
          setSensorSource('device');
        }
      },
      (err) => {
        console.warn("Geolocation watch fallback active:", err.message);
        setGeoData(prev => ({
          ...prev,
          lat: 27.9881,
          lng: 86.9250,
          alt: 5364,
          status: 'fallback'
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const requestIosOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionRequested(true);
        } else {
          alert('Orientation sensor permission denied.');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const currentCardinal = getCardinalDirection(rotation);

  return (
    <motion.div
      ref={compassRef}
      drag
      dragMomentum={false}
      className="fixed z-[120] select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ left: 24, bottom: 24 }}
    >
      {/* Compact Main Floating HUD Dial */}
      <div className="relative group flex items-center gap-3 bg-bg-panel/95 backdrop-blur-2xl border border-text-main/20 p-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all hover:border-accent">
        
        {/* Interactive Rotating Compass Ring */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-14 h-14 bg-bg-base rounded-full border border-text-main/20 flex items-center justify-center cursor-pointer shadow-inner overflow-hidden"
          title="Click to toggle Expedition Navigation HUD"
        >
          {/* Degree Tick Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-text-main/20 pointer-events-none" />

          {/* Cardinal Labels on Dial */}
          <span className="absolute top-1 text-[8px] font-mono font-bold text-accent">N</span>
          <span className="absolute right-1 text-[8px] font-mono font-bold text-text-main/50">E</span>
          <span className="absolute bottom-1 text-[8px] font-mono font-bold text-text-main/50">S</span>
          <span className="absolute left-1 text-[8px] font-mono font-bold text-text-main/50">W</span>

          {/* Rotating Needle / Rose */}
          <motion.div
            animate={{ rotate: useMagneticNorth ? rotation : (rotation + 11) % 360 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
          >
            <Navigation className="w-7 h-7 text-accent drop-shadow-[0_0_10px_rgba(242,125,38,0.7)] transform -rotate-45" />
          </motion.div>
        </motion.div>

        {/* Live Degree & GPS Telemetry Badge */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer pr-3 hidden sm:flex flex-col justify-center"
        >
          <div className="flex items-center gap-1.5 font-mono text-xs font-black text-text-main tracking-tight">
            <span className="text-accent">{Math.round(rotation)}°</span>
            <span className="px-1.5 py-0.5 bg-accent/20 border border-accent/30 text-accent text-[9px] font-bold rounded">
              {currentCardinal}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${geoData.status === 'locked' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[9px] font-mono text-text-main/60 uppercase font-semibold">
              {geoData.lat ? `${geoData.lat.toFixed(2)}°, ${geoData.lng?.toFixed(2)}°` : '27.98°N'}
            </span>
          </div>
        </div>

        {/* Drag Handle Indicator */}
        <div className="text-[9px] font-mono text-text-main/30 uppercase tracking-widest pl-1 pr-1 hidden md:block">
          ⋮⋮
        </div>
      </div>

      {/* Expanded Expedition Tactical HUD Modal / Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -12 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-3 w-80 bg-bg-panel/95 backdrop-blur-2xl border border-accent/40 p-5 shadow-2xl text-text-main font-mono text-xs space-y-4 rounded-sm z-[130]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-text-main/10">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-accent animate-spin-slow" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-accent">
                  TACTICAL NAVIGATION HUD
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-text-main/60 hover:text-text-main transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Orientation Dial Display */}
            <div className="grid grid-cols-2 gap-3 text-center bg-bg-base p-3 border border-text-main/10">
              <div className="p-2 border-r border-text-main/10">
                <span className="text-[9px] text-text-main/50 uppercase block font-bold">HEADING</span>
                <span className="text-xl font-black text-accent">{Math.round(rotation)}° {currentCardinal}</span>
              </div>
              <div className="p-2">
                <span className="text-[9px] text-text-main/50 uppercase block font-bold">SENSOR MODE</span>
                <span className="text-xs font-bold uppercase text-emerald-400">
                  {sensorSource === 'device' ? 'Gyroscope' : sensorSource === 'mouse' ? 'Mouse Angle' : 'Simulated'}
                </span>
              </div>
            </div>

            {/* GPS Telemetry Breakdown */}
            <div className="space-y-1.5 bg-bg-base p-3 border border-text-main/10 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-text-main/60">GPS LATITUDE:</span>
                <strong className="text-text-main">{geoData.lat?.toFixed(5) ?? '27.98810'}° N</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/60">GPS LONGITUDE:</span>
                <strong className="text-text-main">{geoData.lng?.toFixed(5) ?? '86.92500'}° E</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/60">EST. ALTITUDE:</span>
                <strong className="text-accent">{geoData.alt} meters</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/60">GPS ACCURACY:</span>
                <strong className="text-emerald-400">±{geoData.accuracy}m</strong>
              </div>
            </div>

            {/* Controls & Permissions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => setUseMagneticNorth(!useMagneticNorth)}
                className="w-full py-2 bg-bg-base border border-text-main/20 hover:border-accent text-[10px] uppercase font-bold text-text-main flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>Reference: {useMagneticNorth ? 'Magnetic North (0° Decl)' : 'True North (+11° Decl)'}</span>
              </button>

              {typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && !permissionRequested && (
                <button
                  onClick={requestIosOrientationPermission}
                  className="w-full py-2 bg-accent text-bg-base text-[10px] uppercase font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Enable Mobile Compass Sensor (iOS)</span>
                </button>
              )}
            </div>

            <div className="text-[9px] text-text-main/40 text-center uppercase tracking-wider font-mono">
              ★ Drag widget anywhere on screen • Click to collapse
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface GalleryItem {
  url: string;
  title?: string;
  caption?: string;
}

function DestinationGallery({ destination }: { destination: any }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = destination?.gallery && destination.gallery.length > 0
    ? destination.gallery
    : [
        { url: destination?.heroImage, title: `${destination?.name} Vista`, caption: destination?.desc },
        { url: destination?.historyImage, title: destination?.historyTitle, caption: destination?.historySub }
      ];

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryItems.length]);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-text-main/10 gap-6"
        >
          <div>
            <motion.div variants={fadeIn} className="flex items-center gap-3 mb-3">
              <Images className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                VISUAL ARCHIVE
              </span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-md">
              {destination?.name} Gallery
            </motion.h2>
          </div>

          <motion.div variants={fadeIn} className="flex items-center gap-4">
            <span className="font-sans text-xs uppercase tracking-widest text-text-main/60 font-semibold">
              {galleryItems.length} High-Res Frames
            </span>
            <div className="h-4 w-[1px] bg-text-main/20" />
            <span className="text-xs font-mono px-3 py-1 bg-accent/10 border border-accent/20 text-accent font-bold rounded-full">
              Full Screen Lightbox
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => setLightboxIndex(idx)}
              className="group relative cursor-pointer overflow-hidden border border-text-main/10 bg-bg-base shadow-xl aspect-[4/3] rounded-sm"
            >
              <img
                src={item.url}
                alt={item.title || `${destination?.name} image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="font-mono text-[10px] font-bold px-2.5 py-1 bg-bg-panel/80 backdrop-blur-md border border-text-main/10 text-accent uppercase tracking-widest">
                  0{idx + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-accent text-bg-base flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                {item.title && (
                  <h3 className="font-serif italic font-bold text-lg text-white mb-1 drop-shadow-md">
                    {item.title}
                  </h3>
                )}
                {item.caption && (
                  <p className="font-sans text-[11px] text-white/80 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.caption}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            <div
              className="w-full flex items-center justify-between text-white z-20 pb-4 border-b border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <span className="font-sans text-xs uppercase tracking-[0.25em] text-accent font-bold">
                  {destination?.name} • Frame
                </span>
                <span className="font-mono text-sm px-3 py-1 bg-white/10 rounded-full font-bold">
                  0{lightboxIndex + 1} / 0{galleryItems.length}
                </span>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-bg-base flex items-center justify-center transition-all duration-300 text-white cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : 0))
                }
                className="absolute left-2 md:left-6 z-30 p-3 md:p-4 rounded-full bg-black/50 hover:bg-accent hover:text-bg-base border border-white/20 text-white transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center relative p-2"
                >
                  <img
                    src={galleryItems[lightboxIndex]?.url}
                    alt={galleryItems[lightboxIndex]?.title || destination?.name}
                    className="max-w-full max-h-[72vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : 0))
                }
                className="absolute right-2 md:right-6 z-30 p-3 md:p-4 rounded-full bg-black/50 hover:bg-accent hover:text-bg-base border border-white/20 text-white transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div
              className="w-full text-center max-w-2xl mx-auto z-20 pt-4 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[lightboxIndex]?.title && (
                <h3 className="text-xl md:text-2xl font-serif italic text-white font-bold mb-1">
                  {galleryItems[lightboxIndex].title}
                </h3>
              )}
              {galleryItems[lightboxIndex]?.caption && (
                <p className="text-sm font-sans text-white/70 tracking-wide font-light">
                  {galleryItems[lightboxIndex].caption}
                </p>
              )}
              <div className="mt-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Press ESC to close • Left/Right arrows to navigate
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ExpeditionRouteExplorer({ destination }: { destination: any }) {
  const [selectedWaypoint, setSelectedWaypoint] = useState(0);

  const getWaypoints = (dest: any) => {
    if (dest.type === 'mountain') {
      return [
        { title: "Base Camp", alt: "5,364 m", dist: "0 km", risk: "Acclimatization Zone", detail: "Primary staging ground where expedition teams spend weeks adapting to reduced oxygen." },
        { title: "Icefall / Couloir", alt: "6,100 m", dist: "12 km", risk: "High Serac Avalanche Risk", detail: "Navigating shifting ladders and ice crevasses before morning sun warms the ice." },
        { title: "High Altitude Camp 4", alt: "7,920 m", dist: "21 km", risk: "Death Zone Threshold", detail: "Final resting ridge before the midnight summit push. Supplemental oxygen activated." },
        { title: "Summit Pinnacle", alt: dest.elevationMeters || "8,848 m", dist: "28 km", risk: "Apex Altitude", detail: "The highest point on Earth. Unrivaled 360-degree views across Himalayan horizons." }
      ];
    } else if (dest.type === 'forest') {
      return [
        { title: "Khulna Delta Gateway", alt: "2 m", dist: "0 km", risk: "Permit Verification", detail: "Boarding river vessels and verifying forest ranger armed security passes." },
        { title: "Koromjol Eco Station", alt: "4 m", dist: "35 km", risk: "Mangrove Pneumatophores", detail: "Navigating raised wooden walkways over tidal mudflats and saltwater estuaries." },
        { title: "Kotka Wildlife Watch", alt: "3 m", dist: "70 km", risk: "Wild Tiger Territory", detail: "Deep estuary creeks where Bengal tigers and spotted deer roam along pristine mudbanks." },
        { title: "Dublar Char Estuary", alt: "1 m", dist: "110 km", risk: "Bay of Bengal Tides", detail: "Open coastal delta facing tempestuous ocean winds and artisanal fisherman camps." }
      ];
    } else if (dest.type === 'valley') {
      return [
        { title: "Dighinala Foothills", alt: "120 m", dist: "0 km", risk: "Chander Gari Trail", detail: "Registration point for 4x4 open-roof mountain jeeps tackling steep hill climbs." },
        { title: "Kasalong Ridge Drive", alt: "650 m", dist: "24 km", risk: "Dense Fog & Hairpins", detail: "Ascending through swirling cloud layers along narrow jungle cliff roads." },
        { title: "Ruilui Para Ridge", alt: "1,470 ft", dist: "38 km", risk: "Cloud Sea Overlook", detail: "Tribal village settlements nestled atop the highest ridge in Sajek Valley." },
        { title: "Konglak Peak Summit", alt: "1,800 ft", dist: "42 km", risk: "Highest Point in Sajek", detail: "Panoramic views stretching into the Lushai Hills and neighboring Mizoram borders." }
      ];
    } else {
      return [
        { title: "Kolatoli Beach Head", alt: "0 m", dist: "0 km", risk: "Surfing & Tidal Riptides", detail: "The vibrant coastal entrance where golden sands meet roaring Bay of Bengal waves." },
        { title: "Himchari National Park", alt: "45 m", dist: "18 km", risk: "Coastal Cliffs", detail: "Hilltop lookout point featuring lush tropical greenery overlooking the ocean line." },
        { title: "Inani Coral Beach", alt: "1 m", dist: "32 km", risk: "Sharp Coral Boulders", detail: "Unique beach stretch studded with dark, ancient coral stone formations at low tide." },
        { title: "Teknaf Peninsula Tip", alt: "5 m", dist: "80 km", risk: "Border Estuary", detail: "The southern terminus of the longest natural sea beach in the world." }
      ];
    }
  };

  const waypoints = getWaypoints(destination);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-text-main/10 gap-4"
        >
          <div>
            <motion.div variants={fadeIn} className="flex items-center gap-3 mb-2">
              <Navigation className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                EXPEDITION ROUTE & STAGES
              </span>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {destination.name} Waypoints
            </motion.h2>
          </div>
          <motion.p variants={fadeIn} className="text-xs font-mono text-text-main/60 max-w-md">
            Interactive elevation profile & trail checkpoint telemetry. Select a stage to analyze risk and terrain profile.
          </motion.p>
        </motion.div>

        {/* Waypoint Steps Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {waypoints.map((wp, idx) => {
            const isActive = selectedWaypoint === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedWaypoint(idx)}
                className={`p-5 text-left border transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? 'border-accent bg-accent/10 shadow-lg'
                    : 'border-text-main/10 bg-bg-panel hover:border-text-main/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 ${isActive ? 'bg-accent text-bg-base' : 'bg-text-main/10 text-text-main'}`}>
                    STAGE 0{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-accent font-bold">{wp.alt}</span>
                </div>
                <h3 className="font-serif italic font-bold text-lg text-text-main mb-1 line-clamp-1">
                  {wp.title}
                </h3>
                <span className="text-[11px] font-sans text-text-main/60 block">
                  {wp.risk}
                </span>
                {isActive && (
                  <motion.div layoutId="activeWaypoint" className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedWaypoint}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-8 border border-text-main/10 bg-bg-panel relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
                  Stage 0{selectedWaypoint + 1} Protocol • {waypoints[selectedWaypoint].risk}
                </span>
              </div>
              <h4 className="text-2xl md:text-3xl font-serif italic font-bold text-text-main mb-3">
                {waypoints[selectedWaypoint].title} ({waypoints[selectedWaypoint].alt})
              </h4>
              <p className="text-sm md:text-base font-sans text-text-main/80 max-w-2xl leading-relaxed">
                {waypoints[selectedWaypoint].detail}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-text-main/10 pt-4 md:pt-0 md:pl-8">
              <div className="text-center">
                <span className="text-[10px] font-mono text-text-main/50 uppercase block mb-1">Distance</span>
                <span className="text-xl font-bold font-mono text-text-main">{waypoints[selectedWaypoint].dist}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono text-text-main/50 uppercase block mb-1">Status</span>
                <span className="text-xs font-bold font-mono px-3 py-1 bg-accent/20 text-accent border border-accent/30 rounded-full">
                  VERIFIED
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ExpeditionGearChecklist({ destination }: { destination: any }) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const getGear = (dest: any) => {
    if (dest.type === 'mountain') {
      return [
        { id: 'g1', name: "800-Fill Goose Down Parka (-40°C Rating)", cat: "Thermal Defense" },
        { id: 'g2', name: "Supplemental Oxygen Regulator & Mask", cat: "Life Support" },
        { id: 'g3', name: "Crampons & Technical Ice Axe", cat: "Climbing Hardware" },
        { id: 'g4', name: "Garmin InReach Satellite SOS Beacon", cat: "Navigation" },
        { id: 'g5', name: "Glacier UV-400 Side Shield Goggles", cat: "Eye Protection" },
        { id: 'g6', name: "Freeze-Dried High Calorie Rations (4000 kcal)", cat: "Sustenance" }
      ];
    } else if (dest.type === 'forest') {
      return [
        { id: 'g1', name: "Waterproof Mud Boots & Pneumatophore Gaiters", cat: "Footwear" },
        { id: 'g2', name: "High-Decibel Siren & Armed Ranger Escort", cat: "Predator Safety" },
        { id: 'g3', name: "Heavy-Duty Insect & Leech Repellent", cat: "Protection" },
        { id: 'g4', name: "IP68 Waterproof GPS & Topo Maps", cat: "Navigation" },
        { id: 'g5', name: "Potable Water Purification System", cat: "Hydration" },
        { id: 'g6', name: "Solar Power Bank & Emergency Flares", cat: "Power & Signal" }
      ];
    } else if (dest.type === 'valley') {
      return [
        { id: 'g1', name: "Lightweight Breathable Trekking Boots", cat: "Footwear" },
        { id: 'g2', name: "Windproof Cloud-Break Jacket", cat: "Weather Outerwear" },
        { id: 'g3', name: "Compact DSLR Camera & ND Gradient Filters", cat: "Photography" },
        { id: 'g4', name: "Portable Mosquito Net & Jungle Hammock", cat: "Camp Gear" },
        { id: 'g5', name: "Hydro-Flask & Electrolyte Powder Packets", cat: "Hydration" },
        { id: 'g6', name: "First-Aid Snakebite Kit & Antiseptic Wipes", cat: "Medical" }
      ];
    } else {
      return [
        { id: 'g1', name: "Polarized Ocean UV Sunglasses & Reef-Safe Sunscreen", cat: "Sun Care" },
        { id: 'g2', name: "Quick-Dry Rashguard & Breathable Beachwear", cat: "Apparel" },
        { id: 'g3', name: "Dry-Bag Waterproof Pouch for Camera & Phone", cat: "Protection" },
        { id: 'g4', name: "Heavy-Duty Beach Sand Sandals & Reef Shoes", cat: "Footwear" },
        { id: 'g5', name: "Isotonic Rehydration Salts & Insulated Bottle", cat: "Hydration" },
        { id: 'g6', name: "Emergency Marine Whistle & Signal Mirror", cat: "Safety" }
      ];
    }
  };

  const gear = getGear(destination);
  const checkedCount = gear.filter(g => checkedItems[g.id]).length;
  const progressPercent = Math.round((checkedCount / gear.length) * 100);

  const toggleGear = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                EXPEDITION ESSENTIALS CHECKLIST
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {destination.name} Gear Kit
            </h2>
          </div>

          <div className="flex items-center gap-6 bg-bg-base p-4 border border-text-main/10 rounded-sm">
            <div>
              <span className="text-[10px] font-mono text-text-main/60 uppercase block">Pack Readiness</span>
              <span className="text-2xl font-black font-mono text-accent">{progressPercent}%</span>
            </div>
            <div className="w-32 h-2 bg-text-main/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-accent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gear.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleGear(item.id)}
                className={`p-5 text-left border flex items-start gap-4 transition-all duration-300 cursor-pointer ${
                  isChecked
                    ? 'border-accent/50 bg-accent/10 shadow-md'
                    : 'border-text-main/10 bg-bg-base hover:border-text-main/30'
                }`}
              >
                <div className="mt-1">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  ) : (
                    <Circle className="w-5 h-5 text-text-main/30" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold block mb-1">
                    {item.cat}
                  </span>
                  <span className={`text-sm font-sans font-semibold leading-snug block ${isChecked ? 'line-through text-text-main/50' : 'text-text-main'}`}>
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExpeditionMatrix({ destinations, activeIndex, onSelect }: { destinations: any[]; activeIndex: number; onSelect: (idx: number) => void }) {
  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-text-main/10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                GLOBAL EXPEDITION CATALOG
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Explore All Frontiers
            </h2>
          </div>
          <span className="text-xs font-mono text-text-main/60">
            Click any destination below to switch expedition view immediately.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.div
                key={d.id || idx}
                whileHover={{ y: -6 }}
                onClick={() => {
                  onSelect(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative border cursor-pointer overflow-hidden p-6 transition-all duration-300 flex flex-col justify-between h-64 ${
                  isActive
                    ? 'border-accent bg-accent/10 shadow-2xl ring-1 ring-accent'
                    : 'border-text-main/10 bg-bg-panel hover:border-accent/40'
                }`}
              >
                <div className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-35 pointer-events-none">
                  <img src={d.heroImage} alt={d.name} className="w-full h-full object-cover" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-bg-base border border-text-main/10 text-accent">
                    0{idx + 1} • {d.type}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-mono font-bold bg-accent text-bg-base px-2 py-0.5 uppercase tracking-widest">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="relative z-10 my-auto">
                  <h3 className="text-3xl font-serif italic font-bold text-text-main mb-1 group-hover:text-accent transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs font-sans text-text-main/70 line-clamp-2">
                    {d.subtitle} — {d.location}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-3 border-t border-text-main/10 text-xs font-mono text-text-main/80">
                  <span>{d.facts?.[0]?.value || d.elevationMeters || 'See Details'}</span>
                  <div className="flex items-center gap-1 text-accent font-bold group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LiveAtmosphericTelemetry({ destination }: { destination: any }) {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [season, setSeason] = useState<'peak' | 'off' | 'winter'>('peak');

  const getBaseTempC = (dest: any) => {
    if (dest.type === 'mountain') return season === 'peak' ? -18 : season === 'winter' ? -32 : -22;
    if (dest.type === 'forest') return season === 'peak' ? 28 : season === 'winter' ? 18 : 31;
    if (dest.type === 'valley') return season === 'peak' ? 24 : season === 'winter' ? 14 : 26;
    return season === 'peak' ? 32 : season === 'winter' ? 22 : 34; // beach
  };

  const getWindKm = (dest: any) => {
    if (dest.type === 'mountain') return season === 'winter' ? 85 : 45;
    if (dest.type === 'forest') return season === 'peak' ? 18 : 35;
    if (dest.type === 'valley') return season === 'winter' ? 22 : 12;
    return season === 'peak' ? 25 : 42;
  };

  const getO2Percent = (dest: any) => {
    if (dest.type === 'mountain') return '43%';
    if (dest.type === 'valley') return '92%';
    return '99%';
  };

  const getPressure = (dest: any) => {
    if (dest.type === 'mountain') return '335 hPa';
    if (dest.type === 'valley') return '940 hPa';
    return '1,013 hPa';
  };

  const tempC = getBaseTempC(destination);
  const displayTemp = unit === 'C' ? `${tempC}°C` : `${Math.round((tempC * 9) / 5 + 32)}°F`;
  const windKm = getWindKm(destination);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CloudSun className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                LIVE ATMOSPHERIC SIMULATOR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {destination.name} Telemetry
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-bg-base p-1 border border-text-main/10 rounded-sm">
              <button
                onClick={() => setSeason('peak')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  season === 'peak' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                PEAK SEASON
              </button>
              <button
                onClick={() => setSeason('off')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  season === 'off' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                MONSOON/OFF
              </button>
              <button
                onClick={() => setSeason('winter')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  season === 'winter' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                WINTER
              </button>
            </div>

            <button
              onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
              className="px-3 py-1.5 bg-bg-base border border-text-main/20 text-accent font-mono text-xs font-bold hover:border-accent transition-colors cursor-pointer"
            >
              UNIT: °{unit}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-text-main/10 bg-bg-base flex flex-col justify-between h-44 relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-mono text-text-main/50 uppercase tracking-widest font-bold">Ambient Temp</span>
              <ThermometerSnowflake className="w-5 h-5 text-accent" />
            </div>
            <div className="z-10">
              <span className="text-4xl md:text-5xl font-black font-mono text-text-main tracking-tight block">
                {displayTemp}
              </span>
              <span className="text-[11px] font-sans text-text-main/60 block mt-1">
                Thermal variance: ±4°
              </span>
            </div>
          </div>

          <div className="p-6 border border-text-main/10 bg-bg-base flex flex-col justify-between h-44 relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-mono text-text-main/50 uppercase tracking-widest font-bold">Wind Velocity</span>
              <Wind className="w-5 h-5 text-accent" />
            </div>
            <div className="z-10">
              <span className="text-4xl md:text-5xl font-black font-mono text-text-main tracking-tight block">
                {windKm} <span className="text-lg font-normal text-text-main/60">km/h</span>
              </span>
              <span className="text-[11px] font-sans text-text-main/60 block mt-1">
                Knots: {Math.round(windKm * 0.539956)} kts
              </span>
            </div>
          </div>

          <div className="p-6 border border-text-main/10 bg-bg-base flex flex-col justify-between h-44 relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-mono text-text-main/50 uppercase tracking-widest font-bold">O2 Saturation</span>
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div className="z-10">
              <span className="text-4xl md:text-5xl font-black font-mono text-text-main tracking-tight block">
                {getO2Percent(destination)}
              </span>
              <span className="text-[11px] font-sans text-text-main/60 block mt-1">
                Relative sea level ratio
              </span>
            </div>
          </div>

          <div className="p-6 border border-text-main/10 bg-bg-base flex flex-col justify-between h-44 relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-mono text-text-main/50 uppercase tracking-widest font-bold">Barometric Pressure</span>
              <Gauge className="w-5 h-5 text-accent" />
            </div>
            <div className="z-10">
              <span className="text-3xl md:text-4xl font-black font-mono text-text-main tracking-tight block">
                {getPressure(destination)}
              </span>
              <span className="text-[11px] font-sans text-accent font-bold block mt-1">
                Clearance: OPTIMAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Activity(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function Gauge(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function ExpeditionBudgetCalculator({ destination }: { destination: any }) {
  const [members, setMembers] = useState(2);
  const [days, setDays] = useState(destination.type === 'mountain' ? 14 : 5);
  const [tier, setTier] = useState<'standard' | 'alpine' | 'vip'>('alpine');
  const [hasGearRental, setHasGearRental] = useState(true);
  const [hasGuide, setHasGuide] = useState(true);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const getBaseRatePerDay = () => {
    if (destination.type === 'mountain') return tier === 'standard' ? 180 : tier === 'alpine' ? 280 : 450;
    if (destination.type === 'forest') return tier === 'standard' ? 90 : tier === 'alpine' ? 150 : 250;
    if (destination.type === 'valley') return tier === 'standard' ? 50 : tier === 'alpine' ? 95 : 180;
    return tier === 'standard' ? 60 : tier === 'alpine' ? 120 : 220; // beach
  };

  const dailyRate = getBaseRatePerDay();
  const baseCost = members * days * dailyRate;
  const permitCost = destination.type === 'mountain' ? members * 500 : destination.type === 'forest' ? members * 120 : members * 40;
  const gearAddon = hasGearRental ? members * 200 : 0;
  const guideAddon = hasGuide ? days * 100 : 0;
  const insuranceAddon = hasInsurance ? members * 150 : 0;

  const totalUSD = baseCost + permitCost + gearAddon + guideAddon + insuranceAddon;
  const totalBDT = totalUSD * 120; // 1 USD = 120 BDT approx

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                EXPEDITION BUDGET & TRIP ESTIMATOR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {destination.name} Cost Planner
            </h2>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-6 py-3 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-lg self-start md:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>Request Booking Inquiry</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-7 bg-bg-panel border border-text-main/10 p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-widest text-text-main font-bold">
                  Team Members: <span className="text-accent text-base font-bold">{members} Person{members > 1 ? 's' : ''}</span>
                </label>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={members}
                onChange={(e) => setMembers(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-widest text-text-main font-bold">
                  Duration: <span className="text-accent text-base font-bold">{days} Days</span>
                </label>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-text-main font-bold block mb-3">
                Service Package Tier
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'standard', name: 'Standard', sub: 'Essential Logistical Support' },
                  { id: 'alpine', name: 'Alpine Pro', sub: 'Full Sherpa & Gear Package' },
                  { id: 'vip', name: 'Ultra VIP', sub: 'Private Helicopter & Luxury Stay' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTier(t.id as any)}
                    className={`p-3 text-left border transition-all cursor-pointer ${
                      tier === t.id
                        ? 'border-accent bg-accent/10 shadow-md'
                        : 'border-text-main/10 bg-bg-base hover:border-text-main/30'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono block text-text-main">{t.name}</span>
                    <span className="text-[10px] text-text-main/60 block leading-tight mt-1">{t.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-text-main font-bold block mb-3">
                Add-on Services
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 border border-text-main/10 bg-bg-base cursor-pointer hover:border-text-main/20">
                  <span className="text-xs font-sans text-text-main font-semibold">High-Altitude Gear Rental Package</span>
                  <input
                    type="checkbox"
                    checked={hasGearRental}
                    onChange={(e) => setHasGearRental(e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-text-main/10 bg-bg-base cursor-pointer hover:border-text-main/20">
                  <span className="text-xs font-sans text-text-main font-semibold">Dedicated Local Guide & Armed Ranger</span>
                  <input
                    type="checkbox"
                    checked={hasGuide}
                    onChange={(e) => setHasGuide(e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-text-main/10 bg-bg-base cursor-pointer hover:border-text-main/20">
                  <span className="text-xs font-sans text-text-main font-semibold">Comprehensive SOS Evacuation Insurance</span>
                  <input
                    type="checkbox"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="lg:col-span-5 bg-bg-panel border border-text-main/10 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block mb-4">
                ITEMIZED ESTIMATE BREAKDOWN
              </span>

              <div className="space-y-3 font-mono text-xs text-text-main/80 border-b border-text-main/10 pb-6">
                <div className="flex justify-between">
                  <span>Base Logistics ({members}p x {days}d)</span>
                  <span className="font-bold text-text-main">${baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Permit & Government Fees</span>
                  <span className="font-bold text-text-main">${permitCost.toLocaleString()}</span>
                </div>
                {hasGearRental && (
                  <div className="flex justify-between">
                    <span>Technical Gear Rental</span>
                    <span className="font-bold text-text-main">${gearAddon.toLocaleString()}</span>
                  </div>
                )}
                {hasGuide && (
                  <div className="flex justify-between">
                    <span>Guide & Ranger Service</span>
                    <span className="font-bold text-text-main">${guideAddon.toLocaleString()}</span>
                  </div>
                )}
                {hasInsurance && (
                  <div className="flex justify-between">
                    <span>SOS Evacuation Insurance</span>
                    <span className="font-bold text-text-main">${insuranceAddon.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6">
              <span className="text-[10px] font-mono text-text-main/50 uppercase block mb-1">Total Estimated Investment</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-black font-mono text-accent">
                  ${totalUSD.toLocaleString()}
                </span>
                <span className="text-sm font-mono text-text-main/60 font-semibold">
                  (~৳{totalBDT.toLocaleString()})
                </span>
              </div>
              <p className="text-[11px] font-sans text-text-main/60 mt-2">
                *Includes all tax, government permits, and ground transport logistics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <ExpeditionBookingModal
            destination={destination}
            totalUSD={totalUSD}
            members={members}
            days={days}
            onClose={() => setIsBookingOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ExpeditionBookingModal({ destination, totalUSD, members, days, onClose }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    month: 'October',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[210] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-bg-panel border border-text-main/20 p-8 max-w-lg w-full relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-main/60 hover:text-accent p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block mb-1">
                EXPEDITION INQUIRY PROTOCOL
              </span>
              <h3 className="text-2xl font-serif italic font-bold text-text-main">
                Book {destination.name}
              </h3>
              <p className="text-xs font-mono text-text-main/60 mt-1">
                {members} Person{members > 1 ? 's' : ''} • {days} Days • Est. ${totalUSD.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Commander Sarah Jenkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-sans text-text-main focus:border-accent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Email</label>
                <input
                  required
                  type="email"
                  placeholder="expedition@frontier.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-sans text-text-main focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Target Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-mono text-text-main focus:border-accent outline-none cursor-pointer"
                >
                  {['January', 'March', 'May', 'September', 'October', 'November'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Special Requirements / Medical Notes</label>
              <textarea
                rows={3}
                placeholder="List dietary preferences, prior high-altitude experience, or custom gear requirements..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-sans text-text-main focus:border-accent outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer mt-2"
            >
              Confirm Expedition Reservation
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-accent/20 border border-accent text-accent rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif italic font-bold text-text-main">
              Inquiry Dispatched Successfully
            </h3>
            <p className="text-xs font-sans text-text-main/80 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-accent">{formData.name}</strong>. Our expedition director will review your parameters for <strong className="text-text-main">{destination.name}</strong> and contact you at <strong className="text-text-main">{formData.email}</strong> within 12 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-text-main text-bg-base font-mono text-xs font-bold uppercase tracking-widest hover:opacity-90 cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function DestinationCompareTool({ destinations, currentDest, onSelectTarget }: any) {
  const [compareIdx, setCompareIdx] = useState((currentDest.id % destinations.length));
  const secondDest = destinations[compareIdx] || destinations[0];

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Scale className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                CROSS-FRONTIER COMPARISON ENGINE
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Compare Destinations
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-text-main/60 uppercase font-bold">Compare Against:</span>
            <select
              value={compareIdx}
              onChange={(e) => setCompareIdx(parseInt(e.target.value))}
              className="bg-bg-base border border-text-main/20 p-2.5 text-xs font-mono text-text-main focus:border-accent outline-none cursor-pointer"
            >
              {destinations.map((d: any, idx: number) => (
                <option key={d.id} value={idx} disabled={d.id === currentDest.id}>
                  {d.name} ({d.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="border border-text-main/10 bg-bg-base overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-text-main/10 bg-bg-panel font-mono text-xs uppercase text-text-main">
                <th className="p-4 border-r border-text-main/10 w-1/3">Parameter</th>
                <th className="p-4 border-r border-text-main/10 w-1/3 text-accent font-bold">
                  {currentDest.name} (ACTIVE)
                </th>
                <th className="p-4 w-1/3 text-text-main font-bold flex items-center justify-between">
                  <span>{secondDest.name}</span>
                  <button
                    onClick={() => onSelectTarget(compareIdx)}
                    className="text-[10px] font-mono px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-bg-base transition-colors cursor-pointer"
                  >
                    Switch View
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-main/10 font-sans text-xs text-text-main">
              <tr>
                <td className="p-4 border-r border-text-main/10 font-mono uppercase text-text-main/60">Category / Type</td>
                <td className="p-4 border-r border-text-main/10 font-bold uppercase text-accent">{currentDest.type}</td>
                <td className="p-4 font-bold uppercase">{secondDest.type}</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-text-main/10 font-mono uppercase text-text-main/60">Elevation / Scale</td>
                <td className="p-4 border-r border-text-main/10 font-mono">{currentDest.elevationMeters || 'Sea Level'}</td>
                <td className="p-4 font-mono">{secondDest.elevationMeters || 'Sea Level'}</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-text-main/10 font-mono uppercase text-text-main/60">Location / Region</td>
                <td className="p-4 border-r border-text-main/10">{currentDest.location}</td>
                <td className="p-4">{secondDest.location}</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-text-main/10 font-mono uppercase text-text-main/60">Primary Hazard / Risk</td>
                <td className="p-4 border-r border-text-main/10 text-amber-500 font-semibold">{currentDest.type === 'mountain' ? 'High Altitude Hypoxia' : currentDest.type === 'forest' ? 'Royal Bengal Tigers & Tides' : 'Heavy Mountain Fog'}</td>
                <td className="p-4 text-amber-500 font-semibold">{secondDest.type === 'mountain' ? 'High Altitude Hypoxia' : secondDest.type === 'forest' ? 'Royal Bengal Tigers & Tides' : 'Heavy Mountain Fog'}</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-text-main/10 font-mono uppercase text-text-main/60">Historical Highlight</td>
                <td className="p-4 border-r border-text-main/10 italic">{currentDest.historyTitle}</td>
                <td className="p-4 italic">{secondDest.historyTitle}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

{/* --- SYNTHESIZED ATMOSPHERIC SOUNDSCAPE PLAYER --- */}
function SynthesizedAudioSoundscape({ destination }: { destination: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [soundMode, setSoundMode] = useState<'ambient' | 'wind' | 'storm'>('ambient');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create pink noise buffer for realistic nature wind/surf soundscape
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter settings based on destination type
      const filter = ctx.createBiquadFilter();
      if (destination.type === 'mountain') {
        filter.type = soundMode === 'storm' ? 'bandpass' : 'lowpass';
        filter.frequency.value = soundMode === 'storm' ? 800 : 350;
      } else if (destination.type === 'forest') {
        filter.type = 'lowpass';
        filter.frequency.value = 500;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 250; // Ocean beach wave swell
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio Context error', e);
    }
  };

  const stopAudio = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol * 0.3, audioCtxRef.current.currentTime);
    }
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-bg-panel border border-text-main/10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                isPlaying
                  ? 'bg-accent text-bg-base scale-105 animate-pulse'
                  : 'bg-bg-base text-accent border border-text-main/20 hover:border-accent'
              }`}
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Headphones className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                  ATMOSPHERIC SOUNDSCAPE SYNTHESIZER
                </span>
              </div>
              <h3 className="text-2xl font-serif italic font-bold text-text-main">
                {destination.name} Acoustic Environment
              </h3>
              <p className="text-xs font-mono text-text-main/60 mt-1">
                {isPlaying ? 'Playing live procedural audio simulation' : 'Click play to initialize ambient soundscape engine'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 bg-bg-base p-1.5 border border-text-main/10">
              <button
                onClick={() => setSoundMode('ambient')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  soundMode === 'ambient' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                GENTLE BREEZE
              </button>
              <button
                onClick={() => setSoundMode('wind')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  soundMode === 'wind' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                HIGH WIND
              </button>
              <button
                onClick={() => setSoundMode('storm')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  soundMode === 'storm' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                GALE STORM
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-text-main/60" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-28 accent-accent bg-text-main/10 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-text-main w-8">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- INTERACTIVE TREK ELEVATION & CONTOUR CHART --- */}
function TrekElevationChart({ destination }: { destination: any }) {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const getElevationData = (dest: any) => {
    if (dest.type === 'mountain') {
      return [
        { km: 0, alt: 1400, name: 'Lukla Trailhead', gradient: '4%', terrain: 'Pine Trail', oxygen: '86%' },
        { km: 12, alt: 2800, name: 'Namche Bazaar', gradient: '12%', terrain: 'Stone Steps', oxygen: '72%' },
        { km: 24, alt: 3860, name: 'Tengboche Monastery', gradient: '18%', terrain: 'Glacial Scree', oxygen: '63%' },
        { km: 36, alt: 4410, name: 'Dingboche High Camp', gradient: '22%', terrain: 'Lateral Moraine', oxygen: '57%' },
        { km: 48, alt: 5160, name: 'Gorak Shep Ridge', gradient: '28%', terrain: 'Glacial Ice', oxygen: '52%' },
        { km: 58, alt: 6189, name: 'Island Peak Summit', gradient: '45%', terrain: 'Crevasse Ice Wall', oxygen: '44%' }
      ];
    }
    if (dest.type === 'forest') {
      return [
        { km: 0, alt: 2, name: 'Mongla Port Jetty', gradient: '1%', terrain: 'Tidal Basin', oxygen: '99%' },
        { km: 15, alt: 5, name: 'Herbaria Guard Post', gradient: '2%', terrain: 'Mangrove Root Mud', oxygen: '98%' },
        { km: 30, alt: 8, name: 'Kotka Wildlife Camp', gradient: '1%', terrain: 'Sundari Forest Bed', oxygen: '99%' },
        { km: 45, alt: 12, name: 'Jamtola Tiger Tower', gradient: '3%', terrain: 'Coastal Dune Grass', oxygen: '99%' }
      ];
    }
    return [
      { km: 0, alt: 200, name: 'Srimangal Town', gradient: '2%', terrain: 'Paved Road', oxygen: '99%' },
      { km: 8, alt: 450, name: 'Lawachara Forest Gate', gradient: '8%', terrain: 'Rainforest Canopy Trail', oxygen: '98%' },
      { km: 18, alt: 680, name: 'Finlay Tea Ridge', gradient: '15%', terrain: 'Tea Estate Slopes', oxygen: '97%' },
      { km: 28, alt: 920, name: 'Hum Hum Waterfall Pass', gradient: '25%', terrain: 'Slippery Clay Ravine', oxygen: '96%' }
    ];
  };

  const data = getElevationData(destination);
  const maxAlt = Math.max(...data.map(d => d.alt));

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                TOPOGRAPHIC ELEVATION & GRADIENT PROFILE
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {destination.name} Altitude Contour
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-text-main/70">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-accent rounded-full inline-block"></span> Summit Altitude: {maxAlt}m</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-text-main/40 rounded-full inline-block"></span> Distance: {data[data.length - 1].km} km</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="border border-text-main/10 bg-bg-base p-6 relative">
          <div className="h-64 md:h-80 w-full relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 75, 150, 225].map((yVal, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={yVal}
                  x2="1000"
                  y2={yVal}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <polygon
                points={`0,300 ${data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 1000;
                  const y = 300 - (d.alt / (maxAlt * 1.15)) * 260;
                  return `${x},${y}`;
                }).join(' ')} 1000,300`}
                fill="url(#elevationGrad)"
              />

              {/* Contour Line */}
              <polyline
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
                points={data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 1000;
                  const y = 300 - (d.alt / (maxAlt * 1.15)) * 260;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Data points */}
              {data.map((d, i) => {
                const x = (i / (data.length - 1)) * 1000;
                const y = 300 - (d.alt / (maxAlt * 1.15)) * 260;
                const isSelected = activePoint === i;

                return (
                  <g key={i} className="cursor-pointer" onClick={() => setActivePoint(i)}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 8 : 5}
                      fill={isSelected ? "var(--color-bg-base)" : "var(--color-accent)"}
                      stroke="var(--color-accent)"
                      strokeWidth={isSelected ? 3 : 2}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive milestone cards underneath */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-text-main/10">
            {data.map((pt, idx) => (
              <button
                key={idx}
                onClick={() => setActivePoint(idx)}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  activePoint === idx
                    ? 'border-accent bg-accent/10 shadow-md scale-102'
                    : 'border-text-main/10 bg-bg-panel hover:border-text-main/30'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-accent block">{pt.km} KM</span>
                <span className="text-xs font-bold text-text-main block truncate">{pt.name}</span>
                <span className="text-[11px] font-mono text-text-main/60 block mt-1">{pt.alt}m altitude</span>
              </button>
            ))}
          </div>

          {/* Detailed Selected Point Callout */}
          {activePoint !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 border border-accent bg-accent/5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
            >
              <div>
                <span className="text-accent font-bold uppercase tracking-widest block text-[10px]">SELECTED MILESTONE DETAILED TELEMETRY</span>
                <span className="text-base font-bold text-text-main">{data[activePoint].name}</span>
              </div>
              <div className="flex flex-wrap gap-6 text-text-main/80">
                <div><span>Altitude:</span> <strong className="text-accent">{data[activePoint].alt} m</strong></div>
                <div><span>Max Incline:</span> <strong className="text-accent">{data[activePoint].gradient}</strong></div>
                <div><span>Surface Terrain:</span> <strong className="text-text-main">{data[activePoint].terrain}</strong></div>
                <div><span>O2 Saturation:</span> <strong className="text-accent">{data[activePoint].oxygen}</strong></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

{/* --- EXPEDITION REVIEWS & TRAVELER LOGBOOK --- */}
function ExpeditionReviewsLogbook({ destination }: { destination: any }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Captain Marcus Vance',
      role: 'Alpine High-Altitude Guide',
      badge: 'VERIFIED SUMMIT 2025',
      rating: 5,
      date: 'May 14, 2025',
      title: 'Uncompromising wilderness test. Flawless logistical route.',
      comment: 'The terrain demands absolute respect. Carrying 25kg gear over scree slopes requires proper acclimatization. The telemetry metrics on this portal were spot on!',
      helpful: 42
    },
    {
      id: 2,
      author: 'Elena Rostova',
      role: 'Solo Wilderness Photographer',
      badge: 'TRAIL COMPLETED',
      rating: 5,
      date: 'April 22, 2025',
      title: 'Untouched photographic paradise. Be prepared for rapid weather shifts.',
      comment: 'The lighting at dawn across the high pass is unearthly. Make sure to pack extra thermal battery covers as extreme cold drains equipment fast.',
      helpful: 29
    },
    {
      id: 3,
      author: 'Dr. Rahul Chowdhury',
      role: 'Tropical Biologist',
      badge: 'EXPEDITION LEADER',
      rating: 4,
      date: 'March 10, 2025',
      title: 'Rich biodiversity and challenging river crossings.',
      comment: 'Dense jungle canopy and tidal fluctuations demand experienced local guides. An unforgettable frontier experience for serious adventurers.',
      helpful: 18
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    role: 'Explorer',
    title: '',
    comment: '',
    rating: 5
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.title) return;

    setReviews([
      {
        id: Date.now(),
        author: newReview.author,
        role: newReview.role,
        badge: 'VERIFIED EXPLORER',
        rating: newReview.rating,
        date: 'Just now',
        title: newReview.title,
        comment: newReview.comment,
        helpful: 1
      },
      ...reviews
    ]);

    setIsModalOpen(false);
    setNewReview({ author: '', role: 'Explorer', title: '', comment: '', rating: 5 });
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                FIELD REPORTS & VERIFIED EXPEDITION LOGS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Explorer Field Reviews
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Logbook Entry</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-bg-panel border border-text-main/10 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-amber-500' : 'text-text-main/20'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 font-bold uppercase">
                    {rev.badge}
                  </span>
                </div>

                <h4 className="text-base font-serif italic font-bold text-text-main mb-2">
                  "{rev.title}"
                </h4>

                <p className="text-xs font-sans text-text-main/80 leading-relaxed mb-6">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-text-main/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-text-main block">{rev.author}</span>
                  <span className="text-[10px] font-mono text-text-main/50 block">{rev.role} • {rev.date}</span>
                </div>

                <button
                  onClick={() => {
                    setReviews(reviews.map(r => r.id === rev.id ? { ...r, helpful: r.helpful + 1 } : r));
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-text-main/60 hover:text-accent transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{rev.helpful}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-panel border border-text-main/20 p-8 max-w-lg w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-text-main/60 hover:text-accent p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block mb-1">
                    FIELD LOG DISPATCH
                  </span>
                  <h3 className="text-2xl font-serif italic font-bold text-text-main">
                    Submit Explorer Logbook Entry
                  </h3>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Your Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. David Vance"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-sans text-text-main focus:border-accent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Explorer Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Mountaineer, Trekker"
                      value={newReview.role}
                      onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                      className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-sans text-text-main focus:border-accent outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-mono text-text-main focus:border-accent outline-none cursor-pointer"
                    >
                      <option value={5}>5 ★★★★★ (Exceptional)</option>
                      <option value={4}>4 ★★★★☆ (Strong Trail)</option>
                      <option value={3}>3 ★★★☆☆ (Moderate)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Headline Summary</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. High winds at camp 2, but summit view is unequaled!"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-sans text-text-main focus:border-accent outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-text-main font-bold uppercase block mb-1">Detailed Field Log</label>
                  <textarea
                    rows={3}
                    placeholder="Share essential logistical tips, gear insights, and trail conditions..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-bg-base border border-text-main/20 p-2.5 text-xs font-sans text-text-main focus:border-accent outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer mt-2"
                >
                  Publish Log Entry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

{/* --- EMERGENCY RANGER & SOS HOTLINE STATION --- */}
function EmergencyRangerHotline({ destination }: { destination: any }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getHotlines = (dest: any) => {
    return [
      {
        service: 'High-Altitude Air Rescue Dispatch',
        number: '+880 1819-223344 / VHF Ch 16',
        desc: 'Direct 24/7 Helicopter Evacuation & Search Mission HQ'
      },
      {
        service: `${dest.name} Local Ranger Station`,
        number: '+880 1711-998877',
        desc: 'Ground patrol dispatch and weather hazard reporting base'
      },
      {
        service: 'Frontier SOS Satellite Beacon Frequency',
        number: '406.025 MHz (Global Cospas-Sarsat)',
        desc: 'Emergency locator transmitter frequency monitored continuously'
      }
    ];
  };

  const hotlines = getHotlines(destination);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PhoneCall className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-red-500 font-bold">
                CRITICAL SOS & SEARCH RESCUE NETWORK
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Emergency Ranger Directory
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-mono text-red-500 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>DIRECT SAT-LINK STANDBY ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotlines.map((h, i) => (
            <div key={i} className="bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between hover:border-red-500/40 transition-colors">
              <div>
                <span className="text-[10px] font-mono uppercase text-text-main/50 font-bold block mb-1">
                  SERVICE CHANNEL #{i + 1}
                </span>
                <h4 className="text-lg font-bold font-mono text-text-main mb-2">
                  {h.service}
                </h4>
                <p className="text-xs font-sans text-text-main/70 leading-relaxed mb-6">
                  {h.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-text-main/10 flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-accent">{h.number}</span>
                <button
                  onClick={() => copyToClipboard(h.number, i)}
                  className="px-3 py-1 bg-bg-panel border border-text-main/20 text-[10px] font-mono font-bold text-text-main hover:border-accent transition-colors cursor-pointer"
                >
                  {copiedIndex === i ? 'COPIED!' : 'COPY SOS'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

{/* --- EXPEDITION MATCHMAKER & QUIZ --- */}
function ExpeditionMatchmaker({ destinations, onSelect }: { destinations: any[]; onSelect: (index: number) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    experience: 'intermediate',
    terrain: 'mountain',
    duration: 'week'
  });
  const [matchedIndex, setMatchedIndex] = useState<number | null>(null);

  const calculateMatch = () => {
    let bestIdx = 0;
    if (answers.terrain === 'mountain') {
      bestIdx = destinations.findIndex(d => d.type === 'mountain');
    } else if (answers.terrain === 'forest') {
      bestIdx = destinations.findIndex(d => d.type === 'forest');
    } else if (answers.terrain === 'valley') {
      bestIdx = destinations.findIndex(d => d.type === 'valley');
    } else {
      bestIdx = destinations.findIndex(d => d.type === 'beach');
    }
    if (bestIdx === -1) bestIdx = 0;
    setMatchedIndex(bestIdx);
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                INTELLIGENT ROUTE MATCHMAKER
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Find Your Ideal Expedition
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            Interactive Diagnostic Engine
          </span>
        </div>

        <div className="bg-bg-panel border border-text-main/10 p-6 md:p-10 max-w-3xl mx-auto">
          {matchedIndex === null ? (
            <div className="space-y-8">
              {step === 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-2">STEP 1 OF 3</span>
                  <h3 className="text-xl font-serif italic font-bold text-text-main mb-4">
                    What is your wilderness and high-altitude experience level?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'beginner', title: 'Beginner / Day-Trekker', desc: 'No technical gear or oxygen experience' },
                      { id: 'intermediate', title: 'Seasoned Hiker', desc: 'Comfortable with 15km+ multi-day backpacks' },
                      { id: 'expert', title: 'Alpine Mountaineer', desc: 'Crevasse rescue & ice crampon certified' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setAnswers({ ...answers, experience: opt.id });
                          setStep(1);
                        }}
                        className={`p-4 border text-left cursor-pointer transition-all ${
                          answers.experience === opt.id
                            ? 'border-accent bg-accent/10'
                            : 'border-text-main/10 bg-bg-base hover:border-text-main/30'
                        }`}
                      >
                        <span className="text-xs font-bold font-mono block text-text-main">{opt.title}</span>
                        <span className="text-[10px] text-text-main/60 block mt-1">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-2">STEP 2 OF 3</span>
                  <h3 className="text-xl font-serif italic font-bold text-text-main mb-4">
                    Which frontier climate & biosphere calls to you?
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'mountain', title: 'Himalayan Glaciers', icon: Mountain },
                      { id: 'forest', title: 'Sundarbans Mangrove', icon: TreePine },
                      { id: 'valley', title: 'Rainforest Valleys', icon: Compass },
                      { id: 'beach', title: 'Ocean Coral Reefs', icon: Waves }
                    ].map((opt) => {
                      const IconComp = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setAnswers({ ...answers, terrain: opt.id });
                            setStep(2);
                          }}
                          className={`p-4 border text-center cursor-pointer transition-all ${
                            answers.terrain === opt.id
                              ? 'border-accent bg-accent/10'
                              : 'border-text-main/10 bg-bg-base hover:border-text-main/30'
                          }`}
                        >
                          <IconComp className="w-6 h-6 text-accent mx-auto mb-2" />
                          <span className="text-xs font-bold font-mono block text-text-main">{opt.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-2">STEP 3 OF 3</span>
                  <h3 className="text-xl font-serif italic font-bold text-text-main mb-4">
                    Target Expedition Duration
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'weekend', title: '3-5 Days', desc: 'Short escape' },
                      { id: 'week', title: '7-12 Days', desc: 'Standard trek' },
                      { id: 'epic', title: '14+ Days', desc: 'Full alpine siege' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setAnswers({ ...answers, duration: opt.id });
                          calculateMatch();
                        }}
                        className="p-4 border border-text-main/10 bg-bg-base hover:border-accent hover:bg-accent/10 text-left cursor-pointer transition-all"
                      >
                        <span className="text-xs font-bold font-mono block text-text-main">{opt.title}</span>
                        <span className="text-[10px] text-text-main/60 block mt-1">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold bg-accent/10 px-3 py-1 border border-accent/20">
                100% COMPATIBILITY MATCH FOUND
              </span>

              <h3 className="text-3xl font-serif italic font-bold text-text-main">
                {destinations[matchedIndex].name}
              </h3>

              <p className="text-xs font-sans text-text-main/80 max-w-md mx-auto leading-relaxed">
                Based on your preference for <strong className="text-accent">{answers.terrain}</strong> biospheres and <strong className="text-text-main">{answers.experience}</strong> experience level, we recommend exploring this frontier.
              </p>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => {
                    onSelect(matchedIndex);
                  }}
                  className="px-6 py-3 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 cursor-pointer shadow-lg"
                >
                  Load {destinations[matchedIndex].name} View
                </button>
                <button
                  onClick={() => {
                    setMatchedIndex(null);
                    setStep(0);
                  }}
                  className="px-4 py-3 bg-bg-base border border-text-main/20 text-xs font-mono text-text-main hover:border-accent cursor-pointer"
                >
                  Reset Diagnostic
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

{/* --- BACKPACK PAYLOAD & WEIGHT CALCULATOR --- */}
function BackpackWeightCalculator({ destination }: { destination: any }) {
  const [items, setItems] = useState([
    { id: 1, name: '4-Season expedition tent', weightKg: 2.8, packed: true },
    { id: 2, name: 'Down sleeping bag (-20°C)', weightKg: 1.6, packed: true },
    { id: 3, name: 'Multi-fuel stove & fuel canister', weightKg: 1.1, packed: true },
    { id: 4, name: 'High-altitude oxygen canister', weightKg: 3.2, packed: destination.type === 'mountain' },
    { id: 5, name: 'Technical ice axes (Pair)', weightKg: 1.2, packed: destination.type === 'mountain' },
    { id: 6, name: 'First aid & trauma kit', weightKg: 0.8, packed: true },
    { id: 7, name: 'Freeze-dried provisions (5 days)', weightKg: 3.5, packed: true },
    { id: 8, name: 'Hydration bladder & water filter', weightKg: 2.5, packed: true }
  ]);

  const totalWeight = items.reduce((sum, item) => sum + (item.packed ? item.weightKg : 0), 0);
  const status = totalWeight < 10 ? 'Lightweight Fast-Pack' : totalWeight < 16 ? 'Optimal Alpine Payload' : 'Heavy Expedition Burden';

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Backpack className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                PAYLOAD & MASS DISTRIBUTION CALCULATOR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Backpack Mass Index
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-text-main/60 uppercase font-bold">Total Mass:</span>
            <span className="text-2xl font-black font-mono text-accent">{totalWeight.toFixed(1)} kg</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-bg-base border border-text-main/10 p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase text-text-main/50 font-bold block mb-2">
              SELECT RUCKSACK EQUIPMENT LIST
            </span>
            {items.map((it) => (
              <label
                key={it.id}
                onClick={() => setItems(items.map(i => i.id === it.id ? { ...i, packed: !i.packed } : i))}
                className="flex items-center justify-between p-3 border border-text-main/10 bg-bg-panel cursor-pointer hover:border-text-main/30"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={it.packed}
                    onChange={() => {}}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-sans font-semibold text-text-main">{it.name}</span>
                </div>
                <span className="text-xs font-mono text-accent font-bold">+{it.weightKg} kg</span>
              </label>
            ))}
          </div>

          <div className="lg:col-span-4 bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-1">
                ANALYSIS & ERGONOMICS
              </span>
              <h3 className="text-xl font-mono font-bold text-text-main mb-4">
                {status}
              </h3>
              <p className="text-xs font-sans text-text-main/80 leading-relaxed mb-6">
                Carrying {totalWeight.toFixed(1)}kg across steep inclines increases daily calorie burn by ~35%. Keep heavy items centered close to your lower spine.
              </p>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/20 text-accent font-mono text-xs">
              <span className="font-bold block mb-1">RECOMMENDED HYDRATION:</span>
              <span>{(totalWeight * 0.15 + 2).toFixed(1)} Liters / Day</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- GPS TOPO GRID & COORDINATE CONVERTER --- */}
function GpsCoordinatesGrid({ destination }: { destination: any }) {
  const [coordFormat, setCoordFormat] = useState<'DMS' | 'DEC' | 'UTM'>('DMS');

  const getCoordinates = () => {
    const lat = destination?.lat ?? destination?.coordinates?.lat ?? 27.9881;
    const lng = destination?.lng ?? destination?.coordinates?.lng ?? 86.9250;
    if (coordFormat === 'DMS') return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
    if (coordFormat === 'DEC') return `${lat}° N, ${lng}° E`;
    return `45Q ${Math.round(lng * 10000)}m E ${Math.round(lat * 100000)}m N`;
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crosshair className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                GEOSPATIAL TOPOGRAPHIC GIS MATRIX
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              GPS Coordinates & Grid
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-panel p-1 border border-text-main/10">
            {(['DMS', 'DEC', 'UTM'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setCoordFormat(fmt)}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  coordFormat === fmt ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-panel border border-text-main/10 p-8 font-mono flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] text-text-main/50 uppercase block mb-1">PRECISION GEOGRAPHIC LOCATION ({coordFormat})</span>
            <span className="text-3xl font-black text-accent">{getCoordinates()}</span>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-accent text-bg-base font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 cursor-pointer"
          >
            <Map className="w-4 h-4" />
            <span>Open High-Res Satellite View</span>
          </a>
        </div>
      </div>
    </section>
  );
}

{/* --- ACCLIMATIZATION & ALTITUDE SICKNESS RISK SIMULATOR --- */}
function AcclimatizationRiskSimulator({ destination }: { destination: any }) {
  const [ascentRate, setAscentRate] = useState(500); // meters per day
  const [restDays, setRestDays] = useState(2);
  const [priorAltitudeExp, setPriorAltitudeExp] = useState(true);
  const [restingHr, setRestingHr] = useState(72);

  // Peak altitude calculation
  const isHighAltitude = destination.type === 'mountain';
  const peakAlt = isHighAltitude ? 6189 : destination.type === 'forest' ? 12 : 920;

  // AMS Risk Score Calculation
  const calculateAmsRisk = () => {
    if (!isHighAltitude) return { score: 5, label: 'Negligible (Sea Level / Low Altitude)', color: 'text-emerald-500' };
    
    let risk = 20;
    if (ascentRate > 600) risk += 35;
    if (ascentRate > 400) risk += 15;
    if (restDays < 2) risk += 30;
    if (!priorAltitudeExp) risk += 20;
    if (restingHr > 80) risk += 10;

    if (risk < 30) return { score: risk, label: 'Low AMS Risk (Safe Protocol)', color: 'text-emerald-500' };
    if (risk < 60) return { score: risk, label: 'Moderate AMS Risk (Monitor Closely)', color: 'text-amber-500' };
    return { score: risk, label: 'High AMS Risk (Mandatory Rest Days Needed)', color: 'text-red-500' };
  };

  const ams = calculateAmsRisk();

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <HeartPulse className="w-5 h-5 text-accent animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                PHYSIOLOGICAL ACCLIMATIZATION MODEL
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              High-Altitude AMS Risk Engine
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-base px-4 py-2 border border-text-main/10 font-mono text-xs">
            <ActivityIcon className="w-4 h-4 text-accent" />
            <span>Target Peak: <strong className="text-accent">{peakAlt}m</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-7 bg-bg-base border border-text-main/10 p-6 md:p-8 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="font-bold text-text-main uppercase">Daily Ascent Velocity</span>
                <span className="text-accent font-bold">{ascentRate} meters / day</span>
              </div>
              <input
                type="range"
                min={200}
                max={1000}
                step={50}
                value={ascentRate}
                onChange={(e) => setAscentRate(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-text-main/50 block mt-1">Recommended safe rate: ≤ 500m / day above 3,000m</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="font-bold text-text-main uppercase">Mandatory Acclimatization Rest Days</span>
                <span className="text-accent font-bold">{restDays} Days Scheduled</span>
              </div>
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={restDays}
                onChange={(e) => setRestDays(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[11px] font-mono text-text-main/70 uppercase block mb-1">Resting Pulse Rate (BPM)</label>
                <input
                  type="number"
                  value={restingHr}
                  onChange={(e) => setRestingHr(parseInt(e.target.value) || 70)}
                  className="w-full bg-bg-panel border border-text-main/20 p-2 text-xs font-mono text-text-main focus:border-accent outline-none"
                />
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={() => setPriorAltitudeExp(!priorAltitudeExp)}
                  className={`w-full p-2.5 border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    priorAltitudeExp ? 'border-accent bg-accent/10 text-accent' : 'border-text-main/20 text-text-main/60'
                  }`}
                >
                  {priorAltitudeExp ? '✓ Prior High Altitude Exp' : '✕ First Time >3000m'}
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Display */}
          <div className="lg:col-span-5 bg-bg-base border border-text-main/10 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-main/50 font-bold block mb-1">
                PHYSIOLOGICAL SIMULATION OUTPUT
              </span>

              <h3 className={`text-2xl font-mono font-black mb-2 ${ams.color}`}>
                {ams.label}
              </h3>

              <div className="w-full bg-text-main/10 h-3 rounded-full overflow-hidden my-4">
                <div
                  className={`h-full transition-all duration-500 ${
                    ams.score < 30 ? 'bg-emerald-500' : ams.score < 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, ams.score)}%` }}
                />
              </div>

              <div className="space-y-3 font-mono text-xs text-text-main/80 pt-2">
                <div className="flex justify-between border-b border-text-main/10 pb-1.5">
                  <span>Estimated SpO2 Saturation:</span>
                  <strong className="text-accent">{isHighAltitude ? `${Math.max(68, 98 - Math.round(peakAlt / 180))}%` : '99%'}</strong>
                </div>
                <div className="flex justify-between border-b border-text-main/10 pb-1.5">
                  <span>Hydration Protocol:</span>
                  <strong className="text-text-main">4.5 Liters / Day</strong>
                </div>
                <div className="flex justify-between border-b border-text-main/10 pb-1.5">
                  <span>Prophylactic Recommendation:</span>
                  <strong className="text-text-main">{isHighAltitude ? 'Acetazolamide (Diamox)' : 'None Needed'}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-bg-panel border border-text-main/10 text-[11px] font-mono text-text-main/70 mt-6">
              <span className="text-accent font-bold block mb-1">MEDEVAC TRIGGER PROTOCOL:</span>
              If persistent headache, pulmonary edema, or ataxia occurs above 3,500m, immediate descent of ≥ 1,000m is mandatory.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- WILDLIFE & INDIGENOUS SPECIES SPOTTER GUIDE --- */}
function WildlifeSpotterGuide({ destination }: { destination: any }) {
  const [sightingLogged, setSightingLogged] = useState<number[]>([]);

  const getSpecies = (dest: any) => {
    if (dest.type === 'mountain') {
      return [
        { id: 1, name: 'Snow Leopard (Uncia uncia)', status: 'Vulnerable / Rare', bestTime: 'Dawn / Dusk', tip: 'Scan high rock ridges with 10x42 binoculars', icon: '🐆' },
        { id: 2, name: 'Himalayan Monal Pheasant', status: 'Protected Native', bestTime: 'Early Morning', tip: 'Listen for metallic whistling calls near rhododendron trees', icon: '🦅' },
        { id: 3, name: 'Blue Sheep (Bharal)', status: 'Common Alpine', bestTime: 'Midday', tip: 'Grazes in herds along steep glacial moraines', icon: '🐐' },
        { id: 4, name: 'Red Panda (Ailurus fulgens)', status: 'Endangered', bestTime: 'Twilight', tip: 'Look in dense high-altitude bamboo understory', icon: '🦊' }
      ];
    }
    if (dest.type === 'forest') {
      return [
        { id: 1, name: 'Royal Bengal Tiger (Panthera tigris)', status: 'Critically Protected', bestTime: 'Tidal Low Tide', tip: 'Observe fresh mud pugmarks near freshwater ponds', icon: '🐅' },
        { id: 2, name: 'Irrawaddy River Dolphin', status: 'Vulnerable', bestTime: 'Morning Tide', tip: 'Watch river confluence zones near Kotka channel', icon: '🐬' },
        { id: 3, name: 'Saltwater Crocodile', status: 'Protected Apex', bestTime: 'Sunny Afternoons', tip: 'Basking on tidal mudflats during low tide', icon: '🐊' },
        { id: 4, name: 'Spotted Chital Deer', status: 'Abundant Native', bestTime: 'All Day', tip: 'Follow monkey alarm calls under Sundari canopy', icon: '🦌' }
      ];
    }
    return [
      { id: 1, name: 'Western Hoolock Gibbon', status: 'Endangered Ape', bestTime: '6:00 AM - 8:00 AM', tip: 'Listen for loud hooting vocalizations canopy tops', icon: '🐒' },
      { id: 2, name: 'Asian Elephant (Elephas maximus)', status: 'Vulnerable Migratory', bestTime: 'Dusk', tip: 'Keep safe 100m distance along bamboo corridors', icon: '🐘' },
      { id: 3, name: 'Great Indian Hornbird', status: 'Rare Canopy Bird', bestTime: 'Early Morning', tip: 'Look for massive wing beats in tea garden ficus trees', icon: '🦜' },
      { id: 4, name: 'Slow Loris (Nycticebus)', status: 'Nocturnal Arboreal', bestTime: 'Night Safari', tip: 'Use red-filtered spotlight in primary rainforest', icon: '🦉' }
    ];
  };

  const species = getSpecies(destination);

  const toggleSighting = (id: number) => {
    if (sightingLogged.includes(id)) {
      setSightingLogged(sightingLogged.filter(i => i !== id));
    } else {
      setSightingLogged([...sightingLogged, id]);
    }
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                BIODIVERSITY & INDIGENOUS FAUNA SPOTTER
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Wildlife Field Guide
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-panel px-3 py-1.5 border border-text-main/10 text-xs font-mono">
            <Eye className="w-4 h-4 text-accent" />
            <span>Logged Sightings: <strong className="text-accent">{sightingLogged.length} / {species.length}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {species.map((sp) => {
            const isLogged = sightingLogged.includes(sp.id);
            return (
              <div
                key={sp.id}
                className={`border p-6 bg-bg-panel flex flex-col justify-between transition-all ${
                  isLogged ? 'border-accent bg-accent/5' : 'border-text-main/10 hover:border-text-main/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{sp.icon}</span>
                    <span className="text-[9px] font-mono bg-bg-base border border-text-main/20 px-2 py-0.5 text-accent font-bold uppercase">
                      {sp.status}
                    </span>
                  </div>

                  <h4 className="text-base font-serif italic font-bold text-text-main mb-2">
                    {sp.name}
                  </h4>

                  <p className="text-xs font-sans text-text-main/70 leading-relaxed mb-4">
                    <strong>Tip:</strong> {sp.tip}
                  </p>
                </div>

                <div className="pt-4 border-t border-text-main/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-text-main/50 uppercase">{sp.bestTime}</span>
                  <button
                    onClick={() => toggleSighting(sp.id)}
                    className={`px-3 py-1 text-[10px] font-mono font-bold uppercase cursor-pointer border transition-colors ${
                      isLogged
                        ? 'bg-accent text-bg-base border-accent'
                        : 'bg-bg-base text-text-main border-text-main/20 hover:border-accent'
                    }`}
                  >
                    {isLogged ? '✓ LOGGED' : '+ LOG SIGHTING'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

{/* --- MANDATORY PERMITS & GOVT CHECKLIST VAULT --- */}
function PermitDocumentChecklist({ destination }: { destination: any }) {
  const [permits, setPermits] = useState([
    { id: 1, title: 'National Park Protected Area Pass', office: 'Ministry of Environment & Forests', fee: '$25 USD', status: 'Obtained' },
    { id: 2, title: 'Trekkers Information Management System (TIMS Card)', office: 'Tourism Board Authority', fee: '$20 USD', status: 'Obtained' },
    { id: 3, title: 'High Altitude Climbing Expedition Permit', office: 'Mountaineering Federation', fee: '$150 USD', status: 'Pending' },
    { id: 4, title: 'Satellite Phone & Transceiver License', office: 'Telecommunications Bureau', fee: '$35 USD', status: 'Required' }
  ]);

  const toggleStatus = (id: number) => {
    setPermits(permits.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Obtained' ? 'Pending' : p.status === 'Pending' ? 'Required' : 'Obtained';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileCheck className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                FRONTIER COMPLIANCE & PERMIT VAULT
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Mandatory Entry Clearances
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            Official Regulatory Clearance Portal
          </span>
        </div>

        <div className="bg-bg-base border border-text-main/10 p-6 md:p-8 space-y-4">
          {permits.map((p) => (
            <div
              key={p.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-text-main/10 bg-bg-panel gap-4 hover:border-text-main/30"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleStatus(p.id)}
                  className={`w-6 h-6 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                    p.status === 'Obtained' ? 'bg-emerald-500 border-emerald-500 text-bg-base' : 'border-text-main/30 bg-bg-base'
                  }`}
                >
                  {p.status === 'Obtained' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div>
                  <h4 className="text-sm font-mono font-bold text-text-main">{p.title}</h4>
                  <p className="text-[11px] font-sans text-text-main/60">{p.office} • Fee: <strong className="text-accent">{p.fee}</strong></p>
                </div>
              </div>

              <button
                onClick={() => toggleStatus(p.id)}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border cursor-pointer ${
                  p.status === 'Obtained'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                    : p.status === 'Pending'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : 'bg-red-500/10 border-red-500/30 text-red-500'
                }`}
              >
                STATUS: {p.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

{/* --- EXPEDITION BRIEFING & PRINTABLE EXPORTER --- */}
function ExpeditionPdfExporter({ destination }: { destination: any }) {
  const [showBriefingModal, setShowBriefingModal] = useState(false);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-16 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold bg-accent/10 px-3 py-1 border border-accent/20">
          OFFICIAL DISPATCH DOSSIER
        </span>

        <h2 className="text-3xl md:text-5xl font-serif italic font-bold text-text-main">
          Export Full Expedition Itinerary & Briefing
        </h2>

        <p className="text-xs font-sans text-text-main/70 max-w-xl mx-auto leading-relaxed">
          Generate an offline-ready printable dossier formatted with complete route coordinates, emergency contact frequencies, gear manifests, and trail topography.
        </p>

        <button
          onClick={() => setShowBriefingModal(true)}
          className="px-8 py-4 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-3 mx-auto cursor-pointer shadow-xl"
        >
          <Printer className="w-5 h-5" />
          <span>Generate Printable Expedition Dossier</span>
        </button>
      </div>

      {/* Briefing Modal */}
      <AnimatePresence>
        {showBriefingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowBriefingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-bg-base border border-text-main/30 p-8 max-w-3xl w-full text-left space-y-6 shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-text-main/20 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-bold block">FRONTIER EXPEDITION DISPATCH DOSSIER</span>
                  <h3 className="text-2xl font-black uppercase text-text-main">{destination.name} Briefing</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-accent text-bg-base font-mono text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Dossier</span>
                  </button>

                  <button
                    onClick={() => setShowBriefingModal(false)}
                    className="text-text-main/60 hover:text-accent p-1 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs text-text-main">
                <div className="grid grid-cols-2 gap-4 p-4 bg-bg-panel border border-text-main/10">
                  <div><span>DESTINATION:</span> <strong className="text-accent">{destination.name}</strong></div>
                  <div><span>LOCATION:</span> <strong>{destination.location}</strong></div>
                  <div><span>ELEVATION:</span> <strong>{destination.elevation}</strong></div>
                  <div><span>DIFFICULTY:</span> <strong className="text-accent">{destination.difficulty}</strong></div>
                </div>

                <div>
                  <h4 className="font-bold uppercase text-accent mb-1">ROUTE OVERVIEW:</h4>
                  <p className="font-sans text-text-main/80 leading-relaxed text-xs">{destination.description}</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase text-accent mb-1">EMERGENCY SOS FREQUENCY:</h4>
                  <p className="text-xs text-text-main/80">Air Rescue: +880 1819-223344 | VHF Channel 16 | Sat-Beacon 406.025 MHz</p>
                </div>

                <div className="pt-4 border-t border-text-main/10 text-[10px] text-text-main/50 text-center">
                  CONFIDENTIAL EXPEDITION DISPATCH • GENERATED LIVE VIA FRONTIER ADVENTURES PLATFORM
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

{/* --- SATELLITE DOPPLER RADAR & CLOUD COVER SIMULATOR --- */}
function SatelliteRadarSimulation({ destination }: { destination: any }) {
  const [radarLayer, setRadarLayer] = useState<'precipitation' | 'wind' | 'clouds'>('precipitation');
  const [isSweeping, setIsSweeping] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Radar className="w-5 h-5 text-accent animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                REAL-TIME DOPPLER SATELLITE RADAR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Atmospheric Cloud & Radar Overlay
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-bg-base p-1 border border-text-main/10">
              <button
                onClick={() => setRadarLayer('precipitation')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  radarLayer === 'precipitation' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                PRECIPITATION
              </button>
              <button
                onClick={() => setRadarLayer('clouds')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  radarLayer === 'clouds' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                CLOUD DENSITY
              </button>
              <button
                onClick={() => setRadarLayer('wind')}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  radarLayer === 'wind' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                WIND VECTORS
              </button>
            </div>

            <button
              onClick={() => setIsSweeping(!isSweeping)}
              className="px-3 py-1.5 bg-bg-base border border-text-main/20 text-xs font-mono font-bold text-text-main hover:border-accent cursor-pointer"
            >
              {isSweeping ? 'PAUSE DOPPLER' : 'RESUME DOPPLER'}
            </button>
          </div>
        </div>

        <div className="relative border border-text-main/10 bg-black h-96 overflow-hidden rounded-none shadow-2xl flex items-center justify-center">
          {/* Background Map Graphic Simulation */}
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-700"
            style={{
              backgroundImage: `url(${destination.image})`,
              transform: `scale(${zoomLevel})`
            }}
          />

          {/* Radar Radar Grid Lines */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[300px] h-[300px] border border-accent/20 rounded-full flex items-center justify-center">
              <div className="w-[200px] h-[200px] border border-accent/20 rounded-full flex items-center justify-center">
                <div className="w-[100px] h-[100px] border border-accent/30 rounded-full" />
              </div>
            </div>
            <div className="absolute w-full h-[1px] bg-accent/20" />
            <div className="absolute h-full w-[1px] bg-accent/20" />
          </div>

          {/* Animated Sweeping Radar Scanner */}
          {isSweeping && (
            <div
              className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-spin"
              style={{
                animationDuration: '4s',
                background: 'conic-gradient(from 0deg, rgba(var(--color-accent-rgb, 16, 185, 129), 0.3) 0deg, transparent 60deg, transparent 360deg)'
              }}
            />
          )}

          {/* Layer-based Weather Particles Visual */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {radarLayer === 'precipitation' && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-full blur-sm animate-pulse w-48 h-48" />
            )}
            {radarLayer === 'clouds' && (
              <div className="p-4 bg-slate-300/20 border border-slate-300/40 rounded-full blur-md animate-pulse w-64 h-64" />
            )}
            {radarLayer === 'wind' && (
              <div className="p-4 bg-cyan-400/20 border border-cyan-400/40 rounded-full blur-sm animate-ping w-40 h-40" />
            )}
          </div>

          {/* Overlay Coordinates & Status Callout */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md p-3 border border-accent/30 text-accent font-mono text-[10px] space-y-1">
            <div className="font-bold uppercase tracking-wider">SATELLITE FREQ: 14.225 GHz</div>
            <div>STATUS: LIVE ORBITAL FEED</div>
            <div>COVERAGE: {destination.name} Sector</div>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md p-2 border border-text-main/20 flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
              className="w-7 h-7 bg-text-main/10 text-white font-mono text-xs hover:bg-accent hover:text-black font-bold flex items-center justify-center cursor-pointer"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.2))}
              className="w-7 h-7 bg-text-main/10 text-white font-mono text-xs hover:bg-accent hover:text-black font-bold flex items-center justify-center cursor-pointer"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- INTERACTIVE 3D TERRAIN FLYOVER SIMULATOR --- */}
function Terrain3DFlyoverViewer({ destination }: { destination: any }) {
  const [wireframe, setWireframe] = useState(false);
  const [rotation, setRotation] = useState(25);
  const [isFlying, setIsFlying] = useState(false);
  const flyIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (isFlying) {
      flyIntervalRef.current = setInterval(() => {
        setRotation(prev => (prev + 2) % 360);
      }, 50);
    } else {
      if (flyIntervalRef.current) clearInterval(flyIntervalRef.current);
    }
    return () => {
      if (flyIntervalRef.current) clearInterval(flyIntervalRef.current);
    };
  }, [isFlying]);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                SIMULATED 3D TOPOGRAPHIC MESH
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              3D Terrain Flyover View
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`px-4 py-2 border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                wireframe ? 'bg-accent text-bg-base border-accent' : 'bg-bg-panel text-text-main border-text-main/20'
              }`}
            >
              {wireframe ? 'WIREFRAME MESH' : 'TEXTURED SURFACE'}
            </button>

            <button
              onClick={() => setIsFlying(!isFlying)}
              className="px-4 py-2 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 cursor-pointer shadow-md"
            >
              {isFlying ? 'PAUSE 3D ORBIT' : 'START AUTOMATED ORBIT'}
            </button>
          </div>
        </div>

        <div className="bg-bg-panel border border-text-main/10 p-6 md:p-12 relative flex flex-col items-center justify-center min-h-[380px] overflow-hidden">
          {/* 3D Perspective Grid Box */}
          <div
            className="w-full max-w-xl h-64 border border-accent/30 relative transition-transform duration-300 ease-out flex items-center justify-center shadow-2xl"
            style={{
              perspective: '800px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              className={`w-full h-full transition-all duration-300 ${
                wireframe ? 'bg-transparent border-2 border-dashed border-accent/60' : 'bg-bg-base border border-text-main/20'
              }`}
              style={{
                transform: `rotateX(55deg) rotateZ(${rotation}deg)`,
                boxShadow: wireframe ? '0 0 30px rgba(16,185,129,0.2)' : 'none'
              }}
            >
              {/* Simulated mesh wireframe grid */}
              <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0">
                {[...Array(64)].map((_, i) => (
                  <div
                    key={i}
                    className={`border text-[8px] font-mono flex items-center justify-center transition-opacity ${
                      wireframe ? 'border-accent/30 text-accent/40' : 'border-text-main/5 text-text-main/20'
                    }`}
                  >
                    {(i * 120) % 900}m
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Rotation Slider */}
          <div className="w-full max-w-md mt-8 flex items-center gap-4">
            <span className="text-xs font-mono text-text-main/60 uppercase font-bold">Camera Angle:</span>
            <input
              type="range"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-accent w-10">{rotation}°</span>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- WILDERNESS SURVIVAL & FIRST-AID HANDBOOK --- */}
function WildernessSurvivalHandbook() {
  const [selectedTopic, setSelectedTopic] = useState<number>(0);

  const topics = [
    {
      title: 'High-Altitude Hypothermia & Frostbite Protocol',
      icon: LifeBuoy,
      urgent: 'IMMEDIATE THERMAL PROTECTION',
      steps: [
        'Move victim out of wind into tent or snow cave shelter.',
        'Remove wet clothing and replace with dry down layers.',
        'Apply passive rewarming with emergency warm water bottles near femoral artery.',
        'Never rub frostbitten skin; thaw gently in 37°C–39°C water.'
      ]
    },
    {
      title: 'Bengal Tiger & Predator Avoidance Protocol',
      icon: Shield,
      urgent: 'NON-AGGRESSIVE DEFENSIVE STANCE',
      steps: [
        'Never turn your back or sprint; retreat slowly facing the animal.',
        'Raise arms and trek poles above head to maximize perceived height.',
        'Speak in low, calm, assertive tones.',
        'Carry and deploy air-horns or flare stick if animal approaches within 15 meters.'
      ]
    },
    {
      title: 'Rapid Glacial River Fording',
      icon: Waves,
      urgent: 'HYDRODYNAMIC CROSSING SAFETY',
      steps: [
        'Unbuckle backpack waist strap before stepping into fast currents.',
        'Use a tripod stance with two trek poles planted upstream.',
        'Cross diagonally downstream towards calm eddy banks.',
        'Never attempt crossing if water line rises above thigh height.'
      ]
    },
    {
      title: 'Emergency Ground-to-Air Signaling',
      icon: Radio,
      urgent: 'SATELLITE & HELICOPTER RESCUE',
      steps: [
        'Construct a large 3x3 meter "V" or "X" symbol using dark rocks or logs on open snow/grass.',
        'Ignite green pine boughs for thick white smoke signals during daylight.',
        'Flash signal mirror directly at aircraft cockpit at 3-second intervals.',
        'Signal SOS with strobe light: 3 short, 3 long, 3 short flashes.'
      ]
    }
  ];

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                OFFLINE WILDERNESS FIRST-AID & SURVIVAL MANUAL
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Frontier Survival Handbook
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            Verified Emergency Response Field Guide
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Topic selection navigation */}
          <div className="lg:col-span-5 space-y-3">
            {topics.map((tp, idx) => {
              const IconComp = tp.icon;
              const isSelected = selectedTopic === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTopic(idx)}
                  className={`w-full p-4 border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-accent/10 shadow-md'
                      : 'border-text-main/10 bg-bg-base hover:border-text-main/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-text-main/60'}`} />
                    <span className="text-xs font-mono font-bold text-text-main">{tp.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-accent' : 'text-text-main/40'}`} />
                </button>
              );
            })}
          </div>

          {/* Detailed step breakdown */}
          <div className="lg:col-span-7 bg-bg-base border border-text-main/10 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold bg-accent/10 px-3 py-1 border border-accent/20 inline-block mb-3">
                {topics[selectedTopic].urgent}
              </span>

              <h3 className="text-2xl font-serif italic font-bold text-text-main mb-6">
                {topics[selectedTopic].title}
              </h3>

              <div className="space-y-4">
                {topics[selectedTopic].steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-bg-panel border border-text-main/10">
                    <span className="w-6 h-6 rounded-full bg-accent text-bg-base font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-xs font-sans text-text-main/90 leading-relaxed pt-0.5">
                      {st}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-text-main/10 text-[10px] font-mono text-text-main/50 flex items-center justify-between">
              <span>WILDERNESS FIRST RESPONDER STANDARDS</span>
              <span>REV 2026.4</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- MULTI-CURRENCY EXPENSE GROUP SPLITTER --- */}
function ExpenseGroupSplitter() {
  const [currency, setCurrency] = useState<'USD' | 'BDT' | 'NPR'>('USD');
  const [members, setMembers] = useState(['David (Leader)', 'Elena', 'Rahul']);
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Permit & Park Entrance Fees', amount: 320, paidBy: 'David (Leader)' },
    { id: 2, title: 'Porter & Mule Team Transport', amount: 450, paidBy: 'Elena' },
    { id: 3, title: 'High Altitude Rations & Gas Canisters', amount: 180, paidBy: 'Rahul' }
  ]);

  const currencySymbols = { USD: '$', BDT: '৳', NPR: 'NRs ' };
  const rates = { USD: 1, BDT: 118, NPR: 133 };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = totalAmount / members.length;

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                EXPEDITION GROUP EXPENSE CALCULATOR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Group Expense Splitter
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-panel p-1 border border-text-main/10">
            {(['USD', 'BDT', 'NPR'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  currency === curr ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Expenses list */}
          <div className="lg:col-span-8 bg-bg-panel border border-text-main/10 p-6 space-y-4">
            <span className="text-[10px] font-mono uppercase text-text-main/50 font-bold block mb-2">
              ITEMIZED EXPEDITION EXPENSES
            </span>

            {expenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3.5 bg-bg-base border border-text-main/10">
                <div>
                  <h4 className="text-xs font-mono font-bold text-text-main">{exp.title}</h4>
                  <span className="text-[10px] font-mono text-text-main/60 block">Paid by: {exp.paidBy}</span>
                </div>
                <span className="text-sm font-mono font-bold text-accent">
                  {currencySymbols[currency]} Math.round(exp.amount * rates[currency])
                </span>
              </div>
            ))}
          </div>

          {/* Breakdown & Share Summary */}
          <div className="lg:col-span-4 bg-bg-panel border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-1">
                PER-PERSON EQUAL BALANCE
              </span>

              <h3 className="text-3xl font-mono font-black text-text-main mb-2">
                {currencySymbols[currency]}{Math.round(perPerson * rates[currency])}
              </h3>

              <p className="text-xs font-sans text-text-main/70 mb-6">
                Total expedition pooled cost: <strong>{currencySymbols[currency]}{Math.round(totalAmount * rates[currency])}</strong> split across {members.length} team members.
              </p>
            </div>

            <div className="p-4 bg-bg-base border border-text-main/10 space-y-2 text-xs font-mono">
              <span className="text-[10px] text-accent uppercase font-bold block mb-1">INDIVIDUAL SETTLEMENT STATUS:</span>
              {members.map((m, idx) => {
                const paid = expenses.filter(e => e.paidBy === m).reduce((s, e) => s + e.amount, 0);
                const diff = paid - perPerson;
                return (
                  <div key={idx} className="flex justify-between border-b border-text-main/10 pb-1">
                    <span>{m}:</span>
                    <span className={diff >= 0 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                      {diff >= 0 ? `+${currencySymbols[currency]}${Math.round(diff * rates[currency])}` : `-${currencySymbols[currency]}${Math.abs(Math.round(diff * rates[currency]))}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- SOLAR, LUNAR & TIDAL ASTRONOMY CLOCK --- */}
function SolarLunarTideCalculator({ destination }: { destination: any }) {
  const isMangrove = destination.type === 'forest';

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sun className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                ASTRONOMICAL & TIDAL TIMING MATRIX
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Solar, Lunar & Tide Clock
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            Optimal Light & Navigational Windows
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Sunrise className="w-6 h-6 text-amber-500" />
                <span className="text-[10px] font-mono text-accent uppercase font-bold">GOLDEN HOUR</span>
              </div>
              <h4 className="text-xs font-mono uppercase text-text-main/60 mb-1">Dawn First Light</h4>
              <span className="text-2xl font-black font-mono text-text-main">05:22 AM</span>
            </div>
            <span className="text-[10px] font-mono text-text-main/50 block mt-4">Ideal start time for ridge ascents</span>
          </div>

          <div className="bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Sunset className="w-6 h-6 text-orange-500" />
                <span className="text-[10px] font-mono text-amber-500 uppercase font-bold">CAMP DEADLINE</span>
              </div>
              <h4 className="text-xs font-mono uppercase text-text-main/60 mb-1">Sunset Alpine Glow</h4>
              <span className="text-2xl font-black font-mono text-text-main">06:48 PM</span>
            </div>
            <span className="text-[10px] font-mono text-text-main/50 block mt-4">Pitch tent before temperature plunge</span>
          </div>

          <div className="bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Moon className="w-6 h-6 text-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">88% ILLUMINATED</span>
              </div>
              <h4 className="text-xs font-mono uppercase text-text-main/60 mb-1">Waxing Gibbous Moon</h4>
              <span className="text-2xl font-black font-mono text-text-main">21:15 PM Rise</span>
            </div>
            <span className="text-[10px] font-mono text-text-main/50 block mt-4">Minimal headlamp power needed at night</span>
          </div>

          <div className="bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Waves className="w-6 h-6 text-emerald-500" />
                <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold">{isMangrove ? 'HIGH TIDE NAV' : 'RIVER FLOW'}</span>
              </div>
              <h4 className="text-xs font-mono uppercase text-text-main/60 mb-1">{isMangrove ? 'Tidal Waterway Peak' : 'Peak Melt Stream Flow'}</h4>
              <span className="text-2xl font-black font-mono text-text-main">{isMangrove ? '11:40 AM (+2.8m)' : '14:30 PM (High)'}</span>
            </div>
            <span className="text-[10px] font-mono text-text-main/50 block mt-4">{isMangrove ? 'Safe boat clearance over mangrove roots' : 'Ford rivers early morning when flow is lowest'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 360 PANORAMA CAMPSITE VR PREVIEWER --- */}
function CampVrPanoramaViewer({ destination }: { destination: any }) {
  const [activeSpot, setActiveSpot] = useState<'tent' | 'water' | 'cook' | 'view'>('tent');
  const [panAngle, setPanAngle] = useState(0);

  const spots = {
    tent: { title: 'Optimal 4-Season Tent Pitching Zone', desc: 'Flat, dry, wind-sheltered depression 30 meters away from dead pine branches.' },
    water: { title: 'Glacial Freshwater Melt Outlet', desc: 'Pristine flowing water source. Boil or filter with 0.1 micron ceramic filter.' },
    cook: { title: 'Cooking & Bear-Safe Food Stash', desc: 'Positioned 50m downwind from sleeping zone to prevent wildlife attraction.' },
    view: { title: '360° Alpine Ridge Lookout', desc: 'Unobstructed view of the main peak summit and valley weather systems.' }
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Maximize className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                VIRTUAL CAMPSITE INSPECTOR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              360° Campsite VR Panorama
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-panel p-1 border border-text-main/10">
            {(['tent', 'water', 'cook', 'view'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSpot(key)}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                  activeSpot === key ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="relative border border-text-main/10 h-[400px] overflow-hidden bg-black flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-60"
            style={{
              backgroundImage: `url(${destination.image})`,
              backgroundPosition: `${50 + panAngle}% center`
            }}
          />

          {/* Interactive Overlay Callout */}
          <div className="relative z-10 bg-black/80 backdrop-blur-md p-6 max-w-md border border-accent/40 text-left space-y-2">
            <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-widest block">CAMPSITE SPOT INSPECTION</span>
            <h3 className="text-lg font-mono font-bold text-white">{spots[activeSpot].title}</h3>
            <p className="text-xs font-sans text-text-main/80 leading-relaxed">{spots[activeSpot].desc}</p>
          </div>

          {/* Pan Slider */}
          <div className="absolute bottom-4 left-6 right-6 bg-black/80 backdrop-blur-md p-3 border border-text-main/20 flex items-center gap-4">
            <span className="text-[10px] font-mono text-text-main/60 uppercase font-bold shrink-0">360° Pan Angle:</span>
            <input
              type="range"
              min={-40}
              max={40}
              value={panAngle}
              onChange={(e) => setPanAngle(parseInt(e.target.value))}
              className="w-full accent-accent bg-text-main/20 h-1.5 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- HIGH ALTITUDE METABOLIC NUTRITION PLANNER --- */}
function MetabolicNutritionPlanner() {
  const [bodyWeight, setBodyWeight] = useState(72);
  const [trekDays, setTrekDays] = useState(5);
  const [tempCelsius, setTempCelsius] = useState(-10);

  const baseBmr = bodyWeight * 24;
  const trekkingBurn = 2200;
  const coldExtra = tempCelsius < 0 ? Math.abs(tempCelsius) * 45 : 0;
  const totalDailyKcal = Math.round(baseBmr + trekkingBurn + coldExtra);

  const carbsGrams = Math.round((totalDailyKcal * 0.55) / 4);
  const fatsGrams = Math.round((totalDailyKcal * 0.30) / 9);
  const proteinGrams = Math.round((totalDailyKcal * 0.15) / 4);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Utensils className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                EXPEDITION CALORIC & METABOLIC CALCULATOR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Metabolic Ration Planner
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-base px-4 py-2 border border-text-main/10 text-xs font-mono font-bold">
            <span>Daily Intake: <strong className="text-accent">{totalDailyKcal} Kcal</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-bg-base border border-text-main/10 p-6 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span>Trekker Body Weight (kg):</span>
                <strong className="text-accent">{bodyWeight} kg</strong>
              </div>
              <input
                type="range"
                min={50}
                max={110}
                value={bodyWeight}
                onChange={(e) => setBodyWeight(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span>Ambient Temperature (°C):</span>
                <strong className="text-accent">{tempCelsius}°C</strong>
              </div>
              <input
                type="range"
                min={-25}
                max={25}
                value={tempCelsius}
                onChange={(e) => setTempCelsius(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-text-main/50 block mt-1">Sub-zero temperatures burn extra calories maintaining core thermoregulation.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span>Expedition Duration:</span>
                <strong className="text-accent">{trekDays} Days</strong>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={trekDays}
                onChange={(e) => setTrekDays(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-2">OPTIMAL MACRONUTRIENT RATION DISTRIBUTION</span>
              
              <div className="grid grid-cols-3 gap-3 text-center my-4 font-mono">
                <div className="p-3 bg-bg-panel border border-text-main/10">
                  <span className="text-[10px] text-text-main/60 block">CARBS (55%)</span>
                  <span className="text-lg font-bold text-accent">{carbsGrams}g</span>
                  <span className="text-[9px] text-text-main/50 block mt-1">Fast Altitude Energy</span>
                </div>
                <div className="p-3 bg-bg-panel border border-text-main/10">
                  <span className="text-[10px] text-text-main/60 block">FATS (30%)</span>
                  <span className="text-lg font-bold text-text-main">{fatsGrams}g</span>
                  <span className="text-[9px] text-text-main/50 block mt-1">Dense Calorie Mass</span>
                </div>
                <div className="p-3 bg-bg-panel border border-text-main/10">
                  <span className="text-[10px] text-text-main/60 block">PROTEIN (15%)</span>
                  <span className="text-lg font-bold text-text-main">{proteinGrams}g</span>
                  <span className="text-[9px] text-text-main/50 block mt-1">Muscle Recovery</span>
                </div>
              </div>

              <div className="p-4 bg-bg-panel border border-text-main/10 text-xs font-mono space-y-1">
                <div className="flex justify-between"><span>TOTAL PROVISIONS MASS (DRY):</span> <strong>{(totalDailyKcal * trekDays / 4000).toFixed(1)} kg</strong></div>
                <div className="flex justify-between text-accent"><span>FREEZE-DRIED MEAL PACKS:</span> <strong>{trekDays * 3} Pouches</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- EXPEDITION FITNESS CONDITIONING PROGRAM --- */}
function FitnessReadinessTest() {
  const [stepCount, setStepCount] = useState(45);
  const [benchPress, setBenchPress] = useState('Intermediate');

  const score = stepCount > 60 ? 'Alpine Lead Climber' : stepCount > 40 ? 'High-Altitude Trekker Ready' : 'Conditioning Required';

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                PHYSICAL CONDITIONING ASSESSMENT
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Expedition Fitness Readiness
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-panel px-4 py-2 border border-text-main/10 text-xs font-mono">
            <span>Classification: <strong className="text-accent">{score}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-bg-panel border border-text-main/10 p-6 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span>Weighted Step-Ups (15kg Pack, 3 Mins):</span>
                <strong className="text-accent">{stepCount} Reps</strong>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                value={stepCount}
                onChange={(e) => setStepCount(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-bg-base border border-text-main/10 space-y-3 font-mono text-xs">
              <span className="text-[10px] text-accent font-bold uppercase block">RECOMMENDED 4-WEEK PREP ROUTINE:</span>
              <div>• 3x Weekly: Stair-Climber 45 mins with 12kg rucksack</div>
              <div>• 2x Weekly: Goblet Squats & Core Planks (3 sets x 15)</div>
              <div>• 1x Weekend: 18km outdoor zone-2 endurance hike</div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-bg-panel border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-2">CARDIOVASCULAR VO2 BENCHMARK</span>
              <h3 className="text-2xl font-serif italic font-bold text-text-main mb-3">
                Target VO2 Max: ≥ 48 mL/kg/min
              </h3>
              <p className="text-xs font-sans text-text-main/80 leading-relaxed mb-4">
                Sustained steep grade ascents with heavy payload demand strong eccentric knee stability and efficient oxygen uptake under reduced oxygen partial pressures.
              </p>
            </div>

            <div className="p-3 bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold text-center">
              ✓ PASSED STANDARD FOR 5,000M+ EXPEDITIONS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- TRAIL AUDIO JOURNAL & FIELD LOGBOOK --- */}
function TrailAudioJournal() {
  const [logs, setLogs] = useState([
    { id: 1, text: 'Cleared Basecamp 1 at 05:30 AM. Blue skies, high wind gusts on north ridge.', time: '05:30 AM', altitude: '3,850m' },
    { id: 2, text: 'Glacial stream crossing complete. Water level nominal.', time: '10:15 AM', altitude: '4,100m' }
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    setLogs([...logs, {
      id: Date.now(),
      text: newNote,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      altitude: '4,250m'
    }]);
    setNewNote('');
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Mic className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                ENCRYPTED FIELD DISPATCH LOG
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Trail Dispatch Journal
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            Live Waypoint Timestamp Log
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-bg-panel border border-text-main/10 p-6 space-y-4">
            <span className="text-[10px] font-mono uppercase text-text-main/50 font-bold block">RECORD FIELD LOG</span>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record waypoint observation, weather conditions, or team status..."
              className="w-full bg-bg-base border border-text-main/20 p-3 text-xs font-mono text-text-main focus:border-accent outline-none h-28 resize-none"
            />
            <button
              onClick={addNote}
              className="px-6 py-3 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 cursor-pointer w-full"
            >
              + Commit Entry to Field Journal
            </button>
          </div>

          <div className="lg:col-span-6 bg-bg-panel border border-text-main/10 p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-2">WAYPOINT JOURNAL ENTRIES</span>
            {logs.map((lg) => (
              <div key={lg.id} className="p-3 bg-bg-base border border-text-main/10 space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-text-main/50">
                  <span>TIMESTAMP: {lg.time}</span>
                  <span className="text-accent font-bold">ALT: {lg.altitude}</span>
                </div>
                <p className="text-xs font-sans text-text-main leading-relaxed">{lg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 1. SATELLITE SEVERE WEATHER EARLY-WARNING ALERT SYSTEM --- */}
function SatelliteWeatherAlertSystem({ destination }: { destination: any }) {
  const [alerts, setAlerts] = useState([
    { id: 1, level: 'SEVERE', title: 'High-Altitude Blizzard & Jetstream Shear Warning', area: 'Ridge > 3,800m', time: 'Valid next 18 hrs', desc: 'Gusts exceeding 85 km/h expected with visibility dropping below 10 meters. Hold position at Basecamp.' },
    { id: 2, level: 'ADVISORY', title: 'Flash Melt Surge & Torrent Creek Advisory', area: 'Glacial Valleys', time: 'Active from 14:00 PM', desc: 'Accelerated afternoon snowmelt will raise stream levels by 0.6m. Ford streams before 11:00 AM.' }
  ]);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CloudLightning className="w-5 h-5 text-red-500 animate-bounce" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-red-500 font-bold">
                SEVERE ATMOSPHERIC SATELLITE RADAR ALERTS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Severe Weather Alert Protocol
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-xs font-mono text-red-500 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>METEOROLOGICAL DEFENSE SYSTEM ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {alerts.map((al) => (
              <div
                key={al.id}
                className={`p-6 border bg-bg-base flex flex-col md:flex-row justify-between gap-4 transition-all ${
                  al.level === 'SEVERE' ? 'border-red-500/40 bg-red-500/5' : 'border-amber-500/40 bg-amber-500/5'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                      al.level === 'SEVERE' ? 'bg-red-500 text-bg-base' : 'bg-amber-500 text-bg-base'
                    }`}>
                      {al.level}
                    </span>
                    <span className="text-[10px] font-mono text-text-main/60">{al.area} • {al.time}</span>
                  </div>

                  <h4 className="text-base font-mono font-bold text-text-main">{al.title}</h4>
                  <p className="text-xs font-sans text-text-main/80 leading-relaxed">{al.desc}</p>
                </div>

                <div className="shrink-0 flex items-center">
                  <button className="px-4 py-2 border border-text-main/20 hover:border-accent text-xs font-mono font-bold uppercase text-text-main transition-colors cursor-pointer">
                    Acknowledge & Sync
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-accent font-bold block">EMERGENCY SHELTER MATRIX</span>
              <div className="p-3 bg-bg-panel border border-text-main/10 font-mono text-xs">
                <span className="text-text-main/50 block text-[10px]">NEAREST EMERGENCY BUNKER:</span>
                <strong className="text-accent">High Camp Emergency Hut #02 (2.4 km)</strong>
              </div>
              <div className="p-3 bg-bg-panel border border-text-main/10 font-mono text-xs">
                <span className="text-text-main/50 block text-[10px]">SATELLITE BEACON FREQ:</span>
                <strong className="text-text-main">406 MHz Emergency Band</strong>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-text-main/10 text-[10px] font-mono text-text-main/50">
              UPDATED LIVE FROM NOAA & LOCAL MET-OFFICE STATIONS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 2. OFFLINE TRAIL MAP & GPX / KML WAYPOINT EXPORTER --- */}
function GpxKmlExporterMap({ destination }: { destination: any }) {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const exportGpx = (type: 'GPX' | 'KML' | 'GEOJSON') => {
    const data = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Frontier Adventures">
  <trk><name>${destination.name} Full Route</name></trk>
</gpx>`;
    const blob = new Blob([data], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${destination.id}-route.${type.toLowerCase()}`;
    a.click();
    setDownloaded(type);
    setTimeout(() => setDownloaded(null), 3000);
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileDown className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                GPS NAVIGATION & OFFLINE MAP EXPORTER
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              GPX & KML Route Exporter
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportGpx('GPX')}
              className="px-4 py-2 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export .GPX (Garmin / Gaia)</span>
            </button>
            <button
              onClick={() => exportGpx('KML')}
              className="px-4 py-2 border border-text-main/20 hover:border-accent text-xs font-mono font-bold uppercase text-text-main transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Export .KML (Google Earth)</span>
            </button>
          </div>
        </div>

        {downloaded && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-xs font-bold text-center">
            ✓ SUCCESSFULLY EXPORTED {downloaded} TRAIL DATA FILE TO LOCAL DEVICE
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-bg-panel border border-text-main/10 p-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-text-main/50 uppercase font-bold">PRIMARY TRAIL LENGTH:</span>
            <div className="text-xl font-mono font-bold text-text-main">48.2 Kilometers</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-text-main/50 uppercase font-bold">WAYPOINTS INCLUDED:</span>
            <div className="text-xl font-mono font-bold text-accent">14 Verified GPS Points</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-text-main/50 uppercase font-bold">ACCURACY RADIUS:</span>
            <div className="text-xl font-mono font-bold text-text-main">± 1.2 Meters (GLONASS)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 3. CERTIFIED LOCAL GUIDES & PORTER DIRECTORY --- */}
function PorterGuideDirectory({ destination }: { destination: any }) {
  const [selectedGuide, setSelectedGuide] = useState<any>(null);

  const guides = [
    { id: 1, name: 'Pemba Sherpa', role: 'Chief High-Altitude Mountaineering Guide', exp: '14 Years', trips: '85 Peaks', rating: 4.9, rate: '$45/day', lang: 'English, Nepali, Sherpa', verified: true },
    { id: 2, name: 'Nurul Islam', role: 'Sundarban Apex Wildlife & River Captain', exp: '18 Years', trips: '120 Expeditions', rating: 5.0, rate: '$35/day', lang: 'Bengali, English', verified: true },
    { id: 3, name: 'Kalsang Chakma', role: 'Bandarban Ridge Trekker & Porter Lead', exp: '10 Years', trips: '64 Treks', rating: 4.8, rate: '$25/day', lang: 'Chakma, Bengali, Basic English', verified: true }
  ];

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                LOCAL COMMUNITY & CERTIFIED GUIDE REGISTRY
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Guides & Porter Team
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            100% Fair-Trade & Local Economy Direct Support
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((gd) => (
            <div key={gd.id} className="border border-text-main/10 bg-bg-base p-6 flex flex-col justify-between space-y-4 hover:border-accent/40 transition-all">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-mono font-bold text-text-main flex items-center gap-2">
                    {gd.name}
                    {gd.verified && <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </h4>
                  <span className="text-xs font-mono font-bold text-accent">{gd.rate}</span>
                </div>

                <p className="text-xs font-mono text-accent/80 font-bold mb-3">{gd.role}</p>

                <div className="space-y-1.5 font-mono text-[11px] text-text-main/70 border-t border-b border-text-main/10 py-3 my-3">
                  <div className="flex justify-between"><span>Experience:</span> <strong>{gd.exp}</strong></div>
                  <div className="flex justify-between"><span>Completed Journeys:</span> <strong>{gd.trips}</strong></div>
                  <div className="flex justify-between"><span>Languages:</span> <strong>{gd.lang}</strong></div>
                  <div className="flex justify-between"><span>Rating:</span> <strong className="text-amber-500">★ {gd.rating} / 5.0</strong></div>
                </div>
              </div>

              <button
                onClick={() => setSelectedGuide(gd)}
                className="w-full py-2.5 bg-bg-panel border border-text-main/20 hover:border-accent text-xs font-mono font-bold uppercase text-text-main transition-colors cursor-pointer"
              >
                Request Guide Slot
              </button>
            </div>
          ))}
        </div>

        {selectedGuide && (
          <div className="mt-6 p-4 bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex justify-between items-center">
            <span>✓ SLOT REQUESTED FOR <strong>{selectedGuide.name}</strong>. OUR DISPATCH TEAM WILL CONFIRM WITHIN 2 HOURS.</span>
            <button onClick={() => setSelectedGuide(null)} className="font-bold underline cursor-pointer">CLOSE</button>
          </div>
        )}
      </div>
    </section>
  );
}

{/* --- 4. LEAVE NO TRACE (LNT) & ECO-FOOTPRINT CERTIFIER --- */}
function LeaveNoTraceEcoScore() {
  const [zeroPlastic, setZeroPlastic] = useState(true);
  const [biodegradableSoap, setBiodegradableSoap] = useState(true);
  const [noCampfireInProtectedArea, setNoCampfireInProtectedArea] = useState(true);
  const [packOutAllTrash, setPackOutAllTrash] = useState(true);

  const calculateScore = () => {
    let score = 0;
    if (zeroPlastic) score += 25;
    if (biodegradableSoap) score += 25;
    if (noCampfireInProtectedArea) score += 25;
    if (packOutAllTrash) score += 25;
    return score;
  };

  const score = calculateScore();

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-emerald-500 font-bold">
                ENVIRONMENTAL CONSERVATION & LNT CERTIFICATION
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Leave No Trace (LNT) Score
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 font-mono text-xs font-bold text-emerald-500">
            <span>Eco-Score: {score} / 100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-bg-panel border border-text-main/10 p-6 space-y-4">
            <label className="flex items-center justify-between p-3.5 bg-bg-base border border-text-main/10 cursor-pointer">
              <span className="text-xs font-mono font-bold text-text-main">1. Zero Single-Use Plastic Bottles Protocol</span>
              <input type="checkbox" checked={zeroPlastic} onChange={(e) => setZeroPlastic(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-bg-base border border-text-main/10 cursor-pointer">
              <span className="text-xs font-mono font-bold text-text-main">2. 100% Organic & Biodegradable Soap Usage</span>
              <input type="checkbox" checked={biodegradableSoap} onChange={(e) => setBiodegradableSoap(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-bg-base border border-text-main/10 cursor-pointer">
              <span className="text-xs font-mono font-bold text-text-main">3. No Campfire in Protected Canopy / High Alpine Zone</span>
              <input type="checkbox" checked={noCampfireInProtectedArea} onChange={(e) => setNoCampfireInProtectedArea(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-bg-base border border-text-main/10 cursor-pointer">
              <span className="text-xs font-mono font-bold text-text-main">4. Carry In, Carry Out: Pack Out All Human & Organic Waste</span>
              <input type="checkbox" checked={packOutAllTrash} onChange={(e) => setPackOutAllTrash(e.target.checked)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </label>
          </div>

          <div className="lg:col-span-4 bg-bg-panel border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-500 font-bold block mb-1">CERTIFICATION RATING</span>
              <h3 className="text-2xl font-mono font-bold text-text-main mb-2">
                {score === 100 ? '🌿 GOLD LNT GUARDIAN' : score >= 75 ? '🌱 SILVER CONSERVATOR' : '⚠️ ECO-COMPLIANCE NEEDED'}
              </h3>
              <p className="text-xs font-sans text-text-main/70 leading-relaxed">
                Protect pristine wilderness ecosystems by adhering to global Leave No Trace principles.
              </p>
            </div>

            <div className="p-3 bg-bg-base border border-text-main/10 text-[10px] font-mono text-text-main/60 mt-4">
              PLEDGE CERTIFIED BY GLOBAL WILDERNESS ALLIANCE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 5. LIVE TRAIL STREAM & CAMPSITE WEBCAM SIMULATOR --- */}
function TrailWebcamStreamViewer({ destination }: { destination: any }) {
  const [selectedCam, setSelectedCam] = useState<number>(1);
  const [thermalMode, setThermalMode] = useState(false);

  const cams = [
    { id: 1, name: 'Basecamp High Ridge Station (Cam 01)', alt: '3,820m', status: 'ONLINE', temp: '-6°C' },
    { id: 2, name: 'Glacial Confluence Pass (Cam 02)', alt: '4,150m', status: 'ONLINE', temp: '-12°C' },
    { id: 3, name: 'Forest River Crossing (Cam 03)', alt: '1,200m', status: 'ONLINE', temp: '18°C' }
  ];

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Video className="w-5 h-5 text-accent animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                LIVE OPTICAL & THERMAL FIELD WEBCAMS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Trail Live Stream Feeds
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setThermalMode(!thermalMode)}
              className={`px-3 py-1.5 border font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
                thermalMode ? 'bg-red-500 text-white border-red-500' : 'bg-bg-base text-text-main border-text-main/20'
              }`}
            >
              {thermalMode ? 'THERMAL INFRARED ON' : 'OPTICAL COLOR FEED'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 relative border border-text-main/10 bg-black h-80 overflow-hidden flex items-center justify-center">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
                thermalMode ? 'contrast-200 hue-rotate-180 brightness-90' : 'opacity-70'
              }`}
              style={{ backgroundImage: `url(${destination.image})` }}
            />

            {/* Live Recording Badge */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-red-500/50 flex items-center gap-2 text-[10px] font-mono text-red-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE DISPATCH FEED • {cams[selectedCam - 1].name}</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md p-2 border border-text-main/20 text-[10px] font-mono text-text-main/80 space-y-0.5">
              <div>ELEVATION: {cams[selectedCam - 1].alt}</div>
              <div>TEMPERATURE: {cams[selectedCam - 1].temp}</div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] font-mono uppercase text-text-main/50 font-bold block mb-2">AVAILABLE WEBCAM STATIONS</span>
            {cams.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCam(c.id)}
                className={`w-full p-3.5 border text-left flex items-center justify-between font-mono text-xs transition-all cursor-pointer ${
                  selectedCam === c.id
                    ? 'border-accent bg-accent/10 font-bold text-accent'
                    : 'border-text-main/10 bg-bg-base text-text-main/70 hover:border-text-main/30'
                }`}
              >
                <div>
                  <div className="text-text-main">{c.name}</div>
                  <span className="text-[10px] text-text-main/50 font-normal">Altitude: {c.alt}</span>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 font-bold">{c.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 1. SATELLITE EMERGENCY SOS BEACON & VHF RADIO SWITCHER --- */}
function SatelliteSosBeacon({ destination }: { destination: any }) {
  const [sosActive, setSosActive] = useState(false);
  const [channel, setChannel] = useState('Ch 16 (156.800 MHz)');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: any = null;
    if (sosActive && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [sosActive, countdown]);

  const triggerSos = () => {
    setSosActive(true);
    setCountdown(5);
  };

  const cancelSos = () => {
    setSosActive(false);
    setCountdown(5);
  };

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Siren className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-red-500 font-bold">
                COSPAS-SARSAT 406 MHZ EMERGENCY BEACON
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Satellite Emergency SOS & VHF Radio
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="bg-bg-base border border-text-main/20 text-xs font-mono p-2 text-text-main outline-none focus:border-accent font-bold"
            >
              <option>Ch 16 Marine Distress (156.800 MHz)</option>
              <option>146.520 MHz High Altitude Tactical</option>
              <option>406.025 MHz COSPAS Satellite Sync</option>
            </select>
          </div>
        </div>

        <div className="bg-bg-base border border-red-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <span className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-widest block">EMERGENCY RESCUE BEACON</span>
            <h3 className="text-2xl font-mono font-bold text-text-main">
              Instant Global Satellite Rescue Dispatch
            </h3>
            <p className="text-xs font-sans text-text-main/80 leading-relaxed">
              Transmits encrypted 406 MHz distress signal directly to nearest Rescue Coordination Center (RCC) with live GPS payload: <strong>{destination.coords || '27°59′17″N 86°55′31″E'}</strong>.
            </p>
          </div>

          <div className="shrink-0 text-center">
            {!sosActive ? (
              <button
                onClick={triggerSos}
                className="px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-mono text-sm font-bold uppercase tracking-widest shadow-2xl transition-all cursor-pointer border-2 border-red-400 animate-pulse"
              >
                🚨 ACTIVATE EMERGENCY SOS
              </button>
            ) : (
              <div className="space-y-3">
                <div className="text-red-500 font-mono text-xs font-bold animate-bounce">
                  TRANSMITTING BEACON IN {countdown} SECONDS...
                </div>
                <button
                  onClick={cancelSos}
                  className="px-6 py-2 bg-text-main text-bg-base font-mono text-xs font-bold uppercase cursor-pointer"
                >
                  CANCEL DISPATCH
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 2. WILDERNESS FORAGING & BOTANICAL FLORA ENGINE --- */}
function WildernessForagingScanner({ destination }: { destination: any }) {
  const [selectedPlant, setSelectedPlant] = useState<number>(0);

  const plants = [
    { name: 'Wild Alpine Cloudberry', status: 'EDIBLE', desc: 'Rich in Vitamin C. Bright amber berries found near high peat bogs.', prep: 'Eat raw or boil for tea.' },
    { name: 'Mountain Morel Mushroom', status: 'EDIBLE (COOKED ONLY)', desc: 'Honeycomb cap. High protein content found near damp fir roots.', prep: 'MUST boil/saute for 10+ mins. Never eat raw.' },
    { name: 'Aconite / Monkshood', status: 'DEADLY TOXIC', desc: 'Deep purple helmet flowers. Contains lethal neurotoxins.', prep: 'DO NOT TOUCH OR CONSUME.' }
  ];

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Apple className="w-5 h-5 text-emerald-500" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-emerald-500 font-bold">
                OFFLINE BOTANICAL FIELD FLORA & FORAGING GUIDE
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Wilderness Foraging Guide
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            Survival Botanical Identification
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3">
            {plants.map((pl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPlant(idx)}
                className={`w-full p-4 border text-left flex items-center justify-between font-mono text-xs transition-all cursor-pointer ${
                  selectedPlant === idx ? 'border-emerald-500 bg-emerald-500/10 font-bold' : 'border-text-main/10 bg-bg-panel hover:border-text-main/30'
                }`}
              >
                <span>{pl.name}</span>
                <span className={`text-[10px] px-2 py-0.5 font-bold ${pl.status.includes('DEADLY') ? 'bg-red-500 text-white' : 'bg-emerald-500/20 text-emerald-500'}`}>
                  {pl.status}
                </span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 bg-bg-panel border border-text-main/10 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-accent font-bold block">BOTANICAL SPECIES DETAIL</span>
              <h3 className="text-2xl font-serif italic font-bold text-text-main">{plants[selectedPlant].name}</h3>
              <p className="text-xs font-sans text-text-main/80 leading-relaxed">{plants[selectedPlant].desc}</p>
              
              <div className="p-3 bg-bg-base border border-text-main/10 text-xs font-mono">
                <span className="text-text-main/50 block text-[10px] uppercase font-bold">PREPARATION & PRECAUTION PROTOCOL:</span>
                <strong className="text-accent">{plants[selectedPlant].prep}</strong>
              </div>
            </div>

            <div className="mt-6 text-[10px] font-mono text-text-main/50">
              CROSS-REFERENCED WITH WILDERNESS BOTANICAL REGISTRY
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 3. HIGH-ALTITUDE OXYGEN SATURATION (SpO2) SIMULATOR --- */}
function SpO2AltitudeSimulator({ destination }: { destination: any }) {
  const [altitudeMeters, setAltitudeMeters] = useState(3800);

  const spo2 = Math.max(70, Math.round(98 - (altitudeMeters / 500) * 2.2));
  const partialO2 = (21 * Math.exp(-altitudeMeters / 7400)).toFixed(1);

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <HeartPulse className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                BLOOD OXYGEN SATURATION & PARTIAL PRESSURE
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Pulse Oximeter & SpO2 Simulator
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-base px-4 py-2 border border-text-main/10 text-xs font-mono">
            <span>Predicted SpO2: <strong className={spo2 < 80 ? 'text-red-500' : 'text-accent'}>{spo2}%</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-bg-base border border-text-main/10 p-6 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span>Simulated Altitude Level:</span>
                <strong className="text-accent">{altitudeMeters} Meters</strong>
              </div>
              <input
                type="range"
                min={0}
                max={6000}
                step={100}
                value={altitudeMeters}
                onChange={(e) => setAltitudeMeters(parseInt(e.target.value))}
                className="w-full accent-accent bg-text-main/10 h-2 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-bg-panel border border-text-main/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between"><span>Effective Oxygen Partial Pressure:</span> <strong>{partialO2}% O2</strong></div>
              <div className="flex justify-between text-accent"><span>Supplemental Oxygen Status:</span> <strong>{altitudeMeters > 5000 ? 'REQUIRED FOR SLEEP' : 'RECOMMENDED AS BACKUP'}</strong></div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-bg-base border border-text-main/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-2">HYPOXIC ADAPTATION GUIDELINE</span>
              <h3 className="text-2xl font-serif italic font-bold text-text-main mb-3">
                Pursed-Lip Rhythm Breathing
              </h3>
              <p className="text-xs font-sans text-text-main/80 leading-relaxed mb-4">
                Inhale deeply through nose for 2 counts, exhale slowly through pursed lips for 4 counts to maintain positive end-expiratory pressure (PEEP) and maximize alveolar gas exchange.
              </p>
            </div>

            <div className="p-3 bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold text-center">
              AUTOMATED PACER METRONOME READY
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 4. EXPEDITION PHOTO JOURNAL & EXIF DISPATCH STAMPER --- */}
function PhotoJournalExifStamper({ destination }: { destination: any }) {
  const [photoCaption, setPhotoCaption] = useState('Ridge summit clear horizon dispatch');

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-base p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                EXPEDITION DISPATCH & EXIF WATERMARK STAMPER
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Photo Journal & EXIF Card Generator
            </h2>
          </div>

          <button className="px-4 py-2 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-2 cursor-pointer">
            <Share className="w-4 h-4" />
            <span>Generate Stamp Card</span>
          </button>
        </div>

        <div className="relative border border-text-main/10 h-96 overflow-hidden bg-black flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url(${destination.image})` }}
          />

          {/* EXIF Watermark Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 border border-accent/30 text-white font-mono text-xs flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="text-accent font-bold text-[10px] uppercase tracking-widest mb-1">
                LOCATION: {destination.name.toUpperCase()}
              </div>
              <p className="text-sm font-sans italic">{photoCaption}</p>
            </div>

            <div className="text-[10px] text-text-main/70 space-y-0.5 text-right font-mono">
              <div>ALTITUDE: {destination.elevation || '3,850m'}</div>
              <div>DATE: 2026-07-29 • 12:30 UTC</div>
              <div>GPS: {destination.coords || '27°59′N 86°55′E'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* --- 5. INDIGENOUS DIALECT & FRONTIER PHRASEBOOK --- */}
function IndigenousDialectPhrasebook({ destination }: { destination: any }) {
  const phrases = [
    { orig: 'Hello / Greetings', trans: 'Juley / Namaste', lang: 'Highland Alpine' },
    { orig: 'Where is safe water?', trans: 'Kaha safa pani chha?', lang: 'Trail Local' },
    { orig: 'Thank you for shelter', trans: 'Dhanyabad / Tashi Delek', lang: 'Frontier Culture' }
  ];

  return (
    <section className="relative z-20 border-b border-text-main/10 bg-bg-panel p-8 md:p-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-text-main/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Languages className="w-5 h-5 text-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                LOCAL DIALECT & CULTURAL ETIQUETTE PHRASEBOOK
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Indigenous Phrasebook & Customs
            </h2>
          </div>

          <span className="text-xs font-mono text-text-main/60 uppercase font-bold">
            Respectful Local Integration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phrases.map((ph, idx) => (
            <div key={idx} className="bg-bg-base border border-text-main/10 p-6 space-y-2">
              <span className="text-[10px] font-mono text-accent uppercase font-bold block">{ph.lang}</span>
              <h4 className="text-sm font-mono font-bold text-text-main">{ph.orig}</h4>
              <p className="text-lg font-serif italic font-bold text-accent">{ph.trans}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

{/* --- INTERSECTION OBSERVER SCROLL REVEAL ANIMATION SECTION WRAPPER --- */}
function ScrollRevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

{/* --- FULL-FEATURED EXPEDITION ADMIN COMMAND CENTER MODAL --- */}
function AdminControlPanelModal({
  isOpen,
  onClose,
  destinations,
  setDestinations
}: {
  isOpen: boolean;
  onClose: () => void;
  destinations: any[];
  setDestinations: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [activeTab, setActiveTab] = useState<'manifest' | 'broadcast' | 'permits' | 'rescue' | 'trail' | 'telemetry' | 'themeData'>('manifest');
  
  // Tab 1: Manifest States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Tab 2: Live Broadcast & Alert States
  const [broadcastText, setBroadcastText] = useState<string>(() => {
    return localStorage.getItem('global_admin_broadcast') || 'SEVERE BLIZZARD WARNING IN HIGH-ALTITUDE SECTOR 4';
  });
  const [broadcastActive, setBroadcastActive] = useState<boolean>(() => {
    return localStorage.getItem('global_admin_broadcast_active') === 'true';
  });
  const [alertSeverity, setAlertSeverity] = useState<'INFO' | 'WARNING' | 'EMERGENCY'>('WARNING');

  // Tab 3: Permits & Booking Approvals States
  const [permitSearch, setPermitSearch] = useState<string>('');
  const [permitsList, setPermitsList] = useState<Array<{
    id: string;
    applicant: string;
    expedition: string;
    date: string;
    groupSize: number;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
  }>>([
    { id: 'PERMIT-2026-089', applicant: 'Bodhi S. & Expedition Crew', expedition: 'Annapurna Circuit', date: '2026-08-12', groupSize: 4, status: 'APPROVED' },
    { id: 'PERMIT-2026-092', applicant: 'Elena Rostova', expedition: 'Everest Base Camp', date: '2026-08-15', groupSize: 2, status: 'PENDING' },
    { id: 'PERMIT-2026-097', applicant: 'Marcus Vance', expedition: 'Patagonia W-Trek', date: '2026-08-20', groupSize: 6, status: 'PENDING' },
    { id: 'PERMIT-2026-104', applicant: 'Tenzing N. Ridge Team', expedition: 'Annapurna Circuit', date: '2026-08-25', groupSize: 8, status: 'APPROVED' }
  ]);

  // Tab 4: Air Support & Helicopter Rescue Dispatcher
  const [airRescueUnits, setAirRescueUnits] = useState<Array<{
    id: string;
    callsign: string;
    type: string;
    location: string;
    status: 'STANDBY' | 'DISPATCHED' | 'REFUELING' | 'AIRBORNE';
    pilot: string;
  }>>([
    { id: 'RESCUE-01', callsign: 'EUROCOPTER AS350 B3', type: 'High Altitude Air Ambulance', location: 'Lukla Helipad (3,800m)', status: 'STANDBY', pilot: 'Capt. Pemba Sherpa' },
    { id: 'RESCUE-02', callsign: 'THERMAL RESCUE DRONE X8', type: 'Infrared SAR Drone Unit', location: 'Gorakshep Base', status: 'AIRBORNE', pilot: 'Autonomous Nav-AI' },
    { id: 'RESCUE-03', callsign: 'AGUSTAWESTLAND AW119', type: 'Long-Range Medical Transport', location: 'Pokhara Airfield', status: 'STANDBY', pilot: 'Capt. Anita Rai' }
  ]);

  // Tab 5: Trail Status & Avalanche Controls per destination
  const [trailStatuses, setTrailStatuses] = useState<Record<string, 'OPEN' | 'CAUTION' | 'CLOSED'>>({
    'annapurna': 'OPEN',
    'everest': 'CAUTION',
    'patagonia': 'OPEN'
  });
  const [avalancheRiskLevels, setAvalancheRiskLevels] = useState<Record<string, number>>({
    'annapurna': 2,
    'everest': 4,
    'patagonia': 1
  });

  // Tab 6: Telemetry States
  const [threatLevel, setThreatLevel] = useState<'NORMAL' | 'ELEVATED' | 'SEVERE'>('NORMAL');

  // Tab 7: System Accent Theme
  const [accentColor, setAccentColor] = useState<string>(() => localStorage.getItem('admin_accent_color') || '#f27d26');

  // General Notification toast
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Theme Accent Handler
  const handleThemeChange = (colorHex: string) => {
    setAccentColor(colorHex);
    document.documentElement.style.setProperty('--color-accent', colorHex);
    localStorage.setItem('admin_accent_color', colorHex);
    showNotification(`✓ SYSTEM ACCENT THEME UPDATED TO ${colorHex}`);
  };

  // Save/Edit Destination
  const handleSaveEdit = () => {
    if (!editForm.name) return;
    if (editingId === 'NEW') {
      const newDest = {
        ...editForm,
        id: editForm.id || `custom-${Date.now()}`,
        specs: editForm.specs || [
          { label: 'Elevation', value: editForm.elevation || '2,500m', icon: 'Map' },
          { label: 'Difficulty', value: editForm.difficulty || 'Moderate', icon: 'ThermometerSnowflake' }
        ]
      };
      const updated = [...destinations, newDest];
      setDestinations(updated);
      localStorage.setItem('custom_destinations', JSON.stringify(updated));
      showNotification('✓ NEW EXPEDITION MANIFEST CREATED SUCCESSFULLY');
    } else {
      const updated = destinations.map(d => d.id === editingId ? { ...d, ...editForm } : d);
      setDestinations(updated);
      localStorage.setItem('custom_destinations', JSON.stringify(updated));
      showNotification('✓ EXPEDITION MANIFEST UPDATED');
    }
    setEditingId(null);
  };

  // Delete Destination
  const handleDelete = (id: string) => {
    if (destinations.length <= 1) {
      alert('Cannot delete the last remaining expedition.');
      return;
    }
    const updated = destinations.filter(d => d.id !== id);
    setDestinations(updated);
    localStorage.setItem('custom_destinations', JSON.stringify(updated));
    showNotification('✓ EXPEDITION DELETED');
  };

  // Move Order
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= destinations.length) return;
    const newArr = [...destinations];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setDestinations(newArr);
    localStorage.setItem('custom_destinations', JSON.stringify(newArr));
  };

  // Reset Factory Defaults
  const handleResetDefaults = () => {
    localStorage.removeItem('custom_destinations');
    setDestinations(defaultDestinations);
    showNotification('✓ FACTORY DEFAULT EXPEDITIONS RESTORED');
  };

  // Broadcast Alert Actions
  const handleSaveBroadcast = () => {
    localStorage.setItem('global_admin_broadcast', broadcastText);
    localStorage.setItem('global_admin_broadcast_active', String(broadcastActive));
    localStorage.setItem('global_admin_broadcast_severity', alertSeverity);
    showNotification(broadcastActive ? '✓ GLOBAL EMERGENCY BROADCAST LIVE ON AIR' : '✓ BROADCAST BANNER SAVED (PAUSED)');
  };

  // Permit Approval Toggle
  const handlePermitStatusChange = (id: string, newStatus: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    setPermitsList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showNotification(`✓ PERMIT ${id} SET TO ${newStatus}`);
  };

  // Export JSON Manifest
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(destinations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `expeditions-manifest-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('✓ MANIFEST JSON DOWNLOADED');
  };

  // Import JSON Manifest
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDestinations(parsed);
            localStorage.setItem('custom_destinations', JSON.stringify(parsed));
            showNotification('✓ CUSTOM MANIFEST IMPORTED');
          } else {
            alert('Invalid JSON structure. Must be an array of destinations.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-bg-panel border border-accent/40 w-full max-w-5xl my-auto text-text-main font-mono relative shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-text-main/10 flex items-center justify-between bg-bg-base shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-accent animate-spin-slow" />
            <div>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-text-main flex items-center gap-2">
                EXPEDITION SYSTEM ADMIN COMMAND CENTER
                <span className="px-2 py-0.5 bg-accent/20 border border-accent/30 text-accent text-[9px] font-bold rounded">
                  v5.0 PRO
                </span>
              </h3>
              <p className="text-[10px] text-text-main/60 uppercase">Global Frontier Core Management • Real-time Sync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-text-main/20 hover:border-accent text-text-main hover:text-accent transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-text-main/10 bg-bg-base shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-4 py-3 text-xs font-bold uppercase transition-colors border-r border-text-main/10 flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'manifest' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. Manifests ({destinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-3 text-xs font-bold uppercase transition-colors border-r border-text-main/10 flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'broadcast' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
            }`}
          >
            <Siren className="w-3.5 h-3.5" />
            <span>2. Live Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('permits')}
            className={`px-4 py-3 text-xs font-bold uppercase transition-colors border-r border-text-main/10 flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'permits' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>3. Permits ({permitsList.filter(p => p.status === 'PENDING').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rescue')}
            className={`px-4 py-3 text-xs font-bold uppercase transition-colors border-r border-text-main/10 flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'rescue' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>4. Air Rescue ({airRescueUnits.filter(u => u.status === 'AIRBORNE' || u.status === 'DISPATCHED').length} Active)</span>
          </button>

          <button
            onClick={() => setActiveTab('trail')}
            className={`px-4 py-3 text-xs font-bold uppercase transition-colors border-r border-text-main/10 flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'trail' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>5. Trail & Avalanche</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-3 text-xs font-bold uppercase transition-colors border-r border-text-main/10 flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'telemetry' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>6. Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('themeData')}
            className={`px-4 py-3 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'themeData' ? 'bg-accent text-bg-base' : 'text-text-main/70 hover:text-text-main'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>7. Theme & Backup</span>
          </button>
        </div>

        {/* Notifications Toast */}
        {notice && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 p-3 text-emerald-400 text-xs font-bold text-center shrink-0">
            {notice}
          </div>
        )}

        {/* Main Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 grow">
          
          {/* TAB 1: MANIFEST MANAGER */}
          {activeTab === 'manifest' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-main/40" />
                  <input
                    type="text"
                    placeholder="Search expeditions by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-bg-base border border-text-main/20 text-xs text-text-main outline-none focus:border-accent"
                  />
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingId('NEW');
                      setEditForm({
                        name: 'New Alpine Expedition',
                        tagline: 'Uncharted Ridge Trail',
                        location: 'Karakoram Range',
                        type: 'mountain',
                        difficulty: 'Extreme',
                        season: 'Autumn / Spring',
                        elevation: '5,100m',
                        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
                        description: 'A newly cataloged frontier expedition peak.'
                      });
                    }}
                    className="px-4 py-2 bg-accent text-bg-base text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ New Destination</span>
                  </button>

                  <button
                    onClick={handleResetDefaults}
                    className="px-3 py-2 border border-text-main/20 hover:border-accent text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Inline Edit / Add Form */}
              {editingId && (
                <div className="bg-bg-base border border-accent p-6 space-y-4 shadow-lg">
                  <h4 className="text-sm font-bold text-accent uppercase flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>{editingId === 'NEW' ? 'CREATE NEW EXPEDITION MANIFEST' : 'EDIT EXPEDITION MANIFEST'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-text-main/60 mb-1">DESTINATION NAME:</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-bg-panel border border-text-main/20 p-2 text-text-main outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-text-main/60 mb-1">TAGLINE / SUBTITLE:</label>
                      <input
                        type="text"
                        value={editForm.tagline || ''}
                        onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                        className="w-full bg-bg-panel border border-text-main/20 p-2 text-text-main outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-text-main/60 mb-1">GEOGRAPHIC LOCATION:</label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full bg-bg-panel border border-text-main/20 p-2 text-text-main outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-text-main/60 mb-1">ELEVATION / ALTITUDE:</label>
                      <input
                        type="text"
                        value={editForm.elevation || ''}
                        onChange={(e) => setEditForm({ ...editForm, elevation: e.target.value })}
                        className="w-full bg-bg-panel border border-text-main/20 p-2 text-text-main outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-text-main/60 mb-1">HERO IMAGE URL:</label>
                      <input
                        type="text"
                        value={editForm.image || ''}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                        className="w-full bg-bg-panel border border-text-main/20 p-2 text-text-main outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-text-main/60 mb-1">TERRAIN TYPE:</label>
                      <select
                        value={editForm.type || 'mountain'}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        className="w-full bg-bg-panel border border-text-main/20 p-2 text-text-main outline-none focus:border-accent"
                      >
                        <option value="mountain">Alpine Mountain Peak</option>
                        <option value="forest">Dense Rainforest / Mangrove</option>
                        <option value="beach">Coastal Marine Reserve</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-text-main/60 mb-1">DESCRIPTION BRIEF:</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full bg-bg-panel border border-text-main/20 p-2 text-text-main outline-none focus:border-accent h-20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 border border-text-main/20 text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-2 bg-accent text-bg-base text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Expedition Manifest</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Destination List Items */}
              <div className="space-y-3">
                {filteredDestinations.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 bg-bg-base border border-text-main/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-text-main/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cover bg-center border border-text-main/20 shrink-0" style={{ backgroundImage: `url(${item.image})` }} />
                      <div>
                        <h4 className="font-bold text-sm text-text-main">{item.name}</h4>
                        <span className="text-[10px] text-text-main/60 uppercase">{item.location} • {item.elevation || '2,400m'} • {item.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 border border-text-main/20 disabled:opacity-30 hover:border-accent cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === filteredDestinations.length - 1}
                        className="p-1.5 border border-text-main/20 disabled:opacity-30 hover:border-accent cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditForm({ ...item });
                        }}
                        className="p-1.5 border border-text-main/20 hover:border-accent text-accent cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE EMERGENCY BROADCAST BANNER CONTROLLER */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="bg-bg-base border border-text-main/10 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-text-main/10 pb-4">
                  <div>
                    <h4 className="text-sm font-bold text-accent uppercase flex items-center gap-2">
                      <Siren className="w-5 h-5 animate-pulse" />
                      <span>GLOBAL APP BROADCAST & ALERT SYSTEM</span>
                    </h4>
                    <p className="text-[10px] text-text-main/60 uppercase">Publish live weather & safety alert banners across the whole application</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-main/70">BROADCAST STATUS:</span>
                    <button
                      onClick={() => setBroadcastActive(!broadcastActive)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase border cursor-pointer ${
                        broadcastActive ? 'bg-red-500 text-white border-red-500' : 'bg-bg-panel text-text-main border-text-main/30'
                      }`}
                    >
                      {broadcastActive ? 'LIVE ON AIR' : 'OFFLINE / INACTIVE'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-text-main/60 mb-1 font-bold">ALERT SEVERITY LEVEL:</label>
                    <div className="flex gap-3">
                      {(['INFO', 'WARNING', 'EMERGENCY'] as const).map((sev) => (
                        <button
                          key={sev}
                          onClick={() => setAlertSeverity(sev)}
                          className={`px-4 py-2 text-xs font-bold uppercase border cursor-pointer ${
                            alertSeverity === sev ? 'bg-accent text-bg-base border-accent' : 'border-text-main/20 text-text-main'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-main/60 mb-1 font-bold">ANNOUNCEMENT TEXT MESSAGE:</label>
                    <textarea
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      placeholder="Enter emergency warning broadcast text..."
                      className="w-full bg-bg-panel border border-text-main/20 p-3 text-text-main text-xs outline-none focus:border-accent h-24 resize-none"
                    />
                  </div>

                  {/* Live Preview Box */}
                  <div className="p-4 bg-bg-panel border border-accent/40 space-y-2">
                    <span className="text-[10px] font-bold text-accent uppercase block">LIVE BANNER PREVIEW:</span>
                    <div className={`p-3 text-xs font-bold flex items-center gap-3 ${
                      alertSeverity === 'EMERGENCY' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                      alertSeverity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    }`}>
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{broadcastText || 'No alert text set.'}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveBroadcast}
                      className="px-6 py-2.5 bg-accent text-bg-base text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Publish Broadcast Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKINGS & PERMIT APPROVALS */}
          {activeTab === 'permits' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-main/60 uppercase font-bold">RANGER & EXPEDITION PERMIT REGISTRATION REGISTRY</span>
                <div className="text-xs font-bold text-accent">
                  Total Records: {permitsList.length}
                </div>
              </div>

              <div className="space-y-3">
                {permitsList.map((permit) => (
                  <div
                    key={permit.id}
                    className="p-4 bg-bg-base border border-text-main/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-text-main">{permit.applicant}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-bg-panel border border-text-main/20 text-accent font-bold">
                          {permit.id}
                        </span>
                      </div>
                      <p className="text-xs text-text-main/70 mt-1">
                        Expedition Target: <strong className="text-text-main">{permit.expedition}</strong> • Date: {permit.date} • Party Size: {permit.groupSize} climbers
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handlePermitStatusChange(permit.id, 'APPROVED')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase border cursor-pointer transition-colors ${
                          permit.status === 'APPROVED' ? 'bg-emerald-500 text-bg-base border-emerald-500' : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handlePermitStatusChange(permit.id, 'PENDING')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase border cursor-pointer transition-colors ${
                          permit.status === 'PENDING' ? 'bg-amber-500 text-bg-base border-amber-500' : 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
                        }`}
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => handlePermitStatusChange(permit.id, 'REJECTED')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase border cursor-pointer transition-colors ${
                          permit.status === 'REJECTED' ? 'bg-red-500 text-bg-base border-red-500' : 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SATELLITE TELEMETRY & THREATS */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-bg-base border border-text-main/10">
                  <span className="text-[10px] text-text-main/50 uppercase block mb-1">ACTIVE EXPLORERS ONLINE</span>
                  <div className="text-2xl font-bold text-accent">1,842 Live Pings</div>
                </div>

                <div className="p-4 bg-bg-base border border-text-main/10">
                  <span className="text-[10px] text-text-main/50 uppercase block mb-1">SATELLITE BANDWIDTH LATENCY</span>
                  <div className="text-2xl font-bold text-emerald-500">12ms (COSPAS Sync)</div>
                </div>

                <div className="p-4 bg-bg-base border border-text-main/10">
                  <span className="text-[10px] text-text-main/50 uppercase block mb-1">EMERGENCY SOS STATUS</span>
                  <div className="text-2xl font-bold text-text-main">0 Active Incidents</div>
                </div>
              </div>

              <div className="bg-bg-base border border-text-main/10 p-6 space-y-4">
                <span className="text-xs font-bold text-accent uppercase block">GLOBAL SYSTEM OVERRIDE THREAT LEVEL</span>
                <div className="flex gap-4">
                  {(['NORMAL', 'ELEVATED', 'SEVERE'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setThreatLevel(lvl);
                        showNotification(`SYSTEM THREAT LEVEL OVERRIDDEN TO ${lvl}`);
                      }}
                      className={`px-4 py-2 text-xs font-bold uppercase border cursor-pointer ${
                        threatLevel === lvl ? 'bg-accent text-bg-base border-accent' : 'border-text-main/20 text-text-main'
                      }`}
                    >
                      {lvl} LEVEL
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THEME & BACKUP JSON */}
          {activeTab === 'themeData' && (
            <div className="space-y-6">
              {/* Theme Color Picker */}
              <div className="bg-bg-base border border-text-main/10 p-6 space-y-4">
                <span className="text-xs font-bold text-accent uppercase block">SYSTEM ACCENT COLOR SCHEME</span>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'Frontier Amber', hex: '#f27d26' },
                    { name: 'Alpine Emerald', hex: '#10b981' },
                    { name: 'Glacier Blue', hex: '#3b82f6' },
                    { name: 'Crimson Rescue', hex: '#ef4444' },
                    { name: 'Deep Twilight', hex: '#a855f7' }
                  ].map((thm) => (
                    <button
                      key={thm.hex}
                      onClick={() => handleThemeChange(thm.hex)}
                      className="px-4 py-3 bg-bg-panel border border-text-main/20 flex items-center gap-3 text-xs font-bold text-text-main hover:border-accent cursor-pointer"
                    >
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: thm.hex }} />
                      <span>{thm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Backup & Import Section */}
              <div className="space-y-4 bg-bg-base border border-text-main/10 p-6">
                <span className="text-xs font-bold text-accent uppercase block">BACKUP & MANIFEST JSON EXPORT / IMPORT</span>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={handleExportJson}
                    className="px-6 py-3 bg-accent text-bg-base text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Manifest JSON File</span>
                  </button>

                  <label className="px-6 py-3 border border-text-main/20 hover:border-accent text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer text-text-main">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Import JSON Manifest File</span>
                    <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}











