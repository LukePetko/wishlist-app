'use client';
import type { FC } from 'react';
import { useMd } from '@/hooks/useMd';
import type { WishlistItem } from '@/types';
import ListItem from './ListItem';
import MobileListItem from './MobileListItem';

type ListProps = {
  items: WishlistItem[];
};

const index: FC<ListProps> = ({ items }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isMd = useMd();

  if (items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center gap-2">
        <p className="text-center">
          Nič takéto si asi neželám (zatiaľ) ¯\(ツ)/¯
        </p>
        <p className="text-center text-gray-500 text-sm">
          Skús hľadať niečo iné （＾ω＾）
        </p>
      </div>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <>
          {isMd ? (
            <ListItem
              key={item.id}
              item={item}
              showSeparator={index !== items.length - 1}
            />
          ) : (
            <MobileListItem
              key={item.id}
              item={item}
              showSeparator={index !== items.length - 1}
            />
          )}
        </>
      ))}
    </>
  );
};

export default index;
