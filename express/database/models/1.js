const fs = require('fs');
const mongoose = require('mongoose');
const History = require('./History'); // 替换为你的模型路径


function generateTable(schema) {
    let table = `| Field | Type | Required | Description |\n|-------|------|----------|-------------|\n`;
    Object.keys(schema.paths).forEach((field) => {
        const path = schema.paths[field];
        const type = path.instance;
        const required = path.options.required || false;
        const description = path.options.description || '';
        table += `| ${field} | ${type} | ${required} | ${description} |\n`;
    });
    return table;
}

const table = generateTable(History.schema);
fs.writeFileSync('HistorySchemaTable.md', table, 'utf8');
console.log('Table generated and saved as HistorySchemaTable.md');
