import './styles.css';
import Board from './js/Board';

document.addEventListener('DOMContentLoaded', () => {
    const board = new Board();
    board.init();
});