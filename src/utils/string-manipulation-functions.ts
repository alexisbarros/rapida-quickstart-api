export function hideEmailString(email: string) {
  let hiddenEmail = "";
  for (let i = 0; i < email.length; i++) {
    if (i > 2 && i < email.indexOf("@")) hiddenEmail += "*";
    else hiddenEmail += email[i];
  }
  return hiddenEmail;
}

export function getOnlyNumberFromString(term?: string) : string {
  return (term ?? '').replace(/\D/g, "");
}
