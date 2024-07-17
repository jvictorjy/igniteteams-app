import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupCreate } from "./groupCreate";
import { groupsGetAll } from "./groupsGetAll";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";

export async function groupRemoveByName(groupDeleted: string) {
    try {
        const storageGroup = await groupsGetAll();

        const groups = storageGroup.filter(group => group !== groupDeleted);

        await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
        await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`);
    } catch(error) {
        throw error;
    }
}