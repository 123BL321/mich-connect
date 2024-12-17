import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "../../context/ctx";

interface EventType {
    id: number;
    created_at: string;
    user_id: number;
    time: string;
    event_name: string;
    details: string;
    event_friend_ids: string[];
    location?: {
        data: {
            lat: number;
            lng: number;
        };
        type: string;
    };
    name: string;
}


const History = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const { session } = useSession(); // Get session token from context
    const [newEvent, setNewEvent] = useState({
        name: "",
        time: "",
        description: "",
        friends: "",
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const authKey = session;
            const response = await fetch(
                "https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/events_history", // Replace with your correct endpoint
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }
            const data: EventType[] = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const renderEvent = ({ item }: { item: EventType }) => (
        <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.event_name}</Text>
            <Text>Creator: {item.name}</Text>
            <Text>Time: {new Date(item.time).toLocaleString()}</Text>
            <Text>Description: {item.details}</Text>
            {item.location && item.location.data ? (
                <Text>Location: Lat {item.location.data.lat}, Lng {item.location.data.lng}</Text>
            ) : (
                <Text>Location: Not available</Text>
            )}
            <Text>Shared with: Bridget Lin</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEvent}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    list: { padding: 16 },
    eventCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    eventTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#007bff",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    input: {
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonText: { color: "white", fontWeight: "bold" },
});

export default History;
