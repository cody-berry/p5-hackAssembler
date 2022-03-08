/**
 * @author Cody
 * @date 2022.02.23
 *
 *
 */
let font

// our file
let file

// our table for conversion between C-instruction symbols and binary
let parser

// our divs for display
let leftDiv, middleDiv, rightDiv


function preload() {
    font = loadFont('data/meiryo.ttf')
    file = loadStrings('asm/MaxL.asm')
    parser = new Parser()
}


// gives a 15-bit representation of a decimal number
function decimal_to_binary(number) {
    // our result is a list
    let result = []

    // a copy of the number argument because we're going to modify it
    let number_copy = number

    // While the length of `result` is less than 15:
    while (result.length < 15) {
        // If the number is even
        if (number_copy % 2 === 0) {

            // Then we add a 0 to the left of our list.
            result.unshift("0")
        } if (number_copy % 2 === 1) { // If the number is odd

            // Then we add a 1 to the left of our list
            result.unshift("1")
        }
        number_copy /= 2
        number_copy = floor(number_copy)
    }

    // and now we return our fruit, our list!
    return result
}

function setup() {
    colorMode(HSB, 360, 100, 100, 100)
    noCanvas()
    fill(0, 0, 100)
    background(234, 34, 24)

    // this is our symbol table initialization, where we define all of the
    // default symbols
    let symbolTable = {}
    symbolTable["R0"] = 0
    symbolTable["R1"] = 1
    symbolTable["R2"] = 2
    symbolTable["R3"] = 3
    symbolTable["R4"] = 4
    symbolTable["R5"] = 5
    symbolTable["R6"] = 6
    symbolTable["R7"] = 7
    symbolTable["R8"] = 8
    symbolTable["R9"] = 9
    symbolTable["R10"] = 10
    symbolTable["R11"] = 11
    symbolTable["R12"] = 12
    symbolTable["R13"] = 13
    symbolTable["R14"] = 14
    symbolTable["R15"] = 15
    symbolTable["SCREEN"] = 16384
    symbolTable["KBD"] = 24576
    symbolTable["SP"] = 0
    symbolTable["LCL"] = 1
    symbolTable["ARG"] = 2
    symbolTable["THIS"] = 3
    symbolTable["THAT"] = 4

    leftDiv = select("#left")
    middleDiv = select("#middle")
    rightDiv = select("#right")

    console.log(leftDiv, middleDiv, rightDiv)

    // for our 1st pass, adding the labels in, let's iterate through the
    // file.
    let linesPassed = 0

    for (let i = 0; i < file.length; i++) {
        // if the beginning of the file is a paren, it's a label
        if (file[i][0] === "(") {
            symbolTable[file[i].substring(1, file[i].length - 1)] = linesPassed
        } else if (file[i][0] !== "/" && file[i][0] !== "&" && file[i].length > 0) {
            // otherwise, if it's not whitespace, we increment linesPassed.
            linesPassed++
        }
    }

    // for our 2nd pass, adding the variables in, let's iterate through the file
    // again to find any variable in our symbol table
    let n = 16
    for (let i = 0; i < file.length; i++) {
        const line = file[i]

        if (file[i].charAt(0) !== '/') {
            // where is the start of the line?
            let start = 0

            // while file[i].charAt(start) it is a whitespace, we increment
            // start.
            while (line.charAt(start) === ' ' || line.charAt(start) === "    ") {
                start++
            }


            if (file[i].charAt(start) === "@") {
                // let's define a regular expression! This one just
                // says that if it is a variable, some character can't be a
                // number or a newline.
                let regExp = new RegExp("[^0-9].")

                if (regExp.test(line.substring(start + 1, line.length))) {
                    console.log(line.substring(start + 1, line.length))
                    if (!(line.substring(start + 1, line.length) in symbolTable)) {
                        symbolTable[line.substring(start + 1, line.length)] = n
                        n++
                    }
                }
            }
        }
    }
    console.log(file)





    for (let i = 0; i < file.length; i++) {
        // what is the line
        let line = file[i]

        // cut out any comment or whitespace
        let indexOfAComment = line.indexOf("/")
        if (indexOfAComment === -1) {
            line = trim(line)
        } else {
            line = trim(line.substring(0, indexOfAComment))
        }

        // we only handle it if it's not whitespace.
        if (!(line.charAt(0) === ' ' || line.charAt(0) === '/' || line.length === 0 || line.charAt(0) === '(')) {
            // text lineNumber: line, basically
            leftDiv.html("<pre>" + i + ":</pre>", true)
            middleDiv.html("<pre>" + line + "</pre>", true)


            // handling A instructions
            if (line.charAt(0) === "@") {
                let string = '0'

                // now let's identify if the number is a variable or not
                // with our earlier regular expression that says that if the
                // rest is a variable, then there has to be at least 1
                // non-number character followed by a non-newline character.
                let list
                let regExp = new RegExp("[^0-9].")

                if (regExp.test(line.substring(1))) {
                    // if it is a variable, search it in our complete symbol
                    // table
                    list = decimal_to_binary(symbolTable[line.substring(1)])
                } else {
                    // if it isn't, then we just translate it
                    list = decimal_to_binary(line.substring(1))
                }
                // for every bit of our list, we join the string together
                for (let bit of list) {
                    string = join([string, bit], '')
                }
                // then we write our string to our right div
                rightDiv.html("<pre>" + string + "</pre>", true)
            }
            // handling C instructions
            else {
                let string = '111'

                // The destination.
                let destinationEnd = line.indexOf("=")

                let destination

                // If the result isn't -1, meaning there is a destination...
                if (destinationEnd !== -1) {
                    // define the destination start
                    let destinationStart = 0

                    // While the result of file[i].charAt(destinationEnd) is ' ',
                    // we decrement destinationEnd to take account for
                    // whitespace.
                    while (line.charAt(destinationEnd) === ' ') {
                        destinationEnd--
                    }

                    // While the result of file[i].charAt(destinationStart) is '
                    // ', we increment destinationStart.
                    while (line.charAt(destinationStart) === ' ') {
                        destinationStart++
                    }

                    // now the destination is the substring of destinationStart
                    // and destinationEnd, and then we transform it with the parser.
                    let destinationCode = line.substring(destinationStart, destinationEnd)
                    destination = parser.destDict[destinationCode]
                } else {
                    destination = "000"
                }
                // The jump.
                let jumpStart = line.indexOf(";")

                let jump

                // If the result isn't -1...
                if (jumpStart !== -1) {
                    // define the jump start
                    let jumpEnd = line.length

                    // console.log(jumpEnd)

                    // While the result of file[i].charAt(jumpEnd) is ' ',
                    // we decrement jumpEnd.
                    while (line.charAt(jumpEnd) === ' ') {
                        jumpEnd--
                    }

                    // While the result of file[i].charAt(jumpStart) is '
                    // ', we increment jumpStart.
                    while (line.charAt(jumpStart) === ' ') {
                        jumpStart++
                    }

                    // now the destination is the substring of destinationStart
                    // and destinationEnd and then we transform it with the parser.
                    let jumpCode = line.substring(jumpStart + 1, jumpEnd)
                    jump = parser.jumpDict[jumpCode]
                } else {
                    jump = "000"
                }

                // Computation
                let dstEnd = line.indexOf("=")
                let jmpStart = line.indexOf(";")

                let comp

                // just... go with the same process!

                if (dstEnd === -1) {
                    dstEnd = 0
                }
                if (line.charAt(dstEnd) === ' ' || line.charAt(dstEnd) === '=') {
                    dstEnd++
                }
                if (jmpStart === -1) {
                    jmpStart = line.length
                }
                if (line.charAt(jmpStart) === ' ') {
                    jmpStart--
                }
                let compCode = line.substring(dstEnd, jmpStart)

                comp = parser.compDict[compCode]

                // write our output to our div
                rightDiv.html("<pre>" + string + comp +
                     destination + jump + "</pre>", true)
            }
        }
    }


}

function draw() {    
    // background(234, 34, 24)

}