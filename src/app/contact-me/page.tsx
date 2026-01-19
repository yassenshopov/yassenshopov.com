"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Github, Linkedin, Twitter, Code, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Add your form submission logic here
    setTimeout(() => setIsSending(false), 1000);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/yassenshopov",
      color: "hover:text-[#333] dark:hover:text-[#fff]"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/yassen-shopov/",
      color: "hover:text-[#0077b5]"
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/yassenshopov",
      color: "hover:text-[#1DA1F2]"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-muted">
        <div className="absolute inset-0 bg-grid-white/10 -z-10" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>Let's Connect</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Have a project in mind? Want to collaborate? Or just want to say hi? I'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <Card className="p-8 backdrop-blur-xl bg-card/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    value={message}
                    onChange={handleMessageChange}
                    required
                    className="min-h-[150px] bg-background/50"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full group" disabled={isSending}>
                  {isSending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-12">
              {/* Quick Contact */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Quick Contact</h2>
                <p className="text-muted-foreground">
                  For quick inquiries, you can reach me directly at:
                </p>
                <Link 
                  href="mailto:yassenshopov00@gmail.com"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  yassenshopov00@gmail.com
                </Link>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Follow Me</h2>
                <p className="text-muted-foreground">
                  Connect with me on social media for updates on my latest projects and thoughts.
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-lg bg-card hover:bg-accent transition-colors ${social.color}`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Collaboration */}
              <Card className="p-6 bg-primary/5 border-primary/10">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Let's Build Something</h2>
                <p className="text-muted-foreground mb-4">
                  Looking for a technical co-founder or want to collaborate on an exciting project? I'm always open to interesting opportunities.
                </p>
                <Button variant="outline" className="group" asChild>
                  <Link href="/projects">
                    View My Work
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 