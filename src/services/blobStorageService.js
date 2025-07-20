const { BlobServiceClient } = require('@azure/storage-blob');

class BlobStorageService {
  constructor() {
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = 'slike';
    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
  }

  async uploadFile(fileStream, fileName, contentType = 'image/jpeg') {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

    const uploadOptions = {
      blobHTTPHeaders: { blobContentType: contentType },
    };

    await blockBlobClient.uploadStream(fileStream, undefined, undefined, uploadOptions);

    return blockBlobClient.url; // vraća URL uploadovanog fajla
  }
}

module.exports = BlobStorageService;
