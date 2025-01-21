const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('id');
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://cs2-stats.onrender.com';

if (!playerId) {
    window.location.href = 'index.html';
}

function fetchPlayerInfo() {
    const playerInfoContainer = document.getElementById('player-info');
    playerInfoContainer.innerHTML = '<p>Loading player info...</p>';

    Promise.all([
        fetch(`${API_BASE_URL}/api/player-info/${playerId}`).then(res => res.json()),
        fetch(`${API_BASE_URL}/api/recently-played/${playerId}`).then(res => res.json())
    ])
        .then(([playerData, recentData]) => {
            if (!playerData.response?.players?.[0]) {
                throw new Error('Player not found');
            }

            const player = playerData.response.players[0];
            const cs2Games = recentData.response?.games?.filter(game => game.appid === 730) || [];

            playerInfoContainer.innerHTML = `
            <div class="player-container">
                <div class="player-header">
                    <img src="${player.avatarfull}" alt="Player Avatar" class="player-avatar">
                    <div class="player-details text-center">
                        <h2>${player.personaname}</h2>
                        <p>Status: ${player.personastate === 1 ? 'Online' : 'Offline'}</p>
                        <p>Country: ${player.loccountrycode || 'Not specified'}</p>
                        <p>Steam ID: ${player.steamid}</p>
                        <p>Profile URL: <a href="${player.profileurl}" target="_blank">${player.profileurl}</a></p>
                    </div>
                </div>
                
                <div class="recent-activity text-center">
                    <h3>Recent CS2 Activity</h3>
                    ${cs2Games.length > 0 ? `
                        <p>Last 2 weeks: ${Math.round(cs2Games[0].playtime_2weeks / 60)} hours</p>
                        <p>Total Playtime: ${Math.round(cs2Games[0].playtime_forever / 60)} hours</p>
                    ` : '<p>No recent CS2 activity</p>'}
                </div>
            </div>
        `;
        })
        .catch(error => {
            console.error('Error:', error);
            playerInfoContainer.innerHTML = `<p>Error loading player info: ${error.message}</p>`;
        });
}

