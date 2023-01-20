import readline from 'readline-sync';

export async function postcodeToCoords() {
    let postcodeCheck = false;
    let postcodeNoWS;
    let postcode; // declared here, rather than DO block so in scope for catch block

    console.log("Please enter your postcode to find the closest bus stops:");

    do {
        postcode = readline.prompt();
        postcodeNoWS = postcode.replace(/\s/g, "");
        postcodeCheck = /^[a-z0-9]{5,7}$/i.test(postcodeNoWS);
        if (!postcodeCheck) console.log("You entered an invalid postcode! Please try again.");
    } while (!postcodeCheck);

    try {
        const postCodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcodeNoWS}`);
        const postCodeJSON = await postCodeResponse.json();
        const latitude = postCodeJSON.result.latitude;
        const longitude = postCodeJSON.result.longitude;
        const coords = [latitude, longitude]
        return coords;
    }
    catch {
        console.log(`The API returned no results.\n${postcode} is not a valid London postcode. Please try again.`);
        postcodeToCoords();
        //process.exit(); - to get out of the app and not prompt the user again
    }
}


