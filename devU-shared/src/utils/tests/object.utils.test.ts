import { renameKeys } from '../object.utils'

const attributeMap = { oldKeyOne: 'newKeyOne', oldKeyTwo: 'newKeyTwo' }
describe('Object utils', () => {
  describe('renameKeys', () => {
    test('Changes keys based on map', () => {
      const oldKeyOne = 'someValue1'
      const oldKeyTwo = 'someValue2'
      const inputMap: any = { oldKeyOne, oldKeyTwo }

      renameKeys(attributeMap, inputMap)

      expect(inputMap.newKeyOne).toEqual(oldKeyOne)
      expect(inputMap.newKeyTwo).toEqual(oldKeyTwo)
    })

    test('Keys missing in rename map remain untouched', () => {
      const unmatchedKeyValue = 'someValue3'
      const oldMap = { oldKeyOne: 'someValue', oldKeyTwo: 'someValue2', oldKeyThree: unmatchedKeyValue }
      renameKeys(attributeMap, oldMap)

      expect(oldMap.oldKeyThree).toBeDefined()
      expect(oldMap.oldKeyThree).toEqual(unmatchedKeyValue)
    })

    test('Original key names are deleted', () => {
      const oldMap = { oldKeyOne: 'someValue', oldKeyTwo: 'someValue2' }
      renameKeys(attributeMap, oldMap)

      expect(oldMap.oldKeyOne).toBeUndefined()
      expect(oldMap.oldKeyTwo).toBeUndefined()
    })
  })
})
