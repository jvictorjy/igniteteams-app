import { Header } from "@components/Header";
import { Container, Form } from "./styles";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Alert, FlatList, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";
import { HeaderList, NumberOfPlayers } from "@components/Filter/styles";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppError } from "@utils/appError";
import { playerAddByGroup } from "@storage/players/playerAddByGroup";
import { playerGetByGroup } from "@storage/players/playerGetByGroup";
import { playerGetByGroupAndTeam } from "@storage/players/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/players/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/players/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
    group: string;
}

export function Players() {
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayernameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Novo Jogador', 'Informe o nome da pessoa para adicionar')
        }

        const newPLayer = {
            name: newPlayerName,
            team
        }

        try {
            await playerAddByGroup(newPLayer, group);

            newPlayernameInputRef.current?.blur();

            setNewPlayerName('');
            fetchPlayersByTeam();
        } catch(error) {
            if (error instanceof AppError) {
                Alert.alert('Novo Jogador', error.message);
            } else {
                console.log(error);
                Alert.alert('Novo Jogador', 'Não foi possível adicionar um novo jogador');
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);

            const playersByTeam = await playerGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        } catch(error) {
            console.log(error);
            Alert.alert('Jogadores', 'Não foi possível listar os jogadores do time selecionado');
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePlayerRemove(playername: string) {
        try {
            await playerRemoveByGroup(playername, group);
            fetchPlayersByTeam();
        } catch(error) {
            console.log(error);
            Alert.alert('Remover Jogador', 'Não foi possível remover o jogador selecionado');
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');
        } catch(error) {
            console.log(error);
            Alert.alert('Remover Grupo', 'Não foi possível remover o grupo');
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            'Remover', 
            'Deseja remover a turma?',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => groupRemove() }
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam()
    }, [team]);

    return (
        <Container>
            <Header showBackButton />

            <Highlight 
                title={group}
                subTitle="adicione a galera e separe os times"
            />

            <Form>                
                <Input
                    inputRef={newPlayernameInputRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder="Nome da pessoa" 
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />

                <ButtonIcon 
                    icon="add" 
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter 
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>


            {
                isLoading ?                 
                <Loading /> :
                <FlatList 
                    data={players}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard 
                            name={item.name} 
                            onRemove={() => handlePlayerRemove(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty 
                            message="Não há pessoas nesse time" 
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { paddingBottom: 100 },
                        players.length === 0 && { flex: 1}
                    ]}
                />
            }

            <Button 
                title="Remover turma"
                type="SECUNDARY"
                onPress={handleGroupRemove}
            />
            
        </Container>
    )
}