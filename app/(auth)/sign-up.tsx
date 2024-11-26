//import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
//import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
//import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

 const onSignUpPress = async () => {
    try {
      // Replace this URL with your Xano API endpoint for logging in
      const xanoUrl = "https://xjxu-uarm-amxk.n7d.xano.io/api:XeSFfBac/auth/signup";

      // Make a POST request to Xano
      const response = await fetch(xanoUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      // Parse the response
      const data = await response.json();

      // Check if the login was successful
      if (response.ok) {
        Alert.alert("Success", "You have successfully signed up!");
        router.replace("/(root)/(tabs)/home");
      } else {
        // Handle login failure
        Alert.alert("Error", data.message || "Sign up failed. Please try again.");
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
                        Create Your Account
                    </Text>
                </View>
                <View className="p-5 ">
                    <InputField 
                        label="Name"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm( {...form, name: value})}
                    /> 
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
                        title="Sign Up"
                        onPress={onSignUpPress}
                        className="mt-6"
                    />

                    //OAuth

                    <Link href="/log-in" className= "text-lg text-center text-general-200 mt-10" >
                        <Text>Already have an account? </Text>
                        <Text className="text-primary-500">
                            Sign In
                        </Text>
                    </Link>
                </View>
                {/* Verification Modal */}
            </View>
        </ScrollView>
    );
};

export default SignUp;