import { StyleSheet, View, Text } from "react-native";

function ActionView({ title, isLogin, handle }) {
    return (
        <View style={styles.actionView}>
            <Text style={styles.action} onPress={handle}>
                {title}
            </Text>
            {isLogin && <Text style={styles.action}>Quên mật khẩu</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    actionView: {
        marginTop: 16,
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    action: {
        fontSize: 16,
        textDecorationLine: "underline",
        color: "#252323",
        fontWeight: "600",
    },
});

export default ActionView;
