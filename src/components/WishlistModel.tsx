import { WishlistItem } from "@/types";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Store } from "lucide-react";

type WishlistModelProps = {
  item: WishlistItem;
};

const WishlistModal: FC<PropsWithChildren<WishlistModelProps>> = ({
  item,
  children,
}) => {
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchImage = async () => {
    const url = await fetch(`/api/generate-url?id=${item.image}`);
    const data = await url.json();
    setItemImage(data.url);
  };

  useEffect(() => {
    if (item.image && open) {
      fetchImage();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center">
        {children}
      </DialogTrigger>
      <DialogContent className="w-full !max-w-screen-lg px-12 py-8">
        <DialogHeader>
          <DialogTitle className="text-3xl">{item.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-8 justify-between w-full">
          <div className="flex flex-col gap-1 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Description</h3>
              <p>{item.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">Stores</h3>
              <ul className="flex flex-col">
                {item.links
                  .sort((a, b) => +a.price - +b.price)
                  .map((link) => (
                    <li
                      key={link.id}
                      className="not-last-of-type:border-b border-black w-full p-2 flex flex-row gap-2 justify-between"
                    >
                      <div className="flex flex-row gap-2">
                        {false ? (
                          <Image
                            /* TODO: Add icon */
                            src={link.store.icon!}
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
                              link.price === item.lowestPrice.toString()
                                ? "green"
                                : "",
                          }}
                        >
                          {link.price}€
                        </p>
                        <ArrowRight className="h-5 p-0 cursor-pointer" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          {itemImage && (
            <Image
              src={`/api/image-proxy?url=${encodeURIComponent(itemImage)}`}
              alt={item.name}
              width={400}
              height={400}
              className="rounded-md"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModal;
