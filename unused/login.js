window.addEventListener("load", async function () {
    await Clerk.load();

    if (Clerk.user) {
        document.getElementById("app").innerHTML = `
            <div id="user-button"></div>
        `;

        const userButtonDiv = document.getElementById("user-button");

        Clerk.mountUserButton(userButtonDiv);
    } else {
        document.getElementById("app").innerHTML = `
            <div id="sign-in"></div>
        `;

        const signInDiv = document.getElementById("sign-in");

        // Mount the sign-in component
        Clerk.mountSignIn(signInDiv);

        // Add event listener to the sign-up button
        const signUpButton = document.querySelector('.clerk-sign-up');
        signUpButton.addEventListener('click', function () {
            // Redirect to the sign-up page
            window.location.href = '/signup'; // Change 'signup.html' to your actual sign-up page URL
        });
    }
});
