"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Logs, Search } from "lucide-react"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import GetHostLocation from "@/lib/host"
import { ResponseBody, TagStatDto } from "@/dto/response"
import { DatePickerWithRange } from "@/components/range-date"
import { Badge } from "@/components/ui/badge"

const departmentColumns: ColumnDef<TagStatDto>[] = [
  {
    accessorKey: "tag_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên thẻ
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("tag_name")}</div>,
  },
  {
    accessorKey: "lending",
    header: () => <div className="text-center">Đang mượn</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">
        <Badge variant="secondary">{row.getValue("lending")}</Badge>
      </div>
    },
  },
  {
    accessorKey: "lending_returned",
    header: () => <div className="text-center">Đã trả</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">
        <Badge variant="secondary">{row.getValue("lending_returned")}</Badge>
      </div>
    },
  },
  {
    accessorKey: "washing",
    header: () => <div className="text-center">Đang giặt</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">
        <Badge variant="secondary">{row.getValue("washing")}</Badge>
      </div>
    },
  },
  {
    accessorKey: "washing_returned",
    header: () => <div className="text-center">Đã giặt</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">
        <Badge variant="secondary">{row.getValue("washing_returned")}</Badge>
      </div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const history = row.original
      return (
        <div className="flex justify-end gap-2">
          <Link href={`/statistics/tags/${history.tag_name}`}>
            <Button variant="secondary" className="px-3">
              <Logs size={16} />
            </Button>
          </Link>
        </div>
      )
    },
  }
]

export default function LendingScreen() {
  const [data, setData] = React.useState<TagStatDto[]>([])
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })

  const { toast } = useToast()

  const handleRefreshDept = async () => {
    const fetchData = async () => {
      try {
        const from = date && date.from ? Math.floor(date.from.getTime() / 1000) : ''
        const to = date && date.to ? Math.floor(date.to.getTime() / 1000) : ''

        const httpResp = await fetch(`${GetHostLocation()}/api/v1/stats/tags?from=${from}&to=${to}`)
        const jsonResp: ResponseBody<TagStatDto[]> = await httpResp.json()
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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const from = date && date.from ? Math.floor(date.from.getTime() / 1000) : ''
        const to = date && date.to ? Math.floor(date.to.getTime() / 1000) : ''

        const httpResp = await fetch(`${GetHostLocation()}/api/v1/stats/tags?from=${from}&to=${to}`)
        const jsonResp: ResponseBody<TagStatDto[]> = await httpResp.json()
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
    columns: departmentColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })


  return (
    <div className="w-full px-2 sm:px-6">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Tìm theo thẻ..."
          value={(table.getColumn("tag_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("tag_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button variant="outline" onClick={handleRefreshDept}>
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
                  colSpan={departmentColumns.length}
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
