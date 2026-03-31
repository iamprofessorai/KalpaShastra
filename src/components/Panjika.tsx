import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  Star, 
  Zap, 
  Sparkles, 
  Info, 
  X, 
  Clock, 
  Globe, 
  MapPin, 
  Eye, 
  Compass,
  LayoutGrid,
  List,
  CalendarDays
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfYear, endOfYear, eachMonthOfInterval, addDays } from 'date-fns';
import { calculatePanchang, COSMIC_EVENTS, CELESTIAL_SECRETS, PanchangData } from '../lib/panchangUtils';

export const Panjika: React.FC<{ profile?: any }> = ({ profile }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year' | 'timeline'>('month');
  const [location, setLocation] = useState({ lat: 28.6139, lon: 77.2090, name: 'New Delhi' }); // Default: New Delhi
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(prev => ({ ...prev, lat: position.coords.latitude, lon: position.coords.longitude, name: 'Current Location' }));
      });
    }
  }, []);

  const handleUseCurrentLocation = () => {
    setIsSyncing(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ 
            lat: position.coords.latitude, 
            lon: position.coords.longitude, 
            name: 'Current Location' 
          });
          setIsSyncing(false);
          setIsLocationModalOpen(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsSyncing(false);
        }
      );
    } else {
      setIsSyncing(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  const daysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });

  const selectedPanchang = useMemo(() => {
    if (!selectedDate) return null;
    return calculatePanchang(selectedDate, location.lat, location.lon);
  }, [selectedDate, location]);

  const cosmicEvent = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return COSMIC_EVENTS.find(e => e.date === dateStr);
  }, [selectedDate]);

  const secret = useMemo(() => {
    if (!selectedDate) return null;
    const dayOfYear = Math.floor((selectedDate.getTime() - startOfYear(selectedDate).getTime()) / (1000 * 60 * 60 * 24));
    return CELESTIAL_SECRETS[dayOfYear % CELESTIAL_SECRETS.length];
  }, [selectedDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Calendar Grid */}
        <div className="flex-1 w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] tracking-[0.3em] text-primary uppercase">
                L3 Engine: Cosmic Panjika
              </div>
              <h2 className="text-4xl md:text-8xl font-display tracking-tighter celestial-glow uppercase leading-[0.85] mb-4">
                THE YEARLY <br />
                <span className="text-primary/80">PANJIKA.</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 glass border-white/10 rounded-2xl hover:bg-white/5 transition-all group"
              >
                <MapPin className="w-4 h-4 text-primary group-hover:animate-bounce" />
                <div className="text-left">
                  <div className="text-[8px] text-white/40 uppercase tracking-widest font-bold leading-none mb-1">Location</div>
                  <div className="text-xs font-bold text-white/80">{location.name}</div>
                </div>
              </button>

              <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/10 self-start md:self-center">
              <button 
                onClick={() => setViewMode('month')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'month' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                title="Month View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('year')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'year' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                title="Year View"
              >
                <CalendarDays className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'timeline' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                title="Timeline View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

          <AnimatePresence mode="wait">
            {viewMode === 'month' && (
              <motion.div
                key="month-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-3 glass hover:bg-white/10 transition-colors rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center min-w-[120px]">
                      <div className="text-2xl font-black text-primary">{format(currentDate, 'MMMM')}</div>
                      <div className="text-[10px] tracking-widest text-white/40 uppercase">{format(currentDate, 'yyyy')}</div>
                    </div>
                    <button 
                      onClick={handleNextMonth}
                      className="p-3 glass hover:bg-white/10 transition-colors rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] uppercase tracking-widest text-white/20 font-bold py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {days.map(day => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);
                    const event = COSMIC_EVENTS.find(e => e.date === format(day, 'yyyy-MM-dd'));
                    
                    return (
                      <motion.button
                        key={day.toString()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          aspect-square rounded-xl border flex flex-col items-center justify-center relative group transition-all
                          ${isSelected ? 'bg-primary/20 border-primary shadow-[0_0_20px_var(--glow-color)]' : 'glass border-white/5 hover:border-white/20'}
                          ${isTodayDate && !isSelected ? 'border-accent-color/50' : ''}
                        `}
                      >
                        <span className={`text-lg font-black ${isSelected ? 'text-primary' : 'text-white/80'}`}>
                          {format(day, 'd')}
                        </span>
                        {event && (
                          <div className="absolute top-1 right-1">
                            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                          </div>
                        )}
                        {isTodayDate && (
                          <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-color" />
                        )}
                        <div className="absolute top-1 left-1 flex gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-green-500 opacity-40 group-hover:opacity-100" title="Abhijit Muhurat" />
                          <div className="w-1 h-1 rounded-full bg-secondary-color opacity-40 group-hover:opacity-100" title="Rahu Kaal" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {viewMode === 'year' && (
              <motion.div
                key="year-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                  {monthsInYear.map(month => (
                  <div key={month.toString()} className="glass p-4 rounded-2xl border-white/5">
                    <div className="text-primary font-black text-sm mb-4 uppercase tracking-widest">
                      {format(month, 'MMMM')}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[8px] text-white/20 text-center font-bold">{d}</div>
                      ))}
                      {Array.from({ length: startOfMonth(month).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                      ))}
                      {eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }).map(day => {
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);
                        const event = COSMIC_EVENTS.find(e => e.date === format(day, 'yyyy-MM-dd'));
                        
                        return (
                          <button
                            key={day.toString()}
                            onClick={() => {
                              setSelectedDate(day);
                              setViewMode('month');
                              setCurrentDate(day);
                            }}
                            className={`
                              aspect-square rounded-md flex items-center justify-center text-[10px] font-bold relative
                              ${isSelected ? 'bg-primary text-black' : 'hover:bg-white/5 text-white/60'}
                              ${isTodayDate ? 'border border-accent-color/50' : ''}
                            `}
                          >
                            {format(day, 'd')}
                            {event && <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-primary rounded-full" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {viewMode === 'timeline' && (
              <motion.div
                key="timeline-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-[600px] overflow-y-auto pr-4 space-y-4 custom-scrollbar"
              >
                {daysInYear.map(day => {
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  const event = COSMIC_EVENTS.find(e => e.date === format(day, 'yyyy-MM-dd'));
                  const panchang = calculatePanchang(day, location.lat, location.lon);
                  
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        w-full flex items-center gap-6 p-4 rounded-2xl border transition-all text-left
                        ${isSelected ? 'bg-primary/10 border-primary' : 'glass border-white/5 hover:border-white/10'}
                        ${isTodayDate ? 'ring-1 ring-accent-color/50' : ''}
                      `}
                    >
                      <div className="min-w-[60px] text-center">
                        <div className="text-2xl font-black leading-none">{format(day, 'd')}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40">{format(day, 'MMM')}</div>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">{panchang.masa} • {panchang.vara}</span>
                          {event && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-bold uppercase rounded-full">
                              {event.name}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-white/80">
                          {panchang.tithi.name} Tithi • {panchang.nakshatra.name} Nakshatra
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="text-right">
                          <div className="text-[8px] text-white/40 uppercase tracking-widest">Sunrise</div>
                          <div className="text-xs font-mono">{format(panchang.sunrise, 'HH:mm')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] text-white/40 uppercase tracking-widest">Sunset</div>
                          <div className="text-xs font-mono">{format(panchang.sunset, 'HH:mm')}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Details Panel */}
        <AnimatePresence mode="wait">
          {selectedPanchang && (
            <motion.div
              key={selectedDate?.toString()}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[450px] space-y-6"
            >
              <div className="glass p-8 rounded-3xl border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <CalendarIcon className="w-32 h-32" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-primary font-bold tracking-widest uppercase text-xs mb-1">
                        {selectedPanchang.masa} • {selectedPanchang.vara}
                      </div>
                      <h3 className="text-3xl font-black celestial-glow">
                        {format(selectedDate!, 'do MMMM')}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] tracking-widest text-white/40 uppercase mb-1">Sidereal Sync</div>
                      <div className="flex items-center gap-2 text-primary">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 text-white/40 mb-2">
                        <Moon className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Tithi</span>
                      </div>
                      <div className="text-lg font-black text-primary">{selectedPanchang.tithi.name}</div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedPanchang.tithi.progress * 100}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 text-white/40 mb-2">
                        <Star className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Nakshatra</span>
                      </div>
                      <div className="text-lg font-black text-accent-color">{selectedPanchang.nakshatra.name}</div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedPanchang.nakshatra.progress * 100}%` }}
                          className="h-full bg-accent-color"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 text-white/40 mb-2">
                        <Zap className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Yoga</span>
                      </div>
                      <div className="text-lg font-black text-primary/80">{selectedPanchang.yoga.name}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 text-white/40 mb-2">
                        <Compass className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Karana</span>
                      </div>
                      <div className="text-lg font-black text-accent-color/80">{selectedPanchang.karana.name}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/40">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Muhurats</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--glow-color)]" />
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">Abhijit Muhurat</span>
                        </div>
                        <span className="text-xs font-mono text-white/60">
                          {format(selectedPanchang.abhijit.start, 'HH:mm')} - {format(selectedPanchang.abhijit.end, 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/5 border border-secondary/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_var(--glow-color)]" />
                          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Rahu Kaal</span>
                        </div>
                        <span className="text-xs font-mono text-white/60">
                          {format(selectedPanchang.rahuKaal.start, 'HH:mm')} - {format(selectedPanchang.rahuKaal.end, 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {cosmicEvent && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-primary/10 border border-primary/30 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Cosmic Event</span>
                      </div>
                      <h4 className="text-xl font-black">{cosmicEvent.name}</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{cosmicEvent.description}</p>
                    </motion.div>
                  )}

                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-white/40">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Celestial Secret</span>
                    </div>
                    <p className="text-sm text-primary/80 italic leading-relaxed">
                      "{secret}"
                    </p>
                  </div>

                  {/* Orbital Transactory Section */}
                  <div className="p-6 glass border-primary/20 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Orbital Transactory</span>
                      </div>
                      <div className="px-2 py-0.5 bg-primary/10 rounded text-[8px] text-primary font-mono animate-pulse">
                        REAL-TIME SYNC
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { planet: 'Jupiter', action: 'Direct Motion', status: 'Stable', color: 'text-primary' },
                        { planet: 'Saturn', action: 'Retrograde Phase', status: 'Intense', color: 'text-accent-color' },
                        { planet: 'Venus', action: 'Combust', status: 'Critical', color: 'text-secondary-color' },
                      ].map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 group hover:border-primary/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-1 h-8 rounded-full ${tx.color.replace('text-', 'bg-')} opacity-50`} />
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">{tx.planet}</div>
                              <div className="text-[8px] text-white/40 uppercase tracking-tighter">{tx.action}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-[10px] font-mono ${tx.color}`}>{tx.status}</div>
                            <div className="text-[8px] text-white/20 uppercase tracking-widest">Alignment</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <Sun className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-[8px] text-white/40 uppercase tracking-widest">Sunrise</div>
                        <div className="text-xs font-bold">{format(selectedPanchang.sunrise, 'HH:mm')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Moon className="w-4 h-4 text-accent-color" />
                      <div>
                        <div className="text-[8px] text-white/40 uppercase tracking-widest">Moonrise</div>
                        <div className="text-xs font-bold">{format(selectedPanchang.moonrise, 'HH:mm')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLocationModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass border-primary/20 rounded-3xl p-8 space-y-8 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Set Location</h3>
                </div>
                <button 
                  onClick={() => setIsLocationModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={handleUseCurrentLocation}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/80 transition-all disabled:opacity-50"
                >
                  {isSyncing ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  Use Current Location
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-4 bg-[#0a0a0a] text-white/20 font-bold tracking-widest">Or Select City</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
                    { name: 'New York', lat: 40.7128, lon: -74.0060 },
                    { name: 'London', lat: 51.5074, lon: -0.1278 },
                    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
                    { name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
                    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 }
                  ].map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setLocation(city);
                        setIsLocationModalOpen(false);
                      }}
                      className="p-3 glass border-white/5 hover:border-primary/30 hover:bg-primary/5 rounded-xl text-left transition-all group"
                    >
                      <div className="text-xs font-bold group-hover:text-primary transition-colors">{city.name}</div>
                      <div className="text-[8px] text-white/20 font-mono mt-1">
                        {city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Manual Coordinates</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-widest text-white/20 font-bold ml-2">Latitude</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        value={location.lat}
                        onChange={(e) => setLocation(prev => ({ ...prev, lat: parseFloat(e.target.value), name: 'Custom' }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-widest text-white/20 font-bold ml-2">Longitude</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        value={location.lon}
                        onChange={(e) => setLocation(prev => ({ ...prev, lon: parseFloat(e.target.value), name: 'Custom' }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
