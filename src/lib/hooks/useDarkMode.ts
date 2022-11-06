import { Dispatch, useEffect, useState } from 'react';

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export const useDarkMode = () => {
  const isBrowser = typeof window !== 'undefined';
  const [theme, setTheme] = useState(
    isBrowser ? localStorage.getItem('theme') as ThemeMode : ThemeMode.Light
  );
  const previousTheme = theme === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(previousTheme);
    root.classList.add(theme);

    if (isBrowser) {
      localStorage.setItem('theme', theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return [theme, setTheme] as [ThemeMode, Dispatch<ThemeMode>];
};
