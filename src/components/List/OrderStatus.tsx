import { useAtomValue } from 'jotai';
import type { FC } from 'react';
import type { wishlistOrders } from '@/drizzle/schema';
import isLoggedInAtom from '@/jotai/loggenInAtom';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import OrderConfirmationModal from '../OrderConfirmationModal';
import { WishlistItem } from '@/types';

type OrderNoteProps = {
  note: string | null;
};

type OrderStatusProps = {
  item: WishlistItem;
};

const OrderNote: FC<OrderNoteProps> = ({ note }) => {
  if (!note) {
    return null;
  }

  if (note.length <= 40) {
    return (
      <p className="text-xs">
        <span className="text-gray-500">{note}</span>
      </p>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <p className="text-xs">
          <span className="text-gray-500">{note.slice(0, 40)}...</span>
        </p>
      </TooltipTrigger>
      <TooltipContent className="max-w-[20vw]">
        <p className="text-xs">{note}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const OrderStatus: FC<OrderStatusProps> = ({ item }) => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  if (!isLoggedIn) {
    return null;
  }

  if (item.isBought) {
    return <p className="text-sm text-gray-500">Kúpené</p>;
  }

  if (!item.isOrdered) {
    return (
      <OrderConfirmationModal item={item}>
        <Button className="text-xs">Nastaviť ako objendané</Button>
      </OrderConfirmationModal>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <p className="text-sm text-gray-500">Objednané</p>
      <OrderNote note={item.orders[0].note} />
    </div>
  );
};

export default OrderStatus;
