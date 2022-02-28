/**
 * @author Cody
 * @date 2022.02.23
 *
 *
 */
let font

// our file
let file

// our table for conversion between C-instruction mysterious symbols and binary
let parser

// our div for display
let leftDiv, middleDiv, rightDiv


function preload() {
    font = loadFont('data/meiryo.ttf')
    file = loadStrings('asm/pong.asm')
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
    noCanvas()
    colorMode(HSB, 360, 100, 100, 100)
    fill(0, 0, 100)
    background(234, 34, 24)

    leftDiv = select("#left")
    middleDiv = select("#middle")
    rightDiv = select("#right")

    console.log(leftDiv, middleDiv, rightDiv)

//     for (let number = 10; number < 32769; number++) {
//         text(number + " in 15-bit binary is " + decimal_to_binary(number), 0, 15 + 14*(number-10))
//     }
    for (let i = 0; i < file.length; i++) {
        // we only handle it if it's not whitespace.
        if (!(file[i].charAt(0) === ' ' || file[i].charAt(0) === '/' || file[i].length === 0)) {
            leftDiv.html("<pre>" + i + ":</pre>", true)
            middleDiv.html("<pre>" + file[i] + "</pre>", true)


            // handling A instructions
            if (file[i].charAt(0) === "@") {
                let string = '0'
                let list = decimal_to_binary(file[i].substring(1))
                for (let bit of list) {
                    string = join([string, bit], '')
                }
                console.log(file[i] + ": " + string)
                rightDiv.html("<pre>" + string + "</pre>", true)
            }
            // handling C instructions
            else {
                let string = '111'

                // The destination.
                let destinationEnd = file[i].indexOf("=")

                let destination

                // If the result isn't -1...
                if (destinationEnd !== -1) {
                    // define the destination start
                    let destinationStart = 0

                    // While the result of file[i].charAt(destinationEnd) is ' ',
                    // we decrement destinationEnd.
                    while (file[i].charAt(destinationEnd) === ' ') {
                        destinationEnd--
                    }

                    // While the result of file[i].charAt(destinationStart) is '
                    // ', we increment destinationStart.
                    while (file[i].charAt(destinationStart) === ' ') {
                        destinationStart++
                    }

                    // now the destination is the substring of destinationStart
                    // and destinationEnd and then we transform it with the parser.
                    let destinationCode = file[i].substring(destinationStart, destinationEnd)
                    destination = parser.destDict[destinationCode]
                } else {
                    destination = "000"
                }
                // The jump.
                let jumpStart = file[i].indexOf(";")

                let jump

                // If the result isn't -1...
                if (jumpStart !== -1) {
                    // define the jump start
                    let jumpEnd = file[i].length

                    // console.log(jumpEnd)

                    // While the result of file[i].charAt(jumpEnd) is ' ',
                    // we decrement jumpEnd.
                    while (file[i].charAt(jumpEnd) === ' ') {
                        jumpEnd--
                    }

                    // While the result of file[i].charAt(jumpStart) is '
                    // ', we increment jumpStart.
                    while (file[i].charAt(jumpStart) === ' ') {
                        jumpStart++
                    }

                    // now the destination is the substring of destinationStart
                    // and destinationEnd and then we transform it with the parser.
                    let jumpCode = file[i].substring(jumpStart + 1, jumpEnd)
                    jump = parser.jumpDict[jumpCode]
                } else {
                    jump = "000"
                }

                // Computation
                let dstEnd = file[i].indexOf("=")
                let jmpStart = file[i].indexOf(";")

                let comp

                if (dstEnd === -1) {
                    dstEnd = 0
                } else {
                    if (file[i].charAt(dstEnd) === ' ' || file[i].charAt(dstEnd) === '=') {
                        dstEnd++
                    }
                }
                if (jmpStart === -1) {
                    jmpStart = file[i].length
                } else {
                    if (file[i].charAt(jmpStart) === ' ') {
                        jmpStart--
                    }
                }
                let compCode = file[i].substring(dstEnd, jmpStart)

                comp = parser.compDict[compCode]

                console.log(file[i] + ": " + string + comp + destination + jump)

                console.log(string + comp + destination + jump)

                rightDiv.html("<pre>" + string + comp +
                     destination + jump + "</pre>", true)
            }
        }
    }
}

function draw() {    
    // background(234, 34, 24)

}