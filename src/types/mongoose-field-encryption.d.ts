declare module "mongoose-field-encryption" {
  export function fieldEncryption(): void;

  export function encrypt(
    clearText: string,
    secret: string,
    saltGenerator: () => string
  ): string;

  export function decrypt(encryptedHex: string, secret: string): string;
}
