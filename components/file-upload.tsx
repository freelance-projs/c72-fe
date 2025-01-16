"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

import { DialogClose } from "@radix-ui/react-dialog"

export default function FileUpload() {
  const [file, setFile] = useState<File>()
  const { toast } = useToast()

  const handleChooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    setFile(file);

  };
  const handleUploadFile = async () => {
    if (!file) {
      toast({
        title: "Upload thất bại",
        description: "Vui lòng chọn file!",
      })
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file); // Attach the file to FormData

      // Send the binary file to the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/tags-mapping/upload`, {
        method: "POST",
        body: formData,
      });


      if (response.ok) {
        toast({
          title: "Thành công",
          description: "File đã được tải lên thành công!",
        })
      } else {
        toast({
          title: "Có lỗi xảy ra",
          description: "Không thể tải file",
        })
      }
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message,
      })
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
          <FileIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
          <span className="text-xs text-gray-500">xls or xlsx file</span>
        </div>
        <div className="space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <Input id="file" type="file" placeholder="File" accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleChooseFile} />
        </div>
      </CardContent>
      <CardFooter>
        <DialogClose asChild>
          <Button size="lg" onClick={handleUploadFile}>Upload</Button>
        </DialogClose>
      </CardFooter>
    </Card>
  )
}

function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}
