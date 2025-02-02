import { serialize } from '../fileUpload.serializer'

import { FileUpload } from '../../../devu-shared-modules'

let fakeFileUpload: FileUpload
describe('fileUpload.serializer', () => {
  beforeEach(() => {
    let fieldName: string = 'submissions'
    const originalNames: string = ['test1.txt', 'test2.txt', 'test3.txt'].join(',')
    const fileNames: string = ['modified1.txt', 'modified2.txt', 'modified3.txt'].join(',')
    const etags: string = ['etag1', 'etag2', 'etag3'].join(',')

    fakeFileUpload = {
      fieldName: fieldName,
      originalName: originalNames,
      filename: fileNames,
      etags: etags,
    }
  })
  describe('Serializing fileUpload', () => {
    test('fileUpload values exist in the response', () => {
      const actualResult = serialize(fakeFileUpload)
      expect(actualResult).toBeDefined()
      expect(actualResult.fieldName).toEqual(fakeFileUpload.fieldName)
      expect(actualResult.originalName).toEqual(fakeFileUpload.originalName)
      expect(actualResult.filename).toEqual(fakeFileUpload.filename)
      expect(actualResult.etags).toEqual(fakeFileUpload.etags)
    })
  })
})
