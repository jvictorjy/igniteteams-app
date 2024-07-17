import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playerGetByGroup } from "./playerGetByGroup";
import { AppError } from "@utils/appError";

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
    try {
        const storagePlayers = await playerGetByGroup(group);

        const playerAlreadyExists = storagePlayers.filter(player => player.name === newPlayer.name);

        if (playerAlreadyExists.length  > 0) {
            throw new AppError('Essa pessoa já está adicionada em um time!');
        }

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, JSON.stringify([...storagePlayers, newPlayer]));
    } catch(error) {
        throw error;
    }
}