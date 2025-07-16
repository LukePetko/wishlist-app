"use client";
import React, { FC } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { WishlistItem } from "@/types";

const columns: ColumnDef<WishlistItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "lowestPrice",
    header: "Lowest Price",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return `$${value}`;
    },
  },
];

type WishlistTableProps = {
  data: WishlistItem[];
};

const WishlistTable: FC<WishlistTableProps> = ({ data }) => {
  console.log(data);
  return <DataTable columns={columns} data={data} />;
};

export default WishlistTable;
