# react-native-alatpay

ALATPay makes payments a breeze for merchants. Easily integrate into your React Native app for seamless transactions on both Android and iOS

## Installation

```sh
npm install react-native-alatpay
```

## Usage

```js
import { ALATPay, type ALATPayRef, type Currency } from 'react-native-alatpay';

// ...

<ALATPay
        ref={alatpayRef}
        customerEmail="johndoe@mail.com"
        customerFirstName="John"
        customerLastName="Doe"
        amount={1000}
        currency={Currency.NGN}
        businessId={"your-business-id"}
        apiKey={"your-api-key"}
        onTransaction={(data) => console.log(data)}
        onClose={(data) => console.log(data)}
        autoStart={false}
      />
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
