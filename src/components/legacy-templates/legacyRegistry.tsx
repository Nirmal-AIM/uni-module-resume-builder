/**
 * legacyRegistry.tsx
 *
 * Registry mapping legacy template keys to their restored template components.
 * Restored directly from uni-module-resume-builder-main - Copy.
 */

import React from 'react';
import { ExecutiveNavyTemplate } from './ExecutiveNavyTemplate';
import { WarmTerracottaTemplate } from './WarmTerracottaTemplate';
import { CleanTealTemplate } from './CleanTealTemplate';
import { BoldBlackTemplate } from './BoldBlackTemplate';
import { DefaultLegacyTemplate } from './DefaultLegacyTemplate';

export const LEGACY_TEMPLATE_KEYS = new Set([
  'modern-blue',
  'executive-navy',
  'executive navy',
  'richard-sanchez',
  'minimalist-orange',
  'warm-terracotta',
  'warm terracotta',
  'zola-bekker',
  'clean-teal',
  'clean-modern',
  'clean teal',
  'drew-feig',
  'bold-black',
  'bold-minimal',
  'bold systems',
  'laurice-moretti',
  'modern',
  'minimal',
  'academic',
]);

export function isLegacyTemplate(key: string): boolean {
  return LEGACY_TEMPLATE_KEYS.has((key || '').toLowerCase());
}

export function renderLegacyTemplate(key: string, data: any): React.ReactElement {
  const k = (key || '').toLowerCase();

  if (k === 'modern-blue' || k === 'executive-navy' || k === 'executive navy' || k === 'richard-sanchez') {
    return <ExecutiveNavyTemplate data={data} />;
  }

  if (k === 'minimalist-orange' || k === 'warm-terracotta' || k === 'warm terracotta' || k === 'zola-bekker') {
    return <WarmTerracottaTemplate data={data} />;
  }

  if (k === 'clean-teal' || k === 'clean-modern' || k === 'clean teal' || k === 'drew-feig') {
    return <CleanTealTemplate data={data} />;
  }

  if (k === 'bold-black' || k === 'bold-minimal' || k === 'bold systems' || k === 'laurice-moretti') {
    return <BoldBlackTemplate data={data} />;
  }

  if (k === 'minimal') {
    return <DefaultLegacyTemplate data={data} variant="minimal" />;
  }

  if (k === 'academic') {
    return <DefaultLegacyTemplate data={data} variant="academic" />;
  }

  return <DefaultLegacyTemplate data={data} variant="modern" />;
}
