import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
export interface CepReponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
}

@Injectable()
export class CepService {
  constructor(private readonly httpService: HttpService) {}

  async getCep(cep: string) {
    try {
      const { data } = await this.getCepFromViaCep(cep);
      const response: CepReponse = {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        localidade: data.localidade,
        estado: data.uf,
      };

      return response;
    } catch (error) {
      console.log('Error to get CEP');
    }

    // try another API
    try {
      const { data } = await this.getCepFromOpenCep(cep);
      const response: CepReponse = {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        localidade: data.localidade,
        estado: data.uf,
      };

      return response;
    } catch (error) {
      console.log('Error to get CEP');
    }
  }

  private async getCepFromViaCep(
    cep: string,
  ): Promise<AxiosResponse<ViaCepResponse>> {
    return await this.httpService.axiosRef.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cep}/json/`,
    );
  }

  private async getCepFromOpenCep(
    cep: string,
  ): Promise<AxiosResponse<OpenCepResponse>> {
    return await this.httpService.axiosRef.get<OpenCepResponse>(
      `https://opencep.com/v1/${cep}`,
    );
  }
}

export interface OpenCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; //cidade
  uf: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; //cidade
  uf: string; //ex RJ
}
