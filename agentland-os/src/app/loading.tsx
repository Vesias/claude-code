import { Loading } from '@/components/ui/loading';

export default function RootLoading() {
  return (
    <Loading 
      fullScreen 
      size="xl" 
      text="AgentlandOS wird initialisiert..."
    />
  );
}