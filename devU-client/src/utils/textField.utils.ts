import {ExpressValidationError} from "../../devu-shared-modules";


export function applyClassToField(allFields: Map<string, string>, errField: string, className: string) {
    if (allFields.has(errField)) {
        allFields.set(errField, className)
    }
    return allFields
}


export function applyClassToMultipleFields(allField: Map<string, string>, errField: string[], className: string) {
    let newMap = new Map(allField);
    for (const i in errField) {
        newMap = applyClassToField(allField, errField[i], className)
    }
    return newMap
}


export function initializeFieldClasses(data: any) {
    return new Map(new Map(Object.keys(data).map((key) => [key, ''])))
}


export function extractErrorFields(err: ExpressValidationError[] | Error) {
    if (err instanceof Error) {
        return []
    } else {
        return err.map((e) => e.param)
    }
}


export function removeClassFromField(allFields: Map<string, string>, errField: string) {
    if (allFields.has(errField)) {
        allFields.set(errField, '')
    }
    return allFields
}


export function applyStylesToErrorFields(error: ExpressValidationError[] | Error, data: any, styles: any) {
    const sections = extractErrorFields(error)
    const allFields = initializeFieldClasses(data)
    return applyClassToMultipleFields(allFields, sections, styles)
}

export function applyMessageToErrorFields(allFields: Map<string, string>, errField: string, message: string) {
    allFields.set(errField, message)
    return allFields
}