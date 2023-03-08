import {
    ImageBackground,
    Keyboard,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ActionView from "../../components/ActionView/index.js";
import ButtonPrimary from "../../components/ButtonPrimary/index.js";
import TextInputPrimary from "../../components/Input/InputPrimary/index.js";
import styles from "../../styles/global.js";
import { BACKGROUND_IMAGE } from "../../utils/image.js";

import firebase from "firebase/compat/app";
import { useState } from "react";

function AuthPhoneScreen({ navigation, route }) {
    const { phone, password, name, otp } = route.params;
    const [verificationCode, setVerificationCode] = useState("");
    const goBack = () => {
        navigation.goBack();
    };

    const hideKeyBoard = () => {
        Keyboard.dismiss();
    };

    const handleAuthenticationAndRegisterAccount = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            otp,
            verificationCode
        );
        firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
                setVerificationCode("");
                // console.log("register success!");
            })
            .catch((err) => {
                console.log(err);
                // Alert.alert("Mã không tồn tại hoặc quá hạn");
            });
    };

    return (
        <>
            <View style={styles.titleView}>
                <Text style={styles.title} onPress={hideKeyBoard}>
                    T&T HEALTHCARE
                </Text>
                <Text style={_styles.subTitle}>
                    Nhập OTP được gửi tới số điện thoại của bạn
                </Text>
                <Text style={_styles.phone}>{phone}</Text>
            </View>
            <ImageBackground
                source={BACKGROUND_IMAGE}
                resizeMode="cover"
                style={styles.container}
            >
                <TextInputPrimary
                    isPhone={true}
                    placeholder="Mã xác thực"
                    value={verificationCode}
                    onChangeText={(val) => setVerificationCode(val)}
                />
                <ButtonPrimary
                    title="Xác thực"
                    handle={handleAuthenticationAndRegisterAccount}
                />
                <ActionView title="Quay lại" handle={goBack} />
            </ImageBackground>
        </>
    );
}

const _styles = new StyleSheet.create({
    subTitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#FFFFFFB2",
        marginTop: 16,
    },
    phone: {
        marginTop: 8,
        fontSize: 18,
        textAlign: "center",
        color: "#fff",
        fontWeight: "600",
    },
});
export default AuthPhoneScreen;
