import { ContainerAutoGrader } from 'devu-shared-modules'

import ContainerAutoGraderModel from './containerAutoGrader.model'

export function serialize(containerAutoGrader: ContainerAutoGraderModel): ContainerAutoGrader {
  return {
    id: containerAutoGrader.id,
    assignmentId: containerAutoGrader.assignmentId,
    graderFile: containerAutoGrader.graderFile,
    makefileFile: containerAutoGrader.makefileFile,
    autogradingImage: containerAutoGrader.autogradingImage,
    timeout: containerAutoGrader.timeout,
    createdAt: containerAutoGrader.createdAt.toISOString(),
    updatedAt: containerAutoGrader.updatedAt.toISOString(),
  }
}
