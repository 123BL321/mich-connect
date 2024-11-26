//import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View, Platform } from "react-native";
//import { ReactNativeModal } from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
//import { fetchAPI } from "@/lib/fetch";

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
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

 const onLogInPress = async () => {
    try {
      // Replace this URL with your Xano API endpoint for logging in
      const xanoUrl = "https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/auth/login";

      // Make a POST request to Xano
      const response = await fetch(xanoUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      // Parse the response
      const data = await response.json();

      // Check if the login was successful
      if (response.ok) {
        Alert.alert("Success", "You have successfully logged in!");
        save('authTokenKey', data.authToken);
        router.replace("/(root)/(tabs)/home");

      } else {
        // Handle login failure
        Alert.alert("Error", data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      // Handle request failure
      Alert.alert("Error", "Something went wrong. Please try again later.");
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
                        value={form.email}
                        onChangeText={(value) => setForm( {...form, email: value})}
                    /> 
                    <InputField 
                        label="Password"
                        placeholder="Set a password"
                        icon={icons.lock}
                        secureTextEntry={true}
                        value={form.password}
                        onChangeText={(value) => setForm( {...form, password: value})}
                    /> 
                    <CustomButton
                        title="Sign In"
                        onPress={onLogInPress}
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