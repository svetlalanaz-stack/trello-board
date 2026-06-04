import Card from './Card';

export default class Column {
    constructor(id, title, cardsText) {
        this.id = id;
        this.title = title;
        this.cardsText = cardsText;
        this.element = null;
        this.cardsContainer = null;
        this.cards = [];
        this.onCardsChange = null;
    }

    render(parent) {
        this.element = document.createElement('div');
        this.element.className = 'column';
        this.element.dataset.column = this.id;

        const h2 = document.createElement('h2');
        h2.textContent = this.title;
        this.element.append(h2);

        this.cardsContainer = document.createElement('div');
        this.cardsContainer.className = 'cards-container';
        this.element.append(this.cardsContainer);

        this.cardsText.forEach(text => {
            const card = new Card(text, this.id);
            card.render(this.cardsContainer);
            card.onDelete = () => this.removeCard(card);
            card.onDragStart = (e) => this.handleCardDragStart(e, card);
            card.onDragEnd = () => this.handleCardDragEnd();
            this.cards.push(card);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'add-card-btn';
        addBtn.textContent = '+ Добавить карточку';
        addBtn.addEventListener('click', () => this.showAddForm());
        this.element.append(addBtn);

        parent.append(this.element);
        this.initDropZone();
    }

    showAddForm() {
        const form = document.createElement('div');
        form.className = 'card-input-form';

        const textarea = document.createElement('textarea');
        textarea.className = 'card-input';
        textarea.rows = 2;
        textarea.placeholder = 'Введите текст карточки...';

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Добавить';
        saveBtn.className = 'save-btn';
        saveBtn.addEventListener('click', () => {
            const val = textarea.value.trim();
            if (val) {
                this.addCard(val);
                form.remove();
            }
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Отмена';
        cancelBtn.className = 'cancel-btn';
        cancelBtn.addEventListener('click', () => form.remove());

        actions.append(saveBtn, cancelBtn);
        form.append(textarea, actions);

        const addBtn = this.element.querySelector('.add-card-btn');
        addBtn.before(form);
    }

    addCard(text) {
        const card = new Card(text, this.id);
        card.render(this.cardsContainer);
        card.onDelete = () => this.removeCard(card);
        card.onDragStart = (e) => this.handleCardDragStart(e, card);
        card.onDragEnd = () => this.handleCardDragEnd();
        this.cards.push(card);
        this.cardsText.push(text);
        if (this.onCardsChange) this.onCardsChange();
    }

    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            this.cards.splice(index, 1);
            this.cardsText.splice(index, 1);
            card.element.remove();
            if (this.onCardsChange) this.onCardsChange();
        }
    }

    getCardsText() {
        return this.cards.map(card => card.text);
    }

    initDropZone() {
        this.cardsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingCard = document.querySelector('.card.dragging');
            if (!draggingCard) return;

            const afterElement = this.getDragAfterElement(this.cardsContainer, e.clientY);
            if (afterElement) {
                afterElement.before(draggingCard);
            } else {
                this.cardsContainer.append(draggingCard);
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    handleCardDragStart(e, card) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            columnId: this.id,
            cardText: card.text
        }));
        e.dataTransfer.effectAllowed = 'move';
        card.element.classList.add('dragging');
    }

    handleCardDragEnd() {
        const dragging = document.querySelector('.card.dragging');
        if (dragging) {
            dragging.classList.remove('dragging');
            const newOrder = [...this.cardsContainer.querySelectorAll('.card')].map(el => el.textContent);
            this.cardsText = newOrder;
            this.cards = newOrder.map(text => {
                const card = new Card(text, this.id);
                card.onDelete = () => this.removeCard(card);
                card.onDragStart = (e) => this.handleCardDragStart(e, card);
                card.onDragEnd = () => this.handleCardDragEnd();
                return card;
            });
            if (this.onCardsChange) this.onCardsChange();
        }
    }
}