import Image from 'next/image';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { WishlistItem } from '@/types';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import DisplayPrice from './DisplayPrice';
import StoresPopover from './StoresPopover';
import OrderStatus from './OrderStatus';

type ListItemProps = {
  item: WishlistItem;
  className?: string;
  showSeparator?: boolean;
};

const ListItem: FC<ListItemProps> = ({ item, className, showSeparator }) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row gap-2 justify-between">
        <div className={cn('flex gap-4 px-2', className)}>
          {item.image && (
            <div className="min-w-[120px] flex items-center justify-center">
              <Image
                src={`/api/get-image?id=${item.image}`}
                alt={item.name}
                height={120}
                width={120}
                className="h-[120px] object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 p-4 w-2/3">
            <div className="flex flex-row gap-2">
              <h3 className="text-xl font-semibold md:whitespace-nowrap">
                {item.name}
              </h3>
              {item.difficultyLevel && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="!p-1 text-xs">
                      {item.difficultyLevel?.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="flex flex-col gap-1">
                    Náročnosť: {item.difficultyLevel?.name}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-gray-500">{item.description}</p>
            {item.categories.length > 0 && (
              <div className="flex flex-col gap-2">
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
          </div>
        </div>
        <div className="flex flex-col items-end flex-1 justify-between">
          <div className="flex flex-col gap-2">
            <DisplayPrice link={item.lowestPrice} />
            {item.links.length > 1 && <StoresPopover links={item.links} />}
          </div>
          <OrderStatus item={item} />
        </div>
      </div>
      {showSeparator && <Separator />}
    </div>
  );
};

export default ListItem;
