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
import { ResponseBody, DepartmentStatDetailDto, TagTracking } from "@/dto/response"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<TagTracking>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên vật phẩm
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "exported",
    header: () => <div className="text-center">Đang mượn</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">
        <Badge variant="secondary">{row.getValue("exported")}</Badge>
      </div>
    },
  },
  {
    accessorKey: "returned",
    header: () => <div className="text-center">Đã trả</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">
        <Badge variant="secondary">{row.getValue("returned")}</Badge>
      </div>
    },
  },
]

export default function LendingTagScreen({ params }: { params: Promise<{ department: string }> }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [tagTrackings, setTagTrackings] = React.useState<TagTracking[]>([])
  const [departmentStat, setDepartmentStat] = React.useState<DepartmentStatDetailDto>()

  const { toast } = useToast()

  const { department } = React.use(params)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const httpResp = await fetch(`${GetHostLocation()}/api/v1/stats/departments/${department}`)
        const jsonResp: ResponseBody<DepartmentStatDetailDto> = await httpResp.json()
        if (jsonResp.success) {
          setDepartmentStat(jsonResp.data)
          setTagTrackings(jsonResp.data.tracking)
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
    data: tagTrackings,
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
      {departmentStat && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4 text-gray-600 font-sans">Thống kê mượn / trả đồ của {departmentStat.department}</h2>
            {departmentStat.exported === 0 ?
              <Badge variant="secondary">Đã hoàn thành</Badge> :
              <Badge variant="destructive">Đang xử lý</Badge>
            }
          </div>
          <div className="flex flex-1 justify-between p-4 mb-4 rounded-md border">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Cho mượn</p>
              <p className="text-xl font-bold text-blue-600">{departmentStat.exported + departmentStat.returned}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đang mượn</p>
              <p className="text-xl font-bold text-red-600">{departmentStat.exported}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đã trả</p>
              <p className="text-xl font-bold text-green-600">{departmentStat.returned}</p>
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
