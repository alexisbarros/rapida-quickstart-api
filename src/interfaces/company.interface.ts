export interface ICompanyFromAPI {
  uniqueId: string,
  corporateName: string,
  tradeName: string,
  birthday: Date,
  responsible: string,
  businessActivityCode: IBusinessActivityCode[],
  email: string,
}

export interface IBusinessActivityCode {
  divisao: string,
  grupo: string,
  classe: string,
  subclasse: string,
  fiscal: string,
  descricao: string,
}
