import { capitalize, toCapitalizedWords } from '../string.utils'

describe('String utils', () => {
  describe('capitalize', () => {
    test('Capital stays capital', () => {
      const actualResults = capitalize('Capital')
      expect(actualResults).toEqual('Capital')
    })

    test('Makes first letter capital', () => {
      const actualResults = capitalize('capital words')
      expect(actualResults).toEqual('Capital words')
    })
  })

  describe('toCapitalizedWords', () => {
    test('Capital stays capital', () => {
      const actualResults = toCapitalizedWords('All Capital')
      expect(actualResults).toEqual('All Capital')
    })

    test('Humanifies camelCase words', () => {
      const actualResults = toCapitalizedWords('someWords')
      expect(actualResults).toEqual('Some Words')
    })
  })
})
