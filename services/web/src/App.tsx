import { useEffect } from 'react';
import { FluentProvider, SSRProvider } from '@fluentui/react-components';
import { theme } from './content/theme';
import { PortfolioContent } from './content/Portfolio';
import { Enhancement } from './scene/Enhancement';

export function App() {
  useEffect(() => { document.documentElement.dataset.hydrated = 'true'; }, []);
  return <SSRProvider><FluentProvider theme={theme} className="portfolio"><PortfolioContent enhancement={<Enhancement />} /></FluentProvider></SSRProvider>;
}