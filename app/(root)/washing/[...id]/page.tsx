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
import { ResponseBody, TxLogCompanyDto, TxLogDetailDto, TxLogTracking } from "@/dto/response"

const columns: ColumnDef<TxLogDetailDto>[] = [
   {
      accessorKey: "action",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
               Giao dịch
               <ArrowUpDown />
            </Button>
         )
      },
      cell: ({ row }) => <div>{row.getValue("action")}</div>,
   },
   {
      accessorKey: "tracking",
      header: () => <div className="text-center">Thông tin giao dịch</div>,
      cell: ({ row }) => {
         const tracking: TxLogTracking[] = row.getValue("tracking")
         console.log("tracking", tracking)
         return <div className="">
            <Table>
               <TableBody>
                  {tracking.map((tracking: TxLogTracking) => {
                     return (
                        <TableRow key={tracking.name}>
                           <TableCell className="text-left">
                              {tracking.name}
                           </TableCell>
                           <TableCell className="text-right">
                              {tracking.count}
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
   const [txLog, setTxLog] = React.useState<TxLogCompanyDto>()

   const { toast } = useToast()

   const { id } = React.use(params)

   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const httpResp = await fetch(`${GetHostLocation()}/api/v1/tx-log/companies/${id}`)
            const jsonResp: ResponseBody<TxLogCompanyDto> = await httpResp.json()
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
               <h2 className="text-3xl font-bold mb-4 text-red-600">Lịch sử Công ty Giặt / Trả Đồ</h2>
               <div className="flex flex-1 justify-between p-4 mb-4 rounded-md border">
                  <div className="flex items-center">
                     <p className="font-semibold text-gray-600 mr-2">Cần giặt</p>
                     <p className="text-xl font-bold text-blue-600">{txLog.num_washing + txLog.num_returned}</p>
                  </div>
                  <div className="flex items-center">
                     <p className="font-semibold text-gray-600 mr-2">Đã giặt</p>
                     <p className="text-xl font-bold text-green-600">{txLog.num_returned}</p>
                  </div>
                  <div className="flex items-center">
                     <p className="font-semibold text-gray-600 mr-2">Đang giặt</p>
                     <p className="text-xl font-bold text-red-600">{txLog.num_washing}</p>
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
