import React from 'react';
import PromptToolTemplate from '../components/PromptToolTemplate';
import { fetchAdText } from '../api/openai';

export default function ClaimTool() {
  return (
    <PromptToolTemplate
      title="Claim & Branding Generator"
      apiFunction={({ input, brand, value }) =>
        fetchAdText(`${brand} | ${value} | ${input}`, 'claim')
      }
      extraFields={[
        { name: 'brand', label: 'Markenname' },
        { name: 'value', label: 'USP / Markenwert' }
      ]}
    />
  );
}
