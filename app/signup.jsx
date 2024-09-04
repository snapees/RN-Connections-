import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Input from "../components/Input";
import Icon from "../assets/icons";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign Up", "please fill all the fields!");
      return;
    }

    const name = nameRef.current.trim();
    const email = emailRef.current.trim();
    const password = passwordRef.current.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);

    // console.log("Session", session);
    // console.log("Error", error);
    if (error) {
      Alert.alert("Sign Up", error.message);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      {/* <Text>Login</Text> */}

      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>Let's,</Text>
          <Text style={styles.welcomeText}>Get Start</Text>
        </View>

        {/* form  */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please Fill Your Details to create your account!
          </Text>
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter Your Name"
            onChangeText={(value) => (nameRef.current = value)}
          />

          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter Your Email"
            onChangeText={(value) => (emailRef.current = value)}
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter Your Password"
            secureTextEntry={true}
            onChangeText={(value) => (passwordRef.current = value)}
          />

          {/* button  */}
          <Button title="Sign Up" loading={loading} onPress={onSubmit} />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Allready have an account?</Text>
          <Pressable onPress={() => router.push("login")}>
            <Text
              style={[
                styles.footerText,
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(4),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
