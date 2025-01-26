document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.stats-container').style.display = 'none';
});

async function handleCompareSubmit(event) {
    event.preventDefault();
    
    const player1Id = document.getElementById('player1').value;
    const player2Id = document.getElementById('player2').value;

    const [player1Info, player2Info] = await Promise.all([
        fetchPlayerInfo(player1Id),
        fetchPlayerInfo(player2Id)
    ]);

    const [player1Stats, player2Stats] = await Promise.all([
        fetchStats(player1Id),
        fetchStats(player2Id)
    ]);

    const comparisonResults = calculateScore(player1Stats, player2Stats);

    displayPlayerInfo('player1-stats', player1Info, player1Stats, comparisonResults.player1, comparisonResults.player1Score);
    displayPlayerInfo('player2-stats', player2Info, player2Stats, comparisonResults.player2, comparisonResults.player2Score);

    document.querySelector('.stats-container').style.display = 'flex';
}

async function fetchPlayerInfo(steamId) {
    const response = await fetch(`/api/player-info/${steamId}`);
    const data = await response.json();
    return data.response.players[0];
}

async function fetchStats(steamId) {
    const response = await fetch(`/api/player-stats/${steamId}`);
    const data = await response.json();
    return data.playerstats.stats;
}

function displayPlayerInfo(elementId, playerInfo, stats, comparisonResults, totalScore) {
    const container = document.getElementById(elementId);
    const findStat = (name) => stats.find(s => s.name === name)?.value || 0;
    const matchesPlayed = findStat('total_matches_played');

    const derivedStats = {
        kdr: (findStat('total_kills') / findStat('total_deaths')).toFixed(2),
        winRate: ((findStat('total_matches_won') / matchesPlayed) * 100).toFixed(1),
        mvpPerMatch: (findStat('total_mvps') / matchesPlayed).toFixed(2),
        headshotRatio: ((findStat('total_kills_headshot') / findStat('total_kills')) * 100).toFixed(1),
        dpr: (findStat('total_damage_done') / findStat('total_rounds_played')).toFixed(0),
        accuracy: ((findStat('total_shots_hit') / findStat('total_shots_fired')) * 100).toFixed(1),
        bombsPlantedPerMatch: (findStat('total_planted_bombs') / matchesPlayed).toFixed(2),
        bombsDefusedPerMatch: (findStat('total_defused_bombs') / matchesPlayed).toFixed(2),
        hostagesRescuedPerMatch: (findStat('total_rescued_hostages') / matchesPlayed).toFixed(2),
        enemyWeaponKillsPerMatch: (findStat('total_kills_enemy_weapon') / matchesPlayed).toFixed(2),
        pistolRoundWinsPerMatch: (findStat('total_wins_pistolround') / matchesPlayed).toFixed(2),
        totalWeaponsDonatedPerMatch: (findStat('total_weapons_donated') / matchesPlayed).toFixed(2),
        totalKillsBlindedPerMatch: (findStat('total_kills_enemy_blinded') / matchesPlayed).toFixed(2),
        totalKillsZoomedSnipersPerMatch: (findStat('total_kills_against_zoomed_sniper') / matchesPlayed).toFixed(2),
        totalDecoyKills: findStat('total_kills_decoy'),
        hoursPlayed: (findStat('total_time_played') / 3600).toFixed(1)
    };

    const getColor = (stat) => {
        if (comparisonResults[stat] === 'higher') return 'green';
        if (comparisonResults[stat] === 'lower') return 'red';
        return 'white';
    };

    container.innerHTML = `
        <h3 class="username">${playerInfo.personaname}</h3>
        <img src="${playerInfo.avatarfull}" alt="${playerInfo.personaname}">
        <p class="steam-id">Steam ID: ${playerInfo.steamid}</p>
        <p class="hours-played">Hours Played: ${derivedStats.hoursPlayed}</p>
        <br>
        <h3>Stats:</h3>
        <p style="color: ${getColor('kdr')}">K/D Ratio: ${derivedStats.kdr}</p>
        <p style="color: ${getColor('winRate')}">Win Rate: ${derivedStats.winRate}%</p>
        <p style="color: ${getColor('mvpPerMatch')}">MVPs per Match: ${derivedStats.mvpPerMatch}</p>
        <p style="color: ${getColor('headshotRatio')}">Headshot Ratio: ${derivedStats.headshotRatio}%</p>
        <p style="color: ${getColor('dpr')}">Damage per Round (DPR): ${derivedStats.dpr}</p>
        <p style="color: ${getColor('accuracy')}">Shot Accuracy: ${derivedStats.accuracy}%</p>
        <p style="color: ${getColor('bombsPlantedPerMatch')}">Bombs Planted per Match: ${derivedStats.bombsPlantedPerMatch}</p>
        <p style="color: ${getColor('bombsDefusedPerMatch')}">Bombs Defused per Match: ${derivedStats.bombsDefusedPerMatch}</p>
        <p style="color: ${getColor('hostagesRescuedPerMatch')}">Hostages Rescued per Match: ${derivedStats.hostagesRescuedPerMatch}</p>
        <p style="color: ${getColor('enemyWeaponKillsPerMatch')}">Enemy Weapon Kills per Match: ${derivedStats.enemyWeaponKillsPerMatch}</p>
        <p style="color: ${getColor('pistolRoundWinsPerMatch')}">Pistol Round Wins per Match: ${derivedStats.pistolRoundWinsPerMatch}</p>
        <p style="color: ${getColor('totalWeaponsDonatedPerMatch')}">Weapons Donated per Match: ${derivedStats.totalWeaponsDonatedPerMatch}</p>
        <p style="color: ${getColor('totalKillsBlindedPerMatch')}">Kills when Enemy Blinded per Match: ${derivedStats.totalKillsBlindedPerMatch}</p>
        <p style="color: ${getColor('totalKillsZoomedSnipersPerMatch')}">Kills against Zoomed Snipers per Match: ${derivedStats.totalKillsZoomedSnipersPerMatch}</p>
        <p>Total Decoy Kills: ${derivedStats.totalDecoyKills}</p>
        <br>
        <p class="total-score">Total Score: ${totalScore}</p>
    `;
}

