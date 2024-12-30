async function runWorkflow(key, inputs) {
    const url = 'https://api.dify.ai/v1/workflows/run';
    const requestBody = {
        "inputs": inputs,
        "response_mode": "blocking",
        "user": "geonwprj-github"
    };

        // {
        //     "input_text": "不僅如此。~||~到達修德里·白芸這個層次，她很清楚，要進一步提升實力，很難很難。~||~殺戮之神的無盡殺戮，雪帝今天破不了，即便再給雪帝幾年時間，他大概率也是破不了的。~||~正是因爲想清楚這些，修德里·白芸才選擇了果斷撤兵。"
        // },

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
        
        console.log(response);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        document.getElementById('api-response').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.log('!! error');
        console.log(error);
        console.error('There was a problem with the fetch operation:', error);
    }
}
