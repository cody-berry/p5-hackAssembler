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

function preload() {
    font = loadFont('data/meiryo.ttf')
    file = loadStrings('asm/pongL.asm')
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
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
}

function draw() {    
    background(234, 34, 24)
    fill(0, 0, 100)
//     for (let number = 10; number < 32769; number++) {
//         text(number + " in 15-bit binary is " + decimal_to_binary(number), 0, 15 + 14*(number-10))
//     }
    for (let i = 8; i < 20; i++) {
        // display all of the lines from line 8
        text(file[i], 0, 15*(i-8))

        // handling A instructions
        if (file[i][0] === "@") {
            let string = '0'
            let list = decimal_to_binary(file[i].substring(1))
            for (let bit of list) {
                string = join([string, bit], '')
            }
            if (frameCount === 5) {
                console.log(file[i] + ": " + string)
            }
        }
        // handling C instructions
        else {
            let string = '111'

            // The destination.
            let destinationEnd = file[i].indexOf("=")

            let destination

            if (frameCount === 5) {
                console.log(file[i])
            }

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

                if (frameCount === 5) {
                    console.log(file[i] + ": " + destination)
                }
            }
        }
    }
}