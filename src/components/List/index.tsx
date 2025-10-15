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
