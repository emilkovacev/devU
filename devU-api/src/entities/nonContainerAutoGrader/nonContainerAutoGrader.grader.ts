import { NonContainerAutoGrader } from 'devu-shared-modules'

import parseRegex from 'regex-parser'

export function checkAnswer(studentAnswer: string, nonContainerAutoGrader: NonContainerAutoGrader): [number, string] {
  if (nonContainerAutoGrader.isRegex) {
    // Create a regex pattern
    // we use parseRegex lib here because regular Regex() class will try to add its own escape characters
    // we don't want that since we know correct string should always contain a valid regex
    const pattern = parseRegex(nonContainerAutoGrader.correctString)

    const isMatch: boolean = pattern.test(studentAnswer)
    if (isMatch) {
      return [
        nonContainerAutoGrader.score,
        `Autograder graded "${nonContainerAutoGrader.question}" for ${nonContainerAutoGrader.score} points`,
      ]
    }
  } else {
    // if no regex is set use normal string matching
    if (studentAnswer === nonContainerAutoGrader.correctString) {
      return [
        nonContainerAutoGrader.score,
        `Autograder graded "${nonContainerAutoGrader.question}" for ${nonContainerAutoGrader.score} points`,
      ]
    }
  }
  // default value to return if all conditions fail to execute
  // i.e. the answer is incorrect or improperly formatted
  return [0, `Autograder graded "${nonContainerAutoGrader.question}" for 0 points`]
}
