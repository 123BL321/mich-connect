import { Pressable, StyleSheet, Platform, View, Text, TextInput, Button, Image, Switch } from 'react-native';
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

	const [initialRegion, setInitialRegion] = useState({
    latitude: 42.290390,
    longitude: -83.713242,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  	});
	


    useEffect(() => {
        console.debug("useEffect");
        /*if (isSharingLocation) {
            updateLocation();
        }*/
        getLocation();
    }, []);

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
            setData(json.result1);
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
		return <Text>Loading...</Text>;
	}

	if (!initialRegion) {
		return <Text>Region data not available</Text>;
	}


	return (
		<View style={styles.container}>

			<MapView
				style={styles.map}
				initialRegion={initialRegion}>

					<Marker
						coordinate={{ latitude: this.data.location.data.lat,
						longitude: this.data.location.data.lng }}
						//HELP: title={data.name}
						// HELP: description={data.description} // Access the description of the first user in the data array
						image={userMarkerImage} style={{ width: 50, height: 50 }}
					/>

				{frienddata && frienddata.map((item2, index) => (
					<Marker
						key={index}
						coordinate={{ latitude: item2._user_locations.location.data.lat, longitude: item2._user_locations.location.data.lng }}
						title={item2._user_locations.name} // Assuming your data has a title field
						description={item2._user_locations.description} // Assuming your data has a description field
					/>
				))}
			</MapView>

			<Text
				onPress={() => {
					// The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
					signOut();
				}}
                style={styles.signOutText}>
				Sign Out
			</Text>

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
