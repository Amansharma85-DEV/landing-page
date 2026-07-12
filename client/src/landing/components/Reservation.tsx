import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, User, Phone, Mail, ChevronRight, CheckCircle } from 'lucide-react';

interface SettingsData {
  phone?: string;
  email?: string;
}

interface Props {
  settings: SettingsData;
}

const guestOptions = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6 Guests', '7–10 Guests', '10+ Guests'];
const timeSlots = ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

const Reservation: React.FC<Props> = ({ settings: _settings }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch { /* ignore */ }
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 800);
  };

  const inputCls = 'w-full bg-forest border border-gold/10 text-cream placeholder-muted text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all duration-300 appearance-none';

  return (
    <section id="reservation" className="py-24 bg-forest relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label justify-center">Book Your Table</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-3">
            Make a <span className="gold-gradient">Reservation</span>
          </h2>
          <p className="text-cream/50 text-sm max-w-md mx-auto">
            Reserve your table for an unforgettable dining experience. We'll confirm within 2 hours.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/40 border border-gold/10"
        >
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <CheckCircle className="w-16 h-16 text-gold mx-auto" />
              </motion.div>
              <h3 className="font-serif text-2xl font-bold text-cream">Reservation Received!</h3>
              <p className="text-muted max-w-xs mx-auto text-sm">
                Thank you, {form.name}! We'll confirm your table for {form.date} at {form.time} shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', date: '', time: '', guests: '', note: '' }); }}
                className="btn-outline mt-4"
              >
                Make Another Booking
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    name="name" value={form.name} onChange={handleChange}
                    required placeholder="Full Name"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    name="email" value={form.email} onChange={handleChange}
                    type="email" required placeholder="Email Address"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                    type="tel" required placeholder="Phone Number"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <select
                    name="guests" value={form.guests} onChange={handleChange}
                    required className={`${inputCls} pl-10`}
                  >
                    <option value="" disabled>Number of Guests</option>
                    {guestOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    name="date" value={form.date} onChange={handleChange}
                    type="date" required
                    min={new Date().toISOString().split('T')[0]}
                    className={`${inputCls} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <select
                    name="time" value={form.time} onChange={handleChange}
                    required className={`${inputCls} pl-10`}
                  >
                    <option value="" disabled>Preferred Time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 4 */}
              <textarea
                name="note" value={form.note} onChange={handleChange}
                placeholder="Special requests, dietary restrictions, occasion... (optional)"
                rows={3}
                className={`${inputCls} resize-none`}
              />

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto justify-center">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full block"
                      />
                      Confirming...
                    </span>
                  ) : (
                    <>Confirm Reservation <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-[10px] text-muted text-center sm:text-left">
                  We confirm within 2 hours via email or phone
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Reservation;
