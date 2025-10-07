import type { WishlistItem } from '@/types';
import { type FC, type PropsWithChildren, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Store } from 'lucide-react';
import { Button } from './ui/button';
import { useAtomValue } from 'jotai';
import isLoggedInAtom from '@/jotai/loggenInAtom';
import OrderConfirmationModal from './OrderConfirmationModal';
import codeToSymbol from '@/utils/codeToSymbol';

type WishlistModelProps = {
  item: WishlistItem;
};

const WishlistModal: FC<PropsWithChildren<WishlistModelProps>> = ({
  item,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center">
        {children}
      </DialogTrigger>
      <DialogContent className="w-11/12 md:w-full !max-w-screen-lg px-12 py-8 max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">{item.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-8 justify-between w-full">
          <div className="flex flex-col gap-12 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Popis</h3>
              <p>{item.description}</p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Obchody</h3>
                <ul className="flex flex-col">
                  {item.links
                    .sort((a, b) => +a.price - +b.price)
                    .map((link) => (
                      <li
                        key={link.id}
                        className="not-last-of-type:border-b border-neutral-400 w-full p-2 flex flex-row gap-2 justify-between"
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
                          <p className="text-sm font-semibold">
                            {link.store.name}
                          </p>
                        </div>
                        <Link
                          href={link.url}
                          target="_blank"
                          className="flex flex-row gap-1 hover:underline"
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{
                              color:
                                link.priceEur ===
                                item.lowestPrice.priceEur.toString()
                                  ? 'green'
                                  : '',
                            }}
                          >
                            {link.currency === 'EUR'
                              ? `${link.price}€`
                              : `${link.price}${codeToSymbol(link.currency)} (~${link.priceEur}€)`}
                          </p>
                          <ArrowRight className="h-5 p-0 cursor-pointer" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              {isLoggedIn && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">Stav objednávania</h3>
                  <p className="text-sm text-gray-500">
                    {item.isOrdered ? 'Objendané' : 'Zatiaľ nie je objednané'}
                  </p>
                  {item.orders[0]?.note && (
                    <p className="text-sm">
                      Poznámka:{' '}
                      <span className="text-gray-500">
                        {item.orders[0].note}
                      </span>
                    </p>
                  )}
                  {!item.isOrdered && (
                    <OrderConfirmationModal item={item}>
                      <Button className="w-full">Nastaviť ako objendané</Button>
                    </OrderConfirmationModal>
                  )}
                </div>
              )}
            </div>
          </div>
          {item.image && (
            <Image
              src={`/api/get-image?id=${item.image}`}
              alt={item.name}
              width={400}
              height={400}
              className="rounded-md max-h-[50vh] object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModal;
