import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Hop as Home, Search, Calendar, Trophy, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.grey,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Find Gurus',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="fame"
        options={{
          title: 'Wall of Fame',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  tabItem: {
    paddingVertical: 4,
  },
});
