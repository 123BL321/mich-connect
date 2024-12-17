import { Pressable, StyleSheet, Platform, View, Text, TextInput, Button, Image, Switch } from 'react-native';
import { useIsFocused } from '@react-navigation/native'
/*import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
*/
import { useState, ReactElement, useEffect } from 'react';
import { useRouter } from 'expo-router';
import MapView, {Marker, Callout, CalloutSubview, PROVIDER_GOOGLE} from 'react-native-maps';
import { useSession } from '../../context/ctx';
const userMarkerImage = require('../../assets/images/pfp_marker.png');
const friendMarkerImage = require('../../assets/images/friend_pfp.png');
import * as Location from 'expo-location';

//const {width, height} = Dimensions.get('window');
//const ASPECT_RATIO = width / height;
//const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



type UserDetails = {
	id: number;
	name: string;
	email: string;
	role_permission: number;
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

type friendDetails = {
	id: number;
	name: string;
	email: string;
	role_permission: number;
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

const Home = () => {
	const { signOut, session } = useSession();
	//const { session } = useSession();
	const [data, setData] = useState<UserDetails[]>([]);
	const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [value, setAuthToken] = useState('');
    const [frienddata, setfriendData] = useState<friendDetails[]>([]);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState('');
	const [visible, setVisible] = useState(false);
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	const isFocused = useIsFocused()
	const [locationSharing, setIsLocationSharing] = useState(false);

	const [initialRegion, setInitialRegion] = useState({
    latitude: 42.290390,
    longitude: -83.713242,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  	});
	
	useEffect(() => {
		console.debug('useeffect');
		console.debug('test');
		getFriendLocations();

		if(isFocused){
            
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMessage('Location permission not granted');
        		return;
			}
		
		await Location.watchPositionAsync({
			accuracy: Location.Accuracy.High,
			distanceInterval: 50
		},
		location => {
			console.log('Location updated:', location.coords.latitude, location.coords.longitude);
			setLatitude(location.coords.latitude);
			setLongitude(location.coords.longitude);
			setIsLocationSharing(true);
			postLocation(location.coords.latitude, location.coords.longitude);
		});
		
		

    })();
  }}, [isFocused]);

    /*const postLocation = async (lat: number, lng: number) => {
        //authMe();
        console.debug("loginloaded2");
		try {
			const authKey = session;
            console.debug("authworked");
			const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/edit_location', {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${authKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					location: {
						type: 'Point',
						data: {
							lat: lat,
							lng: lng
						}
					}
        		})
			});
			if (response.ok) {
				console.debug("Location posted successfully");
				} else {
					console.debug("Failed to post location");
				}
				} catch (error) {
				setErrorMessage('An error occurred while posting the location. Please try again.');
				} finally {
				setLoading(false);
				}
	}; */

	const postLocation = async (lat: number, lng: number) => {
    console.debug("loginloaded2");
    try {
        const authKey = session;
        console.debug("authworked");

        // Check if the user has locationSharing enabled
        if (locationSharing == true) {
            const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/edit_location', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: {
                        type: 'point',
                        data: {
                            lat: lat,
                            lng: lng,
                        },
                    },
                    locationSharing: true, // Explicitly set location sharing
                }),
            });

            if (response.ok) {
                console.debug("Location posted successfully");
            } else {
                console.debug("Failed to post location");
            }
        } else {
            console.debug("Location sharing is disabled for this user");
        }
    } catch (error) {
        setErrorMessage('An error occurred while posting the location. Please try again.');
    } finally {
        setLoading(false);
    }
};


	  const getFriendLocations = async () => {
		try {
		const authKey = session;
		const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/homelogic', {
			method: 'GET',
			headers: {
			'Authorization': `Bearer ${authKey}`,
			'Content-Type': 'application/json',
			},
		});
		const json = await response.json();
		if (response.ok) {
			setData([json.result1]);
			setfriendData(json.friends1);
			console.debug("Friend locations received");
			console.debug({frienddata});
		} else {
			console.debug("Failed to fetch friend locations");
		}
		} catch (error) {
		setErrorMessage('An error occurred. Please try again.');
		}
  	};

	/*
	const getLocation = async () => {
        //authMe();
        console.debug("loginloaded2");
		try {
			const authKey = session;
            console.debug("authworked");
			const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/homelogic', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${authKey}`,
					'Content-Type': 'application/json',
				},
			});
			const json = await response.json();
            //setData(json.result1);
			setfriendData(json.friends1.user_friend_ids);
			if (response.ok) {
				console.debug("Location received");
				if (json.result1 && json.result1.location && json.result1.location.data) {
					setInitialRegion({
						latitude: json.result1.location.data.lat,
						longitude: json.result1.location.data.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					});
				}
			} else {
				console.debug("Failed to fetch location");
			}
		} catch (error) {
			setErrorMessage('An error occurred. Please try again.');
			//setVisible(true);
		} finally {
			setLoading(false);
			console.debug("Location fetched");
		}
	};
*/

	/*const updateDescription = async (newDescription: string) => {
        try {
            const authKey = session;
            const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/updateDescription', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: newDescription }),
            });
            if (response.ok) {
                console.debug("Description updated successfully");
                if (data) {
                    setData({ ...data, description: newDescription });
                }
            } else {
                console.debug("Failed to update description");
            }
        } catch (error) {
            setErrorMessage('An error occurred while updating the description. Please try again.');
        }
    };
	*/

//type ItemProps = {user_id: string};


const Item = (info: any): ReactElement => (
  <View >
	<Text>{info.item.name}</Text>
    <Text>{info.item.user_id}</Text>
  </View>
);

	if (loading) {
		return <Text style={styles.signOutText}>Loading...</Text>;
	}

	if (!initialRegion) {
		return <Text>Region data not available</Text>;
	}

	const loc = Location.hasServicesEnabledAsync();
	return (
		<View style={styles.container}>

			<MapView
				style={styles.map}
				initialRegion={initialRegion}>

			if (loc) (
				<Marker
					//key={index}
					coordinate={{ latitude: latitude ?? 0, longitude: longitude ?? 0 }}
					title='Bridget' // Assuming your data has a title field
					description='Duderstadt Center' // Assuming your data has a description field
				/>
			)

				{frienddata && frienddata.map((item2, index) => (
					<Marker
						key={index}
						coordinate={{ latitude: item2.location.data.lat, longitude: item2.location.data.lng }}
						title={item2.name} // Assuming your data has a title field
						description={item2.description} // Assuming your data has a description field
					/>
				))}
			</MapView>

		</View>
	);

}
	


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
  },
  signOutText: {
    padding: 5,
    textAlign: 'left',
    backgroundColor: 'white',
    elevation: 5,
    margin: 30,
    position: 'absolute',
	top: 0,
	zIndex: 1,
  },
});



export default Home;

					/*<FlatList
                    data={frienddata}
                    renderItem={Item}
                    //keyExtractor={item => item.id}
                    />
					<Text>Home</Text>
					*/
				/*{data.map((item, index) => (
					<Marker
						key={index}
						coordinate={{ latitude: item.location.data.lat, longitude: item.location.data.lng }}
						title={item.name} // Assuming your data has a title field
						description={item.description} // Assuming your data has a description field
						image={userMarkerImage} style={{ width: 50, height: 50 }}
					/>

				))}*/