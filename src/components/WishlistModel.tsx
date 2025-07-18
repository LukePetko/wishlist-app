import { WishlistItem } from "@/types";
import React, { FC, PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";

type WishlistModelProps = {
  item: WishlistItem;
};

const WishlistModel: FC<PropsWithChildren<WishlistModelProps>> = ({
  item,
  children,
}) => {
  console.log(item);
  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center">
        {children}
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <div className="flex flex-row gap-1">
            {item.description}
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
              />
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModel;
