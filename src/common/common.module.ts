import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/Axios.adapter';
import { FetchAdapter } from './adapters/Fetch.adapter';

@Module({
  providers: [AxiosAdapter, FetchAdapter], // Registering the adapters as providers
  exports: [AxiosAdapter, FetchAdapter], // Exporting the adapters for use in other modules
})
export class CommonModule {}
