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
import { ArrowUpDown, ChevronDown, FilePenLine, Logs } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import FileUpload from "@/components/file-upload"
import GetHostLocation from "@/lib/host"


type TagNameAggregateType = {
   count: number
   name: string
   total_scanned: number
}

const columns: ColumnDef<TagNameAggregateType>[] = [
   {
      accessorKey: "name",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
               Tên
               <ArrowUpDown />
            </Button>
         )
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
   },
   {
      accessorKey: "count",
      header: () => <div className="text-center">Số lượng</div>,
      cell: ({ row }) => {
         const tags = parseFloat(row.getValue("count"))

         return <div className="text-center font-medium">{tags}</div>
      },
   },
   {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
         const history = row.original
         return (
            <div className="flex justify-end gap-2">
               <Link href={`/details?name=${history.name}`}>
                  <Button variant="secondary" className="px-3">
                     <Logs size={16} />
                  </Button>
               </Link>
            </div>
         )
      },
   },
]

type TagType = {
   id: string
   name: string
   is_scanned: boolean
   created_at: string
}

type ResponseDto = {
   success: boolean
   data: TagType[]
}

function aggregateByName(data: TagType[]): TagNameAggregateType[] {
   const aggregationMap: Record<string, TagNameAggregateType> = {};

   data.forEach((tag) => {
      let tagName = tag.id
      if (tag.name) {
         tagName = tag.name
      }
      if (!aggregationMap[tagName]) {
         aggregationMap[tagName] = {
            count: 0,
            name: tagName,
            total_scanned: 0,
         };
      }

      // Update the count and total_scanned values
      aggregationMap[tagName].count += 1;
      if (tag.is_scanned) {
         aggregationMap[tagName].total_scanned += 1;
      }
   })

   return Object.values(aggregationMap)
}

export default function ListTags() {
   const [sorting, setSorting] = React.useState<SortingState>([])
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = React.useState({})
   const [data, setData] = React.useState<TagNameAggregateType[]>([])


   const { toast } = useToast()

   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(`${GetHostLocation()}/api/v1/tags`)
            const respJSON: ResponseDto = await response.json()
            if (respJSON.success) {
               const listTags = respJSON.data
               const tagNames = aggregateByName(listTags)
               setData(tagNames)
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
               placeholder="Tìm theo tên..."
               value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
               onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
               }
               className="max-w-sm"
            />
            <div className="flex gap-2">
               {/* <Dialog> */}
               {/*   <DialogTrigger asChild> */}
               {/*     <Button>Gán tag</Button> */}
               {/*   </DialogTrigger> */}
               {/*   <DialogContent className="sm:max-w-md"> */}
               {/*     <DialogHeader> */}
               {/*       <DialogTitle>Import Tag</DialogTitle> */}
               {/*     </DialogHeader> */}
               {/*     <FileUpload apiPath="api/v1/tags-mapping/upload" /> */}
               {/*   </DialogContent> */}
               {/* </Dialog> */}
               {/* <DropdownMenu> */}
               {/*    <DropdownMenuTrigger asChild> */}
               {/*       <Button variant="outline" className="ml-auto"> */}
               {/*          Cột <ChevronDown /> */}
               {/*       </Button> */}
               {/*    </DropdownMenuTrigger> */}
               {/*    <DropdownMenuContent align="end"> */}
               {/*       {table */}
               {/*          .getAllColumns() */}
               {/*          .filter((column) => column.getCanHide()) */}
               {/*          .map((column) => { */}
               {/*             return ( */}
               {/*                <DropdownMenuCheckboxItem */}
               {/*                   key={column.id} */}
               {/*                   className="capitalize" */}
               {/*                   checked={column.getIsVisible()} */}
               {/*                   onCheckedChange={(value) => */}
               {/*                      column.toggleVisibility(!!value) */}
               {/*                   } */}
               {/*                > */}
               {/*                   {column.id} */}
               {/*                </DropdownMenuCheckboxItem> */}
               {/*             ) */}
               {/*          })} */}
               {/*    </DropdownMenuContent> */}
               {/* </DropdownMenu> */}
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


function UpdateTagsName({ name }: { name: string }) {
   const [newName, setNewName] = React.useState(name)
   const { toast } = useToast()

   const handleUpdate = async () => {
      try {
         const response = await fetch(`${GetHostLocation()}/api/v1/tags/by-name`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ old_name: name, new_name: newName }),
         })
         if (response.status === 200) {
            toast({
               title: "Thành công",
               description: "Cập nhật tên thẻ thành công",
            })
            window.location.reload()
         }
      } catch (error: any) {
         toast({
            title: "Có lỗi xảy ra",
            description: error.message,
         })
      }
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="secondary" className="px-3">
               <FilePenLine size={16} />
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Update name</DialogTitle>
               <DialogDescription>
                  Thay đổi tên thẻ của bạn ở đây. Nhấn lưu thay đổi khi bạn đã hoàn tất.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                     Tên mới
                  </Label>
                  <Input id="name" className="col-span-3" onChange={(e) => { setNewName(e.target.value) }} />
               </div>
            </div>
            <DialogFooter>
               <DialogClose asChild>
                  <Button onClick={handleUpdate}>Lưu thay đổi</Button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
