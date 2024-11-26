import { Pressable, StyleSheet, Platform, View, Text, TextInput, Button, FlatList} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, ReactElement, useEffect } from 'react';
import { useRouter } from 'expo-router';
import MapView, {Marker, Callout, CalloutSubview} from 'react-native-maps';

//const {width, height} = Dimensions.get('window');
//const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
//const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;



type UserDetails = {
	id: number;
	first_name: string;
	last_name: string;
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
};

type friendDetails = {
    user_id: number;
    _user_locations: {
        id: number,
        created_at: number,
        name: string,
        email: string,
        status: boolean,
        description: string,
        location: {
        type: string,
        data: {
        lng: number,
        lat: number
        }
        }
        }
};

const Home = () => {
    const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [value, setAuthToken] = useState('');
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState<UserDetails[]>([]);
    const [frienddata, setfriendData] = useState<friendDetails[]>([]);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState('');
	const [visible, setVisible] = useState(false);
	


    useEffect(() => {
        console.debug("useEffect");
		getLocation();
	}, []);

    const getLocation = async () => {
        //authMe();
        console.debug("loginloaded2");
		try {
			const authKey = await getValueFor();
            console.debug("authworked");
			const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/homelogic', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${authKey}`,
					'Content-Type': 'application/json',
				},
			});
			const json = await response.json();
            setData(json.result1);
			setfriendData(json.friends1.user_friend_ids);
			if (response.ok) {
				console.debug("Location received");
			} else {
				//setErrorMessage(json.message || 'Login failed');
				//setVisible(true);
			}
		} catch (error) {
			//setErrorMessage('An error occurred. Please try again.');
			//setVisible(true);
		} finally {
			setLoading(false);
			console.debug("loginloaded");
		}
	};

    async function getValueFor() {
	try {
		if (Platform.OS === 'web') {
			const result = await AsyncStorage.getItem('authTokenKey')
			if (result) {
				return result;
			} else {
                router.replace('../../')
            }
		} else {
			const result = await SecureStore.getItemAsync('authTokenKey');
			if (result) {
                console.debug("authtokenretrieved");
				return result;
			} else {
                router.replace('../../')
            }
		}
	} catch (error) {
		console.error("Error retrieving data:", error);
	}
	}

//type ItemProps = {user_id: string};


const Item = (info: any): ReactElement => (
  <View >
	<Text>{info.item.name}</Text>
    <Text>{info.item.user_id}</Text>
  </View>
);

    return(
			<View>
			    <View style={styles.container}>
						<MapView
							style={styles.map}
							initialRegion={{
								latitude: LATITUDE,
								longitude: LONGITUDE,
								latitudeDelta: LATITUDE_DELTA,
								longitudeDelta: LATITUDE_DELTA,
							}}
							/>
    			</View>
				
			</View>


				
    );

//     <MapView style={StyleSheet.absoluteFill} />
	
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
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