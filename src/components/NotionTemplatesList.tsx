'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, List, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  templates,
  notionCategories as categories,
  categoryLabel,
  isFree,
  formatPrice,
  FEATURED_ID,
  type NotionTemplate,
} from '@/data/notion-templates';

export { templates } from '@/data/notion-templates';

type Template = NotionTemplate;

function PriceBadge({ price, className = '' }: { price: string; className?: string }) {
  const free = isFree(price);
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
        free ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
      } ${className}`}
    >
      {formatPrice(price)}
    </span>
  );
}

function FeaturedTemplate({ template }: { template: Template }) {
  return (
    <Link
      href={template.gumroadLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <article className="grid lg:grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary">
        <div className="relative aspect-video lg:aspect-auto lg:min-h-80 overflow-hidden">
          <Image
            src={template.image}
            alt={template.title}
            fill
            unoptimized={template.unoptimized}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-card/60 via-transparent to-transparent lg:bg-linear-to-r" />
        </div>

        <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.18em]">
            <Sparkles className="w-3.5 h-3.5" />
            Flagship template
          </div>

          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {template.title}
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg leading-relaxed">
              {template.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {template.categories.map((category) => (
              <span
                key={category}
                className="px-2.5 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-md"
              >
                {categoryLabel(category)}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Button size="lg" className="pointer-events-none group/btn">
              Get the template
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(template.price)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function TemplateCard({ template, viewMode }: { template: Template; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Link
        href={template.gumroadLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <article className="flex flex-row items-center gap-4 rounded-xl border border-border bg-card p-3 transition-colors duration-300 hover:border-primary">
          <div className="relative h-20 w-20 md:h-24 md:w-40 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={template.image}
              alt={template.title}
              fill
              unoptimized={template.unoptimized}
              sizes="160px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {template.title}
              </h2>
              <PriceBadge price={template.price} />
            </div>
            <p className="hidden md:line-clamp-2 md:block text-sm text-muted-foreground">
              {template.description}
            </p>
            <div className="hidden md:flex flex-wrap gap-2">
              {template.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground rounded-md"
                >
                  {categoryLabel(category)}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={template.gumroadLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={template.image}
            alt={template.title}
            fill
            unoptimized={template.unoptimized}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-end justify-start bg-linear-to-t from-background/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              View template
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {template.title}
            </h2>
            <PriceBadge price={template.price} />
          </div>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{template.description}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            {template.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-md"
              >
                {categoryLabel(category)}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function NotionTemplatesList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((template) => template.categories.includes(selectedCategory));

  const featured = filteredTemplates.find((t) => t.id === FEATURED_ID);
  const gridTemplates = filteredTemplates.filter((t) => t.id !== FEATURED_ID);

  return (
    <section id="templates" className="py-16 md:py-20 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter bar — category pills + view toggle */}
          <div className="sticky top-16 z-30 -mx-4 mb-10 border-y border-border bg-background/80 px-4 py-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategory === category.value;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setSelectedCategory(category.value)}
                      aria-pressed={active}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 self-start lg:self-auto">
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {filteredTemplates.length}{' '}
                  {filteredTemplates.length === 1 ? 'template' : 'templates'}
                </span>
                <div className="flex gap-1 rounded-lg border border-border p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            key={`${selectedCategory}-${viewMode}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {featured && (
              <div className="mb-10">
                <FeaturedTemplate template={featured} />
              </div>
            )}

            {gridTemplates.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col gap-3'
                }
              >
                {gridTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              !featured && (
                <div className="py-16 text-center">
                  <p className="text-lg text-muted-foreground">
                    No templates in this category yet.
                  </p>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
