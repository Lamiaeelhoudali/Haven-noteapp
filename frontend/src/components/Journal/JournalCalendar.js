import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import JournalEditor from './JournalEditor';
import toast from 'react-hot-toast';

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function JournalCalendar() {
  const today = new Date();
  const [year,     setYear]     = useState(today.getFullYear());
  const [month,    setMonth]    = useState(today.getMonth());
  const [calendar, setCalendar] = useState({});
  const [streak,   setStreak]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/journal/calendar?year=${year}`);
      setCalendar(res.data.data);
      setStreak(res.data.streak || 0);
    } catch { toast.error('Failed to load calendar'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCalendar(); }, [year]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  const getKey = (day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleDayClick = async (day) => {
    const key = getKey(day);
    const entries = calendar[key];
    if (!entries || entries.length === 0) {
          const date = new Date(year, month, day, 12, 0, 0);
          setSelected({ _id: null, entryDate: date, title: '', content: '', mood: {}, tags: [] });
          return; 
    }
    try {
      const res = await api.get(`/journal/${entries[0].id}`);
      setSelected(res.data.data);
    } catch { toast.error('Failed to open entry'); }
  };

  if (selected) {
    return <JournalEditor entry={selected} onClose={() => { setSelected(null); fetchCalendar(); }} />;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'1.3rem' }}>
            {MONTHS[month]} {year}
          </h2>
          {streak > 0 && (
            <div style={{ fontSize:'0.82rem', color:'var(--accent)', marginTop:'0.2rem' }}>
              🔥 {streak} day streak
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:'0.4rem' }}>
          <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={18} /></button>
          <button className="btn-icon" onClick={nextMonth}><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Day name headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'0.2rem', marginBottom:'0.4rem' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:'0.72rem', color:'var(--text-muted)', fontWeight:600, padding:'0.25rem' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      {loading ? (
        <div className="loading-skeleton" style={{ height:240 }} />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'0.2rem' }}>
          {/* empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

          {/* actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day     = i + 1;
            const key     = getKey(day);
            const entries = calendar[key];
            const hasEntry= entries && entries.length > 0;
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

            return (
              <div
                key={day}
                className={`calendar-day ${hasEntry ? 'has-entry' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(day)}
                title={hasEntry ? `${entries.length} entry — click to open` : ''}
              >
                <span>{day}</span>
                {hasEntry && (
                  <div style={{ display:'flex', gap:'1px', marginTop:'2px', flexWrap:'wrap', justifyContent:'center' }}>
                    {entries.slice(0,2).map((e, ei) => (
                      <span key={ei} style={{ fontSize:'0.6rem' }}>{e.mood?.emoji || '📝'}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop:'1.25rem', display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.75rem', color:'var(--text-muted)' }}>
          <div style={{ width:12, height:12, borderRadius:4, background:'var(--bg-secondary)', border:'1px solid var(--accent)' }} />
          Has entry (click to open)
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.75rem', color:'var(--text-muted)' }}>
          <div style={{ width:12, height:12, borderRadius:4, border:'2px solid var(--accent)' }} />
          Today
        </div>
      </div>
    </div>
  );
}
