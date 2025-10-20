import apiClient from "@/api/apiClient";
import BackButton from "@/components/backButton";
import Button from "@/components/Button";
import Header from "@/components/header";
import Input from "@/components/input";
import ModalWrapper from "@/components/modalWrapper";
import Typo from "@/components/Typo";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/UserContext";
import { spacingX, spacingY } from "@/types/theme";
import { verticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const presetAmounts = [50, 100, 150, 200];

const Payment = () => {
  const { paymentId } = useLocalSearchParams();
  const { theme } = useTheme();
  const { t } = useLanguage()
  const { accessToken } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    const amount = selectedAmount || Number(customAmount);

    if (!amount || amount <= 0) {
      Alert.alert("Invalid amount", "Please select or enter a valid amount.");
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient.post(
        "/api/donor/donate",
        { campaign_id: paymentId, amount },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      Alert.alert("Success", "Donation successful!\nWe will contact you as soon as possible.");
      setSelectedAmount(null);
      setCustomAmount("");

    } catch (error: any) {
      console.log("Donation error:", error.message);
      Alert.alert("Error", error.message ? error.message : "Failed to process your donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContent}>
          <Header
            title="Payment"
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
        </View>

        <View style={styles.container}>
          {/* Title */}
          <Typo size={20} fontWeight="bold" color={theme.colors.textPrimary}>
            {t('selectamount')}
          </Typo>

          {/* Preset Amount Boxes */}
          <View style={styles.grid}>
            {presetAmounts.map((amount) => {
              const isSelected = selectedAmount === amount;
              return (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.box,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.containerBackground,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                      shadowColor: theme.colors.textSecondary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    },
                  ]}
                  onPress={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  activeOpacity={0.8}
                >
                  <Typo
                    color={
                      isSelected
                        ? theme.colors.white
                        : theme.colors.textPrimary
                    }
                    size={20}
                    fontWeight="bold"
                  >
                    ${amount}
                  </Typo>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Amount Input */}
          <Input
            placeholder="Enter Price Manually"
            keyboardType="numeric"
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text);
              setSelectedAmount(null);
            }}
            placeholderTextColor={theme.colors.disabled}
          />

          {/* Payment Methods */}
          <Typo
            size={20}
            fontWeight="bold"
            color={theme.colors.textPrimary}
            style={{ marginTop: spacingY._15 }}
          >
            {t('method')}
          </Typo>

          <View style={styles.methods}>
            {["cash", "blue"].map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.methodBox,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.containerBackground,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                      shadowColor: theme.colors.textSecondary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    },
                  ]}
                  onPress={() => setPaymentMethod(method)}
                  activeOpacity={0.8}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Ionicons
                      name={method === "cash" ? "cash-outline" : "card-outline"}
                      size={40}
                      color={isSelected ? theme.colors.white : theme.colors.textPrimary}
                      style={{ marginBottom: 6 }}
                    />
                    <Typo
                      color={isSelected ? theme.colors.white : theme.colors.textPrimary}
                      fontWeight="medium"
                      size={16}
                    >
                      {method === "cash" ? t('cash') : t('blue')}
                    </Typo>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
        {/* Proceed Button */}
        <Button
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleProceed}
          disabled={loading}
          loading={loading}
        >
          <Typo color={theme.colors.white} size={18} fontWeight="bold">
            {t('proceed')}
          </Typo>
        </Button>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

export default Payment;

const styles = StyleSheet.create({
  headerContent: {
    paddingHorizontal: spacingY._10,
    justifyContent: "flex-start",
  },
  container: {
    paddingHorizontal: spacingY._15,
    paddingTop: spacingY._20,
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: spacingY._15,
  },
  box: {
    width: "48%",
    paddingVertical: spacingY._20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    marginBottom: spacingY._10,
    height: verticalScale(130)
  },
  input: {
    // borderRadius: 12,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingY._15,
    fontSize: 16,
    marginTop: spacingY._10,
  },
  methods: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: spacingY._20,
  },
  methodBox: {
    flex: 1,
    paddingVertical: spacingY._15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    borderWidth: 1.2,
    height: verticalScale(150)
  },
  button: {
    paddingVertical: spacingY._15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacingY._10,
    marginHorizontal: spacingX._20
  },
});
