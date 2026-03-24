import { useState } from 'react'

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {

  // Tries to load saved data from localStorage first
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // Custom setValue — handles both direct values AND functional updates
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as standard useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // 1. Update React state
      setStoredValue(valueToStore)
      
      // 2. Save to localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage