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
import { ArrowUpDown, ChevronDown, Filter, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useRouter, useSearchParams } from "next/navigation"


type TagNameAggregateType = {
  count: number
  name: string
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
          Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "count",
    header: () => <div className="text-center">Count</div>,
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
          <DeleteTags name={row.getValue("name")} count={row.getValue("count")} />
          <UpdateTagsName name={row.getValue("name")} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/details?name=${history.name}`}>
                <DropdownMenuItem>List all tags by name</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]


type TagType = {
  id: string
  name: string
  created_at: string
}

type ResponseDto = {
  success: boolean
  data: TagType[]
}

function aggregateByName(data: TagType[]): TagNameAggregateType[] {
  const aggregated = data.reduce<{ [key: string]: number }>((acc, item) => {
    let tagName = item.id
    if (item.name) {
      tagName = item.name
    }
    acc[tagName] = (acc[tagName] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(aggregated).map(([name, count]) => ({ name, count }));
}

export default function ListTags() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<TagNameAggregateType[]>([])

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters state based on query parameters
  const [filters, setFilters] = React.useState<{ [key: string]: boolean }>(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      is_scanned: params.is_scanned === "true",
    };
  });

  const [urlParams, setUrlParams] = React.useState<string>(searchParams.toString())

  const toggleFilter = (filterKey: string, value: boolean) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [filterKey]: value,
      };

      return updatedFilters;
    });

    // Update the URL query parameters
    const updatedSearchParams = new URLSearchParams(searchParams);

    // Update or delete the specific filter
    if (value) {
      updatedSearchParams.set(filterKey, "true");
    } else {
      updatedSearchParams.set(filterKey, "false");
    }

    router.push(`?${updatedSearchParams.toString()}`);
    setUrlParams(updatedSearchParams.toString())
  };
  const { toast } = useToast()

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/tags?${urlParams}`)
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
  }, [urlParams])


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
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Import</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Tag</DialogTitle>
              </DialogHeader>
              <FileUpload />
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Filter <Filter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(filters).map((filterKey) => (
                <DropdownMenuCheckboxItem
                  key={filterKey}
                  className="lowercase"
                  checked={filters[filterKey]}

                  onCheckedChange={(value) => toggleFilter(filterKey, !!value)}
                >
                  {filterKey.replace("_", " ")} {/* Format key for display */}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
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
                      className="capitalize"
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

function DeleteTags({ name, count }: { name: string, count: number }) {
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/tags/by-name/${name}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Xóa thẻ thành công",
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
        <Button variant="secondary">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {count} tags with name {name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleDelete} variant="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function UpdateTagsName({ name }: { name: string }) {
  const [newName, setNewName] = React.useState(name)
  const { toast } = useToast()

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/tags/by-name`, {
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
        <Button variant="secondary">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update name</DialogTitle>
          <DialogDescription>
            Make changes to your tag name here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" onChange={(e) => { setNewName(e.target.value) }} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleUpdate}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
