import Link from 'next/link';
import { FaLinkedin, FaTwitter, FaYoutube, FaShoppingBag } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 mb-6">
          <Link 
            href="https://linkedin.com/in/yassenshopov" 
            target="_blank"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <FaLinkedin size={24} />
          </Link>
          <Link 
            href="https://twitter.com/yassenshopov" 
            target="_blank"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <FaTwitter size={24} />
          </Link>
          <Link 
            href="https://youtube.com/@yassenshopov" 
            target="_blank"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <FaYoutube size={24} />
          </Link>
          <Link 
            href="https://yassenshopov.gumroad.com" 
            target="_blank"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <FaShoppingBag size={24} />
          </Link>
        </div>
        <p className="text-center text-foreground/60">
          Copyright © {new Date().getFullYear()} - Designed and maintained by{" "}
          <Link href="https://github.com/yassenshopov" target="_blank" className="hover:underline">
            Yassen Shopov
          </Link>{" "}
          • All rights reserved.
        </p>
      </div>
    </footer>
  );
} 