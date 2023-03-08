import { StyleSheet } from "react-native";
import { Image, View } from "react-native";

function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/online-doctor-app.gif")}
                style={{ width: "60%", height: 300 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffff",
    },
});

export default LoadingScreen;
