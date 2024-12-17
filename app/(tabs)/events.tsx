import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "../../context/ctx";


interface EventType {
    id: number;
    name: string;
    time: string;
    details: string;
    user_id: number;
    location?: {
        data: {
            lat: number;
            lng: number;
        };
        type: string;
    };
    created_at: number;
    event_name: string;
    event_friend_ids: string[];  
}

const Events = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const { session } = useSession();
    const [newEvent, setNewEvent] = useState({
        event_name: "",
        name: "",
        time: "", // Set to a number
        details: "",
        event_friend_ids: [],
    });


    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const authKey = session;
            const response = await fetch(
                "https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/events_history/{events_history_id}", // Replace with your correct endpoint
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
            //console.error("Error fetching events:", error);
        }
    };

    const handleCreateEvent = async () => {
        try {
            const authKey = session;
            const response = await fetch(
                "https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/events_history",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...newEvent,
                    }),
                }
            );
            if (!response.ok) {
                //throw new Error("Failed to create event");
            }
            const createdEvent: EventType = await response.json();
            setEvents((prevEvents) => [...prevEvents, createdEvent]);
            setNewEvent({ event_name: "", name: "", time: "", details: "", event_friend_ids: [] });
            setModalVisible(false);
        } catch (error) {
            //console.error("Error creating event:", error);
        }
    };

    const renderEvent = ({ item }: { item: EventType }) => (
        <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.event_name}</Text>
            <Text>Creator: {item.name}</Text>
            <Text>Date & Time: {new Date(item.time).toLocaleString()}</Text>
            <Text>Description: {item.details}</Text>
            {item.location && item.location.data ? (
                <Text>Location: Lat {item.location.data.lat}, Lng {item.location.data.lng}</Text>
            ) : (
                <Text>Location: Not available</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {events.length === 0 ? (
                <Text style={styles.noEventsText}>No events found. Create a new one!</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.user_id.toString()}
                    renderItem={renderEvent}
                    contentContainerStyle={styles.list}
                />
            )}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Event</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Event Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter event name"
                                value={newEvent.event_name}
                                onChangeText={(text) =>
                                    setNewEvent({ ...newEvent, event_name: text })
                                }
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Date & Time</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter date & time (Dec 6, 2024 6:00 PM)"
                                value={newEvent.time}
                                onChangeText={(text) =>
                                    setNewEvent({ ...newEvent, time: text })
                                }
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Details</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter event details"
                                value={newEvent.details}
                                onChangeText={(text) =>
                                    setNewEvent({ ...newEvent, details: text })
                                }
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Tag Your Friends</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter friend IDs"
                                value={newEvent.event_friend_ids.join(", ")}
                                onChangeText={(text) =>
                                    setNewEvent({
                                        ...newEvent,
                                        event_friend_ids: text.split(",").map((id) => id.trim()),
                                    })
                                }
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleCreateEvent}
                        >
                            <Text style={styles.buttonText}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    noEventsText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#6c757d" },
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
        bottom: 120, // Bring the button higher
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
        paddingTop: 90,
    },
    modalContent: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
    },
    modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
    inputContainer: {
        width: "100%",
        marginBottom: 16,
    },
    inputLabel: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#333" },
    input: {
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        fontSize: 16,

    },
    button: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        width: "100%",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#6c757d",
    },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default Events;
