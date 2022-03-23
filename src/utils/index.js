const mapDBToAlbumId = ({
    id,
    name,
    year
}) => ({
    id,
    name,
    year
});

const mapDBToSong = ({
    id,
    title,
    performer,
}) => ({
    id,
    title,
    performer,
});
const mapDBToSongDetail = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
});

module.exports = { mapDBToAlbumId, mapDBToSong, mapDBToSongDetail };