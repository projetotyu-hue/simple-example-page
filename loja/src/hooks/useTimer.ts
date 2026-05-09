import { useEffect, useRef, useCallback } from 'react'

export function useTimer(callback: () => void, interval: number, isRunning: boolean) {
  const savedCallback = useRef(callback)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => savedCallback.current(), interval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, interval])
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getTimerColor(seconds: number): string {
  if (seconds < 120) return '#FF0040' // < 2min red
  if (seconds < 300) return '#F59E0B' // < 5min orange
  return '#1A1A1A' // neutral
}
