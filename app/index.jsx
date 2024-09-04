import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import Loading from "../components/Loading";

export default function index() {
  const router = useRouter();
  return (
    // <ScreenWrapper>
    //   <Text>index</Text>
    //   <Button title="Welcome" onPress={() => router.push("welcome")} />
    // </ScreenWrapper>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Loading />
    </View>
  );
}
