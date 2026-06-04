import Storage from './Storage';
import Column from './Column';

export default class Board {
    constructor() {
        this.columns = [];
        this.data = Storage.getData();
    }

    init() {
        const boardEl = document.getElementById('board');
        if (!boardEl) return;

        const columnsData = [
            { id: 'todo', title: '📋 Нужно сделать' },
            { id: 'in-progress', title: '🔄 В процессе' },
            { id: 'done', title: '✅ Готово' }
        ];

        columnsData.forEach(col => {
            const column = new Column(col.id, col.title, this.data[col.id] || []);
            column.render(boardEl);
            column.onCardsChange = () => this.saveToStorage();
            this.columns.push(column);
        });
    }

    saveToStorage() {
        const newData = {};
        this.columns.forEach(col => {
            newData[col.id] = col.getCardsText();
        });
        Storage.saveData(newData);
    }
}