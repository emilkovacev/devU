import { serialize } from '../containerAutoGrader.serializer'

import ContainerAutoGraderModel from '../containerAutoGrader.model'

import Testing from '../../../utils/testing.utils'

let mockContainerAutoGrader: ContainerAutoGraderModel

describe('ContainerAutoGrader Serializer', () => {
  beforeEach(() => {
    mockContainerAutoGrader = Testing.generateTypeOrm<ContainerAutoGraderModel>(ContainerAutoGraderModel)

    mockContainerAutoGrader.id = 5
    mockContainerAutoGrader.assignmentId = 1
    mockContainerAutoGrader.graderFile = 'path/to/grader/on/blobby'
    mockContainerAutoGrader.makefileFile = 'path/to/makefile/on/blobby'
    mockContainerAutoGrader.autogradingImage = 'autograding_image_3'
    mockContainerAutoGrader.timeout = 500
    mockContainerAutoGrader.createdAt = new Date()
    mockContainerAutoGrader.updatedAt = new Date()
  })

  describe('Serializing ContainerAutoGrader', () => {
    test('ContainerAutoGrader values exist in the response', () => {
      const actualResult = serialize(mockContainerAutoGrader)

      expect(actualResult).toBeDefined()
      expect(actualResult.id).toEqual(mockContainerAutoGrader.id)
      expect(actualResult.assignmentId).toEqual(mockContainerAutoGrader.assignmentId)
      expect(actualResult.graderFile).toEqual(mockContainerAutoGrader.graderFile)
      expect(actualResult.makefileFile).toEqual(mockContainerAutoGrader.makefileFile)
      expect(actualResult.autogradingImage).toEqual(mockContainerAutoGrader.autogradingImage)
      expect(actualResult.timeout).toEqual(mockContainerAutoGrader.timeout)
    })

    test('CreatedAt and ModifiedAt are ISO strings', () => {
      const actualResult = serialize(mockContainerAutoGrader)

      expect(actualResult).toBeDefined()
      expect(actualResult.updatedAt).toEqual(mockContainerAutoGrader.updatedAt.toISOString())
      expect(actualResult.createdAt).toEqual(mockContainerAutoGrader.createdAt.toISOString())
    })
  })
})
