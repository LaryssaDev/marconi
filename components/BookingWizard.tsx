
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User as UserIcon, Scissors, Check, Send } from 'lucide-react';
import { PROFESSIONALS, SERVICES, WHATSAPP_CONTACT } from '../constants';
import { Professional, Service, Booking } from '../types';

interface BookingWizardProps {
  onClose: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [busyTimes, setBusyTimes] = useState<string[]>([]);

  // Calculate busy times for the selected professional and date
  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      const allBookings: Booking[] = JSON.parse(localStorage.getItem('barbearia_bookings') || '[]');
      const filtered = allBookings
        .filter(b => b.professionalId === selectedProfessional.id && b.date === selectedDate && b.status !== 'rejected')
        .map(b => b.time);
      setBusyTimes(filtered);
    }
  }, [selectedProfessional, selectedDate]);

  const handleFinalize = () => {
    if (!selectedProfessional || !selectedService || !selectedDate || !selectedTime) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerEmail: customerData.email,
      professionalId: selectedProfessional.id,
      serviceId: selectedService.id,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      totalValue: selectedService.price,
      createdAt: new Date().toISOString()
    };

    const allBookings = JSON.parse(localStorage.getItem('barbearia_bookings') || '[]');
    localStorage.setItem('barbearia_bookings', JSON.stringify([...allBookings, newBooking]));

    // Prepare WhatsApp message
    const message = encodeURIComponent(
      `💈 *Novo Agendamento - Barbearia Marconi*\n\n` +
      `👤 *Cliente:* ${customerData.name}\n` +
      `📞 *Telefone:* ${customerData.phone}\n` +
      `✂️ *Profissional:* ${selectedProfessional.name}\n` +
      `📅 *Data:* ${new Date(selectedDate).toLocaleDateString('pt-BR')}\n` +
      `⏰ *Hora:* ${selectedTime}\n` +
      `🛠️ *Serviço:* ${selectedService.name}\n` +
      `💰 *Valor Total:* R$${selectedService.price.toFixed(2)}\n\n` +
      `⏳ *Status:* Pendente - aguardando aprovação`
    );

    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_CONTACT}&text=${message}`, '_blank');
    onClose();
  };

  const steps = [
    { title: 'Profissional', icon: <UserIcon size={20} /> },
    { title: 'Serviço', icon: <Scissors size={20} /> },
    { title: 'Data/Hora', icon: <Calendar size={20} /> },
    { title: 'Seus Dados', icon: <Check size={20} /> },
  ];

  const availableHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-amber-500 text-slate-900 p-1.5 rounded-lg">{steps[step-1].icon}</span>
            {steps[step-1].title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex w-full h-1 bg-slate-800">
          <div 
            className="bg-amber-500 h-full transition-all duration-500" 
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROFESSIONALS.filter(p => p.role === 'barber').map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProfessional(p); setStep(2); }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedProfessional?.id === p.id ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                >
                  <img src={p.photo} alt={p.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700" />
                  <div className="text-left">
                    <p className="font-bold text-lg">{p.name}</p>
                    <p className="text-sm text-slate-400 leading-tight">{p.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep(3); }}
                  className={`flex justify-between items-center p-4 rounded-xl border transition-all ${selectedService?.id === s.id ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="font-bold text-amber-500">R$ {s.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Escolha o dia</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Escolha o horário</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableHours.map(h => {
                      const isBusy = busyTimes.includes(h);
                      return (
                        <button
                          key={h}
                          disabled={isBusy}
                          onClick={() => { setSelectedTime(h); setStep(4); }}
                          className={`p-3 rounded-lg font-bold border transition-all ${
                            isBusy ? 'bg-slate-800 border-slate-700 opacity-20 cursor-not-allowed' :
                            selectedTime === h ? 'bg-amber-500 text-slate-900 border-amber-500' :
                            'bg-slate-800 border-slate-700 hover:border-amber-500 text-white'
                          }`}
                        >
                          {h}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 mb-6">
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-3">Resumo</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-slate-400">Profissional:</span> <span className="text-right font-medium">{selectedProfessional?.name}</span>
                  <span className="text-slate-400">Serviço:</span> <span className="text-right font-medium">{selectedService?.name}</span>
                  <span className="text-slate-400">Data:</span> <span className="text-right font-medium">{selectedDate}</span>
                  <span className="text-slate-400">Hora:</span> <span className="text-right font-medium">{selectedTime}</span>
                  <span className="text-slate-400 font-bold border-t border-slate-700 pt-2 mt-2">Total:</span> 
                  <span className="text-right font-bold text-amber-500 border-t border-slate-700 pt-2 mt-2 text-lg">R$ {selectedService?.price.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Telefone / WhatsApp</label>
                <input 
                  type="tel" 
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">E-mail</label>
                <input 
                  type="email" 
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-between">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-lg font-bold border border-slate-600 hover:bg-slate-700 transition-colors"
            >
              Voltar
            </button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button 
              disabled={ (step === 1 && !selectedProfessional) || (step === 2 && !selectedService) || (step === 3 && (!selectedDate || !selectedTime)) }
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 rounded-lg font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          ) : (
            <button 
              disabled={!customerData.name || !customerData.phone}
              onClick={handleFinalize}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold bg-green-600 text-white hover:bg-green-500 transition-all shadow-lg hover:shadow-green-500/20 active:scale-95"
            >
              <Send size={18} />
              Finalizar Agendamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;
