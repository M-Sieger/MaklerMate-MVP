import React from 'react';
import PromptToolTemplate from '../components/PromptToolTemplate';
import { fetchAdText } from '../api/openai';

const SALES_FORMATS = [
  { label: '💡 Value Proposition', value: 'value_prop' },
  { label: '📑 Angebots-Pitch', value: 'sales_pitch' },
  { label: '🎯 Slide Text / Deck', value: 'sales_slide' }
];

export default function B2BSalesTool() {
  return (
    <PromptToolTemplate
      title="Pitch & B2B Sales"
      formats={SALES_FORMATS}
      apiFunction={({ input, format }) => fetchAdText(input, format)}
    />
  );
}
