import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Only track once per session
        if (sessionStorage.getItem('visit_tracked')) return;
        
        const { error } = await supabase.functions.invoke('track-visitor', {
          body: {
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }
        });

        if (!error) {
          sessionStorage.setItem('visit_tracked', 'true');
        }
      } catch (error) {
        console.error('Visitor tracking error:', error);
      }
    };

    // Track after a small delay to not impact page load
    const timer = setTimeout(trackVisit, 2000);
    return () => clearTimeout(timer);
  }, []);
};
