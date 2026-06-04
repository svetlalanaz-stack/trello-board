export default class Card {
    constructor(text, columnId) {
        this.text = text;
        this.columnId = columnId;
        this.element = null;
        this.onDelete = null;
        this.onDragStart = null;
        this.onDragEnd = null;
    }

    render(container) {
        this.element = document.createElement('div');
        this.element.className = 'card';
        this.element.textContent = this.text;
        this.element.draggable = true;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onDelete) this.onDelete();
        });
        this.element.append(deleteBtn);

        this.element.addEventListener('dragstart', (e) => {
            if (this.onDragStart) this.onDragStart(e);
        });
        this.element.addEventListener('dragend', () => {
            if (this.onDragEnd) this.onDragEnd();
        });

        container.append(this.element);
    }
}