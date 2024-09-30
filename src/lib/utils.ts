export function convertToAscii(inputString: string){
    // remove non ascii characters 
    const asciiString = inputString.replace(/[^\x00-\x7F]/g, '');
    return asciiString;
}