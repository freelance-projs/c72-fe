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
import { ArrowUpDown, FilePenLine, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { ResponseBody, TagNameDto, DeleteTagNameRequest } from "@/dto/response"
import { Checkbox } from "@/components/ui/checkbox"


const columns: ColumnDef<TagNameDto>[] = [
   {
      id: "select",
      header: ({ table }) => (
         <Checkbox
            checked={
               table.getIsAllPageRowsSelected() ||
               (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
         />
      ),
      cell: ({ row }) => (
         <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
         />
      ),
      enableSorting: false,
      enableHiding: false,
   },
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
         return (
            <div className="flex justify-end gap-2">
               <UpdateTagsName name={row.getValue("name")} />
            </div>
         )
      },
   },
]


export default function TagNamePage() {
   const [sorting, setSorting] = React.useState<SortingState>([])
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = React.useState({})
   const [tagNames, setTagNames] = React.useState<TagNameDto[]>([])

   // Ensure that selected rows state gets updated correctly
   React.useEffect(() => {
   }, [rowSelection]);

   const handleDelete = async () => {
      try {
         const selectedRows = Object.keys(rowSelection)
         const selectedTagNames = tagNames.filter((_, key) =>
            selectedRows.includes(key.toString())
         )
         if (selectedTagNames.length === 0) {
            toast({
               title: "Không có tên thẻ nào được chọn",
               description: "Vui lòng chọn ít nhất một tên thẻ để xóa.",
               variant: "destructive"
            })
            return
         }
         const body: DeleteTagNameRequest = {
            names: selectedTagNames.map((tag) => tag.name),
         }
         const response = await fetch(`${GetHostLocation()}/api/v1/tag-names`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         })
         if (response.status === 200) {
            toast({
               title: "Thành công",
               description: "Xóa tên thẻ thành công",
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

   const { toast } = useToast()

   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(`${GetHostLocation()}/api/v1/tag-names`)
            const respJSON: ResponseBody<TagNameDto[]> = await response.json()
            if (respJSON.success) {
               const listTags = respJSON.data
               setTagNames(listTags)
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
      data: tagNames,
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
               <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 />
               </Button>
               <Dialog>
                  <DialogTrigger asChild>
                     <Button>
                        <Plus />
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                     <DialogHeader>
                        <DialogTitle></DialogTitle>
                     </DialogHeader>
                     <FileUpload apiPath="api/v1/tag-names/upload" />
                  </DialogContent>
               </Dialog>
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
               <DialogTitle></DialogTitle>
               <DialogDescription>
                  Thay đổi tên thẻ. Nhấn lưu thay đổi khi bạn đã hoàn tất.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-left">
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
