import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ppsa_compare';
const MAX = 4;

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        } catch { return []; }
    });

    // Keep localStorage in sync
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const isCompared = useCallback((id) => items.some(p => (p.id ?? p) === id), [items]);

    const toggle = useCallback((product) => {
        const id = product.id ?? product;
        setItems(prev => {
            if (prev.some(p => (p.id ?? p) === id)) {
                return prev.filter(p => (p.id ?? p) !== id);
            }
            if (prev.length >= MAX) return prev; // silently ignore if at max
            return [...prev, product];
        });
    }, []);

    const clear = useCallback(() => setItems([]), []);

    return (
        <CompareContext.Provider value={{ items, isCompared, toggle, clear, max: MAX }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    return useContext(CompareContext);
}
