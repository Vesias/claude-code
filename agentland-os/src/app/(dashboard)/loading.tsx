import { Loading } from '@/components/ui/loading';

export default function DashboardLoading() {
  return (
    <Loading 
      size="lg" 
      text="Dashboard wird geladen..." 
      className="min-h-[600px]"
    />
  );
}