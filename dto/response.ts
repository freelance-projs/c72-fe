export type ResponseBody<T> = {
  success: boolean
  data: T
  message: string
  error: any
}

export type TagDTO = {
  id: string
  name: string
  created_at: string
}

export type TxLogDto = {
  id: number
  exported: number
  returned: number
  details: TxLogDetailDto[]
}

export type TxLogCompanyDto = {
  id: number
  company: string
  washing: number
  returned: number
  created_at: Date
}

export type TxLogDepartmentDto = {
  id: number
  department: string
  washing: number
  returned: number
  created_at: Date
}

export type TxLogDetailDto = {
  entity: string
  action: string
  actor: string
  tracking: TagTracking[]
  created_at: Date
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

// statistics
export type DepartmentStatDto = {
  department: string
  exported: number
  returned: number
}

export type TagTracking = {
  name: string
  exported: number
  returned: number
}

export type DepartmentStatDetailDto = {
  department: string
  exported: number
  returned: number
  tracking: TagTracking[]
}


export type CompanyStatDto = {
  company: string
  washing: number
  returned: number
}

export type CompanyStatDetailDto = {
  company: string
  exported: number
  returned: number
  tracking: TagTracking[]
}

export type TagStatDto = {
  tag_name: string
  lending: number
  lending_returned: number
  washing: number
  washing_returned: number
}

export type TagDetailStatDto = {
  tag_name: string
  lending: number
  lending_returned: number
  washing: number
  washing_returned: number
  departments: DepartmentTracking[]
  companies: CompanyTracking[]
}

export type DepartmentTracking = {
  name: string
  exported: number
  returned: number
}

export type CompanyTracking = {
  name: string
  exported: number
  returned: number
}
