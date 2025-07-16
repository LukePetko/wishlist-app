import { db } from "@/drizzle";
import { wishlistItems } from "@/drizzle/schema";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { WishlistItem } from "@/types";
import WishlistTable from "@/components/WishlistTable";

const Wishlist = async () => {
  const data = (await db.select().from(wishlistItems)).map((item) => ({
    ...item,
    lowestPrice: 0,
  })) as WishlistItem[];

  return (
    <div className="py-12 max-w-7xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <WishlistTable data={data} />
    </div>
  );
};

export default Wishlist;
