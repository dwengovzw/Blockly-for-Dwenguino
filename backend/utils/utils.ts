
//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript?page=1&tab=modifieddesc#tab-top
let makeSharingCode = (length=8 ) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export { makeSharingCode }