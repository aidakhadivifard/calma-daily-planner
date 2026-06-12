import { Sparkles, PawPrint, Shield, Trophy, Rocket, Lightbulb, Wand2, Leaf } from 'lucide-react';

export const THEMES = [
  { id: 'all', label: 'All' },
  { id: 'animals', label: 'Animals', icon: PawPrint, gradient: ['#2f6b4f', '#8fd6a8'] },
  { id: 'heroes', label: 'Heroes', icon: Shield, gradient: ['#7a2f3a', '#ff9d8a'] },
  { id: 'sports', label: 'Sports', icon: Trophy, gradient: ['#1f4f73', '#7fcdff'] },
  { id: 'space', label: 'Space', icon: Rocket, gradient: ['#33206b', '#b9a6ff'] },
  { id: 'invention', label: 'Invention', icon: Lightbulb, gradient: ['#7a5c12', '#ffd57a'] },
  { id: 'mythology', label: 'Mythology', icon: Wand2, gradient: ['#6b2150', '#f6a8d4'] },
  { id: 'nature', label: 'Nature', icon: Leaf, gradient: ['#235c2e', '#a8e394'] },
];

export const THEMES_BY_ID = THEMES.reduce((acc, theme) => {
  acc[theme.id] = theme;
  return acc;
}, {});

export const SparklesIcon = Sparkles;
