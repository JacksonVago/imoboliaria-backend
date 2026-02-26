import { EnvService } from '@/env/env.service';
import { BlobServiceClient } from "@azure/storage-blob";
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesAzureService {
    constructor(
        private envService: EnvService,
    ) { }

    async uploadFile(folder: string, file: any): Promise<string> {
        try {
            const blobServiceClient = BlobServiceClient.fromConnectionString(this.envService.get('AZURE_CONTAINER_CONNECTSTRING').toString());
            const containerClient = blobServiceClient.getContainerClient(this.envService.get('AZURE_CONTAINER_NAME').toString());
            //const blobName = this.envService.get('AZURE_BLOB_CONTAINER').toString() + folder;
            const blobName = folder;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const uploadBlobResponse = blockBlobClient.upload(file.buffer, file.buffer.byteLength);
            return blobName;
        } catch (error) {
            console.log('Azure Upload Error:', error);
            return null;
        }
    }

    async deleteFile(blobName: string): Promise<void> {
        try {
            const blobServiceClient = BlobServiceClient.fromConnectionString(this.envService.get('AZURE_CONTAINER_CONNECTSTRING').toString());
            const containerClient = blobServiceClient.getContainerClient(this.envService.get('AZURE_CONTAINER_NAME').toString());
            console.log('Deleting blob:', this.envService.get('AZURE_BLOB_CONTAINER').toString() + blobName);
            const deleteBlobResponse = await containerClient.deleteBlob(blobName);
            console.log('Blob deleted successfully:', deleteBlobResponse);
        } catch (error) {
            console.log('Azure Delete Error:', error);
        }
    }
}
