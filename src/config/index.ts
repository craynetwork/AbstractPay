class Config {
  private static instance: Config;
  private apiKey: string = '';
  private baseUrl: string = '';

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public setConfig(apiKey: string, baseUrl: string): void {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const sdkConfig = Config.getInstance();
