import Image from 'next/image';
import type { FC } from 'react';
import type { WishlistItem } from '@/types';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import DisplayPrice from './DisplayPrice';
import OrderStatus from './OrderStatus';
import StoresPopover from './StoresPopover';

type MobileListItemProps = {
  item: WishlistItem;
  showSeparator?: boolean;
};

const MobileListItem: FC<MobileListItemProps> = ({ item, showSeparator }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-4 justify-between">
        <Image
          src={`/api/get-image?id=${item.image}`}
          alt={item.name}
          height={120}
          width={120}
          className="h-[120px] object-contain"
        />
        <div className="flex flex-col gap-2 w-2/3">
          {item.isBought ? (
            <h3 className="text-md font-semibold md:whitespace-nowrap line-through hover:no-underline">
              {item.name}
            </h3>
          ) : (
            <h3 className="text-md font-semibold">{item.name}</h3>
          )}
          <div className="flex flex-row gap-2">
            {item.isBought && (
              <Popover>
                <PopoverTrigger asChild>
                  <Badge className="!p-1 text-xs" variant="destructive">
                    Kúpené
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="border-none bg-black text-white p-2 w-max text-sm">
                  Tento darček už bol kúpený a už som ho aj dostal :)
                </PopoverContent>
              </Popover>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Badge className="!p-1">{item.difficultyLevel?.name}</Badge>
              </PopoverTrigger>
              <PopoverContent className="border-none bg-black text-white p-2 w-max text-sm">
                Náročnosť: {item.difficultyLevel?.name}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500">{item.description}</p>
      {item.categories.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">Kategórie</p>
          <div className="flex gap-2">
            {item.categories.map((category) => (
              <Badge key={category.id} className="!py-1">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <DisplayPrice
          link={item.lowestPrice}
          className="w-full justify-between items-center flex-row"
          displayConverted
        />
        {item.links.length > 1 && <StoresPopover links={item.links} />}
      </div>
      <OrderStatus item={item} className="items-start" />
      {showSeparator && <Separator />}
    </div>
  );
};

export default MobileListItem;
