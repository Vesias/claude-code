import { LivingDesktop } from '@/components/desktop/living-desktop';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgentLand OS - Living Desktop',
  description: 'A conscious desktop operating system for AI agents',
};

export default function DesktopPage() {
  return <LivingDesktop />;
}