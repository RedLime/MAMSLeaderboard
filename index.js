const ALL_RECORDS = [];
$(document).ready(() => {

    const init = (rawText) => {
        ALL_RECORDS.splice(0, ALL_RECORDS.length);
        
        const data = rawText.split("\n");

        for (const rawRecord of data) {
            const record = rawRecord.split('|');
            ALL_RECORDS.push({
                nickname: record[0],
                time: +record[1],
                type: record[2],
                video_url: record[3],
                use_book: record[4] == 'true'
            });
        }
    }

    fetch('./records.txt')
        .then(response => response.text())
        .then(rawText => {
            console.log(rawText);
            init(rawText);
            updateLeaderboard(CURRENT_TYPE, CURRENT_RECIPE);
        });
})

const TEMPLATE = `<tr>`+
    `<td class="text-left">#{RANK}</td>`+
    `<td class="text-center">{NAME}</td>`+
    `<td class="text-center">{TIME}</td>`+
    `<td class="text-right"><a class="waves-effect waves-light btn" href="{VIDEO}" target="_blank">Video</a></td>`+
    `</tr>`;

let CURRENT_TYPE = 'room_1', CURRENT_RECIPE = true;

const changeType = (type) => {
    CURRENT_TYPE = type;
    updateLeaderboard(CURRENT_TYPE, CURRENT_RECIPE);
}

const changeRecipe = (recipe) => {
    CURRENT_RECIPE = recipe;
    $('#toggle-recipe-book').text(recipe ? 'With Recipe Book' : 'Without Recipe Book');
    updateLeaderboard(CURRENT_TYPE, CURRENT_RECIPE);
}

const updateLeaderboard = (type, recipe) => {
    const records = [];
    for (const record of ALL_RECORDS) {
        if (type != record.type || recipe != record.use_book) continue;

        const oldRecord = records.find(rec => rec.nickname == record.nickname);
        if (oldRecord && oldRecord.time <= record.time) {
            records.splice(records.findIndex(rec => rec.nickname == record.nickname), 1);
            continue;
        }

        records.push(record);
    }

    let rank = 1;
    $('#record-list').html(records.sort((a, b) => a.time - b.time).map(record => TEMPLATE.replace('{RANK}', rank++).replace('{NAME}', record.nickname).replace('{TIME}', record.time).replace('{VIDEO}', record.video_url)))
}
