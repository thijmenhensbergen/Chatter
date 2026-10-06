async function verifyToken() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`http://localhost:3000/api/verifytoken?RoomID=${token}`)
            .then(response => response.json())
            .then(isValid => {
                if (isValid) {
                    console.log("Verification Succesful!");
                } else {
                    console.log("Token not found...");
                    window.location.href = window.location.origin + "/login";   
                }
            })
            .catch(error => console.error("Error: ", error));
    } else {
        window.location.href = window.location.origin + "/login";   
    }
}