import { NonContainerAutoGrader } from 'devu-shared-modules'

import { checkAnswer } from '../nonContainerAutoGrader.grader'

describe('NonContainerAutoGrader grader', () => {
  let mockQuestionWithoutRegex: NonContainerAutoGrader

  describe('NonContainerAutoGrader without regex', () => {
    beforeEach(() => {
      mockQuestionWithoutRegex = {
        id: 23,
        question: 'The Answer to the Ultimate Question of Life, the Universe, and Everything',
        correctString: '42',
        score: 1,
        assignmentId: 8,
        isRegex: false,
      }
    })

    test('Student correct answer', () => {
      const studentAnswer = '42'
      const expectedResult = checkAnswer(studentAnswer, mockQuestionWithoutRegex)

      expect(expectedResult[0]).toEqual(mockQuestionWithoutRegex.score)
    })

    test('Student messed up', () => {
      const studentAnswer = '69'
      const expectedResult = checkAnswer(studentAnswer, mockQuestionWithoutRegex)

      expect(expectedResult[0]).toEqual(0)
    })
  })

  describe('NonContainerAutoGrader with regex', () => {
    let mockQuestionWithRegex: NonContainerAutoGrader

    beforeEach(() => {
      mockQuestionWithRegex = {
        id: 23,
        question: 'What was the last ever Dolphin message',
        // regex to match this exact sentence and is case-sensitive
        correctString: '/So long, and thanks for all the fish./gm',
        score: 1,
        assignmentId: 8,
        isRegex: true,
      }
    })

    test('answer match with exact casing', () => {
      const studentAnswer = 'So long, and thanks for all the fish.'
      const expectedResult = checkAnswer(studentAnswer, mockQuestionWithRegex)

      expect(expectedResult[0]).toEqual(mockQuestionWithRegex.score)
    })

    test('Incorrect answer', () => {
      const studentAnswer = '~~dolphin noises~~'
      const expectedResult = checkAnswer(studentAnswer, mockQuestionWithRegex)

      expect(expectedResult[0]).toEqual(0)
    })

    test('correct answer but incorrect formatting', () => {
      const studentAnswer = 'So long, and thanks for all the fish.'.toUpperCase()
      const expectedResult = checkAnswer(studentAnswer, mockQuestionWithRegex)

      expect(expectedResult[0]).toEqual(0)
    })
  })
})
