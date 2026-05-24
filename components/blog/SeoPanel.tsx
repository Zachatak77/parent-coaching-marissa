'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface SeoPanelProps {
  seoTitle: string
  seoDescription: string
  keywords: string[]
  ogImageUrl: string
  canonicalUrl: string
  noIndex: boolean
  onChange: (field: string, value: string | string[] | boolean) => void
}

export function SeoPanel({
  seoTitle,
  seoDescription,
  keywords,
  ogImageUrl,
  canonicalUrl,
  noIndex,
  onChange,
}: SeoPanelProps) {
  const isConfigured =
    seoTitle.length > 0 ||
    seoDescription.length > 0 ||
    keywords.length > 0 ||
    ogImageUrl.length > 0 ||
    canonicalUrl.length > 0 ||
    noIndex

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="seo">
        <AccordionTrigger className="hover:no-underline">
          <span className="flex items-center gap-2">
            <span className="font-[Inter] font-semibold text-sm text-[#1F1D1A]">
              SEO &amp; Metadata
            </span>
            <span className="flex items-center">
              {isConfigured ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-[#9BB39B] mr-2" />
                  <span className="text-xs text-[#6E6A60]">SEO configured</span>
                </>
              ) : (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-[#D9CFB9] mr-2" />
                  <span className="text-xs text-[#6E6A60]">Using defaults</span>
                </>
              )}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            {/* SEO Title */}
            <div className="space-y-1">
              <Label>SEO Title</Label>
              <Input
                value={seoTitle}
                onChange={(e) => onChange('seoTitle', e.target.value)}
                maxLength={70}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#6E6A60]">Defaults to post title if left blank</p>
                <span
                  className={`text-xs ${seoTitle.length > 60 ? 'text-red-600' : 'text-[#6E6A60]'}`}
                >
                  {seoTitle.length}/60
                </span>
              </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-1">
              <Label>Meta Description</Label>
              <Textarea
                value={seoDescription}
                onChange={(e) => onChange('seoDescription', e.target.value)}
                rows={3}
                maxLength={180}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#6E6A60]">Defaults to excerpt if left blank</p>
                <span
                  className={`text-xs ${seoDescription.length > 160 ? 'text-red-600' : 'text-[#6E6A60]'}`}
                >
                  {seoDescription.length}/160
                </span>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-1">
              <Label>Keywords</Label>
              <Input
                placeholder="parenting, coaching, neurodiversity"
                value={keywords.join(', ')}
                onChange={(e) =>
                  onChange(
                    'keywords',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
              />
              <p className="text-xs text-[#6E6A60]">Comma-separated keywords</p>
            </div>

            {/* OG Image URL */}
            <div className="space-y-1">
              <Label>OG Image URL</Label>
              <Input
                value={ogImageUrl}
                onChange={(e) => onChange('ogImage', e.target.value)}
                placeholder="https://..."
              />
              {ogImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ogImageUrl}
                  alt="OG preview"
                  className="mt-1 h-12 w-20 rounded object-cover"
                />
              )}
              <p className="text-xs text-[#6E6A60]">Defaults to cover image if left blank</p>
            </div>

            {/* Canonical URL */}
            <div className="space-y-1">
              <Label>Canonical URL</Label>
              <Input
                value={canonicalUrl}
                onChange={(e) => onChange('canonicalUrl', e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-[#6E6A60]">
                Only set if this content is republished from another URL
              </p>
            </div>

            {/* noIndex */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="noindex-checkbox"
                  checked={noIndex}
                  onCheckedChange={(checked) => onChange('noIndex', checked === true)}
                />
                <Label htmlFor="noindex-checkbox">Hide from search engines (noindex)</Label>
              </div>
              {noIndex && (
                <div className="rounded-lg border border-[#EFB63F] bg-[#EFB63F]/20 p-3 text-sm text-[#9A7200] mt-2">
                  ⚠️ This post will not appear in search engine results
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
