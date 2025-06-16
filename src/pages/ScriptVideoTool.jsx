import React from 'react';
import PromptToolTemplate from '../components/PromptToolTemplate';
import { fetchAdText } from '../api/openai';

const VIDEO_FORMATS = [
  { label: '🎬 TikTok Hook', value: 'tiktok_hook' },
  { label: '📽️ YouTube Intro', value: 'youtube_intro' },
  { label: '📱 Reels Caption', value: 'reel_caption' }
];

export default function ScriptVideoTool() {
  return (
    <PromptToolTemplate
      title="Video & Script Generator"
      formats={VIDEO_FORMATS}
      apiFunction={({ input, format }) => fetchAdText(input, format)}
    />
  );
}
