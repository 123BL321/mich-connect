import { Tabs } from "expo-router"
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';


const Layout = () => {
        <Tabs screenOptions={{headerShown: false}} >
            <Tabs.Screen name="home"></Tabs.Screen>
            <Tabs.Screen name="history"></Tabs.Screen>
            <Tabs.Screen name="chat"></Tabs.Screen>
            <Tabs.Screen name="profile"></Tabs.Screen>
        </Tabs>

}

export default Layout;