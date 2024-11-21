import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Platform, View, Text, TextInput, Button} from 'react-native';
import { useState, ReactElement, useEffect } from 'react';
//import { Layout, Text, Input, Icon, IconElement, Card, Button, Popover } from '@ui-kitten/components';
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';


type UserDetails = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	role_permission: number;
};


async function save(key: any, value: any) {
	try {
		if (Platform.OS === 'web') {
			await AsyncStorage.setItem(key, value);
		} else { // mobile
			await SecureStore.setItemAsync(key, value.toString());
		}
	} catch (error) {
		console.error("Error saving data:", error);
	}
}


async function getValueFor() {
	try {
		if (Platform.OS === 'web') {
			const result = await AsyncStorage.getItem('authTokenKey')
			if (result) {
				return result;
			}
		} else {
			const result = await SecureStore.getItemAsync('authTokenKey');
			if (result) {
				return result;
			}
		}
	} catch (error) {
		console.error("Error retrieving data:", error);
	}
}




const LoginPage = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [value, setAuthToken] = useState('');
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState<UserDetails[]>([]);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState('');
	const [visible, setVisible] = useState(false);


	const authMe = async () => {
		try {
			const authKey = await getValueFor();
			const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/auth/me', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${authKey}`,
					'Content-Type': 'application/json',
				},
			});
			const json = await response.json();
			setData(json);
			if (response.ok) {
				console.debug("AuthmeAuthedsignin");
				router.replace('/(root)/(tabs)/home');
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


	const handleLogin = async () => {
		try {
			const response = await fetch('https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			});
			const data = await response.json();

			if (response.ok) {
				setAuthToken(data.authToken);
				save('authTokenKey', data.authToken);
				router.replace('/(root)/(tabs)/home');
			} else {
				setErrorMessage(data.message || 'Login failed');
				setVisible(true);
			}
		} catch (error) {
			setErrorMessage('An error occurred. Please try again.');
			setVisible(true);
		}
	};

	const createAccount = () => {
		router.replace('/sign-up');
	};


	const renderLoginButton = (): ReactElement => (
		<Button title="login" onPress={handleLogin}>
		</Button>
	);


	const toggleSecureEntry = (): void => {
		setSecureTextEntry(!secureTextEntry);
	};


	const renderInputIcon = (props: any): ReactElement => (
		<Pressable onPress={toggleSecureEntry}>
			<Ionicons
				{...props}
				name={!secureTextEntry ? 'eye' : 'eye-off'}
			/>
		</Pressable>
	);


	useEffect(() => {
		authMe();
	}, []);

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '90%', maxWidth: 500 }}>
				<View style={{ marginBottom: 20, alignSelf: 'flex-start' }}>
					<Text style={styles.text}  >honey done.</Text>
					<Text style={styles.text}  >transform your honey do into a honey done.</Text>
				</View>
				<View style={styles.card}>
                    <Text style={styles.text}  >Email:</Text>
					<TextInput style={styles.input}
						placeholder='email'
						value={email}
						onChangeText={nextValue => setEmail(nextValue)}
					/>
                    <Text style={styles.text}  >Password:</Text>
					<TextInput style={styles.input}
						value={password}
						placeholder='********'
						secureTextEntry={secureTextEntry}
						onChangeText={nextValue => setPassword(nextValue)}
					/>

                    <Pressable onPress={handleLogin} style={styles.button}>
                        <Text style={styles.text}  >Login</Text>
                    </Pressable>

				</View>
				<Pressable onPress={createAccount} >
					<Text style={{ marginTop: 20, fontWeight: 500 }}>[sign up]</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default LoginPage;



const styles = StyleSheet.create({

	captionContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	captionIcon: {
		width: 10,
		height: 10,
		marginRight: 5,
	},
	input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
	captionText: {
		fontSize: 12,
		fontWeight: '400',
		fontFamily: 'opensans-regular',
		color: '#000000',
	},
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	button: {
		marginTop: 20,
		width: '100%',
	},
	card: {
		marginTop: 10,
		padding: 2,
		width: '100%',
	},
	text: {
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 4,
		paddingVertical: 8,
	},
	backdrop: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},

});


