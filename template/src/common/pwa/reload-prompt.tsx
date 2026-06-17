import { useRegisterSW } from 'virtual:pwa-register/react'
import { cn } from '@/common/utils/cn'

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  const close = () => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }

  if (!needRefresh && !offlineReady) return null

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg',
        'dark:border-gray-700 dark:bg-gray-800',
      )}
      role="status"
    >
      <span className="text-sm text-gray-800 dark:text-gray-100">
        {needRefresh
          ? 'New content available, click reload to update.'
          : 'App ready to work offline.'}
      </span>

      {needRefresh && (
        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Reload
        </button>
      )}

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
