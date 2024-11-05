import { View, Text, Switch, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingItem = ({ label, value, onValueChange, iconName }) => (
    <View style={styles.setting}>
        <View style={styles.labelContainer}>
            <Icon name={iconName} size={22} color="#7047EB" />
            <Text style={styles.label}>{label}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#4a4a4a', true: '#7047EB' }}
            thumbColor={value ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#4a4a4a"
        />
    </View>
);

const styles = StyleSheet.create({
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 12,
    }
})

export default SettingItem;