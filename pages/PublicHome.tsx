
import React, { useState } from 'react';
import { Instagram, Phone, MapPin, ChevronRight, Menu, X, Calendar } from 'lucide-react';
import { PROFESSIONALS, SPACE_GALLERY, SERVICE_GALLERY, LOGO_URL, INSTAGRAM_LINK, MAPS_LINK, WHATSAPP_CONTACT } from '../constants';
import BookingWizard from '../components/BookingWizard';
import { Link } from 'react-router-dom';

const PublicHome: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="fixed w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Marconi Logo" className="w-12 h-12" />
            <span className="text-xl font-bold tracking-tighter font-display text-amber-500">BARBEARIA MARCONI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="#space" className="hover:text-amber-500 transition-colors">O Espaço</a>
            <a href="#professionals" className="hover:text-amber-500 transition-colors">Time</a>
            <a href="#gallery" className="hover:text-amber-500 transition-colors">Trabalhos</a>
            <Link to="/login" className="px-4 py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors text-xs">Acesso Admin</Link>
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 px-6 py-2 rounded-full font-bold text-slate-950 transition-all"
            >
              AGENDAR AGORA
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950 pt-24 px-6 md:hidden">
           <div className="flex flex-col gap-6 text-xl font-display text-center">
            <a href="#space" onClick={() => setIsMobileMenuOpen(false)}>O Espaço</a>
            <a href="#professionals" onClick={() => setIsMobileMenuOpen(false)}>Time</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)}>Trabalhos</a>
            <button 
              onClick={() => { setIsWizardOpen(true); setIsMobileMenuOpen(false); }}
              className="bg-amber-600 py-4 rounded-xl font-bold text-slate-950"
            >
              AGENDAR AGORA
            </button>
            <Link to="/login" className="text-slate-400 text-sm mt-4">Login Administrativo</Link>
           </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.imgur.com/r9Xwuow.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <img src={LOGO_URL} alt="Marconi" className="w-32 h-32 mx-auto mb-8 drop-shadow-2xl animate-bounce" />
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight drop-shadow-lg">
            A EXPERIÊNCIA DO <br/>
            <span className="text-amber-500 italic">CORTE PERFEITO</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto uppercase tracking-widest font-light">
            Especialistas em cabelos crespos, cacheados e ondulados. Tradição e modernidade em um só lugar.
          </p>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="group relative inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-500 text-slate-950 px-10 py-5 rounded-full font-black text-lg transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
          >
            FAZER AGENDAMENTO
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Space Gallery */}
      <section id="space" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 uppercase font-display tracking-widest">Nosso Espaço</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPACE_GALLERY.map((img, i) => (
            <div key={i} className={`overflow-hidden rounded-2xl group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img 
                src={img} 
                alt="Espaço Barbearia" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Professionals Section */}
      <section id="professionals" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 uppercase font-display tracking-widest">Profissionais</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            <p className="mt-6 text-slate-400 max-w-xl mx-auto">Os melhores mestres da tesoura e da navalha prontos para transformar seu visual.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROFESSIONALS.filter(p => p.role === 'barber').map((p) => (
              <div key={p.id} className="bg-slate-800 rounded-3xl overflow-hidden border border-white/5 group hover:border-amber-500/50 transition-colors">
                <div className="aspect-square overflow-hidden relative">
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                  <p className="text-sm text-amber-500/80 uppercase tracking-widest">{p.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Gallery */}
      <section id="gallery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 uppercase font-display tracking-widest">Galeria de Atendimentos</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
            {SERVICE_GALLERY.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg group">
                <img 
                  src={img} 
                  alt={`Atendimento ${i}`} 
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer className="bg-slate-900 border-t border-white/5 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <img src={LOGO_URL} alt="Marconi Logo" className="w-10 h-10" />
              <span className="text-lg font-bold font-display text-amber-500">MARCONI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Dedicados à arte da barbearia com excelência em atendimento e técnicas exclusivas.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest mb-6">Contato</h4>
            <a href={MAPS_LINK} target="_blank" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors justify-center md:justify-start">
              <MapPin size={20} className="text-amber-500" />
              <span>R. Exemplo, 123 - São Paulo, SP</span>
            </a>
            <a href={`https://api.whatsapp.com/send?phone=${WHATSAPP_CONTACT}`} target="_blank" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors justify-center md:justify-start">
              <Phone size={20} className="text-amber-500" />
              <span>+55 11 97661-2575</span>
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors justify-center md:justify-start">
              <Instagram size={20} className="text-amber-500" />
              <span>@barbeariamarconi</span>
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center gap-4">
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 px-8 py-4 rounded-xl font-black text-lg shadow-lg shadow-amber-600/20"
            >
              MARCAR AGORA
            </button>
            <p className="text-xs text-slate-500 uppercase tracking-tighter">© 2024 Barbearia Marconi - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>

      {/* Booking Wizard Modal */}
      {isWizardOpen && <BookingWizard onClose={() => setIsWizardOpen(false)} />}
    </div>
  );
};

export default PublicHome;
