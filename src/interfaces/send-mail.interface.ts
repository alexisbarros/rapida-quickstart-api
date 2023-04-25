export interface ISendMail {
  execute(mailTo: string, body: string): Promise<void>
}