function calculateScore(player1Stats, player2Stats) {
    const findStat = (stats, name) => stats.find(s => s.name === name)?.value || 0;
    const matchesPlayed1 = findStat(player1Stats, 'total_matches_played');
    const matchesPlayed2 = findStat(player2Stats, 'total_matches_played');

    const derivedStats1 = {
        kdr: findStat(player1Stats, 'total_kills') / findStat(player1Stats, 'total_deaths'),
        winRate: findStat(player1Stats, 'total_matches_won') / matchesPlayed1,
        mvpPerMatch: findStat(player1Stats, 'total_mvps') / matchesPlayed1,
        headshotRatio: findStat(player1Stats, 'total_kills_headshot') / findStat(player1Stats, 'total_kills'),
        dpr: findStat(player1Stats, 'total_damage_done') / findStat(player1Stats, 'total_rounds_played'),
        accuracy: findStat(player1Stats, 'total_shots_hit') / findStat(player1Stats, 'total_shots_fired'),
        bombsPlantedPerMatch: findStat(player1Stats, 'total_planted_bombs') / matchesPlayed1,
        bombsDefusedPerMatch: findStat(player1Stats, 'total_defused_bombs') / matchesPlayed1,
        hostagesRescuedPerMatch: findStat(player1Stats, 'total_rescued_hostages') / matchesPlayed1,
        enemyWeaponKillsPerMatch: findStat(player1Stats, 'total_kills_enemy_weapon') / matchesPlayed1,
        pistolRoundWinsPerMatch: findStat(player1Stats, 'total_wins_pistolround') / matchesPlayed1,
        totalWeaponsDonatedPerMatch: findStat(player1Stats, 'total_weapons_donated') / matchesPlayed1,
        totalKillsBlindedPerMatch: findStat(player1Stats, 'total_kills_enemy_blinded') / matchesPlayed1,
        totalKillsZoomedSnipersPerMatch: findStat(player1Stats, 'total_kills_against_zoomed_sniper') / matchesPlayed1,
        totalDecoyKills: findStat(player1Stats, 'total_kills_decoy')
    };

    const derivedStats2 = {
        kdr: findStat(player2Stats, 'total_kills') / findStat(player2Stats, 'total_deaths'),
        winRate: findStat(player2Stats, 'total_matches_won') / matchesPlayed2,
        mvpPerMatch: findStat(player2Stats, 'total_mvps') / matchesPlayed2,
        headshotRatio: findStat(player2Stats, 'total_kills_headshot') / findStat(player2Stats, 'total_kills'),
        dpr: findStat(player2Stats, 'total_damage_done') / findStat(player2Stats, 'total_rounds_played'),
        accuracy: findStat(player2Stats, 'total_shots_hit') / findStat(player2Stats, 'total_shots_fired'),
        bombsPlantedPerMatch: findStat(player2Stats, 'total_planted_bombs') / matchesPlayed2,
        bombsDefusedPerMatch: findStat(player2Stats, 'total_defused_bombs') / matchesPlayed2,
        hostagesRescuedPerMatch: findStat(player2Stats, 'total_rescued_hostages') / matchesPlayed2,
        enemyWeaponKillsPerMatch: findStat(player2Stats, 'total_kills_enemy_weapon') / matchesPlayed2,
        pistolRoundWinsPerMatch: findStat(player2Stats, 'total_wins_pistolround') / matchesPlayed2,
        totalWeaponsDonatedPerMatch: findStat(player2Stats, 'total_weapons_donated') / matchesPlayed2,
        totalKillsBlindedPerMatch: findStat(player2Stats, 'total_kills_enemy_blinded') / matchesPlayed2,
        totalKillsZoomedSnipersPerMatch: findStat(player2Stats, 'total_kills_against_zoomed_sniper') / matchesPlayed2,
        totalDecoyKills: findStat(player2Stats, 'total_kills_decoy')
    };

    let player1Score = 0;
    let player2Score = 0;

    const comparisonResults = {
        player1: {},
        player2: {}
    };

    const compareStat = (statName) => {
        const player1Value = derivedStats1[statName];
        const player2Value = derivedStats2[statName];

        if (player1Value > player2Value) {
            player1Score++;
            comparisonResults.player1[statName] = 'higher';
            comparisonResults.player2[statName] = 'lower';
        } else if (player2Value > player1Value) {
            player2Score++;
            comparisonResults.player1[statName] = 'lower';
            comparisonResults.player2[statName] = 'higher';
        } else {
            comparisonResults.player1[statName] = 'equal';
            comparisonResults.player2[statName] = 'equal';
        }
    };

    Object.keys(derivedStats1).forEach(compareStat);

    return {
        player1: comparisonResults.player1,
        player2: comparisonResults.player2,
        player1Score,
        player2Score
    };
}