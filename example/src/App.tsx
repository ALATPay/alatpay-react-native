import { useRef } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { ALATPay, type ALATPayRef, type Currency } from 'react-native-alatpay';

const currency: Currency = 'NGN';
const amount: number = 100;

const credentials = {
  dev: {
    apiKey: 'e4f75ebe8f8f497880cd056293dd9705',
    businessId: '1e36f623-a60f-4338-1093-08dc48d3aba4',
  },
};

export default function App() {
  // const [showAlatpay, setShowAlatpay] = useState(false);
  const alatpayRef = useRef<ALATPayRef>(null);

  const handleShowAlatpay = () => {
    alatpayRef.current?.startTransaction();
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Example</Text>
      <Text>
        We're working on it, but be rest assured we are the best in the industry
      </Text>
      <Pressable onPress={handleShowAlatpay}>
        <Text>Show Alatpay</Text>
      </Pressable>
      <ALATPay
        ref={alatpayRef}
        customerEmail="afeezagbaje@gmail.com"
        customerFirstName="Afeez"
        customerLastName="Agbaje"
        amount={amount}
        currency={currency}
        businessId={credentials.dev.businessId}
        apiKey={credentials.dev.apiKey}
        onTransaction={(data) => console.log(data)}
        onClose={(data) => console.log(data)}
        autoStart={false}
        environment="dev"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
