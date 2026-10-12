async function verifyAdmin() {
    console.log("Verifying admin");

    const token = localStorage.getItem('accountToken');

    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/verifyadmin?token=${encodeURIComponent(token)}`);

        if (!response.ok) {
            throw new Error(`Server status ${response.status}`);
        }

        const isAdmin = await response.json();

        console.log("Is admin:", isAdmin);

        return isAdmin === true;

    } catch (error) {
        console.error("Verification failed:", error.message);
        return false;
    }
}