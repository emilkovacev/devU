export type NonContainerAutoGrader = {
    id?: number
    assignmentId: number
    question: string
    score:number
    correctString: string
    isRegex: boolean
    createdAt?: string
    updatedAt?: string
}