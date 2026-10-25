'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

function readTheme(): Theme | undefined {
  if (!canUseDOM) return undefined

  const preference = window.localStorage.getItem(themeLocalStorageKey)
  if (themeIsValid(preference)) return preference

  const implicitPreference = getImplicitPreference()
  if (implicitPreference) return implicitPreference

  return defaultTheme
}

export const ThemeProvider = ({
  children,
  forceTheme,
}: {
  children: React.ReactNode
  /** Public marketing pages stay on the cream canvas. OS dark mode must not invert them. */
  forceTheme?: Theme
}) => {
  const [theme, setThemeState] = useState<Theme | undefined>(forceTheme ?? readTheme)

  const setTheme = useCallback(
    (themeToSet: Theme | null) => {
      if (forceTheme) {
        document.documentElement.setAttribute('data-theme', forceTheme)
        setThemeState(forceTheme)
        return
      }

      if (themeToSet === null) {
        window.localStorage.removeItem(themeLocalStorageKey)
        const implicitPreference = getImplicitPreference()
        document.documentElement.setAttribute('data-theme', implicitPreference || '')
        if (implicitPreference) setThemeState(implicitPreference)
      } else {
        setThemeState(themeToSet)
        window.localStorage.setItem(themeLocalStorageKey, themeToSet)
        document.documentElement.setAttribute('data-theme', themeToSet)
      }
    },
    [forceTheme],
  )

  useEffect(() => {
    const themeToSet = forceTheme ?? readTheme() ?? defaultTheme
    document.documentElement.setAttribute('data-theme', themeToSet)
  }, [forceTheme])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
