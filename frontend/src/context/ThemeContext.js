import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  cloud:   { name:'Cloud',   emoji:'☁️', light:{bg:'#f8faff',card:'#ffffff',sidebar:'#eef2fb',accent:'#5b9bd5',text:'#1a2540',muted:'#7a8aaa',border:'#dce4f0'}, dark:{bg:'#151c2e',card:'#1e2844',sidebar:'#131a2e',accent:'#7ab3e8',text:'#e8eeff',muted:'#6070a0',border:'#2a3454'} },
  sage:    { name:'Sage',    emoji:'🌿', light:{bg:'#f4f7f2',card:'#ffffff',sidebar:'#eaf0e6',accent:'#5a8a5e',text:'#1e2d1e',muted:'#7a9a7a',border:'#d4e4d0'}, dark:{bg:'#162016',card:'#1e2e1e',sidebar:'#121c12',accent:'#7ab87e',text:'#e4f0e4',muted:'#5a7a5a',border:'#2a3e2a'} },
  blossom: { name:'Blossom', emoji:'🌸', light:{bg:'#fff5f7',card:'#ffffff',sidebar:'#feeaee',accent:'#d4688a',text:'#2d1a20',muted:'#b08090',border:'#f0d0d8'}, dark:{bg:'#2d1520',card:'#3d1e28',sidebar:'#251018',accent:'#e8a0b8',text:'#ffe8f0',muted:'#a06878',border:'#4d2838'} },
  ocean:   { name:'Ocean',   emoji:'🌊', light:{bg:'#f0f8ff',card:'#ffffff',sidebar:'#e0f0fa',accent:'#2a7ab5',text:'#0d2035',muted:'#5a8aaa',border:'#c0dff0'}, dark:{bg:'#0d1e2d',card:'#102535',sidebar:'#081825',accent:'#5ab5e8',text:'#d8f0ff',muted:'#3a6a8a',border:'#1a3548'} },
  dusk:    { name:'Dusk',    emoji:'🌙', light:{bg:'#f8f5ff',card:'#ffffff',sidebar:'#f0eaff',accent:'#7c5cbf',text:'#1e1535',muted:'#8a70b0',border:'#e0d0f8'}, dark:{bg:'#150d25',card:'#1e1535',sidebar:'#100a1e',accent:'#b09ae8',text:'#ece8ff',muted:'#6a5090',border:'#2e2048'} },
  autumn:  { name:'Autumn',  emoji:'🍂', light:{bg:'#fff8f0',card:'#ffffff',sidebar:'#fff0e0',accent:'#c8622a',text:'#2d1a08',muted:'#a07850',border:'#f0d8b8'}, dark:{bg:'#1e0e05',card:'#2d1808',sidebar:'#180c04',accent:'#e8924a',text:'#fff0d8',muted:'#8a5830',border:'#3d2210'} },
  noir:    { name:'Noir',    emoji:'🖤', light:{bg:'#f5f5f5',card:'#ffffff',sidebar:'#eeeeee',accent:'#222222',text:'#111111',muted:'#888888',border:'#dddddd'}, dark:{bg:'#0a0a0a',card:'#141414',sidebar:'#080808',accent:'#ffffff',text:'#f0f0f0',muted:'#555555',border:'#222222'} },
  citrus:  { name:'Citrus',  emoji:'🍋', light:{bg:'#fffff0',card:'#ffffff',sidebar:'#fffde0',accent:'#c8a820',text:'#1e1e00',muted:'#8a8a30',border:'#f0f0b0'}, dark:{bg:'#1a1a00',card:'#252500',sidebar:'#141400',accent:'#e8d050',text:'#fffff0',muted:'#6a6a20',border:'#303010'} },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => localStorage.getItem('haven_theme') || 'cloud');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('haven_dark') === 'true');
  const [customColors, setCustomColors] = useState(null);

  const applyColors = (colors) => {
    const r = document.documentElement.style;
    r.setProperty('--bg-primary', colors.bg);
    r.setProperty('--bg-secondary', colors.sidebar);
    r.setProperty('--bg-card', colors.card);
    r.setProperty('--bg-sidebar', colors.sidebar);
    r.setProperty('--accent', colors.accent);
    r.setProperty('--accent-hover', colors.accent);
    r.setProperty('--text-primary', colors.text);
    r.setProperty('--text-secondary', colors.muted);
    r.setProperty('--text-muted', colors.muted);
    r.setProperty('--border', colors.border);
  };

  useEffect(() => {
    const theme = THEMES[themeName] || THEMES.cloud;
    const colors = customColors || (isDark ? theme.dark : theme.light);
    applyColors(colors);
    localStorage.setItem('haven_theme', themeName);
    localStorage.setItem('haven_dark', String(isDark));
  }, [themeName, isDark, customColors]);

  const switchTheme = (name) => { setThemeName(name); setCustomColors(null); };
  const toggleDark = () => setIsDark(d => !d);
  const applyCustom = (cols) => setCustomColors(cols);

  return (
    <ThemeContext.Provider value={{ themeName, isDark, toggleDark, switchTheme, applyCustom, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
