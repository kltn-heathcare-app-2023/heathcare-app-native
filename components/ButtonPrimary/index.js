import { Button, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

function ButtonPrimary({ title, handle }) {
    return (
        <TouchableOpacity style={styles.container} onPress={handle}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: 50,
        borderWidth: 1,
        backgroundColor: "#007BFF",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#007BFF",
        zIndex: 0,
    },
    text: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
        color: "#fff",
        marginTop: 12,
    },
});

export default ButtonPrimary;
