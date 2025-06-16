import React from 'react';
import PromptToolTemplate from '../components/PromptToolTemplate';
import { fetchAdText } from '../api/openai';

const SOCIAL_MEDIA_FORMATS = [
  { label: '📸 Instagram Post', value: 'instagram_post' },
  { label: '🎥 TikTok Video Hook', value: 'tiktok_hook' },
  { label: '💼 LinkedIn Ad', value: 'linkedin_ad' },
  { label: '🧵 Threads-Post', value: 'threads_post' },
  { label: '🐦 X / Twitter Teaser', value: 'twitter_teaser' },
  { label: '🎬 YouTube Shorts Caption', value: 'youtube_caption' }
];

export default function OnlineAdsTool() {
  return (
    <PromptToolTemplate
      title="Social Media Werbetexte"
      formats={SOCIAL_MEDIA_FORMATS}
      apiFunction={({ input, format }) => fetchAdText(input, format)}
    />
  );
}
