export type NonContainerAutoGrader = {
    id: number
    assignmentId: number
    question: string
    score:number
    correctString: string
    createdAt?: string
    updatedAt?: string
}