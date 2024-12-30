async function runWorkflow(key, inputs) {
    const url = 'https://api.dify.ai/v1/workflows/run';
    const requestBody = {
        "inputs": inputs,
        "response_mode": "blocking",
        "user": "geonwprj-github"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`,
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            },
            body: JSON.stringify(requestBody),
            mode: 'no-cors'
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.data.outputs.second_translation;
    } catch (error) {
        console.log('Error');
        console.log(error);
        // console.error('There was a problem with the fetch operation:', error);
    }
}
