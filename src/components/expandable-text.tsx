
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { CardDescription } from './ui/card';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

export function ExpandableText({ text, maxLength = 300 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }

  const needsTruncation = text.length > maxLength;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-2">
      <CardDescription className="text-base leading-relaxed whitespace-pre-wrap">
        {needsTruncation && !isExpanded ? `${text.slice(0, maxLength)}...` : text}
      </CardDescription>
      {needsTruncation && (
        <Button variant="link" onClick={toggleExpanded} className="p-0 h-auto text-primary">
          {isExpanded ? 'Lihat lebih sedikit' : 'Lihat lebih banyak'}
        </Button>
      )}
    </div>
  );
}
