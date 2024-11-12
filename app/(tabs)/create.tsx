import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { Video, ResizeMode } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/customButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    video: "",
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType: any) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,

      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.title || !form.video || !form.thumbnail) {
      return Alert.alert("Please fill in all the fields");
    }

    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfuly");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("error", error.message);
    } finally {
      setForm({
        title: "",
        video: "",
        thumbnail: null,
        prompt: "",
      });
    }
    setUploading(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold pb-6">
          Upload Video
        </Text>

        <FormField
          title={`Video Title`}
          value={form.title}
          placeholder="Give your video a catch title..."
          handleChangeText={(e: any) => {
            setForm({ ...form, title: e });
          }}
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <View className="">
                <Video
                  source={{ uri: form.video.uri }}
                  style={{ width: "100%", height: 256, borderRadius: 16 }}
                  resizeMode={ResizeMode.COVER}
                />
              </View>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    className={`w-1/2 h-1/2`}
                    resizeMode={`contain`}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className={`w-full h-64 rounded-2xl`}
                resizeMode={`cover`}
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  className={`w-5 h-5`}
                  resizeMode={`contain`}
                />
                <Text className="text-sm text-gray-100 font-medium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title={`AI Prompt`}
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(e: any) => {
            setForm({ ...form, prompt: e });
          }}
          otherStyles={`mt-7`}
        />

        <CustomButton
          title={`Submit & Publish`}
          handlePress={() => submit()}
          containerStyles="mt-7"
          isLoading={uploading}
        ></CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
