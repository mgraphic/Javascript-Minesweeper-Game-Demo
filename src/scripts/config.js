export class Config {
    /**
     * Default width and height of grid
     */
    static DEFAULT_GRID_COUNT_HORIZONTAL = 10;

    static DEFAULT_GRID_COUNT_VERTICAL = 10;

    /**
     * Default bomb count
     */
    static DEFAULT_BOMB_COUNT = 20;

    /**
     * Square size of the game peice tile (in pixels)
     * Update this if the css changes
     */
    static TILE_SIZE = 40;

    /**
     * Emoji's for the flag and bomb elements
     * Used in HTML entity format here
     */
    // static FLAG_EMOJI='🚩'
    // static FLAG_EMOJI = '&#x1F6A9;';
    static FLAG_EMOJI = '&#128681;';

    // static BOMB_EMOJI='💣'
    // static BOMB_EMOJI = '&#x1F4A3;';
    static BOMB_EMOJI = '&#128163';

    /**
     * Emoji's of the faces on the start button
     */
    static START_EMOJI_GOOD = '&#128578;';
    static START_EMOJI_ACTIVE = '&#128562;';
    static START_EMOJI_WIN = '&#128526;';
    static START_EMOJI_LOSE = '&#128565;';
}
