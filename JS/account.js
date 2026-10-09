

async function getExistingData()
{
    try {
        const token = localStorage.getItem('accountToken');
        const response = await fetch(`http://localhost:3000/api/getprofilebytoken?token=${token}`)
        const json = await response.json();
        console.log(json);
        fillInExistingData(json);
    } catch (error) {
        console.log(error);
    }
}
async function fillInExistingData(json) {
    const usernameField = document.getElementById('usernameinput');
    const pfpurlField = document.getElementById('pfpurl');
    const pfppreview = document.getElementById('pfp');
    const pfp2preview = document.getElementById('pfp2');
    usernameField.value = json.Name;
    pfpurlField.value = json.PFPURL;
    pfppreview.src = json.PFPURL;
    pfp2preview.src = json.PFPURL;
}
document.getElementById('updateButton').addEventListener('click', async (e) => {
    const token = localStorage.getItem('accountToken');
    const usernameinput = document.getElementById('usernameinput');
    const pfpurlinput = document.getElementById('pfpurl');
    const usernameinputText = usernameinput.value.trim();
    const pfpurlinputText = pfpurlinput.value.trim();
    try {
        const response = await fetch('http://localhost:3000/api/updateAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                NewUsername: usernameinputText,
                NewPFPURL: pfpurlinputText,
                Token: token
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        window.location.href = window.location.origin;
    } catch (err) {
        console.error('Error', err);
    }

});
getExistingData();