function fetchPlayerStats() {
    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = '<p>Loading stats...</p>';

    fetch(`${API_BASE_URL}/api/player-stats/${playerId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.playerstats?.stats) {
                throw new Error('Invalid API response format');
            }

            console.log('Full Player Stats:', data);

            const stats = data.playerstats.stats;
            const findStat = (name) => {
                const stat = stats.find(s => s.name === name);
                return stat ? stat.value : 'N/A';
            };

            // Calculate accuracy
            const accuracy = ((findStat('total_shots_hit') / findStat('total_shots_fired')) * 100).toFixed(1);

            statsContainer.innerHTML = `
                <div class="stats-container">
                <div class="weapon-stats">
                        <h3>Top Weapons</h3>
                        <p>AK-47: ${findStat('total_kills_ak47')} kills</p>
                        <p>AWP: ${findStat('total_kills_awp')} kills</p>
                        <p>M4A4: ${findStat('total_kills_m4a1')} kills</p>
                        <p>Desert Eagle: ${findStat('total_kills_deagle')} kills</p>
                        <p>Knife: ${findStat('total_kills_knife')} kills</p>
                        <p>Grenade: ${findStat('total_kills_hegrenade')} kills</p>
                        <p>Glock: ${findStat('total_kills_glock')} kills</p>
                        <p>FiveSeven: ${findStat('total_kills_fiveseven')} kills</p>
                        <p>USP: ${findStat('total_kills_hkp2000')} kills</p>
                        <p>Xm1014: ${findStat('total_kills_xm1014')} kills</p>
                        <p>Mac10: ${findStat('total_kills_mac10')} kills</p>
                        <p>Ump45: ${findStat('total_kills_ump45')} kills</p>
                        <p>P90: ${findStat('total_kills_p90')} kills</p>
                        <p>Aug: ${findStat('total_kills_aug')} kills</p>
                        <p>Famas: ${findStat('total_kills_famas')} kills</p>
                        <p>Sg: ${findStat('total_kills_sg556')} kills</p>
                        <p>M249: ${findStat('total_kills_m249')} kills</p>
                        <p>P250: ${findStat('total_kills_p250')} kills</p>
                        <p>Scar: ${findStat('total_kills_scar20')} kills</p>
                        <p>SSG: ${findStat('total_kills_ssg08')} kills</p>
                        <p>Mp7: ${findStat('total_kills_mp7')} kills</p>
                        <p>Mp9: ${findStat('total_kills_mp9')} kills</p>
                        <p>Nova: ${findStat('total_kills_nova')} kills</p>
                        <p>Negev: ${findStat('total_kills_negev')} kills</p>
                        <p>SawedOff: ${findStat('total_kills_sawedoff')} kills</p>
                        <p>Bizon: ${findStat('total_kills_bizon')} kills</p>
                        <p>Tec9: ${findStat('total_kills_tec9')} kills</p>
                        <p>mag7: ${findStat('total_kills_mag7')} kills</p>
                        <p>Galil: ${findStat('total_kills_galilar')} kills</p>
                        <p>Taser: ${findStat('total_kills_taser')} kills</p>
                        <p>Decoy: ${findStat('total_kills_decoy')} kills</p>
                        <p>Molotov: ${findStat('total_kills_molotov')} kills</p>
                    </div> 
                    <div class="general-stats">
                        <h3>Player Stats Overview</h3>
                        <p>Total Matches: ${findStat('total_matches_played')}</p>
                        <p>Matches Won: ${findStat('total_matches_won')}</p>
                        <p>Win Rate: ${((findStat('total_matches_won') / findStat('total_matches_played')) * 100).toFixed(1)}%</p>
                        <p>Total Kills: ${findStat('total_kills')}</p>
                        <p>Total Deaths: ${findStat('total_deaths')}</p>
                        <p>K/D Ratio: ${(findStat('total_kills') / findStat('total_deaths')).toFixed(2)}</p>
                        <p>Headshots: ${findStat('total_kills_headshot')}</p>
                        <p>Accuracy: ${accuracy}%</p>
                        <p>MVPs: ${findStat('total_mvps')}</p>
                        <p>Total damage done: ${findStat('total_damage_done')}</p>
                        <p>Total money earned: $${findStat('total_money_earned')}</p>
                        <p>Total planted bombs: ${findStat('total_planted_bombs')}</p>
                        <p>Total defused bombs: ${findStat('total_defused_bombs')}</p>
                        <p>Enemy Weapon: ${findStat('total_kills_enemy_weapon')} kills</p>
                        <p>Total resqued hostages: ${findStat('total_rescued_hostages')}</p>
                    </div>        
                </div>           
            `;
        })
        .catch(error => {
            console.error('Error fetching player stats:', error);
            statsContainer.innerHTML = `<p>Error loading stats: ${error.message}</p>`;
        });
}

function fetchMatchHistory() {
    const matchHistoryContainer = document.getElementById('map-stats');
    matchHistoryContainer.innerHTML = '<p>Loading stats...</p>';

    fetch(`${API_BASE_URL}/api/player-stats/${playerId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data);

            if (!data.playerstats?.stats) {
                throw new Error('Invalid stats format');
            }

            const stats = data.playerstats.stats;
            const getStat = (name) => stats.find(s => s.name === name)?.value || 0;

            // Recent Performance
            const matchHistoryHTML = `
                <div class="map-stats-container">
                    <div class="map-stats">
                        <h3>Top Maps</h3>
                        <p>Cobblestone: ${getStat('total_wins_map_de_cbble')} wins</p>
                        <p>Dust2: ${getStat('total_wins_map_de_dust2')} wins</p>
                        <p>Inferno: ${getStat('total_wins_map_de_inferno')} wins</p>
                        <p>Italy: ${getStat('total_wins_map_cs_italy')} wins</p>
                        <p>Nuke: ${getStat('total_wins_map_de_nuke')} wins</p>
                        <p>Office: ${getStat('total_wins_map_cs_office')} wins</p>
                        <p>Train: ${getStat('total_wins_map_de_train')} wins</p>
                        <p>Vertigo: ${getStat('total_wins_map_de_vertigo')} wins</p>
                    </div>

                    <div class="achievements">
                        <h3>Achievements</h3>
                        <p>Pistol Round Wins: ${getStat('total_wins_pistolround')}</p>
                        <p>Bombs Planted: ${getStat('total_planted_bombs')}</p>
                        <p>Bombs Defused: ${getStat('total_defused_bombs')}</p>
                        <p>Enemy Weapons Kills: ${getStat('total_kills_enemy_weapon')}</p>
                        <p>Total Weapons Donated: ${getStat('total_weapons_donated')}</p>
                        <p>Total kills when the enemy was blinded: ${getStat('total_kills_enemy_blinded')}</p>
                        <p>Total kills against zoomed snipers: ${getStat('total_kills_against_zoomed_sniper')}</p>
                        <p>Total Broken Windows: ${getStat('total_broken_windows')}</p>
                    </div>
                </div>
            `;

            matchHistoryContainer.innerHTML = matchHistoryHTML;
        })
        .catch(error => {
            console.error('Error:', error);
            matchHistoryContainer.innerHTML = `<p>Error loading match history: ${error.message}</p>`;
        });
}

fetchPlayerInfo();
fetchPlayerStats();
fetchMatchHistory();