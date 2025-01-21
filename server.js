require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.STEAM_API_KEY;

app.use(cors());
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use(express.static('public'));

// API routes
// Api route for player stats + map stats + achievements
app.get('/api/player-stats/:playerId', async (req, res) => {
    try {
        const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${API_KEY}&steamid=${req.params.playerId}&appid=730`);
        if(!response.data.playerstats?.stats) {
            return res.status(404).json({ error: 'No CS2 stats found. Make sure your game profile is public and you have played CS2 recently.' });
        }
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch CS2 stats. Please check if your Steam profile is public.'});
    }
});

// Api route for player info (status, country, name, image, steam id, proifle url)
app.get('/api/player-info/:playerId', async (req, res) => {
    try {
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${req.params.playerId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch player information. Please check if the Steam ID is correct and try again.' });
    }
});

// Api route for getting the Recent Cs2 activity
app.get('/api/recently-played/:playerId', async (req, res) => {
    try {
        const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${API_KEY}&steamid=${req.params.playerId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch recent games. Please ensure your Steam profile is public and try again.' });
    }
});

// Api route for Steam Id from vanity url
app.get('/api/resolve-vanity/:vanityUrl', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${API_KEY}&vanityurl=${req.params.vanityUrl}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port: ${PORT}`);
});