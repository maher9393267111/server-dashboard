const { uploadFile } = require("./aws");

class AudioService {
  constructor(bucketName, audioModel) {
    this.bucketName = bucketName;
    this.audioModel = audioModel;
  }

  async uploadFile(filename, folder, file, contentType) {
    const link = await uploadFile(
      filename,
      this.bucketName,
      folder,
      file,
      contentType
    );
    console.log("Link from service:", link);
    return link;
  }

  async storeAudioInfo(
    title,
    description,
    artist,
    date,
    category_id,
    audio_url,
    thumbnail_url,
    duration
  ) {
    try {
      const audioId = await this.audioModel.storeAudio(
        title,
        description,
        artist,
        date,
        category_id,
        audio_url,
        thumbnail_url,
        duration
      );
      return audioId;
    } catch (error) {
      throw error;
    }
  }

  async getAllAudio() {
    try {
      const audios = await this.audioModel.getAllAudio();
      return audios;
    } catch (error) {
      throw error;
    }
  }

  async getAudioById(audioId) {
    try {
      const audio = await this.audioModel.getAudioById(audioId);
      return audio;
    } catch (error) {
      throw error;
    }
  }

  async uploadAudio(filename, file, contentType) {
    const folder = "audio";
    return this.uploadFile(filename, folder, file, contentType);
  }

  async uploadThumbnail(filename, file, contentType) {
    const folder = "thumbs";
    return this.uploadFile(filename, folder, file, contentType);
  }

  async getAggregate() {
    const totalAudioCount = await this.audioModel.getTotalAudioCount();
    console.log("Total Audio Count:", totalAudioCount);

    const audioCountByCategory =
      await this.audioModel.getAudioCountByCategory();
    console.log("Audio Count by Category:", audioCountByCategory);
  }
}

module.exports = AudioService;
