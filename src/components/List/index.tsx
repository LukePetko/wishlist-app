'use client';
import type { FC } from 'react';
import type { WishlistItem } from '@/types';
import ListItem from './ListItem';

type ListProps = {
  items: WishlistItem[];
};

const index: FC<ListProps> = ({ items }) => {
  console.log(items);
  return (
    <div>
      {items.map((item, index) => {
        console.log(index, items.length, item.name);
        return (
          <ListItem
            key={item.id}
            item={item}
            showSeparator={index !== items.length - 1}
          />
        );
      })}
    </div>
  );
};

export default index;
