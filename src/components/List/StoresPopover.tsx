import { ArrowRight, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import type { WishlistLink } from '@/types';
import codeToSymbol from '@/utils/codeToSymbol';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type StoresPopoverProps = {
  links: WishlistLink[];
};

const StoresPopover: FC<StoresPopoverProps> = ({ links }) => {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2 hover:underline text-xs whitespace-nowrap cursor-pointer">
        Všetky obchody
        <Store className="w-4 h-4 text-gray-500" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-3">
        {links
          .sort((a, b) => +a.price - +b.price)
          .map((link) => (
            <Link
              key={link.id}
              className="flex flex-row gap-2 justify-between hover:underline"
              href={link.url}
              target="_blank"
            >
              <div className="flex flex-row gap-2">
                {link.store.icon ? (
                  <Image
                    src={`/api/get-image?id=${link.store.icon}`}
                    alt=""
                    width={20}
                    height={20}
                    className="rounded-full p-0"
                  />
                ) : (
                  <Store className="w-5 h-5 text-gray-500" />
                )}
                <p className="text-sm font-semibold">{link.store.name}</p>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <p className="text-sm text-gray-500">
                  {link.currency === 'EUR'
                    ? `${link.price}€`
                    : `${link.price}${codeToSymbol(link.currency)} (~${link.priceEur}€)`}
                </p>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
      </PopoverContent>
    </Popover>
  );
};

export default StoresPopover;
