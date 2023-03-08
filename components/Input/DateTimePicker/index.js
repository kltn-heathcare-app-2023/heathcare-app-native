import DatePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import FIcon from "react-native-vector-icons/Fontisto";
function DateTimePicker({ date, setDate }) {
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <FIcon name="date" size={24} />
            <DatePicker
                style={styles.picker}
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                onChange={onChange}
                locale="vi_VN"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#5D90F5",
        height: 50,
        width: "90%",
        margin: 5,
        paddingLeft: 10,
        backgroundColor: "#fff",
    },
    picker: {
        marginRight: 4,
    },
});
export default DateTimePicker;
