'use client';
import { RefreshCw } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';

const ResetFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleReset = () => {
    router.push(pathname);
  };

  if (searchParams.size === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 border-red-400"
      onClick={handleReset}
    >
      <RefreshCw className="h-4 w-4 text-red-400" />
      <span className="text-sm font-semibold text-red-400">
        Resetovať filtre
      </span>
    </Button>
  );
};

export default ResetFilters;
