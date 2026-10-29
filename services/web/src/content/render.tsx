import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { RendererProvider, createDOMRenderer, renderToStyleElements } from '@griffel/react';
import { App } from '../App';

export function render() {
  const renderer = createDOMRenderer();
  const html = renderToString(<RendererProvider renderer={renderer}><App /></RendererProvider>);
  const css = renderToStaticMarkup(<>{renderToStyleElements(renderer)}</>);
  return { html, css };
}