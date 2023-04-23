import {Person} from '../domain/entities';
import {convertBirthdayStringToDate} from '../utils/date-manipulation-functions';
const fetch = require('node-fetch')

export class GetPersonDataFromAPI {

  async execute(uniqueId: string): Promise<Person> {

    uniqueId = uniqueId.replace(/\D/g, "");

    const raw = await fetch(`${process.env.API_CPF_CNPJ}/2/${uniqueId}`);
    const response = await raw.json();

    if (!response.status) throw new Error('Person data not found in external API');

    const birthday = convertBirthdayStringToDate(response.nascimento);

    return new Person({
      name: response.nome,
      uniqueId: response.cpf.replace(/\D/g, ""),
      birthday: birthday.getTime(),
      gender: response.genero,
      mother: response.mae,
      country: 'br',
    });
  }

}
