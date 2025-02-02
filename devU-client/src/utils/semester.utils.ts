export function prettyPrintSemester(semester: string) {
    let season = semester.substring(0, 1)
    let year = semester.substring(1)
    let seasonString = ""
    switch (season) {
        case "f":
            seasonString = "Fall"
            break
        case "s":
            seasonString = "Spring"
            break
        case "w":
            seasonString = "Winter"
            break
        case "u":
            seasonString = "Summer"
            break
    }
    return seasonString + " " + year
}
