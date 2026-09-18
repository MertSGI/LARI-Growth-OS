/**
 * LARI Growth OS — Public Discovery Engine Tests
 * Verifies Acceptance Gates WP01-A5 & WP01-A6
 */

import fs from 'node:fs';
import path from 'node:path';
import { PublicDiscoveryEngine } from '../src/connectors/public_discovery/discovery_engine.ts';

export function runDiscoveryTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: unknown) {
      results.push({ name, passed: false, error: err instanceof Error ? err.message : String(err) });
    }
  }

  const engine = new PublicDiscoveryEngine('https://larihealth.com');

  // 1. Robots.txt parsing
  test('WP01-A5: Robots.txt parsing extracts directives and sitemap locations', () => {
    const robotsPath = path.resolve('tests/fixtures/public_site/robots.txt');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    const parsed = engine.parseRobotsTxt(robotsContent);

    if (!parsed.sitemaps.includes('https://larihealth.com/sitemap.xml')) {
      throw new Error('Sitemap location not extracted from robots.txt');
    }
    if (!parsed.disallow_rules.includes('/admin/')) {
      throw new Error('Disallow rule /admin/ not found');
    }
    if (!parsed.allow_rules.includes('/')) {
      throw new Error('Allow rule / not found');
    }
  });

  // 2. Sitemap parsing
  test('WP01-A5: XML Sitemap parsing extracts locations, hreflang alternates, and priorities', () => {
    const sitemapPath = path.resolve('tests/fixtures/public_site/sitemap.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const items = engine.parseSitemapXml(sitemapContent);

    if (items.length !== 6) {
      throw new Error(`Expected 6 sitemap items, got ${items.length}`);
    }

    const homeItem = items.find(i => i.loc === 'https://larihealth.com/');
    if (!homeItem) throw new Error('Home item missing in sitemap items');
    if (homeItem.priority !== 1.0) throw new Error(`Expected priority 1.0, got ${homeItem.priority}`);
    if (homeItem.hreflang_alternates.length !== 4) {
      throw new Error(`Expected 4 hreflang alternates on home, got ${homeItem.hreflang_alternates.length}`);
    }
    const esAlt = homeItem.hreflang_alternates.find(h => h.lang === 'es');
    if (!esAlt || esAlt.href !== 'https://larihealth.com/es/') {
      throw new Error('Spanish alternate link mismatch');
    }
  });

  // 3. HTML Surface parsing
  test('WP01-A5: HTML surface extraction captures canonical, title, description, schema and links', () => {
    const htmlPath = path.resolve('tests/fixtures/public_site/sample_home.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const parsed = engine.parseHtmlSurface(htmlContent, 'https://larihealth.com/');

    if (!parsed.title?.includes('LARI Health')) {
      throw new Error(`Title not parsed: ${parsed.title}`);
    }
    if (!parsed.meta_description?.includes('Connect with internationally accredited')) {
      throw new Error('Meta description mismatch');
    }
    if (parsed.canonical_url !== 'https://larihealth.com/') {
      throw new Error(`Canonical mismatch: ${parsed.canonical_url}`);
    }
    if (!parsed.structured_data_types.includes('MedicalBusiness')) {
      throw new Error(`Expected MedicalBusiness structured data, found: ${parsed.structured_data_types.join(', ')}`);
    }
    if (!parsed.internal_links.includes('https://larihealth.com/services/hair-transplant/')) {
      throw new Error('Internal service link hair-transplant not captured');
    }
  });

  // 4. Known Universe reconciliation
  test('WP01-A5: URL Universe reconciliation maps nodes with reconciliation states', () => {
    const sitemapPath = path.resolve('tests/fixtures/public_site/sitemap.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const sitemapItems = engine.parseSitemapXml(sitemapContent);
    const sitemapUrls = sitemapItems.map(i => i.loc);

    const htmlPath = path.resolve('tests/fixtures/public_site/sample_home.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const homeParsed = engine.parseHtmlSurface(htmlContent, 'https://larihealth.com/');

    const crawledPages = new Map([[homeParsed.url, homeParsed]]);

    const universe = engine.reconcileKnownUniverse({
      sitemapUrls,
      routerUrls: ['https://larihealth.com/', 'https://larihealth.com/services/hair-transplant/'],
      crawledPages,
    });

    if (universe.size < 6) {
      throw new Error(`Expected at least 6 URLs in universe, got ${universe.size}`);
    }

    const homeNode = universe.get('https://larihealth.com/');
    if (!homeNode || homeNode.reconciliation_state !== 'ACTIVE_CANONICAL') {
      throw new Error(`Home node state invalid: ${homeNode?.reconciliation_state}`);
    }

    const hairNode = universe.get('https://larihealth.com/services/hair-transplant/');
    if (!hairNode || hairNode.inbound_internal_links_count < 1) {
      throw new Error('Expected inbound links to hair-transplant page');
    }
  });

  // 5. WP01-A6: Observation provenance and checksum verification
  test('WP01-A6: Every observation carries source, freshness, confidence and checksum', () => {
    const obs = engine.createObservation(
      { test_key: 'discovery_val', count: 42 },
      'crawler.public_surface.fixture',
      '1.0.0'
    );

    if (!obs.observation_id.startsWith('obs_')) {
      throw new Error('observation_id missing expected prefix');
    }
    if (obs.source_system !== 'crawler.public_surface.fixture') {
      throw new Error('source_system mismatch');
    }
    if (!obs.raw_payload_checksum.startsWith('djb2_')) {
      throw new Error('raw_payload_checksum missing DJB2 hash format');
    }
    if (obs.confidence_class !== 'CONFIRMED_HIGH') {
      throw new Error(`Expected CONFIRMED_HIGH, got: ${obs.confidence_class}`);
    }
    if (!obs.observed_at || !obs.ingested_at) {
      throw new Error('Timestamp metadata missing from observation');
    }
  });

  return results;
}
