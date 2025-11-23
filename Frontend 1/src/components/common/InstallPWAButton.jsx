import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      setShowBanner(false);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowBanner(false);
      });
    }
  };

  const handleDismissClick = () => {
    setShowBanner(false);
  };

  if (isAppInstalled || !showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] flex flex-col items-center justify-between p-4 bg-white border-b shadow-lg sm:flex-row border-gray-200 animate-fade-in-down">
      <div className="flex items-center mb-3 sm:mb-0">
        <span className="mr-3 text-2xl">📲</span>
        <span className="text-sm font-medium text-gray-800 sm:text-base">
          Install our app for a better experience!
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleInstallClick}
          className="flex items-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <Download size={16} className="mr-2" />
          Install
        </button>
        <button
          onClick={handleDismissClick}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
        >
          <X size={16} className="mr-1" />
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default InstallPWAButton;