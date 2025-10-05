'use client';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { DataTable } from './DataTable';
import type { WishlistItem } from '@/types';
import { Skeleton } from './ui/skeleton';
import { Checkbox } from './ui/checkbox';
import { ArrowRight, ArrowUpDown } from 'lucide-react';
import WishlistModel from './WishlistModel';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from './ui/input';
import { Button } from './ui/button';
import PasswordModal from './PasswordModal';
import { useAtom } from 'jotai';
import isLoggedInAtom from '@/jotai/loggenInAtom';

const columns: ColumnDef<WishlistItem>[] = [
  {
    id: 'select',
    header: 'Kúpené',
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
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="!ml-[-12px]"
        >
          Názov
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'lowestPrice',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="!ml-[-12px]"
        >
          Cena
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue();

      return `${value}€`;
    },
  },
  {
    header: 'Detail',
    cell: ({ row }) => {
      return (
        <WishlistModel item={row.original}>
          <ArrowRight className="h-5 p-0 cursor-pointer" />
        </WishlistModel>
      );
    },
  },
];

const orderedColumn: ColumnDef<WishlistItem> = {
  accessorKey: 'isOrdered',
  header: 'Objednané',
  cell: ({ row }) => {
    return <Checkbox checked={row.getValue('isOrdered')} disabled />;
  },
  enableSorting: false,
  enableHiding: false,
};

type WishlistTableProps = {
  data: WishlistItem[];
};

const WishlistTable: FC<WishlistTableProps> = ({ data }) => {
  const [mappedData, setMappedData] = useState<WishlistItem[] | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBought = searchParams.get('bought') === 'true';
  const initialFilter = searchParams.get('filter') ?? '';
  const initialSort = searchParams.get('sort')?.split('.');

  const [filter, setFilter] = useState(initialFilter);
  const debouncedFilter = useDebounce(filter);
  const [sorting, setSorting] = useState<SortingState>(
    initialSort
      ? [{ id: initialSort[0], desc: initialSort[1] === 'desc' }]
      : [],
  );

  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  const filteredColumns = isLoggedIn
    ? ([
        columns[0],
        orderedColumn,
        ...columns.slice(1),
      ] as ColumnDef<WishlistItem>[])
    : columns;

  const table = useReactTable({
    data: mappedData ?? [],
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualSorting: true,
  });

  useEffect(() => {
    setMappedData(data);
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
    const params = new URLSearchParams(searchParams);
    const nextValue = (!isBought).toString();

    if (nextValue === 'false') {
      params.delete('bought'); // optional: remove when false
    } else {
      params.set('bought', nextValue);
    }

    router.push(`?${params.toString()}`);
  }, [isBought, router, searchParams]);

  const handleCheckLogin = async () => {
    const res = await fetch('/api/check-cookie');
    if (res.status === 200) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    const res = await fetch('/api/logout');
    if (res.status === 200) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedFilter) {
      params.set('filter', debouncedFilter);
    } else {
      params.delete('filter');
    }
    router.push(`?${params.toString()}`);
  }, [debouncedFilter, router, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (sorting.length > 0) {
      params.set(
        'sort',
        `${sorting[0].id}.${sorting[0].desc ? 'desc' : 'asc'}`,
      );
    } else {
      params.delete('sort');
    }
    router.push(`?${params.toString()}`);
  }, [sorting, router, searchParams]);

  useEffect(() => {
    handleCheckLogin();
  }, []);

  if (!mappedData) {
    return (
      <div className="w-full flex flex-col gap-1">
        <Skeleton className="w-full h-11" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  console.log(data);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Input
            className="max-w-64"
            placeholder="Hľadať..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <label className="flex items-center gap-2 w-full">
            <Checkbox
              checked={isBought}
              onCheckedChange={handleToggle}
              aria-label="isBought"
            />
            <span className="text-sm">Zobraziť kúpené</span>
          </label>
        </div>
        {isLoggedIn ? (
          <Button variant="ghost" onClick={handleLogout}>
            Odhlásiť
          </Button>
        ) : (
          <PasswordModal>
            <Button variant="ghost">Režim rezervovaných</Button>
          </PasswordModal>
        )}
      </div>
      <DataTable columns={filteredColumns} table={table} />
    </>
  );
};

export default WishlistTable;
