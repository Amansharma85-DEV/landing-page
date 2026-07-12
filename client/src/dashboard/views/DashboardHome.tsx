import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MessageSquare,
  Utensils,
  Star,
  Check,
  X,
  Trash2,
  Clock
} from 'lucide-react';
import api from '../../services/api';

interface Stats {
  totalReservations: number;
  pendingReservations: number;
  totalNewsletter: number;
  totalMessages: number;
  totalMenuItems: number;
  totalGallery: number;
  rating: number;
  reviewsCount: number;
}

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Message {
  _id: string;
  type: 'contact' | 'newsletter';
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.success) {
        setStats(response.data.stats);
        setBookings(response.data.recentBookings);
        setMessages(response.data.recentMessages);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const res = await api.put(`/admin/reservations/${id}`, { status });
      if (res.success) {
        setBookings(prev =>
          prev.map(b => (b._id === id ? { ...b, status } : b))
        );
        // Refresh stats to update pending counter
        fetchDashboardData();
      }
    } catch (err: any) {
      alert(err.message || 'Error updating reservation status.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      try {
        const res = await api.delete(`/admin/messages/${id}`);
        if (res.success) {
          setMessages(prev => prev.filter(m => m._id !== id));
          fetchDashboardData();
        }
      } catch (err: any) {
        alert(err.message || 'Error deleting message.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-300 text-sm rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reservations Box */}
        <div className="bg-[#0e0e0e] border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Reservations</p>
            <h3 className="text-xl font-bold text-zinc-200 mt-0.5">{stats?.totalReservations || 0}</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              <span className="text-primary font-medium">{stats?.pendingReservations || 0}</span> pending approval
            </p>
          </div>
        </div>

        {/* Messages Box */}
        <div className="bg-[#0e0e0e] border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Contact Messages</p>
            <h3 className="text-xl font-bold text-zinc-200 mt-0.5">{stats?.totalMessages || 0}</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              <span className="text-primary font-medium">{stats?.totalNewsletter || 0}</span> newsletter leads
            </p>
          </div>
        </div>

        {/* Menu Items Box */}
        <div className="bg-[#0e0e0e] border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Active Dishes</p>
            <h3 className="text-xl font-bold text-zinc-200 mt-0.5">{stats?.totalMenuItems || 0}</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Categorized menu items</p>
          </div>
        </div>

        {/* Rating/Reviews Box */}
        <div className="bg-[#0e0e0e] border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Google Rating</p>
            <h3 className="text-xl font-bold text-zinc-200 mt-0.5 flex items-center gap-1">
              {stats?.rating || 4.9}
              <Star className="w-4 h-4 fill-primary text-primary" />
            </h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Based on {stats?.reviewsCount || 1200} reviews</p>
          </div>
        </div>
      </div>

      {/* Recents Lists Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Bookings Panel */}
        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-md text-zinc-200">Recent Booking Requests</h3>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Table Bookings
            </span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No reservations booked yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div
                  key={booking._id}
                  className="p-4 rounded-lg bg-[#111111] border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-zinc-300">{booking.name}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-950/55 text-green-400 border border-green-500/10' :
                        booking.status === 'cancelled' ? 'bg-red-950/55 text-red-400 border border-red-500/10' :
                        'bg-yellow-950/55 text-yellow-400 border border-yellow-500/10'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time} • <span className="text-primary">{booking.guests} Guests</span>
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {booking.phone} | {booking.email}
                    </p>
                    {booking.specialRequests && (
                      <p className="text-[10px] text-zinc-500 italic mt-1.5 p-2 bg-[#161616] rounded border border-zinc-900">
                        "{booking.specialRequests}"
                      </p>
                    )}
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                        className="p-1.5 bg-green-950/60 border border-green-500/25 hover:bg-green-600 hover:text-black rounded text-green-400 cursor-pointer transition-colors"
                        title="Confirm Booking"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                        className="p-1.5 bg-red-950/60 border border-red-500/25 hover:bg-red-600 hover:text-black rounded text-red-400 cursor-pointer transition-colors"
                        title="Cancel Booking"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages Panel */}
        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-md text-zinc-200">Recent Customer Inquiries</h3>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Contact Forms
            </span>
          </div>

          {messages.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No messages received yet.</p>
          ) : (
            <div className="space-y-4">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className="p-4 rounded-lg bg-[#111111] border border-zinc-800/80 flex justify-between gap-4"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-zinc-300 truncate">{msg.name || 'Anonymous Subscriber'}</h4>
                      <span className="text-[9px] px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-400">
                        {msg.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      {msg.email} {msg.phone ? `| ${msg.phone}` : ''}
                    </p>
                    {msg.message && (
                      <p className="text-xs text-zinc-400 mt-2 p-2 bg-[#161616] rounded border border-zinc-900 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    )}
                    <span className="text-[9px] text-zinc-600 block mt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="p-1.5 hover:text-red-400 text-zinc-600 border border-transparent hover:border-zinc-800 hover:bg-[#181818] rounded cursor-pointer self-start transition-colors shrink-0"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
