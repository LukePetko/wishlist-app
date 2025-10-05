'use client';

import {
  type ColumnDef,
  flexRender,
  type Table as ReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: ReactTable<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  table,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="w-full">
      {/* Desktop/tablet view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden flex flex-col gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="border rounded-md p-4 shadow-sm bg-white"
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="mb-2">
                  <p className="text-sm text-gray-500">
                    {cell.column.columnDef.header as string}
                  </p>
                  <p className="font-medium text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">No results.</p>
        )}
      </div>
    </div>
  );
}
