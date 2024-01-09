import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import '@testing-library/jest-native/extend-expect';
import { Platform } from 'react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('mobx-react-lite', () => ({
    observer: jest.fn((component) => component)
}));

jest.mock('@src/styles/common', () => ({}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn((str) => str),
        i18n: {
            changeLanguage: () => new Promise((value) => value)
        }
    })
}));

beforeEach(() => {
    Platform.OS = 'ios';
});
