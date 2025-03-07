import { useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

const PWAPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        console.log('New content available, please refresh');
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Install prompt triggered');
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    });

    // Check if app is installed
    window.addEventListener('appinstalled', (e) => {
      console.log('PWA was installed');
    });
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex flex-col items-center">
        <p className="text-center mb-4">
          Install this app on your device for the best experience
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg"
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAPrompt; 