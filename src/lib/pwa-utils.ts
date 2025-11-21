// Utilitários para PWA

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration.scope)
          
          // Verifica atualizações a cada hora
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error)
        })
    })
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister()
    })
  }
}

export function checkForUpdates() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update()
    })
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

export function isPWAInstallable(): boolean {
  if (typeof window === 'undefined') return false
  
  return 'BeforeInstallPromptEvent' in window
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }
  
  return await Notification.requestPermission()
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return
  }
  
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      })
    })
  }
}

export async function syncData() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }
  
  const registration = await navigator.serviceWorker.ready
  
  if ('sync' in registration) {
    try {
      await (registration as any).sync.register('sync-data')
      console.log('Sincronização agendada')
    } catch (error) {
      console.error('Erro ao agendar sincronização:', error)
    }
  }
}

export function getInstallPrompt() {
  return new Promise<any>((resolve) => {
    const handler = (e: Event) => {
      e.preventDefault()
      window.removeEventListener('beforeinstallprompt', handler)
      resolve(e)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
  })
}

export function clearAllCaches() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return Promise.resolve()
  }
  
  return caches.keys().then((names) => {
    return Promise.all(names.map((name) => caches.delete(name)))
  })
}
