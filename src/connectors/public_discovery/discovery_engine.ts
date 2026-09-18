/**
 * LARI Growth OS — Public Discovery Engine
 * Implements WP-01 Current-State Discovery Adapter
 * Strictly Read-Only / Fixture Supported / Zero Remote Mutation
 */

import { DiscoveredUrlNode, RawObservation, ReconciliationState } from '../../../contracts/observations/observation.ts';

export interface DiscoveredRobots {
  source_url: string;
  user_agents: string[];
  disallow_rules: string[];
  allow_rules: string[];
  sitemaps: string[];
  raw_text: string;
}

export interface DiscoveredSitemapItem {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  hreflang_alternates: { lang: string; href: string }[];
}

export interface DiscoveredHtmlMetadata {
  url: string;
  title?: string;
  meta_description?: string;
  canonical_url?: string;
  robots_directive?: string;
  hreflangs: { lang: string; href: string }[];
  structured_data_types: string[];
  internal_links: string[];
  external_links: string[];
}

export class PublicDiscoveryEngine {
  private baseDomain: string;

  constructor(baseDomain = 'https://larihealth.com') {
    this.baseDomain = baseDomain.replace(/\/$/, '');
  }

  /**
   * Parse robots.txt format
   */
  public parseRobotsTxt(content: string, sourceUrl = `${this.baseDomain}/robots.txt`): DiscoveredRobots {
    const lines = content.split(/\r?\n/);
    const disallow_rules: string[] = [];
    const allow_rules: string[] = [];
    const sitemaps: string[] = [];
    const user_agents: string[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const [key, ...valParts] = line.split(':');
      const val = valParts.join(':').trim();
      const lowerKey = key.trim().toLowerCase();

      if (lowerKey === 'user-agent') {
        user_agents.push(val);
      } else if (lowerKey === 'disallow') {
        if (val) disallow_rules.push(val);
      } else if (lowerKey === 'allow') {
        if (val) allow_rules.push(val);
      } else if (lowerKey === 'sitemap') {
        sitemaps.push(val);
      }
    }

    return {
      source_url: sourceUrl,
      user_agents: user_agents.length > 0 ? user_agents : ['*'],
      disallow_rules,
      allow_rules,
      sitemaps,
      raw_text: content,
    };
  }

