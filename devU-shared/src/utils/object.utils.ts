export const renameKeys = (keysMap: Record<string, string>, obj: Record<string, string>) => {
  for (let oldKey of Object.keys(keysMap)) {
    const newKey = keysMap[oldKey]

    if (!obj[oldKey]) continue

    obj[newKey] = obj[oldKey]
    delete obj[oldKey]
  }
}
