export type ResponseBody<T> = {
  success: boolean
  data: T
  message: string
  error: any
}

export type LendingDTO = {
  id: number
  department: string
  num_lending: number
  num_returned: number
  created_at: Date
}

export type LaundryDTO = {
  id: number
  name: string
  num_washing: number
  num_returned: number
  created_at: Date
}

export type TagDTO = {
  id: string
  name: string
  created_at: string
}

export type LendingTagDTO = {
  lending_id: number,
  tag_id: string
  tag_name: string
  status: string
}

export type TxLogDepartmentDto = {
  id: number
  department: string
  num_lending: number
  num_returned: number
  details: TxLogDetailDto[]
  created_at: Date
}

export type TxLogCompanyDto = {
  id: number
  company: string
  num_washing: number
  num_returned: number
  details: TxLogDetailDto[]
  created_at: Date
}

export type TxLogDetailDto = {
  action: string
  tracking: TxLogTracking[]
  created_at: Date
}

export type TxLogTracking = {
  name: string
  count: number
}

export type WashingTagDTO = {
  lending_id: number,
  tag_id: string
  tag_name: string
  status: string
}


export type TagNameDto = {
  name: string
}

export type DeleteTagNameRequest = {
  names: string[]
}

export type DepartmentDto = {
  name: string
}

export type DeleteDepartmentRequest = {
  names: string[]
}


export type CompanyDto = {
  name: string
}

export type DeleteCompanyRequest = {
  names: string[]
}
