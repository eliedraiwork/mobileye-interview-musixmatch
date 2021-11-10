// import { config as loadEnvConfig } from 'dotenv';

const { config: loadEnvConfig } = require('dotenv');
const axios = require('axios').default;
const { parse } = require('json2csv');
const { writeFileSync } = require('fs');

async function main() {
    // Load envfile
    loadEnvConfig();

    // retrieve parameter from the command line
    let word = process.env.DEFAULT_WORD || 'car';
    if (process.argv.length >= 3) {
        word = process.argv[2];
    }
    console.log(`Searching for ${word} in Musixmatch API.`);

    // retrieve api key
    const apiKey = process.env.MUSIX_MATCH_API_KEY;
    if (!apiKey) {
        console.log('Please provide an API key for Musixmatch API in the environment variable MUSIX_MATCH_API_KEY.');
        process.exit(9);
    }

    const tracks = await processApi(word);

    //  convert to csv
    const csv = parse(tracks);
    writeFileSync(__dirname + '/../output/results.csv', csv);
    return tracks;
}

async function processApi(word) {
    //  call API musixmatch for getting results
    const apikey = process.env.MUSIX_MATCH_API_KEY;
    const q_lyrics = word;
    const f_lyrics_language = 'en';
    const f_track_release_group_first_release_date_max = '20100101';
    const page_size = '200';
    let page = 0;

    const tracks = [];
    let status_code = 200;
    let track_list = [];

    do {
        page++;
        const response = await getPage(
            apikey,
            q_lyrics,
            f_lyrics_language,
            f_track_release_group_first_release_date_max,
            page_size,
            page
        );

        status_code = response?.message?.header?.status_code;
        if (status_code === 200) {
            const body = response?.message?.body;
            track_list = body?.track_list.map((track) => {
                return {
                    sound_name: track.track.track_name,
                    performer_name: track.track.artist_name,
                    album_name: track.track.album_name,
                    song_share_url: track.track.track_share_url,
                };
            });
            tracks.push(...track_list);
        }
    } while (status_code === 200 && track_list.length > 0);
    return tracks;
}

async function getPage(
    apiKey,
    q_lyrics,
    f_lyrics_language,
    f_track_release_group_first_release_date_max,
    page_size,
    page
) {
    const base_url = 'https://api.musixmatch.com/ws/1.1';
    const url = `${base_url}/track.search?apikey=${apiKey}&q_lyrics=${q_lyrics}&f_lyrics_language=${f_lyrics_language}&f_track_release_group_first_release_date_max=${f_track_release_group_first_release_date_max}&page_size=${page_size}&page=${page}`;
    const response = await axios.get(url);
    return response.data;
}

main();
