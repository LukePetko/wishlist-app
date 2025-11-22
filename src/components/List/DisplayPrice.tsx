import { ArrowRight, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type react from 'react';
import type { WishlistLink } from '@/types';
import codeToSymbol from '@/utils/codeToSymbol';
import ConditionalTooltip from '../ConditionalTooltip';
import { cn } from '@/lib/utils';

type DisplayPriceProps = {
  link: WishlistLink | null;
  className?: string;
  displayConverted?: boolean;
};

const DisplayPrice: react.FC<DisplayPriceProps> = ({
  link,
  className,
  displayConverted,
}) => {
  if (!link) return null;

  return (
    <div className={cn('flex flex-col gap-2 items-end', className)}>
      <p className="text-sm text-gray-500">Cena</p>
      <Link
        href={link.url}
        target="_blank"
        className="flex flex-row justify-center items-center gap-1 cursor-pointer w-max hover:underline"
      >
        <ConditionalTooltip
          content={link.currency === 'EUR' ? undefined : `~${link.priceEur}€`}
          triggerClassName="cursor-pointer"
        >
          <p className="text-sm mr-1">
            {link.price}
            {codeToSymbol(link.currency)}
          </p>
        </ConditionalTooltip>
        {displayConverted && link.currency !== 'EUR' && (
          <p className="text-sm text-gray-500">(~{link.priceEur}€)</p>
        )}
        {link.store.icon ? (
          <Image
            src={`/api/get-image?id=${link.store.icon}`}
            alt=""
            width={20}
            height={20}
            className="p-0"
          />
        ) : (
          <Store className="w-5 h-5 text-gray-500" />
        )}
        <ArrowRight width={16} height={16} />
      </Link>
    </div>
  );
};

export default DisplayPrice;
