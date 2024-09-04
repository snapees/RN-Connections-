import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";

export default function welcome() {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      {/* <Text>welcome</Text> */}
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* welcome image */}
        <Image
          source={require("../assets/images/welcome.png")}
          style={styles.welcomeImage}
          resizeMode="contain"
        />

        {/* title */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>Connections!</Text>
          <Text style={styles.tagline}>
            Grow Your Connections. And Build Your Own Virtual World!
          </Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title="Let's Get Start"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push("signup")}
          />

          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Allready have an account!</Text>
            <Pressable onPress={() => router.push("login")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    width: wp(100),
    height: hp(30),
    alignSelf: "center",
  },
  title: {
    marginTop: 10,
    color: theme.colors.primary,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  tagline: {
    color: theme.colors.text,
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(2),
  },
  footer: {
    position: "absolute",
    bottom: 30,
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
