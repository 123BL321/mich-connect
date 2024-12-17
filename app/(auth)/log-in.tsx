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

import { useSession } from '../../context/ctx';

const SignUp = () => {

    const { signUp } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        console.debug("signup called");
        const signUpWorked = await signUp(name, email, password);
        if (signUpWorked) {
            router.replace('../(tabs)/home');
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
                        value={name}
                        onChangeText={setName}
                    /> 
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
                        title="Sign Up"
                        onPress={handleSignUp}
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
