import { useAtomValue } from 'jotai';
import type { FC } from 'react';
import isLoggedInAtom from '@/jotai/loggenInAtom';
import { cn } from '@/lib/utils';
import type { WishlistItem } from '@/types';
import OrderConfirmationModal from '../OrderConfirmationModal';
import ResponsiveTooltip from '../ResponsiveTooltip';
import { Button } from '../ui/button';

type OrderNoteProps = {
  note: string | null;
};

type OrderStatusProps = {
  item: WishlistItem;
  className?: string;
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
    <ResponsiveTooltip
      content={<p className="text-xs">{note}</p>}
      trigger={
        <p className="text-xs">
          <span className="text-gray-500">{note.slice(0, 40)}...</span>
        </p>
      }
      mobileContentClassName="border-none bg-black text-white p-2 text-sm"
    />
  );
};

const OrderStatus: FC<OrderStatusProps> = ({ item, className }) => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  if (!isLoggedIn) {
    return null;
  }

  if (item.isBought) {
    return <p className="text-sm text-gray-500">Kúpené</p>;
  }

  if (!item.isOrdered) {
    return (
      <div className={className}>
        <OrderConfirmationModal item={item}>
          <Button className="text-xs">Nastaviť ako objendané</Button>
        </OrderConfirmationModal>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2 items-end', className)}>
      <p className="text-sm text-gray-500">Objednané</p>
      <OrderNote note={item.orders[0].note} />
    </div>
  );
};

export default OrderStatus;
