class Config {
  private static instance: Config;
  private apiKey: string = '';
  private baseUrl: string = '';
  private testnet: boolean = false;

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public setConfig(apiKey: string, baseUrl: string, testnet: boolean = false): void {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.testnet = testnet;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
  public isTestnet():boolean{
    return this.testnet
  }
}

export const sdkConfig = Config.getInstance();
