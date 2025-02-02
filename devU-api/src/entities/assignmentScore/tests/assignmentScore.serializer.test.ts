import { serialize } from '../assignmentScore.serializer'

import AssignmentScoreModel from '../assignmentScore.model'

import Testing from '../../../utils/testing.utils'

let mockAssignmentScore: AssignmentScoreModel

describe('AssignmentScore Serializer', () => {
  beforeEach(() => {
    mockAssignmentScore = Testing.generateTypeOrm<AssignmentScoreModel>(AssignmentScoreModel)

    mockAssignmentScore.id = 10
    mockAssignmentScore.assignmentId = 123
    mockAssignmentScore.userId = 789
    mockAssignmentScore.score = 75
    mockAssignmentScore.createdAt = new Date()
    mockAssignmentScore.updatedAt = new Date()
    mockAssignmentScore.deletedAt = new Date()
  })

  describe('Serializing AssignmentScores', () => {
    test('AssignmentScore values exist in the response', () => {
      const expectedResult = serialize(mockAssignmentScore)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockAssignmentScore.id)
      expect(expectedResult.assignmentId).toEqual(mockAssignmentScore.assignmentId)
      expect(expectedResult.userId).toEqual(mockAssignmentScore.userId)
      expect(expectedResult.score).toEqual(mockAssignmentScore.score)
    })

    test('Dates are returned as ISO strings for all assignments', () => {
      const expectedResult = serialize(mockAssignmentScore)

      expect(expectedResult).toBeDefined()

      expect(expectedResult.createdAt).toEqual(mockAssignmentScore.createdAt.toISOString())
      expect(expectedResult.updatedAt).toEqual(mockAssignmentScore.updatedAt.toISOString())
    })
  })
})
