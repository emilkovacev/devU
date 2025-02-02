export type ContainerAutoGrader = {
  id?: number
  assignmentId: number
  graderFile?: string 
  makefileFile: string | null 
  autogradingImage?: string 
  timeout: number
  createdAt?: string
  updatedAt?: string
  }