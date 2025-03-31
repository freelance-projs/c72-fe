"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Logs, Search } from "lucide-react"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import GetHostLocation from "@/lib/host"
import { LaundryDTO, ResponseBody } from "@/dto/response"
import { DatePickerWithRange } from "@/components/range-date"
import Link from "next/link"

const columns: ColumnDef<LaundryDTO>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phòng ban
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "num_washing",
    header: () => <div className="text-center">Đang giặt</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("num_washing")}</div>
    },
  },
  {
    accessorKey: "num_returned",
    header: () => <div className="text-center">Đã trả</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("num_returned")}</div>
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-center">Ngày tạo</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const datePart = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "-");
      const timePart = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const formattedDate = `${datePart} ${timePart}`;
      return <div className="text-center font-medium">{formattedDate}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const history = row.original
      return (
        <div className="flex justify-end gap-2">
          <Link href={`/washing/${history.id}`}>
            <Button variant="secondary" className="px-3">
              <Logs size={16} />
            </Button>
          </Link>
        </div>
      )
    },
  },
]


export default function LendingScreen() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<LaundryDTO[]>([])
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })

  const handleRefresh = async () => {
    const fetchData = async () => {
      try {
        const from = date && date.from ? Math.floor(date.from.getTime() / 1000) : ''
        const to = date && date.to ? Math.floor(date.to.getTime() / 1000) : ''

        const httpResp = await fetch(`${GetHostLocation()}/api/v1/laundry?from=${from}&to=${to}`)
        const jsonResp: ResponseBody<LaundryDTO[]> = await httpResp.json()
        if (jsonResp.success) {
          setData(jsonResp.data)
        }
      } catch (error: any) {
        toast({
          title: "Có lỗi xảy ra",
          description: error.message,
        })
      }
    }
    await fetchData()
  }

  const { toast } = useToast()

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const from = date && date.from ? Math.floor(date.from.getTime() / 1000) : ''
        const to = date && date.to ? Math.floor(date.to.getTime() / 1000) : ''

        const httpResp = await fetch(`${GetHostLocation()}/api/v1/laundry?from=${from}&to=${to}`)
        const jsonResp: ResponseBody<LaundryDTO[]> = await httpResp.json()
        if (jsonResp.success) {
          setData(jsonResp.data)
        }
      } catch (error: any) {
        toast({
          title: "Có lỗi xảy ra",
          description: error.message,
        })
      }
    }
    fetchData()
  }, [])


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })


  return (
    <div className="w-full px-2 sm:px-6">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Tìm theo phòng ban..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Cột <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button variant="outline" onClick={handleRefresh}>
            <Search />
            Lấy dữ liệu
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
