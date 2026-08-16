/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Moon, Sun, Palette, X, Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPlaygroundProps {
  onClose?: () => void;
}

export default function AdminPlayground({ onClose }: AdminPlaygroundProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

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
  const [draftConfig, setDraftConfig] = useState(themeConfig);
  const [prevIsDark, setPrevIsDark] = useState(isDark);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Sync draft when theme changes via toggle
  if (isDark !== prevIsDark) {
    const newConfig = getInitialThemeConfig(isDark);
    setPrevIsDark(isDark);
    setThemeConfig(newConfig);
    setDraftConfig(newConfig);
  }

  // Debounce logic: when user pauses dragging/typing for 400ms, auto-apply the theme
  useEffect(() => {
    const isDifferent = JSON.stringify(draftConfig) !== JSON.stringify(themeConfig);
    if (!isDifferent) {
      return;
    }

    const timer = setTimeout(() => {
      setThemeConfig(draftConfig);
    }, 400);

    return () => clearTimeout(timer);
  }, [draftConfig, themeConfig]);

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
    root.style.setProperty('--shadow-neu-modal', `16px 16px ${blur*2}px rgba(0,0,0,${sOpacity*1.5})`);

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



  const updateConfig = (key: string, value: string | number) => {
    setDraftConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${isPreviewMode ? 'pointer-events-none' : ''}`}>
      <AnimatePresence>
        {!isPreviewMode && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {!isPreviewMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-neu-bg rounded-3xl shadow-neu-modal border border-white/10 p-6 sm:p-8 pointer-events-auto"
          >
            <div className="space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
              <Palette size={24} className="text-neu-accent" />
              Theme Playground
            </h1>
            <div className="flex items-center p-1.5 rounded-2xl glass-card-inset border border-white/5 shadow-inner">
              <button 
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-neu-text hover:bg-neu-accent hover:text-white transition-all"
                aria-label="Toggle Theme Mode"
              >
                {isDark ? (
                  <><Sun size={16} /> <span className="hidden sm:inline">Light</span></>
                ) : (
                  <><Moon size={16} /> <span className="hidden sm:inline">Dark</span></>
                )}
              </button>

              <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1"></div>

              <button 
                onClick={() => setIsPreviewMode(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-neu-text hover:bg-neu-accent hover:text-white transition-all"
              >
                <Eye size={16} /> <span className="hidden sm:inline">Preview</span>
              </button>
              
              {onClose && (
                <>
                  <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1"></div>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    aria-label="Close Modal"
                  >
                    <X size={16} /> <span className="hidden sm:inline">Close</span>
                  </button>
                </>
              )}
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
                        {color.label} <span>{(draftConfig as any)[color.key]}</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={(draftConfig as any)[color.key]} 
                          onChange={(e) => updateConfig(color.key, e.target.value)}
                          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0" 
                        />
                        <div className="flex-1 px-4 py-2 glass-card-inset rounded-xl font-mono text-sm opacity-50">
                          {(draftConfig as any)[color.key]}
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
                      Shadow Intensity <span>{draftConfig.shadowOpacity.toFixed(2)}</span>
                    </label>
                    <input 
                      type="range" min="0.01" max="1" step="0.01"
                      value={draftConfig.shadowOpacity}
                      onChange={(e) => updateConfig('shadowOpacity', parseFloat(e.target.value))}
                      className="w-full accent-neu-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-neu-text-muted flex justify-between">
                      Shadow Blur (px) <span>{draftConfig.shadowBlur}</span>
                    </label>
                    <input 
                      type="range" min="4" max="64" step="1"
                      value={draftConfig.shadowBlur}
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
      </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Exit Preview Button when in Preview Mode */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 sm:top-8 sm:right-8 z-[250]"
          >
            <button
              onClick={() => setIsPreviewMode(false)}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-neu-bg text-neu-text shadow-neu-modal border border-white/20 hover:scale-105 active:scale-95 transition-all font-bold text-sm sm:text-base group pointer-events-auto"
            >
              <div className="p-2 rounded-full bg-neu-accent text-white group-hover:rotate-12 transition-transform">
                <EyeOff size={18} />
              </div>
              Exit Preview Mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
