import { db } from "@/drizzle";
import React from "react";
import WishlistTable from "@/components/WishlistTable";
import { wishlistItems } from "@/drizzle/schema";
import { asc, desc } from "drizzle-orm";

const Wishlist = async ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const isBought = searchParams.bought === "true";
  const filter = searchParams.filter as string | undefined;
  const sort = (searchParams.sort as string | undefined)?.split(".");

  const data = await db.query.wishlistItems.findMany({
    where: (wishlist, { eq, and, ilike }) => {
      const conditions = [!isBought ? eq(wishlist.isBought, false) : undefined];

      if (filter) {
        conditions.push(ilike(wishlist.name, `%${filter}%`));
      }

      return and(...conditions.filter((c) => c !== undefined));
    },
    with: {
      links: {
        with: {
          store: true,
        },
      },
    },
    orderBy: (
      wishlist,
      { asc, desc }
    ) => {
      if (sort) {
        const [id, dir] = sort;

        if (id === "name") {
          return [dir === "asc" ? asc(wishlist.name) : desc(wishlist.name)];
        } else if (id === "lowestPrice") {
          // This is a placeholder, as we can't directly sort by the calculated lowestPrice.
          // We will sort the data after fetching it.
        }
      }
      return [];
    },
  });

  const processedData = data.map((item) => ({
    ...item,
    lowestPrice: item.links.reduce((acc, curr) => {
      if (acc.price > curr.price) {
        return curr;
      }
      return acc;
    }).price,
  }));

  if (sort && sort[0] === "lowestPrice") {
    processedData.sort((a, b) => {
      if (sort[1] === "asc") {
        return a.lowestPrice - b.lowestPrice;
      } else {
        return b.lowestPrice - a.lowestPrice;
      }
    });
  }

  return (
    <div className="py-12 max-w-7xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <WishlistTable data={processedData} />
    </div>
  );
};

export default Wishlist;
