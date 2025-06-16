import React from 'react';
import PromptToolTemplate from '../components/PromptToolTemplate';
import { fetchAdText } from '../api/openai';

const PR_FORMATS = [
  { label: '🗞️ Produktankündigung', value: 'product_announcement' },
  { label: '📣 Event-Mitteilung', value: 'event_notice' },
  { label: '📢 Brand-News', value: 'brand_news' }
];

export default function PressPRTool() {
  return (
    <PromptToolTemplate
      title="Presse & PR Texte"
      formats={PR_FORMATS}
      apiFunction={({ input, format }) => fetchAdText(input, format)}
    />
  );
}
