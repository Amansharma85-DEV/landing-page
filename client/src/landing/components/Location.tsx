import React from 'react';
import { MapPin, Phone, Navigation, MessageCircle } from 'lucide-react';

interface SettingsData {
  address?: string;
  phone?: string;
  whatsapp?: string;
  googleMapsLink?: string;
  workingHours?: Array<{ day: string; hours: string }>;
}

interface Props {
  settings: SettingsData;
}

const Location: React.FC<Props> = ({ settings }) => {
  const whatsappNum = settings.whatsapp?.replace(/\D/g, '');

  return (
    <section id="contact" className="py-24 bg-obsidian relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-jade/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label justify-center">Visit Us</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">
            Find Us <span className="gold-gradient">Here</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Map */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-gold/10 shadow-2xl shadow-black/50"
            style={{ height: '420px' }}>
            {settings.googleMapsLink ? (
              <iframe
                src={settings.googleMapsLink}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.5) invert(0.9) hue-rotate(135deg) brightness(0.65) saturate(0.8)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full bg-forest flex items-center justify-center">
                <MapPin className="w-12 h-12 text-muted" />
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Address */}
            <div className="glass p-6 rounded-2xl border border-gold/8 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] text-muted uppercase tracking-widest mb-1">Address</div>
                  <p className="text-cream text-sm leading-relaxed">{settings.address || '123 Michelin Avenue, Gourmet District, NY 10001'}</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            {settings.workingHours && settings.workingHours.length > 0 && (
              <div className="glass p-6 rounded-2xl border border-gold/8 space-y-3">
                <div className="text-[10px] text-gold uppercase tracking-widest font-bold mb-3">Opening Hours</div>
                <div className="space-y-2">
                  {settings.workingHours.map((h, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted">{h.day}</span>
                      <span className="text-cream font-medium">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 glass px-5 py-3.5 rounded-xl border border-gold/10 hover:border-gold/30 text-cream hover:text-gold transition-all duration-300 group"
                >
                  <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="text-[9px] text-muted uppercase tracking-wider">Call Us</div>
                    <div className="text-sm font-medium">{settings.phone}</div>
                  </div>
                </a>
              )}

              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 glass px-5 py-3.5 rounded-xl border border-green-500/15 hover:border-green-500/40 text-cream hover:text-green-400 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-[9px] text-muted uppercase tracking-wider">WhatsApp</div>
                    <div className="text-sm font-medium">Chat with Us</div>
                  </div>
                </a>
              )}

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address || '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 glass px-5 py-3.5 rounded-xl border border-blue-500/15 hover:border-blue-500/40 text-cream hover:text-blue-400 transition-all duration-300 group"
              >
                <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Navigation className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">Navigate</div>
                  <div className="text-sm font-medium">Get Directions</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
