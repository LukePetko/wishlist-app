import { ArrowRight, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type react from 'react';
import type { WishlistLink } from '@/types';
import codeToSymbol from '@/utils/codeToSymbol';
import ConditionalTooltip from '../ConditionalTooltip';

type DisplayPriceProps = {
  link: WishlistLink;
};

const DisplayPrice: react.FC<DisplayPriceProps> = ({ link }) => {
  return (
    <div className="flex flex-col gap-2 items-end">
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
