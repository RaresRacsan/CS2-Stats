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
                throw new Error(data.error);
            }

            const player = playerData.response.players[0];
            const cs2Games = recentData.response?.games?.filter(game => game.appid === 730) || [];

            playerInfoContainer.innerHTML = `
            <div class="player-container">
                <div class="player-header">
                    <img src="${player.avatarfull}" alt="Player Avatar" class="player-avatar">
                    <div class="player-details text-center">
                        <h2>${player.personaname}</h2>
                        <p>Status: <span class="${player.personastate === 1 ? 'online' : 'offline'}">${player.personastate === 1 ? 'Online' : 'Offline'}</span></p>
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
                throw new Error(data.error);
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
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/ak47.svg" alt="AK-47" class="weapon-icon">
                            <p>AK-47: ${findStat('total_kills_ak47')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/awp.svg" alt="AWP" class="weapon-icon">
                            <p>AWP: ${findStat('total_kills_awp')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/m4a4.svg" alt="M4a4" class="weapon-icon">
                            <p>M4A4: ${findStat('total_kills_m4a1')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/deagle.svg" alt="Deagle" class="weapon-icon">
                            <p>Desert Eagle: ${findStat('total_kills_deagle')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/usp_s.svg" alt="USP-S" class="weapon-icon">
                            <p>USP-S: ${findStat('total_kills_hkp2000')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/glock.svg" alt="Glock" class="weapon-icon">
                            <p>Glock: ${findStat('total_kills_glock')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/p90.svg" alt="P90" class="weapon-icon">
                            <p>P90: ${findStat('total_kills_p90')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/sg.svg" alt="SG" class="weapon-icon">
                            <p>SG: ${findStat('total_kills_sg556')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/aug.svg" alt="Aug" class="weapon-icon">
                            <p>Aug: ${findStat('total_kills_aug')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/famas.svg" alt="Famas" class="weapon-icon">
                            <p>Famas: ${findStat('total_kills_famas')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/galil.svg" alt="Galil" class="weapon-icon">
                            <p>Galil: ${findStat('total_kills_galilar')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/fiveseven.svg" alt="Five-Seven" class="weapon-icon">
                            <p>FiveSeven: ${findStat('total_kills_fiveseven')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/tec9.svg" alt="Tec-9" class="weapon-icon">
                            <p>Tec9: ${findStat('total_kills_tec9')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/p250.svg" alt="P250" class="weapon-icon">
                            <p>P250: ${findStat('total_kills_p250')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/mac10.svg" alt="Mac-10" class="weapon-icon">
                            <p>Mac10: ${findStat('total_kills_mac10')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/ump45.svg" alt="Ump45" class="weapon-icon">
                            <p>Ump45: ${findStat('total_kills_ump45')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/mp7.svg" alt="Mp7" class="weapon-icon">
                            <p>Mp7: ${findStat('total_kills_mp7')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/mp9.svg" alt="Mp9" class="weapon-icon">
                            <p>Mp9: ${findStat('total_kills_mp9')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/bizon.svg" alt="Bizon" class="weapon-icon">
                            <p>Bizon: ${findStat('total_kills_bizon')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/xm1014.svg" alt="XM1014" class="weapon-icon">
                            <p>XM1014: ${findStat('total_kills_xm1014')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/nova.svg" alt="Nova" class="weapon-icon">
                            <p>Nova: ${findStat('total_kills_nova')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/mag7.svg" alt="MAG7" class="weapon-icon">
                            <p>MAG7: ${findStat('total_kills_mag7')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/sawedoff.svg" alt="SawedOff" class="weapon-icon">
                            <p>SawedOff: ${findStat('total_kills_sawedoff')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/negev.svg" alt="Negev" class="weapon-icon">
                            <p>Negev: ${findStat('total_kills_negev')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/m249.svg" alt="M249" class="weapon-icon">
                            <p>M249: ${findStat('total_kills_m249')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/scar20.svg" alt="Scar" class="weapon-icon">
                            <p>Scar: ${findStat('total_kills_scar20')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/ssg08.svg" alt="SSG" class="weapon-icon">
                            <p>SSG: ${findStat('total_kills_ssg08')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/elite.svg" alt="Dual Berettas" class="weapon-icon">
                            <p>Dual Berettas: ${findStat('total_kills_elite')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/g3sg1.svg" alt="G3SG1" class="weapon-icon">
                            <p>G3SG1: ${findStat('total_kills_g3sg1')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/knife.svg" alt="Knife" class="weapon-icon">
                            <p>Knife: ${findStat('total_kills_knife')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/hegrenade.svg" alt="Grenade" class="weapon-icon">
                            <p>Grenade: ${findStat('total_kills_hegrenade')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/molotov.svg" alt="Molotov" class="weapon-icon">
                            <p>Molotov: ${findStat('total_kills_molotov')} kills</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/taser.svg" alt="Taser" class="weapon-icon">
                            <p>Taser: ${findStat('total_kills_taser')} kills</p>
                        </div>
                        <div class="weapon-stat">
                        <img src="../icons/Cs2Weapons/decoy.svg" alt="Decoy" class="weapon-icon">
                            <p class="${findStat('total_kills_decoy') > 0 ? 'positive-stat' : ''}">Decoy: ${findStat('total_kills_decoy')} kills</p>
                        </div>
                    </div> 

                    <div class="general-stats">
                        <h3>Player Stats Overview</h3>
                        <h4>General Performance</h4>
                        <p>Total Kills: ${findStat('total_kills')}</p>
                        <p>Total Deaths: ${findStat('total_deaths')}</p>
                        <p class="${(findStat('total_kills') / findStat('total_deaths')).toFixed(2) > 1.00 ? 'positive-stat' : 'negative-stat'}">K/D Ratio: ${(findStat('total_kills') / findStat('total_deaths')).toFixed(2)}</p>
                        <p>Total Matches: ${findStat('total_matches_played')}</p>
                        <p>Total Wins: ${findStat('total_matches_won')}</p>
                        <p>Win Rate: ${((findStat('total_matches_won') / findStat('total_matches_played')) * 100).toFixed(1)}%</p>
                        <p>MVPs: ${findStat('total_mvps')}</p>

                        <br>

                        <h4>Combat Efficiency</h4>
                        <p>Headshot kills: ${findStat('total_kills_headshot')}</p>
                        <p>Damage per round (DPR): ${(findStat('total_damage_done') / findStat('total_rounds_played')).toFixed(0)}</p>
                        <p>Total damage done: ${findStat('total_damage_done')}</p>
                        <p>Shot Accuracy: ${accuracy}%</p>
                        <p>Enemy Weapon kills: ${findStat('total_kills_enemy_weapon')} kills</p>

                        <br>

                        <h4>Tactical Contributions</h4>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/planted.svg" alt="Planted" class="weapon-icon">
                            <p>Total planted bombs: ${findStat('total_planted_bombs')}</p>
                        </div>
                        <div class="weapon-stat">
                            <img src="../icons/Cs2Weapons/defused.svg" alt="Defused" class="weapon-icon">
                            <p>Total defused bombs: ${findStat('total_defused_bombs')}</p>
                        </div>
                        <p>Total resqued hostages: ${findStat('total_rescued_hostages')}</p>
                        <p>Total money earned: $${findStat('total_money_earned')}</p>

                        <br>

                        <h4>Dominance Stats</h4>
                        <p>Dominations: ${findStat('total_dominations')}</p>
                        <p>Overkills: ${findStat('total_domination_overkills')}</p>
                        <p>Revenges: ${findStat('total_revenges')}</p>
                    </div>        
                </div>           
            `;
        })
        .catch(error => {
            console.error('Error fetching player stats:', error);
            statsContainer.innerHTML = `<p>Error loading stats: ${error.message}</p>`;
        });
}

function fetchMapStatsAndAchievements() {
    const matchHistoryContainer = document.getElementById('map-stats');
    matchHistoryContainer.innerHTML = '<p>Loading stats...</p>';

    fetch(`${API_BASE_URL}/api/player-stats/${playerId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data);

            if (!data.playerstats?.stats) {
                throw new Error(data.error);
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
fetchMapStatsAndAchievements();