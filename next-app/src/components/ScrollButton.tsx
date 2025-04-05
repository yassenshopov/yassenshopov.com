'use client';

import { Button } from '@/components/ui/button';
import { FaArrowDown } from 'react-icons/fa';

export function ScrollButton() {
  const scrollToNewsletter = () => {
    const newsletterElement = document.getElementById('newsletter');
    if (newsletterElement) {
      newsletterElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-8">
      <Button
        onClick={scrollToNewsletter}
        variant="secondary"
        size="lg"
        className="group text-base"
      >
        Never miss an update
        <FaArrowDown 
          className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" 
          aria-hidden="true"
        />
      </Button>
    </div>
  );
} 