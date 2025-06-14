// This file registers the service worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