  /**
   * Parse XML sitemap
   */
  public parseSitemapXml(xmlContent: string): DiscoveredSitemapItem[] {
    const items: DiscoveredSitemapItem[] = [];
    const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
    let urlMatch: RegExpExecArray | null;

    while ((urlMatch = urlRegex.exec(xmlContent)) !== null) {
      const block = urlMatch[1];
      const locMatch = /<loc>\s*([^<\s]+)\s*<\/loc>/i.exec(block);
      if (!locMatch) continue;

      const loc = locMatch[1].trim();
      const lastmodMatch = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/i.exec(block);
      const changefreqMatch = /<changefreq>\s*([^<\s]+)\s*<\/changefreq>/i.exec(block);
      const priorityMatch = /<priority>\s*([^<\s]+)\s*<\/priority>/i.exec(block);

      const hreflangs: { lang: string; href: string }[] = [];
      const linkRegex = /<xhtml:link\s+[^>]*rel=["']alternate["'][^>]*>/gi;
      let linkMatch: RegExpExecArray | null;

      while ((linkMatch = linkRegex.exec(block)) !== null) {
        const tag = linkMatch[0];
        const langMatch = /hreflang=["']([^"']+)["']/i.exec(tag);
        const hrefMatch = /href=["']([^"']+)["']/i.exec(tag);
        if (langMatch && hrefMatch) {
          hreflangs.push({ lang: langMatch[1], href: hrefMatch[1] });
        }
      }

      items.push({
        loc,
        lastmod: lastmodMatch ? lastmodMatch[1] : undefined,
        changefreq: changefreqMatch ? changefreqMatch[1] : undefined,
        priority: priorityMatch ? parseFloat(priorityMatch[1]) : undefined,
        hreflang_alternates: hreflangs,
      });
    }

    return items;
  }

  /**
   * Parse HTML content for SEO tags, hreflangs, JSON-LD, and internal links
   */
  public parseHtmlSurface(html: string, pageUrl: string): DiscoveredHtmlMetadata {
    // Title
    const titleMatch = /<title[^>]*>([^<]+)<\/title>/i.exec(html);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    // Meta description
    const descMatch = /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i.exec(html)
      || /<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i.exec(html);
    const meta_description = descMatch ? descMatch[1].trim() : undefined;

    // Canonical
    const canonicalMatch = /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i.exec(html)
      || /<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i.exec(html);
    const canonical_url = canonicalMatch ? canonicalMatch[1].trim() : undefined;

    // Meta robots
    const robotsMatch = /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i.exec(html);
    const robots_directive = robotsMatch ? robotsMatch[1].trim() : undefined;

    // Hreflang
    const hreflangs: { lang: string; href: string }[] = [];
    const linkRegex = /<link\s+[^>]*rel=["']alternate["'][^>]*>/gi;
    let linkMatch: RegExpExecArray | null;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const tag = linkMatch[0];
      const langMatch = /hreflang=["']([^"']+)["']/i.exec(tag);
      const hrefMatch = /href=["']([^"']+)["']/i.exec(tag);
      if (langMatch && hrefMatch) {
        hreflangs.push({ lang: langMatch[1], href: hrefMatch[1] });
      }
    }

    // Structured data types (JSON-LD)
    const structured_data_types: string[] = [];
    const jsonLdRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let jsonMatch: RegExpExecArray | null;
    while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            if (item?.['@type']) structured_data_types.push(String(item['@type']));
          });
        } else if (parsed?.['@type']) {
          structured_data_types.push(String(parsed['@type']));
        }
      } catch {
        // malformed json-ld recorded as unparsed
        structured_data_types.push('MALFORMED_JSON_LD');
      }
    }

    // Links (a href)
    const internal_links: string[] = [];
    const external_links: string[] = [];
    const aRegex = /<a\s+[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
    let aMatch: RegExpExecArray | null;
    while ((aMatch = aRegex.exec(html)) !== null) {
      const href = aMatch[1].trim();
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        continue;
      }

      if (href.startsWith('/') || href.startsWith(this.baseDomain)) {
        const normalized = href.startsWith('/') ? `${this.baseDomain}${href}` : href;
        if (!internal_links.includes(normalized)) {
          internal_links.push(normalized);
        }
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        if (!external_links.includes(href)) {
          external_links.push(href);
        }
      }
    }

    return {
      url: pageUrl,
      title,
      meta_description,
      canonical_url,
      robots_directive,
      hreflangs,
      structured_data_types,
      internal_links,
      external_links,
    };
  }

  /**
   * Reconcile known URL universe according to Section 20.3:
   * router URLs ∪ sitemap URLs ∪ crawl URLs ∪ registered URLs
   */
  public reconcileKnownUniverse(inputs: {
    sitemapUrls: string[];
    routerUrls: string[];
    crawledPages: Map<string, DiscoveredHtmlMetadata>;
  }): Map<string, DiscoveredUrlNode> {
    const universe = new Map<string, DiscoveredUrlNode>();

    const normalize = (u: string) => {
      try {
        const parsed = new URL(u, this.baseDomain);
        return parsed.origin + parsed.pathname;
      } catch {
        return u;
      }
    };

    // 1. Ingest sitemap URLs
    for (const url of inputs.sitemapUrls) {
      const norm = normalize(url);
      universe.set(norm, {
        url,
        normalized_url: norm,
        discovered_via: 'SITEMAP',
        reconciliation_state: 'UNKNOWN_REQUIRES_EVIDENCE',
        inbound_internal_links_count: 0,
        discovered_at: new Date().toISOString(),
        provenance_ref: `sitemap_ingest_${Date.now()}`,
      });
    }

    // 2. Ingest router URLs
    for (const url of inputs.routerUrls) {
      const norm = normalize(url);
      const existing = universe.get(norm);
      if (existing) {
        // already found
      } else {
        universe.set(norm, {
          url,
          normalized_url: norm,
          discovered_via: 'ROUTER',
          reconciliation_state: 'UNKNOWN_REQUIRES_EVIDENCE',
          inbound_internal_links_count: 0,
          discovered_at: new Date().toISOString(),
          provenance_ref: `router_ingest_${Date.now()}`,
        });
      }
    }

    // 3. Reconcile with crawled pages metadata
    for (const [normUrl, htmlMeta] of inputs.crawledPages.entries()) {
      let node = universe.get(normUrl);
      if (!node) {
        node = {
          url: htmlMeta.url,
          normalized_url: normUrl,
          discovered_via: 'HTML_HREF',
          reconciliation_state: 'ACTIVE_CANONICAL',
          inbound_internal_links_count: 0,
          discovered_at: new Date().toISOString(),
          provenance_ref: `crawl_surface_${Date.now()}`,
        };
        universe.set(normUrl, node);
      }

      node.title = htmlMeta.title;
      node.meta_description = htmlMeta.meta_description;
      node.canonical_header_or_tag = htmlMeta.canonical_url;
      node.hreflang_tags = htmlMeta.hreflangs;
      node.structured_data_types = htmlMeta.structured_data_types;
      node.http_status = 200;

      // Classify reconciliation status
      if (htmlMeta.robots_directive?.toLowerCase().includes('noindex')) {
        node.reconciliation_state = 'NOINDEX';
      } else if (htmlMeta.canonical_url && normalize(htmlMeta.canonical_url) !== normUrl) {
        node.reconciliation_state = 'ACTIVE_NONCANONICAL';
      } else {
        node.reconciliation_state = 'ACTIVE_CANONICAL';
      }

      // Count inbound links for destinations
      for (const target of htmlMeta.internal_links) {
        const normTarget = normalize(target);
        const targetNode = universe.get(normTarget);
        if (targetNode) {
          targetNode.inbound_internal_links_count += 1;
        } else {
          universe.set(normTarget, {
            url: target,
            normalized_url: normTarget,
            discovered_via: 'HTML_HREF',
            reconciliation_state: 'UNKNOWN_REQUIRES_EVIDENCE',
            inbound_internal_links_count: 1,
            discovered_at: new Date().toISOString(),
            provenance_ref: `internal_link_from_${normUrl}`,
          });
        }
      }
    }

    // Identify orphans
    for (const [_, node] of universe.entries()) {
      if (node.inbound_internal_links_count === 0 && node.normalized_url !== `${this.baseDomain}/`) {
        if (node.reconciliation_state === 'ACTIVE_CANONICAL') {
          node.reconciliation_state = 'ORPHAN';
        }
      }
    }

    return universe;
  }

  /**
   * Helper to wrap raw facts into canonical RawObservation envelope
   */
  public createObservation<T>(payload: T, sourceSystem: string, schemaVersion = '1.0.0'): RawObservation<T> {
    const rawString = JSON.stringify(payload);
    // Simple fast DJB2 hash for checksum
    let hash = 5381;
    for (let i = 0; i < rawString.length; i++) {
      hash = ((hash << 5) + hash) + rawString.charCodeAt(i);
    }
    const checksum = `djb2_${(hash >>> 0).toString(16)}`;

    return {
      observation_id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      source_system: sourceSystem,
      observed_at: new Date().toISOString(),
      ingested_at: new Date().toISOString(),
      schema_version: schemaVersion,
      freshness_class: 'HOURLY',
      confidence_class: 'CONFIRMED_HIGH',
      data_quality_flags: [],
      raw_payload_checksum: checksum,
      payload,
    };
  }
}
