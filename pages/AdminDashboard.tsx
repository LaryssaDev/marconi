
import React, { useState, useEffect, useMemo } from 'react';
import { User, Booking, BookingStatus } from '../types';
import { PROFESSIONALS, SERVICES } from '../constants';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings'>('overview');

  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem('barbearia_bookings') || '[]');
      setBookings(data);
    };
    load();
    const interval = setInterval(load, 5000); // Poll for new bookings
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = (id: string, status: BookingStatus) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem('barbearia_bookings', JSON.stringify(updated));
  };

  // Stats Logic
  const stats = useMemo(() => {
    const relevantBookings = user.role === 'manager' 
      ? bookings 
      : bookings.filter(b => b.professionalId === user.id);

    const approvedBookings = relevantBookings.filter(b => b.status === 'approved');
    const pendingBookings = relevantBookings.filter(b => b.status === 'pending');

    const totalRevenue = approvedBookings.reduce((acc, b) => acc + b.totalValue, 0);

    // Individual billing (for manager)
    const billingPerBarber = PROFESSIONALS.filter(p => p.role === 'barber').map(p => {
      const barberRev = bookings
        .filter(b => b.professionalId === p.id && b.status === 'approved')
        .reduce((acc, b) => acc + b.totalValue, 0);
      return { name: p.name, value: barberRev };
    });

    // Most used service
    const serviceCounts: Record<string, number> = {};
    approvedBookings.forEach(b => {
      const s = SERVICES.find(svc => svc.id === b.serviceId)?.name || 'Outro';
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });
    const topService = Object.entries(serviceCounts).sort((a,b) => b[1] - a[1])[0] || ['Nenhum', 0];

    // Most busy professional
    const profCounts: Record<string, number> = {};
    bookings.filter(b => b.status === 'approved').forEach(b => {
      const p = PROFESSIONALS.find(prof => prof.id === b.professionalId)?.name || 'Outro';
      profCounts[p] = (profCounts[p] || 0) + 1;
    });
    const topProfessional = Object.entries(profCounts).sort((a,b) => b[1] - a[1])[0] || ['Nenhum', 0];

    return {
      totalRevenue,
      billingPerBarber,
      pendingCount: pendingBookings.length,
      approvedCount: approvedBookings.length,
      topService,
      topProfessional
    };
  }, [bookings, user]);

  const filteredBookings = bookings.filter(b => {
    if (user.role === 'manager') return true;
    return b.professionalId === user.id;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-950 font-display text-xl">M</div>
          <div>
            <p className="font-bold text-sm tracking-tight">MARCONI ADMIN</p>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">{user.role}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={20} />
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'bookings' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <CalendarCheck size={20} />
            Agendamentos
            {stats.pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{stats.pendingCount}</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">{user.name[0]}</div>
             <p className="text-sm font-medium truncate">{user.name}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all font-medium"
          >
            <LogOut size={18} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display">{activeTab === 'overview' ? 'DASHBOARD INDICADORES' : 'GESTOR DE AGENDAMENTOS'}</h1>
          <p className="text-slate-400">{activeTab === 'overview' ? 'Confira o desempenho da barbearia em tempo real.' : 'Gerencie solicitações e horários confirmados.'}</p>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><DollarSign size={24}/></div>
                  <TrendingUp size={16} className="text-green-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Faturamento {user.role === 'barber' ? 'Seu' : 'Total'}</p>
                <p className="text-3xl font-bold mt-1">R$ {stats.totalRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><CalendarCheck size={24}/></div>
                  <span className="text-xs font-bold text-slate-500">Últimos 30 dias</span>
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Atendimentos</p>
                <p className="text-3xl font-bold mt-1">{stats.approvedCount}</p>
              </div>

              <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl"><Briefcase size={24}/></div>
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Mais Realizado</p>
                <p className="text-xl font-bold mt-1">{stats.topService[0]}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.topService[1]} execuções</p>
              </div>

              {user.role === 'manager' && (
                <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl"><Users size={24}/></div>
                  </div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Top Profissional</p>
                  <p className="text-xl font-bold mt-1">{stats.topProfessional[0]}</p>
                  <p className="text-xs text-slate-500 mt-1">{stats.topProfessional[1]} serviços</p>
                </div>
              )}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {user.role === 'manager' && (
                <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-amber-500" />
                    Faturamento Individual
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.billingPerBarber}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                          itemStyle={{ color: '#fbbf24' }}
                        />
                        <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-6">Status dos Agendamentos</h3>
                <div className="h-64 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Confirmados', value: stats.approvedCount },
                          { name: 'Pendentes', value: stats.pendingCount },
                          { name: 'Cancelados', value: bookings.filter(b => b.status === 'rejected').length },
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-1/3 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-xs text-slate-400">Confirmados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-slate-400">Pendentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-slate-400">Cancelados</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-in slide-in-from-bottom duration-500">
            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Serviço</th>
                      {user.role === 'manager' && <th className="px-6 py-4">Barbeiro</th>}
                      <th className="px-6 py-4">Data/Hora</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-slate-500 font-medium">Nenhum agendamento encontrado.</td>
                      </tr>
                    ) : filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm">{b.customerName}</p>
                          <p className="text-xs text-slate-500">{b.customerPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{SERVICES.find(s => s.id === b.serviceId)?.name}</p>
                          <p className="text-xs text-amber-500 font-bold">R$ {b.totalValue.toFixed(2)}</p>
                        </td>
                        {user.role === 'manager' && (
                          <td className="px-6 py-4">
                            <span className="text-sm">{PROFESSIONALS.find(p => p.id === b.professionalId)?.name}</span>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarCheck size={14} className="text-slate-500" />
                            {new Date(b.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                            <Clock size={14} className="text-slate-500" />
                            {b.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                            b.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                            {b.status === 'approved' ? 'Aprovado' : b.status === 'rejected' ? 'Recusado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {b.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleStatusUpdate(b.id, 'approved')}
                                className="p-2 bg-green-500 text-slate-950 rounded-lg hover:bg-green-400 transition-colors shadow-lg shadow-green-500/10"
                                title="Aceitar"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(b.id, 'rejected')}
                                className="p-2 bg-slate-800 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                title="Recusar"
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">Concluído</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
