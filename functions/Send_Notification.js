const handleNotification = (message, token, uid, type) => {
    try {
        fetch('http://10.0.13.126:3000/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                message: message,
                uid: uid,
                type: type
            }),
        }).catch(error => {
            console.error('Error sending notification:', error);
        });
    } catch (error) {
        console.error('Error initiating notification:', error);
    }
};

export default handleNotification;
