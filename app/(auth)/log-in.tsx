//import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { TextInput, Button, Alert, Image, ScrollView, Text, View, Platform } from "react-native";
//import { ReactNativeModal } from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
//import { fetchAPI } from "@/lib/fetch";

import { useSession } from '../../context/ctx';

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

const LogIn = () => {
    const { signIn } = useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        const signInWorked = await signIn(email, password);
        if (signInWorked) {
            router.replace('../(tabs)/home');
        }
    };




    return(
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                        Welcome Back! 👋
                    </Text>
                </View>
                <View className="p-5 ">
                    <InputField 
                        label="Email"
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={email}
                        onChangeText={setEmail}
                    /> 
                    <InputField 
                        label="Password"
                        placeholder="Set a password"
                        icon={icons.lock}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    /> 
                    <CustomButton
                        title="Sign In"
                        onPress={handleSignIn}
                        className="mt-6"
                    />

                    //OAuth

                    <Link href="/sign-up" className= "text-lg text-center text-general-200 mt-10" >
                        <Text>Don't have an account? </Text>
                        <Text className="text-primary-500">
                            Sign Up
                        </Text>
                    </Link>
                </View>
                {/* Verification Modal */}
            </View>
        </ScrollView>
    );
};

export default LogIn;
