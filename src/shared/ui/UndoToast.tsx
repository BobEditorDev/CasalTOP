'use client'

import React, { useEffect, useState } from 'react'

interface UndoToastProps {
  message: string
  visible: boolean
  duration?: number // em ms
  onUndo: () => void
  onDismiss: () => void
}

export function UndoToast({ message, visible, duration = 5000, onUndo, onDismiss }: UndoToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!visible) return

    setProgress(100)
    const intervalTime = 50
    const step = (intervalTime / duration) * 100
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval)
          return 0
        }
        return prev - step
      })
    }, intervalTime)

    const dismissTimeout = setTimeout(() => {
      onDismiss()
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(dismissTimeout)
    }
  }, [visible, duration, onDismiss])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col w-[90%] max-w-xs sm:max-w-sm bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between p-3.5">
        <span className="text-xs font-medium tracking-wide">
          {message}
        </span>
        <button
          type="button"
          onClick={onUndo}
          className="ml-3 px-3 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
        >
          Desfazer
        </button>
      </div>
      <div 
        className="h-0.5 bg-blue-500 transition-all ease-linear"
        style={{ width: `${progress}%`, transitionDuration: '50ms' }}
      />
    </div>
  )
}
