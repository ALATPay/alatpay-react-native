import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { type ALATPayProps, type ALATPayRef } from './types';

const ALATPay = forwardRef<ALATPayRef, ALATPayProps>(
  (
    {
      customerEmail,
      customerPhoneNumber,
      customerFirstName,
      customerLastName,
      amount = '0.00',
      currency = 'NGN',
      businessId,
      apiKey,
      autoStart = false,
      metadata,
      color = '#A90836',
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const webviewRef = useRef<WebView | null>(null);

    useEffect(() => {
      autoStartCheck();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      return () => {
        // Cleanup webview ref on unmount
        if (webviewRef.current) {
          webviewRef.current = null;
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      startTransaction() {
        setShowModal(true);
      },
      endTransaction() {
        setShowModal(false);
      },
    }));

    const autoStartCheck = () => {
      if (autoStart) {
        setShowModal(true);
      }
    };

    const metaDataString =
      typeof metadata === 'object' ? JSON.stringify(metadata) : '';

    const data = {
      apiKey,
      businessId,
      email: customerEmail,
      amount,
      currency: currency || 'NGN',
      phone: customerPhoneNumber,
      firstName: customerFirstName,
      lastName: customerLastName,
      color: color,
      metadata: metaDataString || '{}',
    };

    const ALATPaycontent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <title>ALATPay</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block; /* Ensures no inline gap below iframe */
        }
      </style>
        </head>
        <body>
          <script src="https://web.alatpay.ng/js/alatpay.js"></script>
          <script type="text/javascript">
            window.onload = showPaymentDialog;
            let data = ${JSON.stringify(data)};
            console.log("Data: ", data);
            try {
                let popup = Alatpay.setup({
                  apiKey: data?.apiKey,
                  businessId: data?.businessId,
                  email: data?.email,
                  amount: data?.amount,
                  currency: data?.currency,
                  onTransaction: function (response) {
                    alatpayText.innerHTML = JSON.stringify(response);
                    console.log("Payment Response returned", response);
                  },
                  onClose: function () {
                    console.log("Payment gateway is closed");
                  }
                });
                function showPaymentDialog() {
                  popup.show();
                }
                showPaymentDialog()
              } catch (error) {
                console.log('Error initializing payment dialog:', error);
                document.body.innerHTML = '<p style="color:red;">Failed to load payment dialog. Check console for errors.</p>';
              }
          </script>
        </body>
      </html>
    `;

    const handleLoad = () => {
      webviewRef.current?.injectJavaScript(`
        window.ReactNativeWebView.postMessage(window.location.origin);
        true; // Prevents the WebView from halting
      `);
    };

    return (
      <Modal
        style={{ flex: 1 }}
        visible={showModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            ref={webviewRef}
            style={[{ flex: 1 }]}
            source={{
              html: ALATPaycontent,
              baseUrl: 'https://web.alatpay.ng',
            }}
            onLoad={handleLoad}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            cacheEnabled={false}
            cacheMode={'LOAD_NO_CACHE'}
            originWhitelist={['*']}
            javaScriptCanOpenWindowsAutomatically={true}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.log('WebView error: ', nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.log('WebView HTTP error: ', nativeEvent.statusCode);
            }}
            androidLayerType={Platform.select({
              android: __DEV__ ? 'hardware' : undefined,
              ios: undefined,
            })}
            webviewDebuggingEnabled={true}
            mixedContentMode="always"
            allowFileAccess={true}
            allowFileAccessFromFileURLs={true}
            allowUniversalAccessFromFileURLs={true}
          />

          {isLoading && (
            <View>
              <ActivityIndicator size="large" color={color} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  }
);

export default ALATPay;
