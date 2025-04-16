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
import { CompanyTracking, DepartmentTracking, ResponseBody, TagDetailStatDto } from "@/dto/response"
import { Badge } from "@/components/ui/badge"


export default function TagScreen({ params }: { params: Promise<{ name: string }> }) {
  const [deptTrackings, setDeptTrackings] = React.useState<DepartmentTracking[]>([])
  const [companyTrackings, setCompanyTrackings] = React.useState<CompanyTracking[]>([])
  const [tagStat, setTagStat] = React.useState<TagDetailStatDto>()

  const { toast } = useToast()
  const { name } = React.use(params)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const httpResp = await fetch(`${GetHostLocation()}/api/v1/stats/tags/${name}`)
        const jsonResp: ResponseBody<TagDetailStatDto> = await httpResp.json()
        if (jsonResp.success) {
          setTagStat(jsonResp.data)
          setDeptTrackings(jsonResp.data.departments)
          setCompanyTrackings(jsonResp.data.companies)
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

  return (
    <div className="w-full px-2 sm:px-6 flex flex-col gap-2">
      <div className="flex-1">
        <LendingTagScreen deptTrackings={deptTrackings} tagStat={tagStat} />
      </div>
      <div className="flex-1">
        <WashingTagScreen companyTrackings={companyTrackings} tagStat={tagStat} />
      </div>
    </div>
  )

}

function LendingTagScreen({ deptTrackings, tagStat }: { deptTrackings: DepartmentTracking[], tagStat?: TagDetailStatDto }) {
  const columns: ColumnDef<DepartmentTracking>[] = [
    {
      accessorKey: "name",
      header: () => {
        return (
          <Button
            variant="ghost"
          >
            Phòng ban
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


  const table = useReactTable({
    data: deptTrackings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })


  return (
    <div>
      {tagStat && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-600 font-sans">Thống kê mượn / trả {tagStat.tag_name}</h2>
          <div className="flex flex-1 justify-between p-4 mb-4 rounded-md border">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Cho mượn</p>
              <p className="text-xl font-bold text-blue-600">{tagStat.lending + tagStat.lending_returned}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đang mượn</p>
              <p className="text-xl font-bold text-red-600">{tagStat.lending}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đã trả</p>
              <p className="text-xl font-bold text-green-600">{tagStat.lending_returned}</p>
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

function WashingTagScreen({ companyTrackings, tagStat }: { companyTrackings: CompanyTracking[], tagStat?: TagDetailStatDto }) {
  const columns: ColumnDef<CompanyTracking>[] = [
    {
      accessorKey: "name",
      header: () => {
        return (
          <Button
            variant="ghost"
          >
            Phòng ban
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "exported",
      header: () => <div className="text-center">Đang giặt</div>,
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


  const table = useReactTable({
    data: companyTrackings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })


  return (
    <div>
      {tagStat && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-600 font-sans">Thống kê giặt / trả {tagStat.tag_name}</h2>
          <div className="flex flex-1 justify-between p-4 mb-4 rounded-md border">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đem giặt</p>
              <p className="text-xl font-bold text-blue-600">{tagStat.washing + tagStat.washing_returned}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đang giặt</p>
              <p className="text-xl font-bold text-red-600">{tagStat.washing}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 mr-2">Đã giặt</p>
              <p className="text-xl font-bold text-green-600">{tagStat.washing_returned}</p>
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
