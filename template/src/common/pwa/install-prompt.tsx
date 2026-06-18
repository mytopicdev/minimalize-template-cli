import { useEffect, useState } from 'react'
import { cn } from '@/common/utils/cn'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Chromium fires `beforeinstallprompt` (button appears); iOS Safari does NOT
    // fire it (install is manual via Share → Add to Home Screen), so the banner
    // simply won't render there — graceful fallback.
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  const close = () => {
    setDismissed(true)
  }

  if (!deferredPrompt || dismissed) return null

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg',
        'dark:border-gray-700 dark:bg-gray-800',
      )}
      role="status"
    >
      <span className="text-sm text-gray-800 dark:text-gray-100">
        Install this app on your device.
      </span>

      <button
        type="button"
        onClick={install}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Install app
      </button>

      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
      >
        ✕
      </button>
    </div>
  )
}
