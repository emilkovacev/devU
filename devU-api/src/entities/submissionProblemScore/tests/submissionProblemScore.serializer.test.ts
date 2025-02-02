import { serialize } from '../submissionProblemScore.serializer'

import SubmissionProblemScoreModel from '../submissionProblemScore.model'

import Testing from '../../../utils/testing.utils'

let mockSubmissionProblemScore: SubmissionProblemScoreModel

describe('SubmissionProblemScore Serializer', () => {
  beforeEach(() => {
    mockSubmissionProblemScore = Testing.generateTypeOrm<SubmissionProblemScoreModel>(SubmissionProblemScoreModel)

    mockSubmissionProblemScore.id = 5
    mockSubmissionProblemScore.submissionId = 10
    mockSubmissionProblemScore.assignmentProblemId = 1
    mockSubmissionProblemScore.score = 18
    mockSubmissionProblemScore.feedback = 'Good Job'
    mockSubmissionProblemScore.releasedAt = new Date()
    mockSubmissionProblemScore.createdAt = new Date()
    mockSubmissionProblemScore.updatedAt = new Date()
  })

  describe('Serializing submissionProblemScore', () => {
    test('submissionProblemScore values exist in the response', () => {
      const expectedResult = serialize(mockSubmissionProblemScore)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockSubmissionProblemScore.id)
      expect(expectedResult.submissionId).toEqual(mockSubmissionProblemScore.submissionId)
      expect(expectedResult.assignmentProblemId).toEqual(mockSubmissionProblemScore.assignmentProblemId)
      expect(expectedResult.score).toEqual(mockSubmissionProblemScore.score)
      expect(expectedResult.feedback).toEqual(mockSubmissionProblemScore.feedback)
    })

    test('release, createdAt, and updatedAt are ISO strings for all submissions', () => {
      const expectedResult = serialize(mockSubmissionProblemScore)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.releasedAt).toEqual(mockSubmissionProblemScore.releasedAt?.toISOString())
      expect(expectedResult.createdAt).toEqual(mockSubmissionProblemScore.createdAt.toISOString())
      expect(expectedResult.updatedAt).toEqual(mockSubmissionProblemScore.updatedAt.toISOString())
    })
  })
})
