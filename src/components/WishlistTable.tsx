"use client";
import React, { FC, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { WishlistItem } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import WishlistModel from "./WishlistModel";

const columns: ColumnDef<WishlistItem>[] = [
  {
    id: "select",
    accessorKey: "isBought",
    header: "Bought",
    cell: ({ row, getValue }) => {
      const value = getValue() as boolean;
      if (value && !row.getIsSelected()) row.toggleSelected(true);
      return (
        <Checkbox
          checked={row.getIsSelected()}
          aria-label="isBought"
          disabled
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "lowestPrice",
    header: "Lowest Price",
    cell: ({ getValue }) => {
      const value = getValue();

      return `$${value}`;
    },
  },
  {
    header: "Detail",
    cell: ({ row }) => {
      return (
        <WishlistModel item={row.original}>
          <ArrowRight className="h-5 p-0 cursor-pointer" />
        </WishlistModel>
      );
    },
  },
];

type WishlistTableProps = {
  data: WishlistItem[];
};

const WishlistTable: FC<WishlistTableProps> = ({ data }) => {
  const [mappedData, setMappedData] = useState<WishlistItem[] | null>(null);

  useEffect(() => {
    const mappedData = data.map((item) => {
      return {
        ...item,
        lowestPrice: item.links.reduce((acc, curr) => {
          if (acc.price > curr.price) {
            return curr;
          }
          return acc;
        }).price,
      };
    });

    setMappedData(mappedData);
  }, [data]);

  if (!mappedData) {
    return (
      <div className="w-full flex flex-col gap-1">
        <Skeleton className="w-full h-11" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  return <DataTable columns={columns} data={mappedData} />;
};

export default WishlistTable;
