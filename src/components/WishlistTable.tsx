"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";

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

  const router = useRouter();
  const searchParams = useSearchParams();

  const isBought = searchParams.get("bought") === "true";

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

  const handleToggle = useCallback(() => {
    console.log("toggle");
    const params = new URLSearchParams(searchParams);
    const nextValue = (!isBought).toString();

    if (nextValue === "false") {
      params.delete("bought"); // optional: remove when false
    } else {
      params.set("bought", nextValue);
    }

    router.push(`?${params.toString()}`);
  }, [isBought, router, searchParams]);

  if (!mappedData) {
    return (
      <div className="w-full flex flex-col gap-1">
        <Skeleton className="w-full h-11" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  return (
    <>
      <label className="flex items-center gap-2">
        <Checkbox
          checked={isBought}
          onCheckedChange={handleToggle}
          aria-label="isBought"
        />
        <span className="text-sm">Show bought</span>
      </label>
      <DataTable columns={columns} data={mappedData} table={table} />
    </>
  );
};

export default WishlistTable;
