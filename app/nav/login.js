import { StackNavigator } from 'react-navigation';
import { LoginMainScreen } from '@screens/login-main';
import { LoginAddressScreen } from '@screens/login-address';
import { LoginCredentialsScreen } from '@screens/login-credentials';
import { LoginSuccessScreen } from '@screens/login-success';
import { LoginBarcodeScreen } from '@screens/login-barcode';

export const LoginNavigator = StackNavigator({
    LoginMain: { screen: LoginMainScreen },
    LoginAddress: { screen: LoginAddressScreen },
    LoginCredentials: { screen: LoginCredentialsScreen },
    LoginBarcode: { screen: LoginBarcodeScreen },
    LoginSuccess: { screen: LoginSuccessScreen },
}, {
    initialRouteName: 'LoginMain',
    headerMode: 'none',
});

const mainParams = LoginNavigator.router.getActionForPathAndParams('LoginMain');
const initialRootState = LoginNavigator.router.getStateForAction(mainParams);

export const navLoginReducer = (state = initialRootState, action) => {
    const nextState = LoginNavigator.router.getStateForAction(action, state);

    return nextState || state;
};
