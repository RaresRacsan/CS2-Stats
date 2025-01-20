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
// Api route for player stats
app.get('/api/player-stats/:playerId', async (req, res) => {
    try {
        const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${API_KEY}&steamid=${req.params.playerId}&appid=730`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Api route for match history
app.get('/api/match-history/:playerId', async (req, res) => {
    try {
        const response = await axios.get(`https://api.steampowered.com/ICSGOPlayers_730/GetMatchHistory/v1/?key=${API_KEY}&steamid=${req.params.playerId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Api route for player info
app.get('/api/player-info/:playerId', async (req, res) => {
    try {
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${req.params.playerId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Api route for recently played games stats
app.get('/api/recently-played/:playerId', async (req, res) => {
    try {
        const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${API_KEY}&steamid=${req.params.playerId}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port: ${PORT}`);
});