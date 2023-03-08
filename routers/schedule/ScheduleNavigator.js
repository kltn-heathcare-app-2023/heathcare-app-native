import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouterKey from "../../utils/Routerkey";
import ScheduleListScreen from "../../screens/main/schedule/list";
import ScheduleDoctorProfile from "../../screens/main/schedule/profile";
import DetailScheduleRegister from "../../screens/main/schedule/detail";

const Stack = createNativeStackNavigator();

function ScheduleNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName={RouterKey.SCHEDULE_LIST_SCREEN}
        >
            <Stack.Screen
                name={RouterKey.SCHEDULE_LIST_SCREEN}
                component={ScheduleListScreen}
            />
            <Stack.Screen
                name={RouterKey.SCHEDULE_DETAIL_SCREEN}
                component={ScheduleDoctorProfile}
            />
            <Stack.Screen
                name={RouterKey.SCHEDULE_DETAIL_REGISTER_SCREEN}
                component={DetailScheduleRegister}
            />
        </Stack.Navigator>
    );
}

export default ScheduleNavigator;
