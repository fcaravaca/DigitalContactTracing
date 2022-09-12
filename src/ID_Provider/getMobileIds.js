function getMobileIds(n){
    // This should a request to some kind of DB instead of the random function
    let maximum = 299
    let minimum = 0
    return Array.from(Array(n)).map(() => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
    //return generateRandomNumbers(n)
}


// The functions beneath are just a random mobile number implementation 
function generateRandomNumbers(n){

    const mobileIds = Array.from(Array(n)).map((x, i) => {
        const randomNumber = Math.floor((Math.random() * 100000000) + 1);

        const number = "6" + pad(randomNumber, 8) // Add leading 0s if necessary 
        const final_number = formatNumber(number) // Better formating (not necessary at all)

        return final_number
    });
    
    return mobileIds;
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function formatNumber(num){
    return ["+34",num.slice(0, 3), num.slice(3,6), num.slice(6)].join(' ');
}

module.exports = {getMobileIds};