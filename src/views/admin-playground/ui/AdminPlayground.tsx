'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/shared/ui/admin/AdminSidebar';
import { useRouter } from 'next/navigation';
import { Copy, Save, Moon, Sun, CheckCircle, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPlayground() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [toast, setToast] = useState<string | null>(null);

  const getInitialThemeConfig = (isDark: boolean) => ({
    bg: isDark ? '#222831' : '#F9F7F7',
    secondary: isDark ? '#393E46' : '#DBE2EF',
    text: isDark ? '#EEEEEE' : '#112D4E',
    accent: isDark ? '#00ADB5' : '#3F72AF',
    shadowOpacity: isDark ? 0.5 : 0.08,
    shadowBlur: 16,
    glassOpacity: isDark ? 0.1 : 0.4,
  });

  // Theme State Variables
  const [themeConfig, setThemeConfig] = useState(getInitialThemeConfig(isDark));
  const [prevIsDark, setPrevIsDark] = useState(isDark);

  if (isDark !== prevIsDark) {
    setPrevIsDark(isDark);
    setThemeConfig(getInitialThemeConfig(isDark));
  }

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  // Apply theme to document in real-time
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-neu-bg', themeConfig.bg);
    root.style.setProperty('--color-neu-secondary', themeConfig.secondary);
    root.style.setProperty('--color-neu-text', themeConfig.text);
    root.style.setProperty('--color-neu-accent', themeConfig.accent);

    const lightShadowHex = isDark ? themeConfig.secondary : '#ffffff'; // Light shadow color
    
    // We can't perfectly construct complex rgba shadows with hex without parsing, 
    // but CSS handles rgba(0,0,0, opacity) well enough for the playground
    const blur = themeConfig.shadowBlur;
    const sOpacity = themeConfig.shadowOpacity;
    
    root.style.setProperty('--shadow-neu', `8px 8px ${blur}px rgba(0,0,0,${sOpacity}), -8px -8px ${blur}px ${lightShadowHex}`);
    root.style.setProperty('--shadow-neu-inset', `inset 6px 6px ${blur-4}px rgba(0,0,0,${sOpacity}), inset -6px -6px ${blur-4}px ${lightShadowHex}`);
    root.style.setProperty('--shadow-neu-sm', `4px 4px ${blur/2}px rgba(0,0,0,${sOpacity}), -4px -4px ${blur/2}px ${lightShadowHex}`);
    root.style.setProperty('--shadow-neu-modal', `16px 16px ${blur*2}px rgba(0,0,0,${sOpacity*1.5}), -16px -16px ${blur*2}px ${lightShadowHex}`);

    return () => {
      // Clean up inline styles when leaving the playground to restore globals.css
      root.style.removeProperty('--color-neu-bg');
      root.style.removeProperty('--color-neu-secondary');
      root.style.removeProperty('--color-neu-text');
      root.style.removeProperty('--color-neu-accent');
      root.style.removeProperty('--shadow-neu');
      root.style.removeProperty('--shadow-neu-inset');
      root.style.removeProperty('--shadow-neu-sm');
      root.style.removeProperty('--shadow-neu-modal');
    };
  }, [themeConfig, isDark]);

  const handleExport = () => {
    const sOpacity = themeConfig.shadowOpacity;
    const blur = themeConfig.shadowBlur;
    const lightShadowHex = isDark ? themeConfig.secondary : '#ffffff';
    
    const cssString = `
/* Copy this to globals.css under ${isDark ? '.dark' : ':root'} */
${isDark ? '.dark' : ':root'} {
  --color-neu-bg: ${themeConfig.bg};
  --color-neu-secondary: ${themeConfig.secondary};
  --color-neu-text: ${themeConfig.text};
  --color-neu-accent: ${themeConfig.accent};

  --shadow-neu: 8px 8px ${blur}px rgba(0,0,0,${sOpacity}), -8px -8px ${blur}px ${lightShadowHex};
  --shadow-neu-inset: inset 6px 6px ${blur-4}px rgba(0,0,0,${sOpacity}), inset -6px -6px ${blur-4}px ${lightShadowHex};
  --shadow-neu-sm: 4px 4px ${blur/2}px rgba(0,0,0,${sOpacity}), -4px -4px ${blur/2}px ${lightShadowHex};
  --shadow-neu-modal: 16px 16px ${blur*2}px rgba(0,0,0,${sOpacity*1.5}), -16px -16px ${blur*2}px ${lightShadowHex};
}`;
    navigator.clipboard.writeText(cssString.trim());
    setToast("CSS Copied to clipboard!");
    setTimeout(() => setToast(null), 3000);
  };

  const updateConfig = (key: string, value: string | number) => {
    setThemeConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      <AdminSidebar activePath="/admin/playground" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
              <Palette size={24} className="text-neu-accent" />
              Theme Playground
            </h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-3 rounded-full glass-card hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-neu-accent text-white font-bold rounded-xl shadow-neu-sm hover:scale-105 active:scale-95 transition-all text-sm"
              >
                <Copy size={16} /> Export CSS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Controls Panel */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-3xl glass-card border border-white/5 space-y-6">
                <h3 className="font-bold border-b border-black/10 dark:border-white/10 pb-3">Colors</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Background', key: 'bg' },
                    { label: 'Secondary / Surface', key: 'secondary' },
                    { label: 'Primary Accent', key: 'accent' },
                    { label: 'Text Color', key: 'text' },
                  ].map((color) => (
                    <div key={color.key} className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold text-neu-text-muted flex justify-between">
                        {color.label} <span>{(themeConfig as any)[color.key]}</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={(themeConfig as any)[color.key]} 
                          onChange={(e) => updateConfig(color.key, e.target.value)}
                          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0" 
                        />
                        <div className="flex-1 px-4 py-2 glass-card-inset rounded-xl font-mono text-sm opacity-50">
                          {(themeConfig as any)[color.key]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-white/5 space-y-6">
                <h3 className="font-bold border-b border-black/10 dark:border-white/10 pb-3">Effects (Shadow & Blur)</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-neu-text-muted flex justify-between">
                      Shadow Intensity <span>{themeConfig.shadowOpacity.toFixed(2)}</span>
                    </label>
                    <input 
                      type="range" min="0.01" max="1" step="0.01"
                      value={themeConfig.shadowOpacity}
                      onChange={(e) => updateConfig('shadowOpacity', parseFloat(e.target.value))}
                      className="w-full accent-neu-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-neu-text-muted flex justify-between">
                      Shadow Blur (px) <span>{themeConfig.shadowBlur}</span>
                    </label>
                    <input 
                      type="range" min="4" max="64" step="1"
                      value={themeConfig.shadowBlur}
                      onChange={(e) => updateConfig('shadowBlur', parseInt(e.target.value))}
                      className="w-full accent-neu-accent"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Live Preview Panel */}
            <div className="lg:col-span-7 sticky top-8 space-y-8">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl glass-card flex flex-col items-center justify-center gap-4 text-center aspect-square transition-all duration-300">
                  <div className="w-16 h-16 rounded-full shadow-neu flex items-center justify-center text-neu-accent">
                    <Palette size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Standard Card</h4>
                    <p className="text-sm opacity-70">Elevated surface</p>
                  </div>
                </div>
                
                <div className="p-6 rounded-3xl glass-card-inset flex flex-col items-center justify-center gap-4 text-center aspect-square transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-neu-accent">
                    <Save size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Inset Card</h4>
                    <p className="text-sm opacity-70">Pressed surface</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl glass-card space-y-6">
                <h4 className="font-bold text-lg">Interactive Elements</h4>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 px-4 rounded-xl shadow-neu bg-neu-bg text-neu-accent font-bold hover:shadow-neu-sm active:shadow-neu-inset transition-all">
                    Neumorphic Button
                  </button>
                  <button className="flex-1 py-3 px-4 rounded-xl shadow-neu bg-neu-accent text-white font-bold hover:opacity-90 active:scale-95 transition-all">
                    Accent Button
                  </button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-mono opacity-70">Sample Input</label>
                  <input 
                    type="text" 
                    placeholder="Type something..."
                    className="w-full px-4 py-3 rounded-xl glass-card-inset bg-transparent border-none outline-none focus:ring-2 focus:ring-neu-accent/50"
                  />
                </div>
              </div>

              <div className="relative p-10 rounded-3xl bg-neu-secondary overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-neu-accent rounded-full mix-blend-multiply blur-xl opacity-50 animate-pulse"></div>
                <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-pink-500 rounded-full mix-blend-multiply blur-xl opacity-50 animate-pulse delay-700"></div>
                
                <div 
                  className="relative p-6 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl"
                  style={{ backgroundColor: `rgba(255,255,255,${themeConfig.glassOpacity})` }}
                >
                  <h4 className="font-bold text-lg mb-2">Glassmorphism Overlay</h4>
                  <p className="text-sm opacity-80 leading-relaxed">
                    This pane tests how text legibility and blur hold up over complex, colorful backgrounds.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold font-mono text-sm flex items-center gap-2 backdrop-blur-md">
            <CheckCircle size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
