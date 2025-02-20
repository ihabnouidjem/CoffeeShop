import { View, Text, Image, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "@/components/customButton";
import { Redirect, router } from "expo-router";

import "react-native-url-polyfill/auto";
import { useContext } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function HomeScreen() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;
  return (
    <SafeAreaView className="bg-primary h-full">
      {/* contentContainerStyle={{ height: "100%" }} */}
      <ScrollView>
        <View className="w-full justify-center items-center h-fit px-4 py-6">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilites with{` `}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              className={`w-[136px] h-[15px] absolute -bottom-2 -right-8`}
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm text-gray-100 mt-7 text-center font-pregular">
            Where creativity meets innovation: embark on a journey of limitless
            exploration with Aora
          </Text>
          <CustomButton
            title={`Continue with email`}
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
