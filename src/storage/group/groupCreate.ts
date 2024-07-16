import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/appError";
import { Alert } from "react-native";

export async function groupCreate(newGroup: string) {
    try {
        if (newGroup.trim().length === 0) {
            return Alert.alert('Novo grupo', 'Informe o nome da turma');
        }

        const storadGroups = await groupsGetAll();

        const groupAlreasyExists = storadGroups.includes(newGroup);

        if (groupAlreasyExists) {
            throw new AppError('Já existe um grupo cadastrado com esse nome.');  
        }

        await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify([...storadGroups, newGroup]))
    } catch (error) {
        throw error;
    }
}