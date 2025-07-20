import { db } from "@/drizzle";
import React from "react";
import WishlistTable from "@/components/WishlistTable";
import { minioClient } from "@/utils/file-management";

const Wishlist = async () => {
  const data = await db.query.wishlistItems.findMany({
    with: {
      links: {
        with: {
          store: true,
        },
      },
    },
  });

  const exists = await minioClient.bucketExists("wishlist");

  console.log(exists);

  const presignedUrl = await minioClient.presignedUrl(
    "GET",
    "wishlist",
    "items/switch.png",
    24 * 60 * 60,
  );

  console.log(presignedUrl);

  console.log(data);

  return (
    <div className="py-12 max-w-7xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <WishlistTable data={data} />
    </div>
  );
};

export default Wishlist;
