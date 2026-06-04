export default class Storage {
    static getData() {
        const defaultData = {
            todo: ['Изучить документацию', 'Написать план'],
            'in-progress': ['Разработать DnD'],
            done: ['Сделать дизайн']
        };
        const saved = localStorage.getItem('trello-board');
        if (!saved) {
            localStorage.setItem('trello-board', JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(saved);
    }

    static saveData(data) {
        localStorage.setItem('trello-board', JSON.stringify(data));
    }
}