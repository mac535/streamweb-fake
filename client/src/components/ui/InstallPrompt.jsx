import { useState, useEffect, useCallback } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Check if already installed (running as standalone PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // Show immediately
    };

    // Check if the event was already captured before React loaded
    if (window.deferredPWAInstallPrompt) {
      handler(window.deferredPWAInstallPrompt);
    }

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS — always show the banner (iOS doesn't fire beforeinstallprompt)
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIos) {
      setIsVisible(true);
    }

    // If neither iOS nor beforeinstallprompt fired yet, show after a short wait
    // (covers Android browsers where the event fires late)
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Listen for successful install
    const installedHandler = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
      // Only hide for this session — will show again on next visit
      sessionStorage.setItem('stream_pwa_dismissed', '1');
    }, 300);
  }, []);

  // Don't show if already installed, not visible, or dismissed this session
  if (isInstalled || !isVisible || sessionStorage.getItem('stream_pwa_dismissed')) return null;

  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[200] px-4 pb-4 md:px-6 md:pb-6 pointer-events-none transition-all duration-500 ${
        isAnimatingOut ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'
      }`}
      style={{ animation: !isAnimatingOut ? 'slideUpBanner 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : undefined }}
    >
      <div className="pointer-events-auto max-w-lg mx-auto bg-white border border-black/[0.06] rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-lg shadow-black/[0.06]">
        {/* App Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center">
          <img
            src="/icons/icon-96x96.png"
            alt="STREAM"
            className="w-8 h-8 rounded-lg"
          />
        </div>

        {/* Text */}
        <div className="flex-grow min-w-0">
          <p className="text-sm font-bold text-on-surface tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Install STREAM App
          </p>
          <p className="text-xs text-secondary mt-0.5 truncate">
            Quick access from your home screen
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-xs font-semibold text-secondary/60 hover:text-secondary px-2 py-1.5 rounded-lg hover:bg-surface-container transition-all"
          >
            Later
          </button>
          {isIos && !deferredPrompt ? (
            <div className="text-[10px] text-primary font-medium text-right leading-tight max-w-[80px]">
              Tap Share<br/>then &quot;Add to Home Screen&quot;
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="bg-primary-container text-on-primary-container text-xs font-bold px-4 py-2 rounded-xl hover:shadow-md hover:shadow-primary-container/20 active:scale-[0.97] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                download
              </span>
              Install
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUpBanner {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
