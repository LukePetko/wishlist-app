import { db } from "@/drizzle";
import React from "react";
import WishlistTable from "@/components/WishlistTable";
import { minioClient } from "@/utils/file-management";

const Wishlist = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const resolvedParams = await searchParams;
  const isBought = resolvedParams.bought === "true";

  const data = await db.query.wishlistItems.findMany({
    where: (wishlist, { eq }) => {
      return isBought ? undefined : eq(wishlist.isBought, false);
    },
    with: {
      links: {
        with: {
          store: true,
        },
      },
    },
  });

  return (
    <div className="py-12 max-w-7xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <WishlistTable data={data} />
    </div>
  );
};

export default Wishlist;
