import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Users, Calendar, Rocket, Award, MapPin, Star, Zap, Globe, Heart } from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernCard from "@/components/ui/ModernCard";
import ModernSectionWrapper from "@/components/ui/ModernSectionWrapper";
import Container from "@/components/ui/Container";
import Ticker from "@/components/Ticker";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import { useHeroAnimations } from "@/hooks/useHeroAnimations";
import { useCountUp } from "@/hooks/useCountUp";
import '@/components/EventCard.css';

interface Event {
  title: string;
  date: string;
  type: string;
  location: string;
  time: string;
  image: string;
  description: string;
  fullDescription: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { heroRef, titleRef, buttonsRef, navigationRef } = useHeroAnimations(isLoading);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const stats = [
    { icon: Users, value: 500, label: "Membres Actifs", suffix: "+" },
    { icon: Calendar, value: 30, label: "Événements Organisés", suffix: "+" },
    { icon: Rocket, value: 15, label: "Projets Lancés", suffix: "+" },
    { icon: Award, value: 1000, label: "Bénéficiaires", suffix: "+" },
  ];

  const upcomingEvents = [
    { 
      title: "Workshop Blockchain Fondamentaux", 
      date: "25 Mars 2026", 
      type: "Workshop", 
      location: "Goma Innovation Center",
      time: "14:00 - 18:00",
      image: "https://images.unsplash.com/photo-1639322533843-2b5a3b5b5b5?w=600&h=400&fit=crop",
      description: "Initiation aux concepts fondamentaux de la blockchain",
      fullDescription: "Plongez dans l'univers fascinant de la blockchain avec ce workshop intensif. Vous apprendrez les concepts de base, les mécanismes de consensus, la cryptographie, et comment cette technologie révolutionnaire transforme les industries. Session pratique avec démonstrations live et études de cas concrets applicables au contexte africain."
    },
    { 
      title: "Hackathon Web3 pour le Développement", 
      date: "10 Avril 2026", 
      type: "Hackathon", 
      location: "Virunga Tech Park",
      time: "09:00 - 20:00",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=400&fit=crop",
      description: "48h de développement intensif pour créer des solutions Web3",
      fullDescription: "Rejoignez-nous pour 48 heures de création intensive ! Formez des équipes, développez des solutions innovantes utilisant les technologies Web3, et présentez vos projets à un jury d'experts. Thème central : 'Technologie Blockchain pour le Développement Durable en RDC'. Prix exceptionnels et opportunités de financement pour les meilleurs projets."
    },
    { 
      title: "Meetup Crypto et Investissement", 
      date: "20 Avril 2026", 
      type: "Meetup", 
      location: "Goma Hub HQ",
      time: "17:00 - 19:00",
      image: "https://images.unsplash.com/photo-1611224923853-80b0237ed8b3?w=600&h=400&fit=crop",
      description: "Réseautage et discussions sur les opportunités d'investissement crypto",
      fullDescription: "Un meetup exclusif pour explorer les opportunités d'investissement dans les cryptomonnaies et projets blockchain. Échanges avec des investisseurs expérimentés, analyses de marché, et présentation de projets prometteurs. Session networking suivie d'un cocktail. Places limitées pour garantir des échanges de qualité."
    },
  ];

  const projects = [
    { 
      name: "KivuPay", 
      category: "DeFi", 
      description: "Plateforme de paiement décentralisée pour la région des Grands Lacs"
    },
    { 
      name: "EduChain", 
      category: "Éducation", 
      description: "Système éducatif basé sur la blockchain pour les écoles congolaises"
    },
    { 
      name: "VolcanoDAO", 
      category: "Impact Social", 
      description: "Organisation autonome pour le développement durable autour du Virunga"
    },
  ];

  const partners = [
    {
      name: "Apex Fusion",
      logo: "/partners/apex.png",
      url: "https://apexfusion.com/",
    },
    {
      name: "Wada",
      logo: "/partners/wada.jpg",
      url: "https://wada.org/",
    },
    {
      name: "Catalyst",
      logo: "/partners/Catalyst.jpg",
      url: "https://projectcatalyst.io/",
    },
    {
      name: "Ekival",
      logo: "/partners/Ekival.png",
      url: "https://ekival.com/",
    },
    {
      name: "ISDR-GL",
      logo: "/partners/partner1.png",
      url: "https://isdrgl.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero avec vidéo YouTube en arrière-plan */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20" ref={heroRef}>
        <div className="absolute inset-0">
          <iframe
            src="https://www.youtube.com/embed/3Lp9Zj2tSRo?autoplay=1&mute=1&loop=1&controls=0&playlist=3Lp9Zj2tSRo&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&rel=0&fs=0"
            className="absolute inset-0 w-full h-full"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.77vh',
              transform: 'translateX(-50%) translateY(-50%)',
              pointerEvents: 'none'
            }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="UJUZI Labs Background Video"
            frameBorder="0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/60" />
        </div>
        
        <Container className="relative z-10 text-center">
          <div className="hero-decoration inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium mb-8 bg-white/20 backdrop-blur-md border border-white/30">
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300">Innovation Web3 par UJUZI Labs</span>
          </div>
          
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight mb-6 text-white overflow-hidden"
          >
            <div className="text-blue-400">UJUZI Labs</div>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed text-white/90">
            <div className="text-blue-300">Le centre d'innovation blockchain pour le développement de la RD Congo</div>
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <ModernButton variant="primary" size="lg" href="/community">
              <Zap className="mr-2 h-5 w-5" />
              Rejoindre la communauté
              <ArrowRight className="ml-2 h-5 w-5" />
            </ModernButton>
            
            <ModernButton variant="outline" size="lg" href="/events" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Calendar className="mr-2 h-5 w-5" />
              Voir les événements
            </ModernButton>
          </div>
        </Container>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* Stats */}
      <ModernSectionWrapper background="gray" className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const { count, elementRef } = useCountUp({ 
                end: stat.value, 
                duration: 2500, // 2.5 secondes pour toutes les animations
                startOnView: true 
              });
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <ModernCard className="p-8 text-center">
                    <stat.icon className={`h-10 w-10 mx-auto mb-4 ${
                      i === 0 ? 'text-orange-500' : 
                      i === 1 ? 'text-orange-600' : 
                      i === 2 ? 'text-orange-400' : 
                      'text-orange-300'
                    }`} />
                    <div 
                      ref={elementRef}
                      className="text-4xl font-bold mb-2 text-card-foreground"
                    >
                      {count}{stat.suffix}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                  </ModernCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </ModernSectionWrapper>

