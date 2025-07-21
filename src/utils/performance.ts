// Optimisations de performance pour le jeu

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

import React from 'react';
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.addMetric(name, duration);
    };
  }

  addMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Garder seulement les 100 dernières mesures
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetrics(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { avg, min, max, count: values.length };
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    const entries = Array.from(this.metrics.entries());
    for (const [name] of entries) {
      result[name] = this.getMetrics(name);
    }
    return result;
  }

  reset(): void {
    this.metrics.clear();
  }
}

// Instance globale du monitor
export const performanceMonitor = new PerformanceMonitor();

// Hook pour mesurer les performances des composants React
import { useEffect, useRef } from 'react';

export function usePerformanceMetrics(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime.current;
      performanceMonitor.addMetric(`${componentName}_lifetime`, lifetime);
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current++;
    performanceMonitor.addMetric(`${componentName}_renders`, renderCount.current);
  });

  return {
    renderCount: renderCount.current,
    logMetrics: () => console.log(performanceMonitor.getMetrics(componentName)),
  };
}

// Optimisation des images
export function optimizeImage(src: string, width?: number, height?: number): string {
  // Pour une vraie application, ceci utiliserait un service d'optimisation d'images
  if (width && height) {
    return `${src}?w=${width}&h=${height}&fit=crop&auto=format`;
  }
  return `${src}?auto=format&q=75`;
}

// Lazy loading utility
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return React.lazy(importFunc);
}

// Cache pour les données du jeu
class GameCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const gameCache = new GameCache();
