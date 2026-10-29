import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { portfolio } from '../data/portfolio';

vi.mock('../scene/Enhancement', () => ({ Enhancement: () => null }));
afterEach(cleanup);
describe('shared semantic portfolio', () => {
  it('exposes complete public content independently of graphics', () => {
    const { container } = render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(portfolio.name);
    expect(screen.getByText(portfolio.introduction)).toBeTruthy();
    expect(container.querySelectorAll('.role-entry').length).toBe(2);
    expect(container.querySelectorAll('.project').length).toBe(7);
    for (const project of portfolio.projects) for (const detail of project.details) expect(screen.getByText(detail.value)).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Selected projects' }).querySelectorAll('a').length).toBe(7);
    expect(container.querySelectorAll('.skills dt').length).toBe(10);
    expect(container.querySelector('canvas')).toBeNull();
  });
  it('links to the shared PDF without invoking print', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Resume' }).getAttribute('href')).toBe(`${import.meta.env.BASE_URL}resume.pdf`);
  });
  it('uses the browser print action', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    render(<App />);
    screen.getAllByRole('button', { name: 'Print resume' })[0].click();
    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });
});