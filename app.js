const lat = 37.518252;
const lng = 127.023549;
const DARK_API_KEY = '42bab5929866f1ef0894c8016645116f';
const AQICN_API_KEY = 'c0b0c8b56e4ef876b85fa125fa817853d2fdf7f8';
const request = require('request');
const { RTMClient } = require('@slack/client');
const token = process.env.SLACK_TOKEN || 'xoxb-16238810274-535008858145-CGiM0wwirPF3Ar9xWSpZiPIg';
const rtm = new RTMClient(token);

function requestWeatherInfo(fn) {
    request(`https://api.darksky.net/forecast/${DARK_API_KEY}/${lat},${lng}?lang=ko&units=si`,
        { json: true},
        (err, res, body) => {
            if (err) {
                return console.error(err);
            }
            var w1 = body.currently.summary;
            var w2 = body.currently.temperature + '°';
            var w3 = body.currently.humidity * 100 + '%';
            var weatherValue = '날씨: ' + w1 + '\n기온: ' + w2 + '\n습도: ' + w3;
            fn(weatherValue);
        });
}

function requestAirQuality(fn) {
    request(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=${AQICN_API_KEY}`,
        { json: true},
        (err, res, body) => {
            if (err) {
                return console.error(err);
            }
            var a1 = body.data.aqi;
            var a2 = body.data.iaqi.pm10.v;
            var a3 = body.data.iaqi.pm25.v;
            var airQualityValue = 'AQI: ' + a1 + '\nnpm10: ' + a2 + '\nnpm2.5: ' + a3;
            fn(airQualityValue);
        });
}

rtm.start();

rtm.on('message', message => {
    var text = message.text;
    if (text.includes('천재')) {
        rtm.sendMessage('감사', message.channel);
    } else if (text.includes('바보')) {
        rtm.sendMessage('반사', message.channel);
    } else if (text.includes('대기')) {
        requestAirQuality(airQualityValue => rtm.sendMessage(airQualityValue, message.channel));
    }else {
        requestWeatherInfo(weatherValue => rtm.sendMessage(weatherValue, message.channel));
    }
});