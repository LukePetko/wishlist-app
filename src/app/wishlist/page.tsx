import { db } from "@/drizzle";
import React from "react";
import WishlistTable from "@/components/WishlistTable";

const Wishlist = async () => {
  const data = await db.query.wishlistItems.findMany({
    with: {
      links: true,
    },
  });

  console.log(data);

  return (
    <div className="py-12 max-w-7xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <WishlistTable data={data} />
    </div>
  );
};

export default Wishlist;
