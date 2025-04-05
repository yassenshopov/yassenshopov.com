import { Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { FaLinkedin, FaTwitter, FaYoutube, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              Let's Connect
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you have a question about my Notion templates, want to collaborate on a project, or just want to say hello, I'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">Send me a message</h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
                    placeholder="Your message..."
                  />
                </div>
                <Button className="w-full group">
                  Send Message
                  <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">Other ways to reach me</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Email</h3>
                      <p className="text-muted-foreground">yassen@yassenshopov.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Social Media</h3>
                      <div className="flex gap-4 mt-2">
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
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">What to expect</h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    <span>I typically respond within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    <span>For Notion template support, please include your purchase details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    <span>For collaboration inquiries, please include details about your project</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 