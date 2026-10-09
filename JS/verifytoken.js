async function verifyToken() {
    console.log("verifying token");
    const token = localStorage.getItem('accountToken');
    
    if (token) {
        fetch(`http://localhost:3000/api/verifytoken?token=${token}`)
            .then(async response => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server status ${response.status}: ${errorText}`);
                }
                
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    throw new Error(`I want json but i got text:( - ${text.substring(0, 100)}...`);
                }

                return response.json();
            })
            .then(isValid => {
                if (isValid) {
                    console.log("Verification Succesful!");
                } else {
                    console.log("Token not found...");
                    window.location.href = window.location.origin + "/login";   
                }
            })
            .catch(error => console.error("Error with finding token: ", error));
    } else {
        console.log("No token found in local storage!! Redirecting to login page");
        window.location.href = window.location.origin + "/login";   
    }
}

verifyToken();
