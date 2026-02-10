'use client';

import { useEffect, useRef } from 'react';

export default function SiteTracker() {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Prevent double tracking in strict mode or re-renders
        if (hasTracked.current) return;

        // Check if we already tracked this session
        const sessionTracked = sessionStorage.getItem('kenan_site_visit_tracked');
        if (sessionTracked) {
            hasTracked.current = true;
            return;
        }

        const trackVisit = async () => {
            try {
                await fetch('/api/stats', {
                    method: 'POST',
                });

                // Mark as tracked for this session
                sessionStorage.setItem('kenan_site_visit_tracked', 'true');
                hasTracked.current = true;
            } catch (error) {
                console.error('Failed to track site visit:', error);
            }
        };

        trackVisit();
    }, []);

    return null; // This component doesn't render anything
}
