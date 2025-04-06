'use client';

import { useEffect, useRef } from 'react';

export function KitNewsletterForm() {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!scriptLoaded.current && formContainerRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        [data-uid="7b89eac8f8"] {
          background: transparent !important;
        }

        [data-uid="7b89eac8f8"] .formkit-header {
          color: var(--foreground) !important;
          font-family: var(--font-merriweather) !important;
          font-size: 27px !important;
          font-weight: 700 !important;
          margin-bottom: 1rem !important;
        }

        [data-uid="7b89eac8f8"] .formkit-subheader {
          color: var(--muted-foreground) !important;
          font-size: 18px !important;
          margin-bottom: 1.5rem !important;
        }

        [data-uid="7b89eac8f8"] .formkit-input {
          background: var(--background) !important;
          color: var(--foreground) !important;
          border: 1px solid var(--border) !important;
          border-radius: 0.5rem !important;
          padding: 0.75rem 1rem !important;
          font-size: 1rem !important;
          line-height: 1.5 !important;
          width: 100% !important;
          transition: border-color 0.2s ease !important;
        }

        [data-uid="7b89eac8f8"] .formkit-input:focus {
          outline: none !important;
          border-color: var(--primary) !important;
          ring: 2px var(--primary) !important;
        }

        [data-uid="7b89eac8f8"] .formkit-submit {
          background: var(--primary) !important;
          color: var(--primary-foreground) !important;
          border-radius: 0.5rem !important;
          padding: 0.75rem 1.5rem !important;
          font-weight: 500 !important;
          font-size: 1rem !important;
          transition: opacity 0.2s ease !important;
        }

        [data-uid="7b89eac8f8"] .formkit-submit:hover {
          opacity: 0.9 !important;
        }

        [data-uid="7b89eac8f8"] .formkit-guarantee {
          color: var(--muted-foreground) !important;
          font-size: 0.875rem !important;
          margin-top: 1rem !important;
        }

        [data-uid="7b89eac8f8"] .formkit-powered-by-convertkit-container {
          opacity: 0.7 !important;
        }

        [data-uid="7b89eac8f8"] .seva-fields {
          display: flex !important;
          gap: 0.5rem !important;
          margin-bottom: 1rem !important;
        }

        [data-uid="7b89eac8f8"] .formkit-field {
          flex: 1 !important;
        }

        @media (max-width: 640px) {
          [data-uid="7b89eac8f8"] .seva-fields {
            flex-direction: column !important;
          }

          [data-uid="7b89eac8f8"] .formkit-submit {
            width: 100% !important;
          }
        }
      `;
      document.head.appendChild(style);

      const script = document.createElement('script');
      script.async = true;
      script.src = "https://inkmorphism.kit.com/7b89eac8f8/index.js";
      script.dataset.uid = "7b89eac8f8";
      script.dataset.position = "inline";
      formContainerRef.current.appendChild(script);
      scriptLoaded.current = true;
    }
  }, []);

  return (
    <div id="newsletter" className="max-w-2xl mx-auto border-t pt-16">
      <div ref={formContainerRef}></div>
    </div>
  );
} 