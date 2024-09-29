var inputData = {
    "deviceInfo": {
        "deviceName": "A1",
        "deviceProfileName": "P1",
        "devEui": "1000000000000001"
    },
    "time": "2023-05-22T07:47:05.404859+00:00",
    "data": "AUVdAiIOTARoIA=="
};

function convert(dataToConvert) {
    if (typeof (dataToConvert) === 'string') {
        let convertedData;
        let ts;
        try {
            convertedData = JSON.parse(dataToConvert);
        } catch (err) {
            throw new Error(`Value must be JSON string`);
        }

        try {
            ts = Date.parse(convertedData.time);
        } catch (e) {
            throw new Error(`Time invalid`);
        }
        try {

            const data = Buffer.from(convertedData.data, 'base64')
            console.log(data);


            const batteryId = data.findIndex((elem) => elem === parseInt('0x01'))
            const humidityId = data.findIndex((elem) => elem === parseInt('0x04'))
            const temperature_id = data.findIndex((elem) => elem === parseInt('0x02'))
            if (humidityId === -1 || batteryId === -1 || humidityId === -1) {
                throw new Error();
            }
            const battery = parseInt(data[batteryId + 2])
            const humidity = parseInt(data[humidityId + 2])
            const temperature = parseInt(data[temperature_id + 2].toString(16) + data[temperature_id + 3].toString(16), 16) / 100


            return {
                deviceInfo: convertedData.deviceInfo, telemetry: {
                    ts,
                    values: {
                        battery,
                        humidity,
                        temperature,
                    }
                }
            };
        } catch (err) {
            throw new Error(`Data invalid`);
        }

    } else {
        throw new Error(`Value must be JSON string`);
    }


    // convertedData.data1 = Uint8Array.from(atob(convertedData.convertedData), b => b.charCodeAt(0).toString(16));

}







console.log(convert(JSON.stringify(inputData)))

//output data

/*

{
    "deviceName": "A1",
    "deviceType": "P1",
    "attributes": {
    "devEui": "1000000000000001"
},
    "telemetry": {
    "ts": 1684741625404,
        "values": {
        "battery": 93,
            "temperature": 36.6,
            "humidity": 32
    }
}
}
*/
