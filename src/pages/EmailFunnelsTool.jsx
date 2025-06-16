import React from 'react';
import PromptToolTemplate from '../components/PromptToolTemplate';
import { fetchAdText } from '../api/openai';

const EMAIL_FORMATS = [
  { label: '📩 Betreffzeile', value: 'email_subject' },
  { label: '📧 Follow-Up Mail', value: 'followup_mail' },
  { label: '🚀 Launch-Mail', value: 'launch_mail' },
  { label: '🧲 Newsletter Intro', value: 'newsletter_intro' }
];

export default function EmailFunnelsTool() {
  return (
    <PromptToolTemplate
      title="E-Mail & Funnel Texte"
      formats={EMAIL_FORMATS}
      apiFunction={({ input, format }) => fetchAdText(input, format)}
    />
  );
}
