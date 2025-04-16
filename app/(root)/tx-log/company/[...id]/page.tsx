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
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

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
import { ResponseBody, TxLogDto, TxLogDetailDto, TagTracking } from "@/dto/response"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<TxLogDetailDto>[] = [
  {
    accessorKey: "entity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Công ty
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("entity")}</div>,
  },
  {
    accessorKey: "action",
    header: () => {
      return (
        <div className="text-left">
          Hành động
        </div>
      )
    },
    cell: ({ row }) => {
      const action: string = row.getValue("action")
      return <div className="text-left font-medium">
        {action === "washing" ?
          <Badge variant="secondary">Giặt</Badge>
          :
          <Badge variant="secondary">Trả</Badge>
        }
      </div>
    },
  },
  {
    accessorKey: "tracking",
    header: () => <div className="text-center">
      <Table className="p-0">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Tên vật phẩm</TableHead>
            <TableHead className="text-right">Số lượng</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>,
    cell: ({ row }) => {
      const tracking: TagTracking[] = row.getValue("tracking")
      const action: string = row.getValue("action")
      return <div className="">
        <Table>
          <TableBody>
            {tracking.map((tracking: TagTracking) => {
              return (
                <TableRow key={tracking.name}>
                  <TableCell className="text-left">
                    {tracking.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {action === "washing" ?
                      <Badge variant="secondary">{tracking.exported}</Badge>
                      :
                      <Badge variant="secondary">{tracking.returned}</Badge>
                    }
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-center">Vào lúc</div>,
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
]

export default function LendingTagScreen({ params }: { params: Promise<{ id: string }> }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [txLogDetail, setTxLogDetail] = React.useState<TxLogDetailDto[]>([])
  const [txLog, setTxLog] = React.useState<TxLogDto>()

  const { toast } = useToast()

  const { id } = React.use(params)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const httpResp = await fetch(`${GetHostLocation()}/api/v1/tx-log/companies/${id}`)
        const jsonResp: ResponseBody<TxLogDto> = await httpResp.json()
        if (jsonResp.success) {
          setTxLog(jsonResp.data)
          setTxLogDetail(jsonResp.data.details)
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
    data: txLogDetail,
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
      {txLog && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4 text-gray-600 font-sans">Lịch sử Giặt / Trả Đồ</h2>
            {txLog.exported === txLog.returned ?
              <Badge variant="secondary">Đã hoàn thành</Badge> :
              <Badge variant="destructive">Đang xử lý</Badge>
            }
          </div>
          <div className="flex flex-1 justify-between p-4 mb-4 rounded-md border">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đem giặt</p>
              <p className="text-xl font-bold text-blue-600">{txLog.exported}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đang giặt</p>
              <p className="text-xl font-bold text-red-600">{txLog.returned - txLog.exported}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đã giặt</p>
              <p className="text-xl font-bold text-green-600">{txLog.returned}</p>
            </div>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-0">
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
