"use client";
import React, { FC, useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
    header: "Bought",
    cell: ({ row }) => {
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

  const table = useReactTable({
    data: mappedData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

  useEffect(() => {
    if (!mappedData) return;

    const selection: Record<string, boolean> = {};

    table.getRowModel().rows.forEach((row) => {
      if (row.original.isBought) {
        selection[row.id] = true;
      }
    });

    table.setRowSelection(selection);
  }, [mappedData, table]);

  if (!mappedData) {
    return (
      <div className="w-full flex flex-col gap-1">
        <Skeleton className="w-full h-11" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  return <DataTable columns={columns} data={mappedData} table={table} />;
};

export default WishlistTable;
