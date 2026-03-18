import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function DemoBackButton() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (searchParams.get('from') !== 'demos') return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={() => navigate('/admin?tab=demos')}
        className="gap-2 shadow-lg"
        size="lg"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Modulauswahl
      </Button>
    </div>
  );
}
