"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import GetHostLocation from "@/lib/host"
import { useEffect } from "react"
import { Eye, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"


export default function SettingPage() {
  const FormSchema = z.object({
    tx_log_sheet_id: z.string().min(1, {
      message: "ID bảng ghi không được để trống",
    }),
    report_sheet_id: z.string().min(1, {
      message: "ID bảng báo cáo không được để trống",
    })
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${GetHostLocation()}/api/v1/settings`)
        if (response.status === 200) {
          const respJSON = await response.json()
          const body = await respJSON.data
          console.log(body)
          form.setValue("tx_log_sheet_id", body.tx_log_sheet_id)
          form.setValue("report_sheet_id", body.report_sheet_id)
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tx_log_sheet_id: "",
      report_sheet_id: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(`${GetHostLocation()}/api/v1/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_log_sheet_id: data.tx_log_sheet_id,
          report_sheet_id: data.report_sheet_id,
        }),
      })
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Cập nhật thời gian khoá giao nhận thành công",
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
    <div className="w-full px-2 sm:px-6">
      <div className="mb-4">
        <p className="text-red-500 font-semibold">Lưu ý cần thêm quyền truy cập cho tài khoản bot</p>
        <Badge variant="outline">
          ksnk-92@send-mail-454516.iam.gserviceaccount.com
        </Badge>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-2">
          <FormField
            control={form.control}
            name="tx_log_sheet_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Id sheet ghi nhận giao dịch
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input type="text" placeholder={form.getValues('tx_log_sheet_id')} {...field} className="w-[450px]" />
                  </FormControl>
                  <Link href={`https://docs.google.com/spreadsheets/d/${form.getValues('tx_log_sheet_id')}`} target="_blank">
                    <FileSpreadsheet className="cursor-pointer" />
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="report_sheet_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Id sheet tổng hợp
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl >
                    <Input type="text" placeholder={form.getValues('report_sheet_id')} {...field} className="w-[450px]" />
                  </FormControl>
                  <Link href={`https://docs.google.com/spreadsheets/d/${form.getValues('report_sheet_id')}`} target="_blank">
                    <FileSpreadsheet className="cursor-pointer" />
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-15">Cập nhật</Button>
        </form>
      </Form>
    </div>
  )
}
