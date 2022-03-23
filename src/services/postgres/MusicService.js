const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exception/NotFoundError");
const { mapDBToAlbumId, mapDBToSong, mapDBToSongDetail } = require("../../utils");

class MusicService {
    constructor() {
        this._pool = new Pool();
    }

    //music service

    async addAlbum({ name, year }) {
        const id = "album-" + nanoid(16);
        const query = {
            text: 'INSERT INTO albums VALUES($1,$2,$3) RETURNING id',
            values: [id, name, year]
        };

        const result = await this._pool.query(query);
        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        return result.rows.map(mapDBToAlbumId)[0];
    }

    async editAlbumById(id, { name, year }) {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 RETURNING $3',
            values: [name, year, id]
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Gagal Memperbaharui Album');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Gagal Menghapus Album');
        }
    }

    // songs service

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = "song-" + nanoid(16);
        const query = {
            text: 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId]
        };
        const result = await this._pool.query(query);
        return result.rows[0].id;
    }

    async getSongs() {
        const result = await this._pool.query('SELECT * FROM songs');
        return result.rows.map(mapDBToSong);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        return result.rows.map(mapDBToSongDetail)[0];
    }

    async editSongById(id, {
        title,
        year,
        performer,
        genre,
        duration,
    }) {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
            values: [title, year, performer, genre, duration, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui data lagu. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = MusicService;