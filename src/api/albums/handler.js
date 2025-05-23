const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(AlbumsService, SongsService, AlbumsValidator) {
    // console.log("AlbumsHandler constructor called with:", {
    //   AlbumsService,
    //   SongsService,
    //   AlbumsValidator,
    // });
    this._albumsService = AlbumsService;
    this._songsService = SongsService;
    this._albumsValidator = AlbumsValidator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      console.log("postAlbumHandler payload:", request.payload);

      // Validasi payload
      this._albumsValidator.validateAlbumsPayload(request.payload);

      // Tambahkan album menggunakan service
      const albumId = await this._albumsService.addAlbum(request.payload); // Pastikan nama method service konsisten

      // Response berhasil
      const response = h.response({
        status: "success",
        message: "Album berhasil ditambahkan",
        data: { albumId },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error("Error in postAlbumHandler:", error);
      throw error;
    }
  }

  async getAlbumsHandler() {
    const albums = await this._albumsService.getAlbums();

    return {
      status: "success",
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._albumsService.getAlbumById(id);
    album.songs = await this._songsService.getSongByAlbumId(id);
    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._albumsValidator.validateAlbumsPayload(request.payload);
    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return h.response({
      status: "success",
      message: "Album berhasil diperbarui",
    });
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    const response = h.response({
      status: "success",
      message: "Album berhasil dihapus",
    });

    return response;
  }
}

module.exports = AlbumsHandler;
