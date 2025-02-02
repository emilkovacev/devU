import { serialize } from '../categoryScore.serializer'

import CategoryScoreModel from '../../categoryScore/categoryScore.model'

import Testing from '../../../utils/testing.utils'

let mockCategory: CategoryScoreModel

describe('Category Serializer', () => {
  beforeEach(() => {
    mockCategory = Testing.generateTypeOrm<CategoryScoreModel>(CategoryScoreModel)

    mockCategory.id = 10
    mockCategory.courseId = 123
    mockCategory.userId = 50
    mockCategory.categoryId = 1
    mockCategory.score = 100
  })

  describe('Serializing category', () => {
    test('category values in the response', () => {
      const expectedResult = serialize(mockCategory)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockCategory.id)
      expect(expectedResult.courseId).toEqual(mockCategory.courseId)
      expect(expectedResult.userId).toEqual(mockCategory.userId)
      expect(expectedResult.categoryId).toEqual(mockCategory.categoryId)
      expect(expectedResult.score).toEqual(mockCategory.score)
    })
  })
})
