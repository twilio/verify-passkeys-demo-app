import axios from "axios";
import Config from "../model/Config";
import RegistrationForm from "../model/RegistrationForm";


export abstract class ApiService {
    private static axios = axios.create({
        baseURL: "<backend-url-here>",
        headers: {
            "Content-Type": "Application/json"
        }
    });


    static async getConfig(): Promise<Config | null> {
        const url = "config";
        try {
            const response = await this.axios.get<Config>(url);
            if (response.status === 200) {
                console.log('[Client] GET app config response');
                console.log(response.data);
                return response.data;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async postConfig(config: Config): Promise<Config | null> {
        const url = "config";
        try {
            const response = await this.axios.post<Config>(url, config);
            if (response.status === 200) {
                console.log('[Client] POST app config response');
                console.log(response.data);
                return response.data;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async createFactor(registrationForm: RegistrationForm): Promise<any | null> {
        const url = "factors/create";
        try {
            const response = await this.axios.post<any>(url, registrationForm);
            if (response.status === 200) {
                console.log('[Client] POST Passkeys factor response');
                console.log(response.data);
                return response.data;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async verifyFactor(verifyBody: any): Promise<any | null> {
        const url = "factors/verify";
        try {
            const response = await this.axios.post<any>(url, verifyBody);
            if (response.status === 200) {
                console.log('[Client] POST Passkeys factor verify response');
                console.log(response.data);
                return response.data;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}


