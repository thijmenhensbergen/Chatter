

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
    const colorField = document.getElementById('color');
    const pfppreview = document.getElementById('pfp');
    const pfp2preview = document.getElementById('pfp2');
    usernameField.value = json.Name;
    pfpurlField.value = json.PFPURL;
    pfppreview.src = json.PFPURL;
    pfp2preview.src = json.PFPURL;
    colorField.value = json.Color;
}
document.getElementById('updateButton').addEventListener('click', async (e) => {
    const token = localStorage.getItem('accountToken');
    const usernameinput = document.getElementById('usernameinput');
    const pfpurlinput = document.getElementById('pfpurl');
    const colorField = document.getElementById('color');
    const usernameinputText = usernameinput.value.trim();
    const pfpurlinputText = pfpurlinput.value.trim();
    const colorinputText = colorField.value;
    console.log(colorinputText);
    try {
        const response = await fetch('http://localhost:3000/api/updateAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                NewUsername: usernameinputText,
                NewPFPURL: pfpurlinputText,
                NewColor: colorinputText,
                Token: token
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        window.location.href = window.location.origin;
    } catch (err) {
        console.error(err);
    }

});
document.getElementById('roomListButton').addEventListener('click', () => {
    window.location.href = window.location.origin;
});
getExistingData();
