/*

    This script is meant to be run in the console of your browser

    It hooks onto the POST encryption JS and extracts (and prints) the payload before it's encrypted.
    This is useful to find what exactly is being sent, and I use this for ./cgi-requests

 */

(function hookEncryption() {
    // Find the encryption function
    const original = window.crypto_page?.encrypt_post_data;
    if (!original) {
        console.error("crypto_page.encrypt_post_data not found.");
        console.log("Try searching for 'crypto_page' in the console to locate it.");
        return;
    }

    // Override it to log the plaintext
    window.crypto_page.encrypt_post_data = function(pubkey, plaintext) {
        console.log("PLAINTEXT CAPTURED:");
        console.log(plaintext);
        // console.log("Endpoint:", window.location.href);
        console.log("---");
        // Call the original function so the app still works
        return original.call(this, pubkey, plaintext);
    };

    console.log(" Hook installed successfully.");
    console.log(" Now perform your operation");
    console.log(" The plaintext form data will appear right here in the console.");
})();