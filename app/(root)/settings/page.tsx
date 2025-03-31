"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import GetHostLocation from "@/lib/host"


export default function SettingPage() {
  const FormSchema = z.object({
    lockTime: z.string().min(1, {
      message: "Thời gian khoá giao nhận không được nhỏ hơn 1 phút",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lockTime: "0",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(`${GetHostLocation()}/api/v1/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: 'tx_lock_time', value: data.lockTime }),
      })
      localStorage.setItem("tx_lock_time", data.lockTime)
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="lockTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khoá giao nhận</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="" {...field} className="w-[240px]" />
                </FormControl>
                <FormDescription>
                  Thời gian khoá giao nhận (phút)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Cập nhật</Button>
        </form>
      </Form>
    </div>
  )
}
