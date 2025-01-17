const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;
const API_KEY = 'F0228B3CBFB9076503B108D773277E8A';

app.use(cors());
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});