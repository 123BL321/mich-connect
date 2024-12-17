import { TouchableOpacity, Image, ScrollView, Text, View, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from 'react';
import InputField from "@/components/InputField";
import { useSession } from '../../context/ctx';
import localImage from '../../assets/images/pfp.jpg';
import * as Location from 'expo-location';
import { Link, router } from "expo-router";

type UserDetails = {
	id: number;
  name: string;
	email: string;
  description: string;
  location: {
      type: string,
      data: {
      lng: number,
      lat: number  
      }
  }
  locationSharing: boolean;

};

const Profile = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const { signOut, session } = useSession();
  const [isLocationSharing, setIsLocationSharing] = useState<boolean>(false);

  useEffect(() => {
	
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setIsLocationSharing(data.location?.type === 'sharing');
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const toggleLocationSharing = async () => {
    const newSharingStatus = !isLocationSharing;

    // Update the state to reflect the new location sharing status
    setIsLocationSharing(newSharingStatus);

    if (newSharingStatus) {
      // If the user wants to enable location sharing, request the location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied",
        "Location permission is required to share your location. Please enable location permissions in your device settings.");
        setIsLocationSharing(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      try {
        // Send the user's location to the backend
        const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/edit_location', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: {
              type: 'point',
              data: {
                lng: location.coords.longitude,
                lat: location.coords.latitude,
              },
            },
            locationSharing: true,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Error updating location sharing:', response.statusText);
          Alert.alert("Error", "Failed to share your location. Please try again.");
        }
      } catch (error) {
        console.error('Error updating location sharing:', error);
        Alert.alert("Error", "Failed to share your location. Please try again.");
      }
    } else {
      // If the user wants to disable location sharing, send the update to the backend
      
      try {
        const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/edit_location', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationSharing: false,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Error updating location sharing:', response.statusText);
          Alert.alert("Error", "Failed to disable location sharing. Please try again.");
        }
      } catch (error) {
        console.error('Error updating location sharing:', error);
        Alert.alert("Error", "Failed to disable location sharing. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
        await signOut();
        router.replace('../(auth)/log-in');
        
  };
  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-JakartaBold my-5">My profile</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={
                localImage
            }
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className="rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              label="Name"
              value={user.name}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />


            <InputField
              label="Email"
              value={user.email}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <View className="flex flex-row items-center justify-between w-full mt-5">
              <Text className="text-base font-JakartaRegular">Share Location</Text>
              <Switch
                value={isLocationSharing}
                onValueChange={toggleLocationSharing}
              />
            </View>

            <TouchableOpacity onPress={handleSignOut} style={{ marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

