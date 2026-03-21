import { useState } from 'react'

// This is a GENERIC custom hook
// <T> means "this function works with ANY type"
// When you call it like useLocalStorage<User>(...) 
// TypeScript replaces every T with User automatically
//
// Examples:
// useLocalStorage<User | null>  →  T = User | null
// useLocalStorage<number>       →  T = number
// useLocalStorage<string[]>     →  T = string[]

function useLocalStorage<T>(
  key: string,       // the localStorage key e.g. 'lifeos-user'
  initialValue: T    // default value if nothing saved yet
): [T, (value: T) => void] {
// ↑ Return type — exactly like useState:
// first item = the value (type T)
// second item = setter function that takes type T

  // useState with a function inside — runs ONCE on first load
  // Tries to load saved data from localStorage first
  // If nothing saved yet, uses initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      // If item exists → parse JSON string back to JS object
      // If not → use the default value
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // Custom setValue — does TWO things at once:
  // 1. Updates React state → UI re-renders
  // 2. Saves to localStorage → survives page refresh
  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      // JSON.stringify converts JS object → string for storage
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  // Return exactly like useState → [value, setter]
  return [storedValue, setValue]
}

export default useLocalStorage