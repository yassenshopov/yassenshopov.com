import Link from 'next/link';
import { FaLinkedin, FaShoppingBag } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t font-heading">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 mb-6">
          <Link
            href="https://linkedin.com/in/yassenshopov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} aria-hidden="true" />
          </Link>
          <Link
            href="https://x.com/yassenshopov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="X (Twitter)"
          >
            <FaXTwitter size={24} aria-hidden="true" />
          </Link>
          <Link
            href="https://yassenshopov.gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Gumroad Shop"
          >
            <FaShoppingBag size={24} aria-hidden="true" />
          </Link>
        </div>
        <p className="text-center text-foreground/60">
          Copyright &copy; {new Date().getFullYear()} &mdash; Designed and maintained by{" "}
          <Link
            href="https://github.com/yassenshopov"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Yassen Shopov
          </Link>{" "}
          &bull; All rights reserved.
        </p>
      </div>
    </footer>
  );
}