      {/* About */}
      <ModernSectionWrapper className="py-24">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
              <div className="text-orange-600">Innovation Technologique Locale</div>
            </h2>
            <p className="text-xl leading-relaxed mb-8 text-muted-foreground">
              <div className="text-orange-500 mb-4">UJUZI Labs est un centre d'innovation dédié au développement des technologies blockchain en RD Congo</div>
              <div className="text-orange-400 mb-4">créant des opportunités pour la jeunesse locale</div>
              <div className="text-orange-600">avec un focus sur l'impact social et économique durable</div>
            </p>
            <ModernButton variant="primary" href="/about">
              <Globe className="mr-2 h-5 w-5" />
              En savoir plus
            </ModernButton>
          </motion.div>
        </Container>
      </ModernSectionWrapper>

      {/* Events */}
      <ModernSectionWrapper background="gray" className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            <div className="text-orange-600">Événements à venir</div>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <ModernCard className="overflow-hidden">
                  {/* Image d'aperçu de l'événement */}
                  <div className="event-image-container">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="event-image"
                    />
                    <div className={`event-type-badge ${
                      i === 0 ? 'bg-orange-500' :
                      i === 1 ? 'bg-orange-600' :
                      'bg-orange-400'
                    }`}>
                      {event.type}
                    </div>
                  </div>
                  
                  <div className="event-content">
                    <h3 className="text-2xl font-bold mb-4 text-card-foreground">{event.title}</h3>
                    
                    {/* Description complète de l'événement */}
                    <div className="event-description">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {event.fullDescription}
                      </p>
                    </div>
                    
                    {/* Informations pratiques */}
                    <div className="space-y-3 mb-6">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">{event.date}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="text-card-foreground">{event.location}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">{event.time}</span>
                      </p>
                    </div>
                    
                    {/* Bouton d'inscription */}
                    <ModernButton 
                      variant="primary" 
                      className={`w-full ${
                        i === 0 ? 'bg-orange-500 hover:bg-orange-600' :
                        i === 1 ? 'bg-orange-600 hover:bg-orange-700' :
                        'bg-orange-400 hover:bg-orange-500'
                      }`}
                      onClick={() => handleOpenModal(event)}
                    >
                      S'inscrire maintenant
                    </ModernButton>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </ModernSectionWrapper>

      {/* Projects */}
      <ModernSectionWrapper className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            <div className="text-orange-600">Projets Innovants</div>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <ModernCard className="p-8">
                  <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold mb-4 ${
                    i === 0 ? 'bg-orange-500 text-white' :
                    i === 1 ? 'bg-orange-600 text-white' :
                    'bg-orange-400 text-white'
                  }`}>
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-card-foreground">{project.name}</h3>
                  <p className="leading-relaxed text-muted-foreground">{project.description}</p>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </ModernSectionWrapper>

      {/* Partners */}
      <ModernSectionWrapper background="gray" className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-12">
            <img src="/logo.png" alt="UJUZI Labs" className="h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              <div className="text-orange-600">Partenaires Stratégiques</div>
            </h2>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-r from-transparent via-white/5 to-transparent py-8">
            <div className="flex animate-scroll">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={`${partner.name}-${i}`}
                  className="flex flex-col items-center min-w-[200px] max-w-[220px] mx-4 flex-shrink-0"
                >
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                    aria-label={`Visiter le site de ${partner.name}`}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-16 w-auto object-contain"
                      style={{ maxWidth: 160 }}
                      loading="lazy"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </ModernSectionWrapper>

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Heart className="h-12 w-12 mx-auto mb-6 text-white" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              <div className="text-white">Restez Connecté</div>
            </h2>
            <p className="text-xl mb-8 text-white/90">
              <div className="text-white">Recevez les dernières nouvelles sur nos événements UJUZI Labs et opportunités</div>
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900 placeholder-gray-500"
              />
              <ModernButton variant="secondary" size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                S'abonner
              </ModernButton>
            </form>
          </motion.div>
        </Container>
      </section>

      {/* Modal d'inscription aux événements */}
      <EventRegistrationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default Index;
