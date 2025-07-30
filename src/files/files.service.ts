import { FileData } from '@/common/interfaces/file-data';
import { EnvService } from '@/env/env.service';
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FilesService {
  supabase: SupabaseClient<any, 'public', any>;

  constructor(private envService: EnvService) {
    this.supabase = createClient(
      envService.get('SUPABASE_URL'),
      envService.get('SUPABASE_KEY'),
    );
  }

  async uploadFile(file: FileData): Promise<string> {
    try {
      const result = await this.supabase.storage
        .from('imoveis_photos')
        .upload(file.filename, file.buffer, {
          contentType: file.mimetype,
        });

      console.log('supabaseresult', result);
      return result?.data?.fullPath;
    } catch (error) {
      console.log('supabaseerror', error);
    }
  }

  deleteFile(file: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getFile(file: string): Promise<Blob> {
    try {
      const result = await this.supabase.storage
        .from('imoveis_photos')
        .download(file);

      return result.data;
    }
    catch (error) {

    }
  }

  getFileUrl(file: string): string {
    throw new Error('Method not implemented.');
  }
}
